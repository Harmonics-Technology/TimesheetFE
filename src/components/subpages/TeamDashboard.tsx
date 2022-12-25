import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import TableCards from '@components/bits-utils/TableCards';
import { TableData, TableStatus } from '@components/bits-utils/TableData';
import {
    DashboardTeamMemberView,
    DashboardView,
    DashboardViewStandardResponse,
    RecentTimeSheetView,
    TimeSheetView,
    UserView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function TeamDashboard({ metrics }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardTeamMemberView;
    console.log({ metrics });
    return (
        <VStack gap="1rem">
            <Grid
                templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                gap="1.2rem"
                w="full"
            >
                <DashboardCard
                    url=""
                    title="Approved Timesheet"
                    value={adminMetrics?.approvedTimeSheet}
                />
                <DashboardCard
                    url=""
                    title="Awaiting TimeSheet"
                    value={adminMetrics?.awaitingTimeSheet}
                />
                <DashboardCard
                    url=""
                    title="Rejected Timesheet"
                    value={adminMetrics?.rejectedTimeSheet}
                />
            </Grid>
            <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                <TableCards
                    title={'Recent Timesheet'}
                    url={'profile-management/clients'}
                    data={adminMetrics?.recentTimeSheet
                        ?.slice(0, 4)
                        .map((x: RecentTimeSheetView, i: any) => (
                            <Tr key={i}>
                                <TableData name={x.year} />
                                <TableData name={x.month} />
                                <TableData name={x.hours} />
                                <TableData name={x.numberOfDays} />
                            </Tr>
                        ))}
                    thead={['Year', 'Month', 'Hours', 'No. of Days']}
                    link={'/'}
                />
            </Grid>
            <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                <TableCards
                    title={'Recent Payslips'}
                    url={'profile-management/clients'}
                    data={adminMetrics?.recentTimeSheet
                        ?.slice(0, 4)
                        .map((x: TimeSheetView) => (
                            <Tr key={x.id}>
                                {/* <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} /> */}
                            </Tr>
                        ))}
                    thead={[
                        'Client',
                        'Invoice no.',
                        'Amount',
                        'Generated on',
                        'Status',
                        'Action',
                    ]}
                    link={'/'}
                />
            </Grid>
        </VStack>
    );
}

export default TeamDashboard;
