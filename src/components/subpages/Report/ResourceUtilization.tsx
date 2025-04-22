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
import { LineChartSingle } from '@components/bits-utils/Charts/LineChart';
import { ChartLargeCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartLargeCard';
import { ChartMiniCard } from '@components/bits-utils/ProjectManagement/Dashboard/ChartMiniCard';
import { TableData, TableRow } from '@components/bits-utils/TableData';
import React, { useEffect, useState, useContext } from 'react';
import { ReportService, ResourceUtilizationReportView } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { Round } from '@components/generics/functions/Round';
import Tables from '@components/bits-utils/Tables';

export const ResourceUtilization = () => {
    const [metrics, setMetrics] =
        useState<ResourceUtilizationReportView | null>({});
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getResourceUtilizationReport(
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

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 2rem">
                <Text fontWeight="500" color="#2f363a">
                    Resource Utilization
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
                    title="Statistics"
                    sub="Resource Utilization rate for a period"
                    fs="14px"
                    fsb="13px"
                >
                    {loading ? (
                        <Skeleton
                            height="100%"
                            count={1}
                            style={{ top: '-4px' }}
                        />
                    ) : (
                        <LineChartSingle
                            chart={metrics?.utilizationRateVsPeriod}
                            label="resource"
                            obj="utilizationRate"
                        />
                    )}
                </ChartLargeCard>
                <ChartMiniCard title="Resource Utilization" fs="14px">
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
                                    name: 'Standard Hours',
                                    count: metrics?.resourceUtilizationChartData
                                        ?.standardHours,
                                },
                                {
                                    name: 'Overtime Hours',
                                    count: metrics?.resourceUtilizationChartData
                                        ?.overtimeHours,
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
                    <Text fontSize="14px" fontWeight={500}>
                        Resource Allocation
                    </Text>
                </HStack>
                <Tables
                    tableHead={[
                        'Department Name',
                        'No Of Resources',
                        'No Of Task',
                        'Completed Task',
                        'No Of Hours',
                    ]}
                    color="#2F363A"
                >
                    {loading ? (
                        <Skeleton
                            height="57px"
                            count={4}
                            style={{ top: '-4px' }}
                        />
                    ) : (
                        <>
                            {metrics?.resourceAllocationData
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData
                                                name={x?.departmentName}
                                            />
                                            <TableData
                                                name={x?.noOfResources}
                                            />
                                            <TableData name={x?.noOfTask} />
                                            <TableData
                                                name={x?.completedTask}
                                            />
                                            <TableData name={x?.noOfHours} />
                                        </TableRow>
                                    );
                                })}
                        </>
                    )}
                </Tables>
            </Box>
            <Divider borderColor="#D9D9D9" my="20px" />

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Text fontSize="14px" fontWeight={500}>
                        Top Resource Data
                    </Text>
                </HStack>
                <Tables
                    tableHead={[
                        'Resource Name',
                        'Department',
                        'Total Hours Available',
                        'Hours Utilized',
                        'Utilization Rate',
                    ]}
                    color="#2F363A"
                >
                    {loading ? (
                        <Skeleton
                            height="57px"
                            count={4}
                            style={{ top: '-4px' }}
                        />
                    ) : (
                        <>
                            {metrics?.topResourceData?.slice(0, 4)?.map((x) => {
                                return (
                                    <TableRow>
                                        <TableData name={x?.fullName} />
                                        <TableData name={x?.department} />
                                        <TableData
                                            name={x?.totalHoursAvailable}
                                        />
                                        <TableData name={x?.utilizedHours} />
                                        <TableData
                                            name={Round(x?.utilizationRate)}
                                        />
                                    </TableRow>
                                );
                            })}
                        </>
                    )}
                </Tables>
            </Box>
        </Box>
    );
};
