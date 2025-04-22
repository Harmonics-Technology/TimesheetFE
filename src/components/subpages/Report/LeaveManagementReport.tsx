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
import { LeaveReportView, ReportService } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { formatDate } from '@components/generics/functions/formatDate';
import { LineChartSingle } from '@components/bits-utils/Charts/LineChart';
import { Round } from '@components/generics/functions/Round';
import Tables from '@components/bits-utils/Tables';

export const LeaveManagementReport = () => {
    const [metrics, setMetrics] = useState<LeaveReportView | null>({});
    const [loading, setLoading] = useState(true);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getLeaveReport(superAdminId);
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
            label: 'No of Leave Allocated',
            value: metrics?.noOfLeaveAllocated,
        },
        {
            label: 'No of Leave Taken',
            value: metrics?.noOfLeaveTaken,
        },
        {
            label: 'No of Leave Remaining',
            value: metrics?.noOfLeaveRemaining,
        },
        {
            label: 'No Unpaid Leave',
            value: metrics?.noOfUnpaidLeave,
        },
        {
            label: 'Pending leave request',
            value: metrics?.pendingLeaveRequest,
        },
        {
            label: 'Leave utilization rate',
            value: `${Round(metrics?.leaveUtilizationRate) || 0}%`,
        },
    ];

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 0rem">
                <Text fontWeight="500" color="#2f363a">
                    Leave Management
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
                <Grid templateColumns="repeat(6, 1fr)">
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
                    sub="Leave utilization rate for a period"
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
                            chart={metrics?.leaveUtilizationPerMonth}
                            label="leave utilization"
                            obj="leaveCount"
                        />
                    )}
                </ChartLargeCard>
                <ChartMiniCard title="Top 3 Leave Type Rates" fs="14px">
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
                                    name: 'Vacation',
                                    count: metrics?.leaveTypeRateData?.vacation,
                                },
                                {
                                    name: 'Sick Leave',
                                    count: metrics?.leaveTypeRateData
                                        ?.sickLeave,
                                },
                                {
                                    name: 'Maternity Leave',
                                    count: metrics?.leaveTypeRateData?.matLeave,
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
                            Leave Departmental Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Tracks total leave balance, used leave, and
                            remaining leave in different departments
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Department',
                            'Total Leave Days',
                            'Accrued Leave Days',
                            'Used Leave Days',
                            'Remaining Leave Days',
                            'Leave Balance (%)',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.leaveDepartmentReportmentData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.totalLeaveDays}
                                            />
                                            <TableData
                                                name={x?.accruedLeaveDays}
                                            />
                                            <TableData
                                                name={x?.usedLeaveDays}
                                            />
                                            <TableData
                                                name={x?.remainingLeaveDays}
                                            />
                                            <TableData
                                                name={`${Round(
                                                    x?.leaveBalance || 0,
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
                    <Text fontSize="14px" fontWeight={500}>
                        Employee Leave Report
                    </Text>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Employee Name',
                            'Total Number Leave Allocated (Hours)',
                            'Leave Accrued (Hours)',
                            'Leave Balance (Hours)',
                            'Unpaid Leave (Hours)',
                            'Leave Expiry Date',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.employeeLeaveReportData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employee} />
                                            <TableData
                                                name={
                                                    x?.totalNumberLeaveAllocated
                                                }
                                            />
                                            <TableData
                                                name={x?.leaveAccruedHours}
                                            />
                                            <TableData
                                                name={x?.leaveBalanceHours}
                                            />
                                            <TableData
                                                name={x?.unpaidLeaveHours}
                                            />

                                            <TableData
                                                name={formatDate(
                                                    x?.leaveExpiryDate,
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
                            Leave Request Approval Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Provides an overview of leave requests and their
                            status.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Employee Nmae',
                            'Department',
                            'Leave Request Submittted',
                            'Approved Request',
                            'Pending Request',
                            'Rejected Request',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.leaveRequestApprovalReportData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employeeName} />
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.leaveRequestSubmitted}
                                            />
                                            <TableData
                                                name={x?.approvedRequest}
                                            />
                                            <TableData
                                                name={x?.pendingRequest}
                                            />
                                            <TableData
                                                name={x?.rejectedRequest}
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
                            Absenteeism & Attendance Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Identifies frequent absentees and unapproved
                            absences.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <Tables
                        tableHead={[
                            'Employee Nmae',
                            'Department',
                            'Sick Leave Taken',
                            'Mat Leave',
                            'Vacation Leave Taken',
                            'Unapproved Absence',
                            'Total Absence',
                        ]}
                        color="#2F363A"
                    >
                        <>
                            {(metrics?.absenteeismAndAttendanceReportData || [])
                                ?.slice(0, 4)
                                ?.map((x) => {
                                    return (
                                        <TableRow>
                                            <TableData name={x?.employee} />
                                            <TableData name={x?.department} />
                                            <TableData
                                                name={x?.sickLeaveTaken}
                                            />
                                            <TableData name={x?.matLeave} />
                                            <TableData
                                                name={x?.vacationLeaveTaken}
                                            />
                                            <TableData
                                                name={x?.unApprovedAbsence}
                                            />
                                            <TableData name={x?.totalAbsence} />
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
