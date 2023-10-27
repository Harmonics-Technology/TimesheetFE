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
    useToast,
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
import { CAD, CUR } from '@components/generics/functions/Naira';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import {
    BudgetSummaryReportView,
    DashboardView,
    DashboardViewStandardResponse,
    ExpenseView,
    InvoiceView,
    PaySlipView,
    PayslipUserView,
    ProjectProgressCountView,
    UserView,
} from 'src/services';
import PayrollInvoice from './PayrollInvoice';
import { formatDate } from '@components/generics/functions/formatDate';
import InvoiceTemplate from './InvoiceTemplate';
import { Round } from '@components/generics/functions/Round';
import ClientInvoicedInvoice from './ClientInvoicedInvoice';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import handleCatchErrors from '@components/generics/functions/handleCatchErrors';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
    counts: ProjectProgressCountView;
    summary: BudgetSummaryReportView;
    // error: any;
}

function SuperAdminDashboard({
    metrics,
    counts,
    summary,
}: // error,
DashboardProps) {
    const { user, subType } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const {
        isOpen: exportOpen,
        onOpen: exportOpened,
        onClose: exportClose,
    } = useDisclosure();
    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    const adminMetrics = metrics?.data as DashboardView;

    const isClient = subType == 'premium';
    const totalCounts =
        (counts?.notStarted as number) +
        (counts?.inProgress as number) +
        (counts?.completed as number);
    const thead = [
        'No Of Users',
        'Total Hours',
        'Billable',
        'Non-Billable',
        'Amount',
    ];

    // handleCatchErrors(error);

    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
                <Grid
                    templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                    gap="1.2rem"
                    w="full"
                >
                    <DashboardCard
                        url={`/${role}/project-management/projects`}
                        title="active projects"
                        value={totalCounts || 0}
                    />
                    <DashboardCard
                        url={`/${role}/profile-management/team-members`}
                        title="team members"
                        value={adminMetrics?.totalTeamMembers || 0}
                    />
                    <DashboardCard
                        url={`/${role}/profile-management/admin`}
                        title="admins"
                        value={adminMetrics?.totalDownLines || 0}
                    />
                </Grid>

                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Summary Report'}
                        url={'timesheets/approval'}
                        hasFilter
                        data={[0].map((x) => (
                            <Tr key={x}>
                                <TableData
                                    name={Round(summary?.noOfUsers || 0)}
                                />
                                <TableData
                                    name={`${Round(
                                        summary?.totalHours || 0,
                                    )} hours`}
                                />
                                <TableData
                                    name={`${Round(
                                        summary?.billableHours || 0,
                                    )} hours`}
                                />
                                <TableData
                                    name={`${Round(
                                        summary?.nonBillableHours || 0,
                                    )} hours`}
                                />
                                <TableData
                                    name={CAD(Round(summary?.amount || 0))}
                                />
                                {/* <TableState name={x.status} /> */}
                            </Tr>
                        ))}
                        thead={thead}
                        link={''}
                        exportOpened={exportOpened}
                    />
                    <TableCards
                        title={'Timesheet Report'}
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
                                        name={x?.employeeInformation?.jobTitle}
                                    />
                                    <TableData
                                        name={formatDate(x?.startDate)}
                                    />
                                    <TableData name={formatDate(x?.endDate)} />
                                    <TableData
                                        name={`${
                                            x?.totalHours as unknown as string
                                        } Hours`}
                                    />
                                    <TableData
                                        name={`${
                                            x?.approvedNumberOfHours as unknown as string
                                        }Hours`}
                                    />
                                    {/* <TableState name={x.status} /> */}
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Job Title',
                            'Begining Period',
                            'Ending Period',
                            'Total Hours',
                            'Approved Hours',
                            // 'Status',
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
                                    <TableData
                                        name={CUR(Round(x.totalAmount))}
                                    />
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
                {isClient && (
                    <Grid
                        templateColumns={['1fr', '1fr']}
                        gap="1.2rem"
                        w="full"
                    >
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
                )}
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
                                            x.name ||
                                            x?.createdByUser?.organizationName
                                        }
                                    />
                                    <TableData name={x.invoiceReference} />
                                    <TableData
                                        name={formatDate(x.dateCreated)}
                                    />
                                    <TableData
                                        name={CUR(
                                            Round(x.totalAmount as number),
                                        )}
                                    />
                                    <TableState name={x.status as string} />
                                    <InvoiceAction
                                        data={x}
                                        onOpen={
                                            x.invoiceType == 'PAYROLL'
                                                ? onOpened
                                                : x.invoiceType == 'CLIENT'
                                                ? onOpens
                                                : onOpen
                                        }
                                        clicked={setClicked}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Name on Invoice',
                            'Invoice No',
                            'Generated on',
                            'Amount',
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
            <ClientInvoicedInvoice
                isOpen={isOpens}
                onClose={onCloses}
                clicked={clicked}
            />
            {exportOpen && (
                <ExportReportModal
                    isOpen={exportOpen}
                    onClose={exportClose}
                    data={thead}
                    record={1}
                    fileName={'Summary Report'}
                    model="summary-report"
                />
            )}
        </Grid>
    );
}

export default SuperAdminDashboard;
