import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    Text,
    Tr,
    useToast,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import {
    UpdateUserModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import { useRouter } from 'next/router';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import BeatLoader from 'react-spinners/BeatLoader';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import Checkbox from '@components/bits-utils/Checkbox';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { UserContext } from '@components/context/UserContext';
import ClientPaginate from '@components/bits-utils/ClientPaginate';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const schema = yup.object().shape({});
interface ClientProfileProps {
    userProfile?: UserView;
    teamList?: UserViewPagedCollectionStandardResponse;
    supervisorList?: UserViewPagedCollectionStandardResponse;
    id: any;
}

function ClientProfile({
    userProfile,
    teamList,
    supervisorList,
    id,
}: ClientProfileProps) {
    const [teamMembers, setTeamMembers] = useState(false);
    const [supervisors, setSupervisors] = useState(false);
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: userProfile?.id,
            isActive: userProfile?.isActive,
            role: userProfile?.role,
            invoiceGenerationFrequency: userProfile?.invoiceGenerationFrequency,
            term: userProfile?.term as number,
        },
    });
    const router = useRouter();
    const toast = useToast();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const [teamLists, setTeamLists] = useState(teamList?.data);
    const [teamLoading, setTeamLoading] = useState<boolean>(false);
    const [supervisorLists, setSupervisorLists] = useState(
        supervisorList?.data,
    );
    const [supervisorLoading, setSupervisorLoading] = useState<boolean>(false);

    const onSubmit = async (data: UpdateUserModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);
        ({ data });
        ({ userProfile });
        if (data == userProfile) {
            return;
        }
        try {
            const result = await UserService.adminUpdateUser(data);
            // ({ result });
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            error;
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            minH="80vh"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                    gap="1rem 2rem"
                >
                    <Box w="full">
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="3rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Basic Info
                        </Text>
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<UpdateUserModel>
                                label="Organisation Name"
                                name="organizationName"
                                error={errors.organizationName}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationName as string
                                }
                                register={register}
                            />
                            <InputBlank
                                label="Organisation Email"
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationEmail as string
                                }
                                disableLabel={true}
                            />
                            <PrimaryPhoneInput<UpdateUserModel>
                                label="Phone Number"
                                name="phoneNumber"
                                error={errors.organizationPhone}
                                control={control}
                                placeholder={
                                    userProfile?.organizationPhone as string
                                }
                            />
                            <SelectrixBox<UpdateUserModel>
                                control={control}
                                name="isActive"
                                error={errors.isActive}
                                keys="id"
                                keyLabel="label"
                                label="Profile Status"
                                placeholder={
                                    userProfile?.isActive === true
                                        ? 'Active'
                                        : 'Not Active'
                                }
                                options={[
                                    { id: true, label: 'Active' },
                                    { id: false, label: 'Not Active' },
                                ]}
                            />
                        </Grid>
                        <Box mt="1rem" w="full">
                            <PrimaryTextarea<UpdateUserModel>
                                label="Address"
                                name="organizationAddress"
                                error={errors.organizationAddress}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationAddress || ''
                                }
                                register={register}
                            />
                        </Box>
                    </Box>
                    <Box>
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            m="0rem 0 3rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Contact Details
                        </Text>
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<UpdateUserModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={userProfile?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={userProfile?.lastName as string}
                                register={register}
                            />
                            <InputBlank
                                label="Contact Email"
                                placeholder=""
                                defaultValue={userProfile?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryPhoneInput<UpdateUserModel>
                                label="Contact Phone Number"
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                control={control}
                                placeholder={userProfile?.phoneNumber as string}
                            />
                            <SelectrixBox<UpdateUserModel>
                                control={control}
                                name="invoiceGenerationFrequency"
                                error={errors.invoiceGenerationFrequency}
                                keys="id"
                                keyLabel="label"
                                label="Payment Frequency"
                                placeholder={
                                    userProfile?.invoiceGenerationFrequency as string
                                }
                                options={[
                                    { id: 'Bi-weekly', label: 'Bi-Weekly' },
                                    { id: 'Monthly', label: 'Monthly' },
                                ]}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Term"
                                name="term"
                                error={errors.term}
                                placeholder=""
                                defaultValue={userProfile?.term as number}
                                register={register}
                            />
                        </Grid>
                    </Box>
                </Grid>

                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                    gap="1rem 2rem"
                    my="2rem"
                >
                    <Button
                        bgColor="gray.500"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={() => router.back()}
                    >
                        Back
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
                            <VscSaveAs />
                        </Box>
                        <Box>Update Profile</Box>
                    </Button>
                </Grid>
            </form>
            <Box>
                <Flex
                    gap="2rem"
                    // justify="space-between"
                    align="center"
                    flexDirection={['column', 'row']}
                >
                    <Checkbox
                        label={
                            supervisors
                                ? 'Hide Supervisors'
                                : 'Show Supervisors'
                        }
                        onChange={() => setSupervisors(!supervisors)}
                        checked={supervisors}
                        mb="1rem"
                    />
                    <Checkbox
                        label={
                            teamMembers
                                ? 'Hide Team Members'
                                : 'Show Team Members'
                        }
                        onChange={() => setTeamMembers(!teamMembers)}
                        checked={teamMembers}
                        mb="1rem"
                    />
                </Flex>
            </Box>
            <Box>
                <Box
                    borderY="1px solid"
                    py="1rem"
                    my="1rem"
                    borderColor="gray.300"
                    display={teamMembers ? 'block' : 'none'}
                >
                    <Text fontWeight="600">Team Members</Text>
                    <Tables
                        tableHead={[
                            'Full Name',
                            'Job Title',
                            'Phone No',
                            'Role',
                            'Status',
                            '',
                        ]}
                    >
                        <>
                            {teamLoading ? (
                                <Skeleton
                                    count={8}
                                    className="skeleton"
                                    containerClassName="sk-wrapper"
                                />
                            ) : (
                                <>
                                    {teamList?.data?.value?.map(
                                        (x: UserView) => (
                                            <Tr key={x.id}>
                                                <TableData name={x.fullName} />
                                                <TableData
                                                    name={
                                                        x.employeeInformation
                                                            ?.jobTitle
                                                    }
                                                />
                                                <TableData
                                                    name={x.phoneNumber}
                                                />
                                                <TableData name={x.role} />
                                                <TableStatus
                                                    name={x.isActive}
                                                />
                                                <TableActions
                                                    id={x.id}
                                                    route={`/${role}/profile-management/team-members`}
                                                    email={x.email}
                                                />
                                            </Tr>
                                        ),
                                    )}
                                </>
                            )}
                        </>
                    </Tables>
                    {/* <Pagination data={teamList} /> */}
                    <ClientPaginate
                        data={teamLists}
                        setTxn={setTeamLists}
                        id={id}
                        api={UserService.getClientTeamMembers}
                        setLoading={setTeamLoading}
                    />
                </Box>
                <Box
                    borderY="1px solid"
                    py="1rem"
                    my="1rem"
                    borderColor="gray.300"
                    display={supervisors ? 'block' : 'none'}
                >
                    <Text fontWeight="600">Supervisors</Text>
                    <Tables
                        tableHead={[
                            'First Name',
                            'Last Name',
                            'Phone No',
                            'Role',
                            'Status',
                            '',
                        ]}
                    >
                        <>
                            {supervisorLoading ? (
                                <Skeleton
                                    count={8}
                                    className="skeleton"
                                    containerClassName="sk-wrapper"
                                />
                            ) : (
                                <>
                                    {supervisorList?.data?.value?.map(
                                        (x: UserView) => (
                                            <Tr key={x.id}>
                                                <TableData name={x.firstName} />
                                                <TableData name={x.lastName} />
                                                <TableData
                                                    name={x.phoneNumber}
                                                />
                                                <TableData name={x.role} />
                                                <TableStatus
                                                    name={x.isActive}
                                                />
                                                <TableActions
                                                    id={x.id}
                                                    route={`/${role}/profile-management/supervisors`}
                                                    email={x.email}
                                                />
                                            </Tr>
                                        ),
                                    )}
                                </>
                            )}
                        </>
                    </Tables>
                    {/* <Pagination data={supervisorList} /> */}
                    <ClientPaginate
                        data={supervisorLists}
                        setTxn={setSupervisorLists}
                        id={id}
                        api={UserService.getClientTeamMembers}
                        setLoading={setSupervisorLoading}
                    />
                </Box>
            </Box>
        </Box>
    );
}

export default ClientProfile;
