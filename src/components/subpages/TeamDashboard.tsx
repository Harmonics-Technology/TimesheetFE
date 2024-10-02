import { Box, Grid, Image, Text, Tr, useToast, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NewMiniCard } from '@components/bits-utils/NewUpdates/NewMiniCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    TableContractAction,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { UserContext } from '@components/context/UserContext';
import { CUR } from '@components/generics/functions/Naira';
import { calculatePer } from '@components/generics/functions/calculatePer';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import {
    DashboardService,
    ExpenseView,
    InvoiceView,
    PaySlipView,
    PaySlipViewPagedCollectionStandardResponse,
    RecentTimeSheetView,
    TeammemberDashboardView,
    TimeSheetView,
    UserView,
} from 'src/services';

interface DashboardClientView {
    recentInvoice: [] | undefined | null;
}

function TeamDashboard() {
    const { user, subType } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const { messages, markAsRead, loading, setLimit } =
        useContext(NotificationContext);
    const toast = useToast();
    const superAdminId = user?.superAdminId;
    const [dashData, setDashData] = useState<TeammemberDashboardView>();
    const [isLoading, setLoading] = useState(false);

    const userId = user?.id;

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const res = await DashboardService.getTeamMemberMetrics(userId);
            if (res.status) {
                setDashData(res?.data as TeammemberDashboardView);
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
        if (userId) {
            fetchDashboardData();
        }
    }, []);

    // console.log({ dashData });

    return (
        // <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
        <Box>
            <VStack gap="1rem" w={['full', '70%']}>
                <Grid
                    templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)']}
                    gap="1.2rem"
                    w="full"
                >
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
                                    dashData?.projectManagementDashboardMetric
                                        ?.completedProject,
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
                    <TableCards
                        title={'Timesheet Report'}
                        url={'timesheets/timesheet-history'}
                        data={dashData?.recentTimeSheet
                            ?.slice(0, 4)
                            .map((x, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.name} />
                                    {/* <TableData name={x.year} /> */}
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableData name={x.hours} />
                                    <TableData name={`${x.approvedHours} `} />
                                    {/* <TableContractAction
                                        id={x.employeeInformationId}
                                        date={`${x?.startDate}`}
                                        end={`${x?.endDate}`}
                                        team={true}
                                        timeSheets={false}
                                    /> */}
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Begining Period',
                            'Ending Period',
                            'Total Hours',
                            'Approved Hours',
                            // 'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
                <Grid
                    templateColumns={['1fr', '1fr']}
                    gap="1.2rem"
                    w="full"
                    // display="none"
                >
                    <TableCards
                        title={
                            role == 'client'
                                ? 'Recent Invoices'
                                : 'Recent Payslips'
                        }
                        url={'financials/invoices'}
                        data={
                            role == 'client'
                                ? dashData?.recentPayslips
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
                                : dashData?.recentPayslips
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
                            'Processed Date',
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
                setLimit={setLimit}
            />
        </Box>
        // </Grid>
    );
}

export default TeamDashboard;
