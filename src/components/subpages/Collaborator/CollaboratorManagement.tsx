/* eslint-disable no-sparse-arrays */
import {
    Box,
    Flex,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Icon,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    userList: UserViewPagedCollectionStandardResponse;
    isSuperAdmin?: boolean;
    subs: any;
}

import {
    CollaboratorModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import Loading from '@components/bits-utils/Loading';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { BsDownload } from 'react-icons/bs';
import moment from 'moment';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { UserContext } from '@components/context/UserContext';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { LicenseSelection } from '../ManageSub/LicenseSelection';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    email: yup.string().email().required(),
    clientSubscriptionId: yup.string().required(),
});

function CollaboratorManagement({ userList, isSuperAdmin, subs }: adminProps) {
    const { user, subType, accessControls } = useContext(UserContext);
    // const userAccess: ControlSettingView = accessControls;
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<CollaboratorModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            isSendingInvoice: true,
        },
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

    const onSubmit = async (data: CollaboratorModel) => {
        data.superAdminId = user?.superAdminId;
        if ((data.isSendingInvoice as any) == 'Sending invoice') {
            data.isSendingInvoice = true;
        } else {
            data.isSendingInvoice = false;
        }
        // data.clientSubscriptionId = selectedLicense?.subscriptionId;
        try {
            const result = await UserService.addCollaborator(data);
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

    const admin = router.asPath.startsWith('/Admin');

    const thead = ['Name', 'Email', 'Status', 'Action'];

    useEffect(() => {
        setValue('clientSubscriptionId', selectedLicense?.subscriptionId);
    }, [selectedLicense]);

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" mb="1rem">
                    {/* {(userAccess?.adminOBoarding || isSuperAdmin) && ( */}
                    <>
                        {/* {!admin && ( */}
                        <ShiftBtn
                            text="Add Collaborator"
                            onClick={onOpen}
                            px="1rem"
                        />
                        {/* )} */}
                    </>
                    {/* )} */}

                    <ShiftBtn
                        text="Export"
                        outline
                        suffix={<Icon as={BsDownload} ml=".5rem" />}
                        border="1px solid "
                        px="1rem"
                        onClick={onOpens}
                    />
                </Flex>

                <FilterSearch
                    searchOptions="Search by: Name, Email, Role, or Status "
                    data={userList}
                />
                <Tables tableHead={thead}>
                    <>
                        {userList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="collaborator"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={userList} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add new collaborator'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                        mb=".5rem"
                    >
                        <PrimaryInput<CollaboratorModel>
                            label="First Name"
                            name="firstName"
                            error={errors.firstName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                        <PrimaryInput<CollaboratorModel>
                            label="Last Name"
                            name="lastName"
                            error={errors.lastName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                        <PrimaryInput<CollaboratorModel>
                            label="Email"
                            name="email"
                            error={errors.email}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                        <PrimaryPhoneInput<CollaboratorModel>
                            label="Phone Number"
                            name="phoneNumber"
                            error={errors.phoneNumber}
                            control={control}
                        />
                        <PrimaryInput<CollaboratorModel>
                            label="Job Title"
                            name="jobTitle"
                            error={errors.jobTitle}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                        <PrimaryInput<CollaboratorModel>
                            label="Address"
                            name="address"
                            error={errors.address}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                    </Grid>
                    <Box pos="relative" mb="1rem">
                        <PrimaryRadio<CollaboratorModel>
                            label="Invoice Category"
                            radios={['Receiving invoice', 'Sending invoice']}
                            name="isSendingInvoice"
                            control={control}
                            error={errors.isSendingInvoice}
                            defaultValue={'Sending invoice'}
                            schema={schema}
                        />
                    </Box>
                    <LicenseSelection
                        addLicense={addLicense}
                        removeLicense={removeLicense}
                        errors={errors}
                        selectedLicense={selectedLicense}
                        subs={subs}
                    />

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
                                prefix={<Icon as={RiMailSendFill} mr=".5rem" />}
                            />
                        </Grid>
                    </DrawerFooter>
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

export default CollaboratorManagement;
