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
    useDisclosure,
} from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    InvoiceAction,
    TableData,
    TableInvoiceActions,
    TableState,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { UserContext } from '@components/context/UserContext';
import { CUR } from '@components/generics/functions/Naira';
import moment from 'moment';
import { useContext, useState } from 'react';
import {
    DashboardView,
    DashboardViewStandardResponse,
    ExpenseView,
    InvoiceView,
    PaySlipView,
    PayslipUserView,
    RecentTimeSheetView,
} from 'src/services';
import PayrollInvoice from './PayrollInvoice';
import { formatDate } from '@components/generics/functions/formatDate';
import InvoiceTemplate from './InvoiceTemplate';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function PayrollManagerDashboard({ metrics }: DashboardProps) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();
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
                                                .fullName
                                        }
                                    />
                                    <TableData name={`${120} hours`} />
                                    <TableData name={`${x.hours} hours`} />
                                    <TableData name={20} />
                                    <TableState name={x.status} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Supervisor Name',
                            'Expected Hrs',
                            'Total Hrs',
                            // 'Expected Payout',
                            'Payout',
                            'Status',
                            // 'Action',
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
                                        name={x.employeeInformation?.jobTitle}
                                    />
                                    {/* <TableData
                                        name={formatDate(x.dateCreated).format(
                                            'DD/MM/YYYY',
                                        )}
                                    /> */}
                                    <TableData
                                        name={`${formatDate(
                                            x.startDate,
                                        )}- ${formatDate(x.endDate)}`}
                                    />
                                    <TableData name={CUR(x.totalAmount)} />
                                    <TableState name={x.status as string} />
                                    <TableInvoiceActions id={x.id} x={x} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Job Role',
                            // 'Processed on',
                            'Pay Period',
                            'Salary',
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
                                        name={formatDate(
                                            x?.invoice?.startDate,
                                        ).format('DD-MM-YY')}
                                    />
                                    <TableData
                                        name={formatDate(
                                            x?.invoice?.endDate,
                                        ).format('DD-MM-YY')}
                                    />
                                    <TableData
                                        name={formatDate(
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
                                    <TableData
                                        name={
                                            x.payrollGroupName ||
                                            x.paymentPartnerName ||
                                            x.name
                                        }
                                    />
                                    <TableData name={x.invoiceReference} />
                                    <TableData name={CUR(x.totalAmount)} />
                                    <TableData
                                        name={formatDate(x.dateCreated)}
                                    />
                                    <TableState name={x.status as string} />
                                    <InvoiceAction
                                        data={x}
                                        onOpen={
                                            x.invoiceType == 'PAYROLL'
                                                ? onOpened
                                                : onOpen
                                        }
                                        clicked={setClicked}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Name on Invoice',
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
            <PayrollInvoice
                isOpen={isOpen}
                onClose={onClose}
                clicked={clicked}
            />
            <InvoiceTemplate
                isOpen={isOpened}
                onClose={onClosed}
                clicked={clicked}
            />
        </Grid>
    );
}

export default PayrollManagerDashboard;
