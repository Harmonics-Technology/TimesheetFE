import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import { TableData, TableStatus } from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import moment from 'moment';
import { useContext } from 'react';
import {
    DashboardTeamMemberView,
    DashboardView,
    DashboardViewStandardResponse,
    PaySlipView,
    PaySlipViewPagedCollectionStandardResponse,
    RecentTimeSheetView,
    TimeSheetView,
    UserView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
    payslip?: PaySlipViewPagedCollectionStandardResponse;
    role?: string;
}
interface DashboardClientView {
    recentInvoice: [] | undefined | null;
}

function TeamDashboard({ metrics, payslip, role }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardTeamMemberView;
    const clientMetrics = metrics?.data as DashboardClientView;
    const { messages } = useContext(NotificationContext);

    console.log({ metrics, role });
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
                        url={'timesheets/history'}
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
                        title={
                            role == 'client'
                                ? 'Recent Invoices'
                                : 'Recent Payslips'
                        }
                        url={'financials/invoice'}
                        data={
                            role == 'client'
                                ? clientMetrics?.recentInvoice
                                      ?.slice(0, 4)
                                      .map((x: PaySlipView) => (
                                          <Tr key={x.id}>
                                              <TableData
                                                  name={moment(
                                                      x.startDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={moment(
                                                      x.endDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={moment(
                                                      x.paymentDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={
                                                      x.employeeInformation
                                                          ?.paymentRate
                                                  }
                                              />
                                              <TableData name={x.totalHours} />
                                              <TableData name={x.totalAmount} />
                                          </Tr>
                                      ))
                                : payslip?.data?.value
                                      ?.slice(0, 4)
                                      .map((x: PaySlipView) => (
                                          <Tr key={x.id}>
                                              <TableData
                                                  name={moment(
                                                      x.startDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={moment(
                                                      x.endDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={moment(
                                                      x.paymentDate,
                                                  ).format('YYYY-MM-DD')}
                                              />
                                              <TableData
                                                  name={
                                                      x.employeeInformation
                                                          ?.paymentRate
                                                  }
                                              />
                                              <TableData name={x.totalHours} />
                                              <TableData name={x.totalAmount} />
                                          </Tr>
                                      ))
                        }
                        thead={[
                            'Start Date',
                            'End Date',
                            'Payment Date',
                            'Payment Rate',
                            'Total Hours',
                            'Total Amount',
                        ]}
                        link={'/'}
                    />
                </Grid>
            </VStack>
            <NotificationBox data={messages} />
        </Grid>
    );
}

export default TeamDashboard;
