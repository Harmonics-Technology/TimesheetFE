/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Tr,
    useDisclosure,
    Grid,
    useToast,
    Flex,
    Icon,
    VStack,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    client: UserView[];
    isSuperAdmin?: boolean;
}
import {
    ControlSettingView,
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import router, { useRouter } from 'next/router';
import Loading from '@components/bits-utils/Loading';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import FilterSearch from '@components/bits-utils/FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';
import Cookies from 'js-cookie';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from '@components/context/UserContext';

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    role: yup.string().required(),
    email: yup.string().email().required(),
});

function SupervisorManagement({ adminList, client, isSuperAdmin }: adminProps) {
    //
    const clients = client?.filter((x) => x.isActive);
    const {
        register,
        handleSubmit,
        watch,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            role: 'Supervisor',
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    //

    const [clientType, setClientType] = useState(false);
    const { subType, user, accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;

    useEffect(() => {
        subType == 'premium' ? setClientType(true) : setClientType(false);
    }, []);

    const onSubmit = async (data: RegisterModel) => {
        data.superAdminId = user?.superAdminId;
        data.clientId = !clientType ? user?.superAdminId : data.clientId;
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
                onClose();
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

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
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
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            +Supervisor
                        </Button>
                    )}
                    <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpens}
                        borderRadius="25px"
                    >
                        Download <Icon as={BsDownload} ml=".5rem" />
                    </Button>
                </Flex>
                <FilterSearch searchOptions="Search by: Name, Email, Role, or Status " />
                <Tables
                    tableHead={['Name', 'Email', 'Role', 'Status', 'Action']}
                >
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData name={x.email} />
                                {/* <TableData name={x.clientName} /> */}
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="supervisors"
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
                title={'Add new supervisor'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <VStack spacing="1.5rem">
                        {clientType && (
                            <SelectrixBox<RegisterModel>
                                control={control}
                                name="clientId"
                                error={errors.clientId}
                                keys="id"
                                keyLabel="organizationName"
                                label="Client"
                                options={clients}
                            />
                        )}
                        <PrimaryInput<RegisterModel>
                            label="Email"
                            name="email"
                            error={errors.email}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1.5rem 2rem"
                            w="full"
                        >
                            <PrimaryInput<RegisterModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />

                            <Button
                                bgColor="gray.500"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                <Box pr=".5rem">
                                    <RiMailSendFill />
                                </Box>
                                <Box>Send Invite</Box>
                            </Button>
                        </Grid>
                    </VStack>
                </form>
            </DrawerWrapper>
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={3}
                fileName={'Supervisor'}
                model="users"
            />
        </>
    );
}

export default SupervisorManagement;
