/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    FormLabel,
    Icon,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    team: UserView[];
    isSuperAdmin?: boolean;
    subs: any;
}
interface select {
    options: UserView[];
    customKeys: { key: string; label: string };
    onChange: (value: any) => void;
}

import dynamic from 'next/dynamic';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});
import {
    ControlSettingView,
    ExportService,
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import roles from '../generics/roles.json';
import { useRouter } from 'next/router';
import Loading from '@components/bits-utils/Loading';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import FilterSearch from '@components/bits-utils/FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';
import { BsDownload } from 'react-icons/bs';
import Cookies from 'js-cookie';
import moment from 'moment';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { UserContext } from '@components/context/UserContext';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import { LicenseSelection } from './ManageSub/LicenseSelection';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    role: yup.string().required(),
    email: yup.string().email().required(),
});

function ProfileManagementAdmin({
    adminList,
    team,
    isSuperAdmin,
    subs,
}: adminProps) {
    const { user, subType, accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;
    const {
        register,
        handleSubmit,
        watch,
        control,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    //
    //

    const [selectedLicense, setSelectedLicense] = useState<any>();
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    const onSubmit = async (data: RegisterModel) => {
        data.superAdminId = user?.superAdminId;
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        data.dateOfBirth = moment().format('YYYY-MM-DD');
        try {
            const result = await UserService.create(data);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
                onClose();
                return;
            }
            if (!result.status) {
                toast({
                    title: result.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
                return;
            }
        } catch (err: any) {
            toast({
                title: err.body.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const [userDetail, setUserDetail] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        id: '',
    });
    const newUser = watch('firstName');
    const oldMember = userDetail?.email;
    const [loading, setLoading] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const admin = router.asPath.startsWith('/Admin');

    const getUserData = async (id: string) => {
        if (id === undefined) {
            setUserDetail({
                firstName: '',
                lastName: '',
                email: '',
                role: '',
                id: '',
            });
            return;
        }
        setLoading(true);
        try {
            const data = await UserService.getUserById(id);
            setLoading(false);

            if (data.status) {
                setUserDetail((prevState) => ({
                    ...prevState,
                    firstName: data.data?.firstName as string,
                    lastName: data.data?.lastName as string,
                    email: data.data?.email as string,
                    id: data.data?.id as string,
                }));
                return;
            }
            setLoading(false);
        } catch (error) {
            //
        }
    };

    const createFromTeam = async (e: any) => {
        e.preventDefault();

        setIsLoading(true);
        try {
            const result = await UserService.adminUpdateUser(userDetail);
            setIsLoading(false);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
                reset();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err) {
            toast({
                title: 'An error occurred',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const thead = ['Name', 'Email', 'Role', 'Status', 'Action'];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" mb="1rem">
                    {(userAccess?.adminOBoarding || isSuperAdmin) && (
                        <>
                            {!admin && (
                                <ShiftBtn
                                    text="Add Admin"
                                    onClick={onOpen}
                                    px="1rem"
                                    loading={loading}
                                />
                            )}
                        </>
                    )}

                    <ShiftBtn
                        text="Download"
                        outline
                        suffix={<Icon as={BsDownload} ml=".5rem" />}
                        border="1px solid "
                        px="1rem"
                        onClick={onOpens}
                    />
                </Flex>

                <FilterSearch
                    searchOptions="Search by: Name, Email, Role, or Status "
                    data={adminList}
                />
                <Tables tableHead={thead}>
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="admin"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add new admin'}
            >
                <Loading loading={loading} />
                <form onSubmit={handleSubmit(onSubmit)}>
                    {oldMember === undefined || oldMember === '' ? (
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                            mb=".5rem"
                        >
                            <PrimaryInput<RegisterModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                schema={schema}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                schema={schema}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Email"
                                name="email"
                                error={errors.email}
                                placeholder=""
                                defaultValue=""
                                register={register}
                                schema={schema}
                            />
                            <SelectrixBox<RegisterModel>
                                control={control}
                                name="role"
                                error={errors.role}
                                keys="title"
                                keyLabel="title"
                                label="Role"
                                options={
                                    // subType == 'basic'
                                    //     ? [{ title: 'Admin' }]
                                    //     :
                                    roles.slice(1, 3)
                                }
                            />
                        </Grid>
                    ) : null}
                    <LicenseSelection
                        addLicense={addLicense}
                        removeLicense={removeLicense}
                        errors={errors}
                        selectedLicense={selectedLicense}
                        subs={subs}
                    />

                    {newUser !== '' && newUser !== undefined ? (
                        <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                            <Grid
                                templateColumns="repeat(2,1fr)"
                                gap="1rem 2rem"
                                my="2rem"
                                w="full"
                            >
                                <ShiftBtn
                                    text="Close"
                                    onClick={onClose}
                                    px="1rem"
                                    bg="gray.500"
                                    w="full"
                                    h="2.8rem"
                                />
                                <ShiftBtn
                                    text="Send Invite"
                                    px="1rem"
                                    w="full"
                                    type="submit"
                                    loading={isSubmitting}
                                    h="2.8rem"
                                    prefix={
                                        <Icon as={RiMailSendFill} mr=".5rem" />
                                    }
                                />
                            </Grid>
                        </DrawerFooter>
                    ) : null}
                    {(oldMember === undefined || oldMember === '') &&
                    (newUser === undefined || newUser === '') ? (
                        <Text
                            textAlign="center"
                            borderTop="1px solid"
                            borderBottom="1px solid"
                            borderColor="#e5e5e5"
                            py="1rem"
                            my="1rem"
                        >
                            OR
                        </Text>
                    ) : null}
                </form>
                <form>
                    <>
                        {newUser === undefined || newUser === '' ? (
                            <>
                                <Grid
                                    templateColumns="repeat(2,1fr)"
                                    gap="1rem 2rem"
                                    mb=".5rem"
                                >
                                    <Box>
                                        <Box>
                                            <FormLabel
                                                textTransform="capitalize"
                                                fontSize=".8rem"
                                            >
                                                Select From Team Members
                                            </FormLabel>
                                            <Selectrix
                                                options={team}
                                                customKeys={{
                                                    key: 'id',
                                                    label: 'fullName',
                                                }}
                                                onChange={(value: any) =>
                                                    getUserData(value.key)
                                                }
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <FormLabel
                                            textTransform="capitalize"
                                            fontSize=".8rem"
                                        >
                                            Role
                                        </FormLabel>
                                        <Selectrix
                                            customKeys={{
                                                key: 'id',
                                                label: 'title',
                                            }}
                                            options={
                                                // subType == 'basic'
                                                //     ? [
                                                //           {
                                                //               id: 'admin',
                                                //               title: 'Internal Admin',
                                                //           },
                                                //       ]
                                                //     :
                                                roles.slice(3, 6)
                                            }
                                            onChange={(value: any) =>
                                                setUserDetail((exist) => ({
                                                    ...exist,
                                                    role: value.label,
                                                }))
                                            }
                                        />
                                    </Box>
                                </Grid>

                                <LicenseSelection
                                    addLicense={addLicense}
                                    removeLicense={removeLicense}
                                    errors={errors}
                                    selectedLicense={selectedLicense}
                                    subs={subs}
                                />
                                <DrawerFooter
                                    borderTopWidth="1px"
                                    mt="2rem"
                                    p="0"
                                >
                                    <Grid
                                        templateColumns="repeat(2,1fr)"
                                        gap="1rem 2rem"
                                        my="2rem"
                                        w="full"
                                    >
                                        <ShiftBtn
                                            text="Close"
                                            onClick={onClose}
                                            px="1rem"
                                            bg="gray.500"
                                            w="full"
                                            h="2.8rem"
                                        />
                                        <ShiftBtn
                                            text="Send Invite"
                                            px="1rem"
                                            w="full"
                                            onClick={(e) => createFromTeam(e)}
                                            loading={isLoading}
                                            h="2.8rem"
                                            prefix={
                                                <Icon
                                                    as={RiMailSendFill}
                                                    mr=".5rem"
                                                />
                                            }
                                        />
                                    </Grid>
                                </DrawerFooter>
                            </>
                        ) : null}
                    </>
                </form>
            </DrawerWrapper>
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={1}
                fileName={'Admin'}
                model="users"
            />
        </>
    );
}

export default ProfileManagementAdmin;
