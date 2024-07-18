import {
    Box,
    Grid,
    Image,
    Tr,
    VStack,
    Flex,
    Text,
    Button,
    Circle,
    Divider,
} from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { UserContext } from '@components/context/UserContext';
import { useContext } from 'react';
import {
    DashboardView,
    DashboardViewStandardResponse,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
    team: UserViewPagedCollectionStandardResponse;
}

function SadminDashboard({ metrics, team }: DashboardProps) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const { messages, markAsRead, loading, setLimit } =
        useContext(NotificationContext);
    const adminMetrics = metrics?.data as DashboardView;
    return (
        // <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
        <Box>
            <VStack gap="1rem" w="70%">
                <Grid
                    templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                    gap="1.2rem"
                    w="full"
                >
                    <DashboardCard
                        url={`/${role}/profile-management/clients`}
                        title="client"
                        value={adminMetrics?.totalClients}
                    />
                    <DashboardCard
                        url={`/${role}/profile-management/team-members`}
                        title="team members"
                        value={adminMetrics?.totalTeamMembers}
                    />
                    <DashboardCard
                        url={`/${role}/profile-management/admin`}
                        title="admins"
                        value={adminMetrics?.totalDownLines}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Clients'}
                        url={'profile-management/clients'}
                        data={adminMetrics?.recentCLients
                            ?.slice(0, 4)
                            .map((x: UserView) => (
                                <Tr key={x.id}>
                                    <TableData name={x.organizationName} />
                                    <TableData name={x.organizationEmail} />
                                    <TableData name={x.organizationPhone} />
                                    <TableData
                                        name={x.invoiceGenerationFrequency}
                                    />
                                    <TableStatus name={x.isActive} />
                                </Tr>
                            ))}
                        thead={[
                            'CLIENT NAME',
                            'EMAIL',
                            'Phone',
                            'Invoice Schedule',
                            'STATUS',
                        ]}
                        link={'/'}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Team Members'}
                        url={'profile-management/team-members'}
                        data={team?.data?.value
                            ?.slice(0, 4)
                            .map((x: UserView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.fullName} />
                                    <TableData
                                        name={x.employeeInformation?.jobTitle}
                                    />

                                    <TableData name={x.clientName} />

                                    {/* <TableData name={x.phoneNumber} /> */}
                                    <TableData
                                        name={
                                            x.employeeInformation?.payrollType
                                        }
                                    />
                                    <TableData name={x.role} />
                                    <TableStatus name={x.isActive} />
                                    <TableActions
                                        id={x.id}
                                        route="team-members"
                                        email={x.email}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Full Name',
                            'Job Title',
                            'Client Name',
                            // 'Phone No',
                            'Payroll Type',
                            'Role',
                            'Status',
                            'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
            </VStack>
            <NotificationBox
                data={messages}
                markAsRead={markAsRead}
                loading={loading}
                setLimit={setLimit}
            />
        </Box>
        //  </Grid>
    );
}

export default SadminDashboard;
