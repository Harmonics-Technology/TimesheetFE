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
    TableData,
    TableState,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { UserContext } from '@components/context/UserContext';
import moment from 'moment';
import { useContext } from 'react';
import {
    DashboardView,
    DashboardViewStandardResponse,
    ExpenseView,
    InvoiceView,
    PaySlipView,
    PayslipUserView,
    RecentTimeSheetView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function PayrollManagerDashboard({ metrics }: DashboardProps) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    const adminMetrics = metrics?.data as DashboardView;
    console.log({ metrics });
    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
                {/* <Grid
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
                </Grid> */}
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Timesheets'}
                        url={'timesheets/approval'}
                        data={metrics?.data?.recentTimeSheet
                            ?.slice(0, 4)
                            .map((x: any, i) => (
                                <Tr key={i}>
                                    <TableData
                                        name={
                                            x?.employeeInformation?.user
                                                ?.fullName
                                        }
                                    />
                                    <TableData
                                        name={
                                            x?.employeeInformation?.supervisor
                                                .firstName
                                        }
                                    />
                                    <TableData
                                        name={
                                            x?.employeeInformation?.supervisor
                                                .firstName
                                        }
                                    />
                                    <TableData
                                        name={
                                            x.isApproved == false
                                                ? 'Not Approved'
                                                : 'Approved'
                                        }
                                    />
                                    <TableData name={x.hours} />
                                    <TableState name={x.status} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Supervisor Name',
                            'Expected Hours',
                            'Total Hours',
                            'Expected Payout',
                            'Actual Payout',
                            'Status',
                            'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent payrolls'}
                        url={'financials/payrolls'}
                        data={metrics?.data?.recentPayrolls
                            ?.slice(0, 4)
                            .map((x: InvoiceView, i) => (
                                <Tr key={i}>
                                    <TableData
                                        name={
                                            x.payrollGroupName ||
                                            x.paymentPartnerName ||
                                            x.name
                                        }
                                    />
                                    <TableData
                                        name={moment(x.dateCreated).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(x.startDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(x.endDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableState name={x.status as string} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Job Role',
                            'Pay Period',
                            'Salary',
                            'Total Salary Paid',
                            'Status',
                            'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
                {/* <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Payslip'}
                        url={'financials/payslips'}
                        data={metrics?.data?.recentPayslips
                            ?.slice(0, 4)
                            .map((x: PaySlipView, i) => (
                                <Tr key={i}>
                                    <TableData name={x?.invoice?.name} />
                                    <TableData
                                        name={moment(
                                            x?.invoice?.startDate,
                                        ).format('DD-MM-YY')}
                                    />
                                    <TableData
                                        name={moment(
                                            x?.invoice?.endDate,
                                        ).format('DD-MM-YY')}
                                    />
                                    <TableData
                                        name={moment(
                                            x?.invoice?.paymentDate,
                                        ).format('DD-MM-YY')}
                                    />

                                    <TableData
                                        name={
                                            (x?.invoice
                                                ?.totalAmount as number) +
                                            (
                                                x?.invoice
                                                    ?.expenses as unknown as ExpenseView[]
                                            )?.reduce(
                                                (a, b) =>
                                                    a + (b?.amount as number),
                                                0,
                                            )
                                        }
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Start Date',
                            'End Date',
                            'Payment Date',
                            'Total Amount',
                        ]}
                        link={'/'}
                    />
                </Grid> */}
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Invoice'}
                        url={'financials/invoices'}
                        data={metrics?.data?.recentInvoiced
                            ?.slice(0, 5)
                            .map((x: InvoiceView, i) => (
                                <Tr key={i}>
                                    <TableData name={x.invoiceReference} />
                                    <TableData
                                        name={
                                            x.payrollGroupName ||
                                            x.paymentPartnerName ||
                                            x.name
                                        }
                                    />
                                    <TableData
                                        name={moment(x.dateCreated).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(x.startDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(x.endDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Client Name',
                            'Invoice No',
                            'Amount',
                            'Generated on',
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
            />
        </Grid>
    );
}

export default PayrollManagerDashboard;
