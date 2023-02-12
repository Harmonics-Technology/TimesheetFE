import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    TableContractAction,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { CUR } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useContext } from 'react';
import {
    DashboardTeamMemberView,
    DashboardView,
    DashboardViewStandardResponse,
    ExpenseView,
    InvoiceView,
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
    const { messages, markAsRead, loading } = useContext(NotificationContext);

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
                                    <TableContractAction
                                        id={x.employeeInformationId}
                                        date={`${x.year}-${x.month}-01`}
                                        team={true}
                                        timeSheets={false}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Year',
                            'Month',
                            'Approved Hrs',
                            'No. of Days',
                            'Action',
                        ]}
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
                        url={'financials/invoices'}
                        data={
                            role == 'client'
                                ? clientMetrics?.recentInvoice
                                      ?.slice(0, 4)
                                      .map((x: InvoiceView) => (
                                          <Tr key={x.id}>
                                              <TableData
                                                  name={formatDate(x.startDate)}
                                              />
                                              <TableData
                                                  name={formatDate(x.endDate)}
                                              />
                                              <TableData
                                                  name={formatDate(
                                                      x.paymentDate,
                                                  )}
                                              />
                                              <TableData
                                                  name={
                                                      x.employeeInformation
                                                          ?.paymentRate
                                                  }
                                              />
                                              <TableData name={x.totalHours} />
                                              <TableData
                                                  name={`${
                                                      x.employeeInformation
                                                          ?.currency
                                                  }${CUR(
                                                      x.totalAmount as unknown as string,
                                                  )}`}
                                              />
                                          </Tr>
                                      ))
                                : payslip?.data?.value
                                      ?.slice(0, 4)
                                      .map((x: PaySlipView) => (
                                          <Tr key={x.id}>
                                              <TableData
                                                  name={formatDate(
                                                      x?.invoice?.startDate,
                                                  )}
                                              />
                                              <TableData
                                                  name={formatDate(
                                                      x?.invoice?.endDate,
                                                  )}
                                              />
                                              <TableData
                                                  name={formatDate(
                                                      x?.invoice?.paymentDate,
                                                  )}
                                              />

                                              <TableData
                                                  name={x?.invoice?.totalHours}
                                              />
                                              <TableData
                                                  name={`${
                                                      x.invoice
                                                          ?.employeeInformation
                                                          ?.currency
                                                  }${CUR(
                                                      x.invoice
                                                          ?.totalAmount as unknown as string,
                                                  )}`}
                                              />
                                              {/* <TableData
                                                  name={
                                                      (x?.invoice
                                                          ?.totalAmount as number) +
                                                      (
                                                          x?.invoice
                                                              ?.expenses as unknown as ExpenseView[]
                                                      )?.reduce(
                                                          (a, b) =>
                                                              a +
                                                              (b?.amount as number),
                                                          0,
                                                      )
                                                  }
                                              /> */}
                                          </Tr>
                                      ))
                        }
                        thead={[
                            'Start Date',
                            'End Date',
                            'Payment Date',
                            'Total Hours',
                            'Total Amount',
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

export default TeamDashboard;
