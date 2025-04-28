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
import { TableData, TableRow } from '@components/bits-utils/TableData';
import React, { useEffect, useState, useContext } from 'react';
import { ReportService, TimesheetReportView } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { Round } from '@components/generics/functions/Round';
import Tables from '@components/bits-utils/Tables';

export const TimesheetReport = () => {
    const [metrics, setMetrics] = useState<TimesheetReportView | null>({});
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getTimesheetReport(superAdminId);
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
            label: 'Total Hours',
            value: metrics?.totalHours,
        },
        {
            label: 'Total Approved Hours',
            value: metrics?.approvedHours,
        },
        {
            label: 'Pending Hours',
            value: metrics?.pendingHours,
        },
        {
            label: 'Overtime Hours',
            value: metrics?.overtimeHours,
        },
        {
            label: 'Leave Hours',
            value: metrics?.leaveHours,
        },
    ];

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 0rem">
                <Text fontWeight="500" color="#2f363a">
                    Timesheet Report
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
            <Box
                my="12px"
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="8px 18px 21px"
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

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Departmental Timesheet Report Overview
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Tracks total hours worked, approvals, and overtime
                            trends in the Department
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Department Name',
                            { label: 'Total Hours', center: true },
                            { label: 'Approved Hours', center: true },
                            { label: 'Overtime Hours', center: true },
                            { label: 'Leave Hours', center: true },
                            { label: 'Avg Hours Per Employee', center: true },
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.departmentTimesheetReport || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={Round(x?.totalHours)}
                                                center
                                            />
                                            <TableData
                                                name={Round(x?.approvedHours)}
                                                center
                                            />
                                            <TableData
                                                center
                                                name={x?.overtimeHours}
                                            />
                                            <TableData
                                                name={x?.leaveHours}
                                                center
                                            />
                                            <TableData
                                                name={`${Round(
                                                    x?.avgHoursPerEmployee || 0,
                                                )}`}
                                                center
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
                            Employee Timesheet Summary
                        </Text>
                        {/* <Text fontSize="14px" color="#787486">
                            Monitors team workload and availability.
                        </Text> */}
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Employee Name',
                            'Job Title',
                            'Department',
                            { label: 'Total Hours', center: true },
                            { label: 'Approved Hours', center: true },
                            { label: 'Overtime Hours', center: true },
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.employeeSummaryTimesheetReport || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employee} />
                                            <TableData name={x?.jobTitle} />
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.totalHours}
                                                center
                                            />
                                            <TableData
                                                name={x?.approvedHours}
                                                center
                                            />

                                            <TableData
                                                name={x?.overtimeHours}
                                                center
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
                            Billable vs. Non-Billable Hours Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Identifies time spent on revenue-generating vs.
                            internal tasks.
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
                            { label: 'Total Hours', center: true },
                            { label: 'Billable Hours', center: true },
                            { label: 'Non billable Hours', center: true },
                            { label: '% Billable', center: true },
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.billablevNonBillableHoursReport || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employee} />
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={Round(x?.totalHours)}
                                                center
                                            />
                                            <TableData
                                                name={x?.billableHours}
                                                center
                                            />
                                            <TableData
                                                name={Round(
                                                    x?.nonBillableHours,
                                                )}
                                                center
                                            />
                                            <TableData
                                                name={`${Round(
                                                    Number(
                                                        x?.percentageOfBillable,
                                                    ) * 100 || 0,
                                                )}%`}
                                                center
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
