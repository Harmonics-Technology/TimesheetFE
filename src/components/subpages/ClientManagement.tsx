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
    Checkbox,
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
}

import {
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import FilterSearch from '@components/bits-utils/FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import moment from 'moment';
import { BsDownload } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { UserContext } from '@components/context/UserContext';

const schema = yup.object().shape({
    // lastName: yup.string().required(),
    // firstName: yup.string().required(),
    // role: yup.string().required(),
    // email: yup.string().email().required(),
    // phoneNumber: yup.number().required(),
    organizationEmail: yup.string().email().required(),
    organizationName: yup.string().required(),
    organizationAddress: yup.string().required(),
    organizationPhone: yup.number().required(),
    invoiceGenerationFrequency: yup.string().required(),
    term: yup.number().required(),
});

function ClientManagement({ adminList }: adminProps) {
    //
    const { user } = useContext(UserContext);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            role: 'client',
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    //
    const [same, setSame] = useState(false);
    //

    const onSubmit = async (data: RegisterModel) => {
        {
            same
                ? ((data.firstName = data.organizationName),
                  (data.email = data.organizationEmail),
                  (data.phoneNumber = data.organizationPhone),
                  (data.lastName = data.organizationName))
                : null;
        }
        data.superAdminId = user?.superAdminId;

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
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Name',
        'Email',
        'Role',
        'Phone',
        'Invoice Schedule',
        'Status',
        'Action',
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" mb="1rem">
                    <Button
                        bgColor="brand.400"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpen}
                    >
                        +Client
                    </Button>
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
                <Tables tableHead={thead}>
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableData name={x.organizationPhone} />
                                <TableData
                                    name={x.invoiceGenerationFrequency}
                                />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="clients"
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
                title={'Add new Client'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PrimaryInput<RegisterModel>
                        label="Organization Name"
                        name="organizationName"
                        error={errors.organizationName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                    >
                        <PrimaryInput<RegisterModel>
                            label="Organization Email"
                            name="organizationEmail"
                            error={errors.organizationEmail}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryPhoneInput<RegisterModel>
                            label="Phone Number"
                            name="organizationPhone"
                            error={errors.organizationPhone}
                            placeholder="Organization Phone No."
                            control={control}
                        />
                    </Grid>
                    <PrimaryTextarea<RegisterModel>
                        label="Organization Address"
                        name="organizationAddress"
                        error={errors.organizationAddress}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Box w="full">
                        <Flex
                            justify="space-between"
                            align="center"
                            my="1rem"
                            py="1rem"
                            borderY="1px solid"
                            borderColor="gray.300"
                        >
                            <Text
                                textTransform="uppercase"
                                mb="0"
                                fontSize="1.3rem"
                                fontWeight="500"
                            >
                                Contact Details
                            </Text>
                            <Checkbox
                                onChange={(e) => setSame(e.target.checked)}
                            >
                                Same as above
                            </Checkbox>
                        </Flex>
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            display={same ? 'none' : 'grid'}
                        >
                            <PrimaryInput<RegisterModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={''}
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Email"
                                name="email"
                                error={errors.email}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryPhoneInput<RegisterModel>
                                label="Contact Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                control={control}
                            />
                        </Grid>
                    </Box>
                    <Box w="full">
                        <Flex
                            justify="space-between"
                            align="center"
                            my="1rem"
                            py="1rem"
                            borderY="1px solid"
                            borderColor="gray.300"
                        >
                            <Text
                                textTransform="uppercase"
                                mb="0"
                                fontSize="1.3rem"
                                fontWeight="500"
                            >
                                Work Data
                            </Text>
                        </Flex>
                        <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                            <SelectrixBox<RegisterModel>
                                control={control}
                                name="invoiceGenerationFrequency"
                                error={errors.invoiceGenerationFrequency}
                                keys="id"
                                keyLabel="label"
                                label="Payment Frequency"
                                options={[
                                    { id: 'bi-weekly', label: 'Bi-Weekly' },
                                    { id: 'monthly', label: 'Monthly' },
                                ]}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Term"
                                name="term"
                                error={errors.term}
                                placeholder=""
                                defaultValue={''}
                                register={register}
                            />
                        </Grid>
                    </Box>

                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
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
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={4}
                fileName={'Client'}
                model="users"
            />
        </>
    );
}

export default ClientManagement;
