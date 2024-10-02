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
    HStack,
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
    DashboardService,
    ExpenseView,
    InvoiceView,
    PaySlipView,
    ProjectProgressCountView,
    SuperAdminDashboardView,
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
import { NewMiniCard } from '@components/bits-utils/NewUpdates/NewMiniCard';
import Skeleton from 'react-loading-skeleton';
import { calculatePer } from '@components/generics/functions/calculatePer';

interface DashboardProps {
    isSuperAdmin?: boolean;
    // error: any;
}

function SuperAdminDashboard({ isSuperAdmin }: DashboardProps) {
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
    const { messages, markAsRead, loading, setLimit } =
        useContext(NotificationContext);

    const isClient = subType == 'premium';
    // +
    // (counts?.completed as number);
    const thead = [
        'Total Ava Hours',
        'Utilized Hours',
        'Overtime Hours',
        'Ave Hours Per Resource',
        'Utilization Rate',
    ];

    const toast = useToast();
    const superAdminId = user?.superAdminId;
    const [dashData, setDashData] = useState<SuperAdminDashboardView>();
    const [isLoading, setLoading] = useState(false);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await DashboardService.getAdminMetrics(superAdminId);
            if (res.status) {
                setDashData(res?.data as SuperAdminDashboardView);
                setLoading(false);
                return;
            }
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.message || err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        if (superAdminId) {
            fetchDashboardData();
        }
    }, []);

    // console.log({ dashData });

    // handleCatchErrors(error);

    return (
        // <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
        <Box pos="relative">
            <VStack gap="1rem" w={['full', '70%']}>
                <Grid
                    templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                    gap="20px"
                    w="full"
                >
                    {/* <DashboardCard
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
                    /> */}
                    <Box
                        borderRadius="15px"
                        bgColor="white"
                        p="15px 18px"
                        w="full"
                    >
                        <Text color="#2F363A" fontWeight={500} pb=".8rem">
                            Project Management Overview
                        </Text>
                        <Box
                            bgColor="#EDF2F7"
                            // p="10px 21px"
                            borderRadius="15px"
                            w="full"
                            h="75px"
                            overflow="hidden"
                        >
                            {isLoading ? (
                                <Skeleton
                                    height="100%"
                                    count={1}
                                    style={{ top: '-4px' }}
                                />
                            ) : (
                                <Box p="10px 21px">
                                    <Text
                                        color="#2F363A"
                                        fontSize="14px"
                                        lineHeight="24px"
                                        mb="5px"
                                    >
                                        Total Number Of Projects
                                    </Text>
                                    <Text
                                        color="#2F363A"
                                        fontSize="28px"
                                        fontWeight={500}
                                        lineHeight="24px"
                                    >
                                        {
                                            dashData
                                                ?.projectManagementDashboardMetric
                                                ?.noOfProject
                                        }
                                    </Text>
                                </Box>
                            )}
                        </Box>
                        <Grid
                            templateColumns={[
                                'repeat(1, 1fr)',
                                'repeat(2, 1fr)',
                            ]}
                            gap="13px"
                            w="full"
                            mt="15px"
                        >
                            <NewMiniCard
                                text="Ongoing Projects"
                                count={
                                    dashData?.projectManagementDashboardMetric
                                        ?.ongoingProject
                                }
                                per={calculatePer(
                                    dashData?.projectManagementDashboardMetric
                                        ?.ongoingProject,
                                    dashData?.projectManagementDashboardMetric
                                        ?.noOfProject,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Projects Completed"
                                count={
                                    dashData?.projectManagementDashboardMetric
                                        ?.completedProject
                                }
                                per={calculatePer(
                                    dashData?.projectManagementDashboardMetric
                                        ?.completedProject,
                                    dashData?.projectManagementDashboardMetric
                                        ?.noOfProject,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Projects Not Started"
                                count={
                                    dashData?.projectManagementDashboardMetric
                                        ?.notStartedProject
                                }
                                per={calculatePer(
                                    dashData?.projectManagementDashboardMetric
                                        ?.notStartedProject,
                                    dashData?.projectManagementDashboardMetric
                                        ?.noOfProject,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Overdue Projects"
                                count={
                                    dashData?.projectManagementDashboardMetric
                                        ?.overdueProject
                                }
                                per={calculatePer(
                                    dashData?.projectManagementDashboardMetric
                                        ?.overdueProject,
                                    dashData?.projectManagementDashboardMetric
                                        ?.noOfProject,
                                )}
                                loading={isLoading}
                            />
                        </Grid>
                    </Box>
                    <Box
                        borderRadius="15px"
                        bgColor="white"
                        p="15px 18px"
                        w="full"
                    >
                        <Text color="#2F363A" fontWeight={500} pb=".8rem">
                            Operational Task Overview
                        </Text>
                        <Box
                            bgColor="#EDF2F7"
                            // p="10px 21px"
                            borderRadius="15px"
                            w="full"
                            h="75px"
                            overflow="hidden"
                        >
                            {isLoading ? (
                                <Skeleton
                                    height="100%"
                                    count={1}
                                    style={{ top: '-4px' }}
                                />
                            ) : (
                                <Box p="10px 21px">
                                    <Text
                                        color="#2F363A"
                                        fontSize="14px"
                                        lineHeight="24px"
                                        mb="5px"
                                    >
                                        Total Number Of Tasks
                                    </Text>
                                    <Text
                                        color="#2F363A"
                                        fontSize="28px"
                                        fontWeight={500}
                                        lineHeight="24px"
                                    >
                                        {
                                            dashData
                                                ?.operationalTaskDashboardMetrics
                                                ?.noOfTask
                                        }
                                    </Text>
                                </Box>
                            )}
                        </Box>
                        <Grid
                            templateColumns={[
                                'repeat(1, 1fr)',
                                'repeat(2, 1fr)',
                            ]}
                            gap="13px"
                            w="full"
                            mt="15px"
                        >
                            <NewMiniCard
                                text="Task In Progress"
                                count={
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.ongoingTask
                                }
                                per={calculatePer(
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.ongoingTask,
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.noOfTask,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Task Completed"
                                count={
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.completedTask
                                }
                                per={calculatePer(
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.completedTask,
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.noOfTask,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Task Not Started"
                                count={
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.notStartedTask
                                }
                                per={calculatePer(
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.notStartedTask,
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.noOfTask,
                                )}
                                loading={isLoading}
                            />
                            <NewMiniCard
                                text="Overdue Task"
                                count={
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.overdueTask
                                }
                                per={calculatePer(
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.overdueTask,
                                    dashData?.operationalTaskDashboardMetrics
                                        ?.noOfTask,
                                )}
                                loading={isLoading}
                            />
                        </Grid>
                    </Box>
                </Grid>

                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    {isSuperAdmin && (
                        <TableCards
                            title={'Resource Utilization Overview'}
                            url={''}
                            data={[0].map((x) => (
                                <Tr key={x}>
                                    <TableData
                                        name={Round(
                                            dashData
                                                ?.resourceUtilizationOverview
                                                ?.totalAvailableHours || 0,
                                        )}
                                    />
                                    <TableData
                                        name={`${Round(
                                            dashData
                                                ?.resourceUtilizationOverview
                                                ?.utilizedHours || 0,
                                        )}`}
                                    />
                                    <TableData
                                        name={`${Round(
                                            dashData
                                                ?.resourceUtilizationOverview
                                                ?.overtimeHours || 0,
                                        )}`}
                                    />
                                    <TableData
                                        name={`${Round(
                                            dashData
                                                ?.resourceUtilizationOverview
                                                ?.averageHoursPerResource || 0,
                                        )}`}
                                    />
                                    <TableData
                                        name={`${Round(
                                            dashData
                                                ?.resourceUtilizationOverview
                                                ?.utilizationRate || 0,
                                        )}%`}
                                    />
                                    {/* <TableState name={x.status} /> */}
                                </Tr>
                            ))}
                            thead={thead}
                            link={''}
                            exportOpened={exportOpened}
                        />
                    )}
                    <TableCards
                        title={'Top Resource Data'}
                        url={''}
                        link=""
                        data={dashData?.topResourceReport
                            ?.slice(0, 4)
                            .map((x, i) => (
                                <Tr key={i}>
                                    <TableData name={x?.fullName} />
                                    <TableData
                                        name={Round(x?.totalHoursAvailable)}
                                    />
                                    <TableData name={Round(x?.utilizedHours)} />
                                    <TableData
                                        name={Round(x?.utilizationRate)}
                                    />
                                    {/* <TableState name={x.status} /> */}
                                </Tr>
                            ))}
                        thead={[
                            'Resource Name',
                            'Total Hours Available',
                            'Hours Utilized',
                            'Utilization Rate',
                            // 'Status',
                            // 'Action',
                        ]}
                    />
                    <TableCards
                        title={'Timesheet Report'}
                        url={'timesheets/history'}
                        data={dashData?.recentTimeSheet
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
                            'Beg. Period',
                            'End Period',
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
                        data={dashData?.recentPayrolls
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
                                    <TableState
                                        name={
                                            x.status == 'REVIEWING' ||
                                            x.status == 'REVIEWED'
                                                ? 'APPROVED'
                                                : (x.status as string)
                                        }
                                    />
                                    {/* <TableInvoiceActions id={x.id} x={x} /> */}
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Job Title',
                            // 'Processed on',
                            'Pay Period',
                            'Salary',
                            'Status',
                            // 'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
                {isClient && (
                    <Grid
                        templateColumns={['1fr', '1fr']}
                        gap="1.2rem"
                        w="full"
                        display="none"
                    >
                        {/* <TableCards
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
                        /> */}
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
                <Grid
                    templateColumns={['1fr', '1fr']}
                    gap="1.2rem"
                    w="full"
                    display="none"
                >
                    <TableCards
                        title={'Recent Invoice'}
                        url={'financials/invoices'}
                        data={dashData?.recentPayrolls
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
                setLimit={setLimit}
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
        </Box>
        // </Grid>
    );
}

export default SuperAdminDashboard;
