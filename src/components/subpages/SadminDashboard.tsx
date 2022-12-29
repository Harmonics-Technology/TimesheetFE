import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import TableCards from '@components/bits-utils/TableCards';
import { TableData, TableStatus } from '@components/bits-utils/TableData';
import {
    DashboardView,
    DashboardViewStandardResponse,
    UserView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function SadminDashboard({ metrics }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardView;
    return (
        <VStack gap="1rem">
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                gap="1.2rem"
                w="full"
            >
                <DashboardCard
                    url="/SuperAdmin/profile-management/clients"
                    title="client"
                    value={adminMetrics?.totalClients}
                />
                <DashboardCard
                    url="/SuperAdmin/profile-management/team-members"
                    title="team members"
                    value={adminMetrics?.totalTeamMembers}
                />
                <DashboardCard
                    url="/SuperAdmin/profile-management/admin"
                    title="admins"
                    value={adminMetrics?.totalDownLines}
                />
            </Grid>
            <Grid templateColumns={['1fr', '2fr 1fr']} gap="1.2rem" w="full">
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
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    w="full"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Image src="/assets/dash.png" h="full" mx="auto" />
                </Box>
            </Grid>
        </VStack>
    );
}

export default SadminDashboard;
