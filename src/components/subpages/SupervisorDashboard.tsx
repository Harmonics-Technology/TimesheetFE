import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import { TableData, TableState } from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { CUR } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import { useContext } from 'react';
import {
    DashboardTeamMemberView,
    ExpenseView,
    RecentTimeSheetView,
    TimeSheetApprovedView,
} from 'src/services';

interface DashboardProps {
    adminMetrics: DashboardTeamMemberView;
    expenses?: ExpenseView[];
}

function SupervisorDashboard({ adminMetrics, expenses }: DashboardProps) {
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
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
                        url={'timesheets/approval'}
                        data={adminMetrics?.recentTimeSheet
                            ?.slice(0, 4)
                            .map((x: RecentTimeSheetView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.name} />
                                    <TableData name={x.year} />
                                    <TableData name={x.month} />
                                    {/* <TableData name={x.hours} /> */}
                                    <TableData name={x.hours} />
                                    <TableData name={x.numberOfDays} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Year',
                            'Month',
                            // 'Expected Hours',
                            'Total Hours',
                            'Days',
                        ]}
                        link={'/'}
                    />
                </Grid>

                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Expenses'}
                        url={'financials/expenses'}
                        data={expenses
                            ?.slice(0, 4)
                            .map((x: ExpenseView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.teamMember?.fullName} />
                                    <TableData name={x.description} />
                                    <TableData
                                        name={CUR(`${x.currency}${x.amount}`)}
                                    />
                                    <TableData
                                        name={formatDate(x.expenseDate)}
                                    />
                                    <TableData name={x.expenseType} />
                                    <TableState name={x.status} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Desc',
                            'Amount',
                            'Expense Date',
                            'Expense Type',
                            'Status',
                        ]}
                        link={'/'}
                    />
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

export default SupervisorDashboard;
