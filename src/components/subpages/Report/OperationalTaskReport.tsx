import {
    Box,
    Divider,
    Grid,
    HStack,
    Select,
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';
import { ChartLargeCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartLargeCard';
import { ChartMiniCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartMiniCard';
import { TableData, TableRow } from '@components/bits-utils/TableData';
import React, { useEffect, useState, useContext } from 'react';
import { OperationalTaskReportView, ReportService } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { formatDate } from '@components/generics/functions/formatDate';
import { LineChartSingle } from '@components/bits-utils/Charts/LineChart';
import { Round } from '@components/generics/functions/Round';
import Tables from '@components/bits-utils/Tables';

export const OperationalTaskReport = () => {
    const [metrics, setMetrics] = useState<OperationalTaskReportView | null>(
        {},
    );
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getOperationalTaskReport(
                superAdminId,
            );
            if (res?.data) {
                setMetrics(res?.data);
                return;
            }
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const items = [
        {
            label: 'Total Number Of Tasks',
            value: metrics?.totalNumberOfTasks,
        },
        {
            label: 'Task In Progress',
            value: metrics?.taskInProgress,
        },
        {
            label: 'Task Completed',
            value: metrics?.taskCompleted,
        },
        {
            label: 'Task Not Started',
            value: metrics?.taskNotStarted,
        },
        {
            label: 'Overdue Task',
            value: metrics?.overdueTasks,
        },
    ];

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 0rem">
                <Text fontWeight="500" color="#2f363a">
                    Operational Task
                </Text>
            </HStack>
            <Box
                my="12px"
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="8px 18px 19px"
            >
                <Text
                    fontWeight="500"
                    fontSize="14px"
                    color="#2f363a"
                    py=".5rem"
                    mb="1rem"
                    borderBottom="1px solid #d9d9d9"
                >
                    Overview
                </Text>
                <Grid templateColumns="repeat(5, 1fr)">
                    {items?.map((x) => (
                        <>
                            {loading ? (
                                <Skeleton
                                    height="85px"
                                    count={1}
                                    style={{ top: '-4px' }}
                                />
                            ) : (
                                <VStack
                                    align="flex-start"
                                    gap="6px"
                                    borderRight="1px solid #d9d9d9"
                                    px="16px"
                                    _last={{ borderRight: 'none', pr: '0' }}
                                    _first={{ px: '0' }}
                                >
                                    <Text
                                        fontWeight="500"
                                        color="#2f363a"
                                        fontSize="24px"
                                    >
                                        {x?.value}
                                    </Text>
                                    <Text color="#787486" fontSize="14px">
                                        {x?.label}
                                    </Text>
                                </VStack>
                            )}
                        </>
                    ))}
                </Grid>
            </Box>
            <HStack justify="end" w="full" p="0rem 0 2rem">
                <Select
                    borderRadius="10px"
                    border="1px solid #C4C4C4"
                    h="40px"
                    w="fit-content"
                    fontSize="14px"
                >
                    <option value="12">Last 12 Months</option>
                </Select>
            </HStack>

            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '2fr 1fr']}
                gap="1.06rem"
            >
                <ChartLargeCard
                    title={`Statistics`}
                    sub="The rate of operational task completed"
                    fs="14px"
                    fsb="13px"
                    isFlex
                >
                    {loading ? (
                        <Skeleton
                            height="100%"
                            count={1}
                            style={{ top: '-4px' }}
                        />
                    ) : (
                        <LineChartSingle
                            chart={metrics?.operationalTasksStats}
                            label="leave utilization"
                            obj="completed"
                        />
                    )}
                </ChartLargeCard>
                <ChartMiniCard title="Operational task status" fs="14px">
                    {loading ? (
                        <Skeleton
                            height="100%"
                            count={1}
                            style={{ top: '-4px' }}
                        />
                    ) : (
                        <DoughnutChart
                            chart={[
                                {
                                    name: 'Not Started',
                                    count: metrics
                                        ?.operationalTaskStatusReportView
                                        ?.notStarted,
                                },
                                {
                                    name: 'Ongoing',
                                    count: metrics
                                        ?.operationalTaskStatusReportView
                                        ?.ongoing,
                                },
                                {
                                    name: 'Completed',
                                    count: metrics
                                        ?.operationalTaskStatusReportView
                                        ?.completed,
                                },
                            ]}
                        />
                    )}
                </ChartMiniCard>
            </Grid>
            <Divider borderColor="#D9D9D9" my="20px" />

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Departmental Task Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Tracks task distribution and completion rates within
                            each department.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Department',
                            'Total Task Assigned',
                            'Completed Task',
                            'Pending Task',
                            'Overdue Task',
                            'Task Completion Rate',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(
                                metrics?.departmentOperationalTaskReportView ||
                                []
                            )
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.totalTaskAssigned}
                                            />
                                            <TableData
                                                name={x?.completedTasks}
                                            />
                                            <TableData name={x?.pendingTasks} />
                                            <TableData name={x?.overDueTasks} />
                                            <TableData
                                                name={`${Round(
                                                    x?.completionRate || 0,
                                                )}%`}
                                            />
                                        </TableRow>
                                    );
                                })}
                        </>
                    </Tables>
                )}
            </Box>
            <Divider borderColor="#D9D9D9" my="20px" />

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Resource Utilization Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Monitors team workload and availability.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Employee Name',
                            'Department',
                            'Total Task Assigned',
                            'Completed Task',
                            'To-do Task',
                            'In-progress Task',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(
                                metrics?.operationalTaskResourceUtilizationReportView ||
                                []
                            )
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employee} />
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.totalTaskAssigned}
                                            />
                                            <TableData
                                                name={x?.completedTasks}
                                            />
                                            <TableData name={x?.todoTasks} />

                                            <TableData
                                                name={formatDate(
                                                    x?.inProgressTasks,
                                                )}
                                            />
                                        </TableRow>
                                    );
                                })}
                        </>
                    </Tables>
                )}
            </Box>
            <Divider borderColor="#D9D9D9" my="20px" />

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Task efficiency Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Tracks how long tasks take to complete and
                            identifies delays.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Task Name',
                            'Department',
                            'Assigned To',
                            'Planned Duration (Days)',
                            'Actual Duration (Days)',
                            'Delays (Days)',
                            'Status',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.taskEfficiencyReportView || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.taskName} />
                                            <TableData name={x?.department} />
                                            <TableData name={x?.assignedTo} />
                                            <TableData
                                                name={x?.plannedDuration}
                                            />
                                            <TableData
                                                name={x?.actualDuration}
                                            />
                                            <TableData name={x?.delay} />
                                            <TableData
                                                name={x?.status}
                                                customColor={
                                                    x?.status == 'overdue'
                                                        ? '#ff5b79'
                                                        : x?.status ==
                                                          'completed'
                                                        ? '#2EAFA3'
                                                        : '#28A3EF'
                                                }
                                            />
                                        </TableRow>
                                    );
                                })}
                        </>
                    </Tables>
                )}
            </Box>
        </Box>
    );
};
