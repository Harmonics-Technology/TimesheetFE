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
import { FinancialReportView, ReportService } from 'src/services';
import { ReportNav } from './ReportNav';
import { UserContext } from '@components/context/UserContext';
import Skeleton from 'react-loading-skeleton';
import { Round } from '@components/generics/functions/Round';
import { formatDate } from '@components/generics/functions/formatDate';
import Tables from '@components/bits-utils/Tables';

export const FinancialsReport = () => {
    const [metrics, setMetrics] = useState<FinancialReportView | null>({});
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(4);
    const [expLimit, setExpLimit] = useState(4);
    const [payLimit, setPayLimit] = useState(4);

    const toast = useToast();
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    const role = user?.role?.replaceAll(' ', '');

    const fetchData = async () => {
        try {
            const res = await ReportService.getFinancialReportView(
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
            label: 'Total Request',
            value: metrics?.totalExpenseRequests,
        },
        {
            label: 'Total Amount',
            value: metrics?.totalAmount,
        },
        {
            label: 'Approved Request',
            value: metrics?.approvedRequests,
        },
        {
            label: 'Approved Amount',
            value: metrics?.approvedAmount,
        },
        {
            label: 'Pending Request',
            value: metrics?.pendingRequests,
        },
        {
            label: 'Pending Amount',
            value: metrics?.pendingAmount,
        },
    ];

    return (
        <Box bgColor="white" p="2rem" borderRadius="10px">
            <ReportNav role={role} />
            <HStack justify="space-between" w="full" p="1rem 0 0rem">
                <Text fontWeight="500" color="#2f363a">
                    Financials Report
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

            <Box
                borderRadius="10px"
                border="1px solid #E5E5E5"
                p="20px 20px 50px"
            >
                <HStack justify="space-between" mb="1rem">
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Expense Management Report
                        </Text>
                        <Text fontSize="14px" color="#787486">
                            Summarizes company-wide and department-specific
                            expenses.
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <>
                        <Tables
                            tableHead={[
                                'Department',
                                { label: 'Total Request', center: true },
                                { label: 'Total Amount ($)', center: true },
                                { label: 'Approved Request', center: true },
                                { label: 'Approved Amount ($)', center: true },
                                { label: 'Pending Request', center: true },
                                { label: 'Pending Amount ($)', center: true },
                            ]}
                            color="#2F363A"
                        >
                            <>
                                {(metrics?.expenseManagementReport || [])
                                    ?.slice(0, limit)
                                    ?.map((x) => {
                                        return (
                                            <TableRow>
                                                <TableData
                                                    name={x?.department}
                                                />
                                                <TableData
                                                    name={x?.totalRequest}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.totalAmount}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.approvedRequest}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.approvedAmount}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.pendingRequest}
                                                    center
                                                />
                                                <TableData
                                                    name={`${Round(
                                                        x?.pendingAmount || 0,
                                                    )}`}
                                                    center
                                                />
                                            </TableRow>
                                        );
                                    })}
                            </>
                        </Tables>
                        <Text
                            color="#2EAFA3"
                            fontSize="14px"
                            mt="20px"
                            cursor="pointer"
                            onClick={() => setLimit(limit + 4)}
                        >
                            View More
                        </Text>
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
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            All Expense Report
                        </Text>
                        {/* <Text fontSize="14px" color="#787486">
                            Monitors team workload and availability.
                        </Text> */}
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <>
                        <Tables
                            tableHead={[
                                'Department',
                                'Requestor',
                                'Expense Type',
                                { label: 'Expense Amount($)', center: true },
                                'Status',
                                'Request Date',
                            ]}
                            color="#2F363A"
                        >
                            <>
                                {(metrics?.allExpenseReport || [])
                                    ?.slice(0, expLimit)
                                    ?.map((x) => {
                                        return (
                                            <TableRow>
                                                <TableData
                                                    name={x?.department}
                                                />
                                                <TableData
                                                    name={x?.requestor}
                                                />
                                                <TableData
                                                    name={x?.expenseType}
                                                />
                                                <TableData
                                                    name={x?.amount}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.status}
                                                    customColor={
                                                        x?.status == 'REJECTED'
                                                            ? '#ff5b79'
                                                            : x?.status ==
                                                              'completed'
                                                            ? '#2EAFA3'
                                                            : '#28A3EF'
                                                    }
                                                />

                                                <TableData
                                                    name={formatDate(
                                                        x?.requestDate,
                                                    )}
                                                />
                                            </TableRow>
                                        );
                                    })}
                            </>
                        </Tables>
                        <Text
                            color="#2EAFA3"
                            fontSize="14px"
                            mt="20px"
                            cursor="pointer"
                            onClick={() => setExpLimit(expLimit + 4)}
                        >
                            View More
                        </Text>
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
                    <Box>
                        <Text fontSize="14px" fontWeight={500}>
                            Payroll Summary Report
                        </Text>
                    </Box>
                </HStack>
                {loading ? (
                    <Skeleton height="57px" count={4} style={{ top: '-4px' }} />
                ) : (
                    <>
                        <Tables
                            tableHead={[
                                'Employee Name',
                                'Department',
                                { label: 'Base Salary ($)', center: true },
                                'Payment Type',
                                { label: 'Hours', center: true },
                                { label: 'Rate ($)', center: true },
                                { label: 'Net Salary ($)', center: true },
                            ]}
                            color="#2F363A"
                        >
                            <>
                                {(metrics?.payrollSummaryReport || [])
                                    ?.slice(0, payLimit)
                                    ?.map((x) => {
                                        return (
                                            <TableRow>
                                                <TableData
                                                    name={x?.employeeName}
                                                />
                                                <TableData
                                                    name={x?.department}
                                                />
                                                <TableData
                                                    name={x?.baseSalary}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.paymentType}
                                                />
                                                <TableData
                                                    name={x?.hours}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.rate}
                                                    center
                                                />
                                                <TableData
                                                    name={x?.netSalary}
                                                    center
                                                />
                                            </TableRow>
                                        );
                                    })}
                            </>
                        </Tables>
                        <Text
                            color="#2EAFA3"
                            fontSize="14px"
                            mt="20px"
                            cursor="pointer"
                            onClick={() => setPayLimit(payLimit + 4)}
                        >
                            View More
                        </Text>
                    </>
                )}
            </Box>
        </Box>
    );
};
