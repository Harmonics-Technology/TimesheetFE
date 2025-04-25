import {
    Box,
    Divider,
    Grid,
    HStack,
    Select,
    Text,
    useToast,
} from '@chakra-ui/react';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';
import { ChartLargeCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartLargeCard';
import { ChartMiniCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartMiniCard';
import { TableData, TableRow } from '@components/bits-utils/TableData';
import React, { useEffect, useState, useContext } from 'react';
import { ProjectManagementReportView, ReportService } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { formatDate } from '@components/generics/functions/formatDate';
import { ProgressBar } from '@components/bits-utils/ProjectManagement/Generics/ProgressBar';
import { Round } from '@components/generics/functions/Round';
import { BarChart } from '@components/bits-utils/Charts/BarChart';
import Tables from '@components/bits-utils/Tables';
import Link from 'next/link';

export const ProjectManagementReport = () => {
    const [metrics, setMetrics] = useState<ProjectManagementReportView | null>(
        {},
    );
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getProjectManagementReport(
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

    const totalProjectCount =
        Number(metrics?.projectStatusReportData?.completed) +
        Number(metrics?.projectStatusReportData?.notStarted) +
        Number(metrics?.projectStatusReportData?.ongoing);

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 2rem">
                <Text fontWeight="500" color="#2f363a">
                    Project Management
                </Text>
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
                    title={`Total number of Projects: ${
                        totalProjectCount || 0
                    }`}
                    legend={[
                        { text: 'Completed Project', color: '#45DAB6' },
                        { text: 'Ongoing Projects', color: '#28A3EF' },
                    ]}
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
                        <BarChart
                            chart={metrics?.ongoingVsCompletedProject}
                            datasets={[
                                {
                                    id: 1,
                                    label: 'Completed Projects',
                                    obj: 'completed',
                                    bgColor: '#45DAB6',
                                    barPerc: '0.3',
                                },
                                {
                                    id: 2,
                                    label: 'Ongoing Projects',
                                    obj: 'ongoing',
                                    bgColor: '#28A3EF',
                                    barPerc: '0.3',
                                },
                            ]}
                        />
                    )}
                </ChartLargeCard>
                <ChartMiniCard title="Project Status" fs="14px">
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
                                    name: 'Ongoing',
                                    count: metrics?.projectStatusReportData
                                        ?.ongoing,
                                },
                                {
                                    name: 'Completed',
                                    count: metrics?.projectStatusReportData
                                        ?.completed,
                                },
                                {
                                    name: 'Not Started',
                                    count: metrics?.projectStatusReportData
                                        ?.notStarted,
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
                p="20px 20px 20px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Text fontSize="14px" fontWeight={500}>
                        Project Overview
                    </Text>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <>
                        <Tables
                            tableHead={[
                                'Project',
                                'Projet Manager',
                                'Start Date',
                                'End Date',
                                'Project Status',
                            ]}
                            color="#2F363A"
                        >
                            <>
                                {(metrics?.projectOverviewReportData || [])
                                    ?.slice(0, 4)
                                    ?.map((x) => {
                                        return (
                                            <TableRow>
                                                <TableData name={x?.project} />
                                                <TableData
                                                    name={x?.projectManager}
                                                />
                                                <TableData
                                                    name={formatDate(
                                                        x?.startDate,
                                                    )}
                                                />
                                                <TableData
                                                    name={formatDate(
                                                        x?.endDate,
                                                    )}
                                                />
                                                <TableData
                                                    name={x?.projectStatus}
                                                    customColor={
                                                        x?.projectStatus ==
                                                        'overdue'
                                                            ? '#ff5b79'
                                                            : x?.projectStatus ==
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
                        <Link
                            passHref
                            href={`/${role}/project-management/projects`}
                        >
                            <Text
                                color="#2EAFA3"
                                fontSize="14px"
                                mt="20px"
                                cursor="pointer"
                            >
                                View More
                            </Text>
                        </Link>
                    </>
                )}
            </Box>
            <Divider borderColor="#D9D9D9" my="20px" />

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Text fontSize="14px" fontWeight={500}>
                        Project Progress & Timeline
                    </Text>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Project',
                            'Total Team Members',
                            'Total Hours Spent',
                            '% Completed',
                            'Pending Task',
                            'Overdue Task',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.projectProgressTimelineData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.project} />
                                            <TableData
                                                name={x?.totalTeamMembers}
                                            />
                                            <TableData
                                                name={x?.totalHoursSpent}
                                            />
                                            <TableData>
                                                <ProgressBar
                                                    barWidth={
                                                        x.percentageCompleted
                                                    }
                                                    barColor={'brand.400'}
                                                    rightText={`${Round(
                                                        x.percentageCompleted,
                                                    )}%`}
                                                />
                                            </TableData>
                                            <TableData name={x?.pendingTasks} />
                                            <TableData name={x?.overdueTasks} />
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
                    <Text fontSize="14px" fontWeight={500}>
                        Project Budget Report
                    </Text>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Project',
                            'Hours Spent',
                            'Budget',
                            'Budget Spent',
                            'Remaining',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.projectBudgetReportData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.project} />
                                            <TableData name={x?.hoursSpent} />
                                            <TableData name={x?.budget} />
                                            <TableData>
                                                <ProgressBar
                                                    barWidth={x.budgetSpent}
                                                    barColor={'brand.400'}
                                                    rightText={`${Round(
                                                        x.budgetSpent,
                                                    )}%`}
                                                />
                                            </TableData>
                                            <TableData name={x?.remainig} />
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
