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
import { TableData, TableStatus } from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { UserContext } from '@components/context/UserContext';
import { useContext } from 'react';
import {
    DashboardView,
    DashboardViewStandardResponse,
    UserView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function SadminDashboard({ metrics }: DashboardProps) {
    const { user } = useContext(UserContext);
    const role = user?.role.replace(' ', '');
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    const adminMetrics = metrics?.data as DashboardView;
    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
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
                                    <TableData name={x.firstName} />
                                    <TableData name={x.email} />
                                    <TableStatus name={x.isActive} />
                                </Tr>
                            ))}
                        thead={['CLIENT NAME', 'EMAIL', 'STATUS']}
                        link={'/'}
                    />
                    {/* <Flex
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        w="full"
                        justify="center"
                        align="center"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Image src="/assets/dash.png" w="full" mx="auto" />
                    </Flex> */}
                </Grid>
            </VStack>
            <NotificationBox
                data={messages}
                markAsRead={markAsRead}
                loading={loading}
            />
        </Grid>
    );
}

export default SadminDashboard;
