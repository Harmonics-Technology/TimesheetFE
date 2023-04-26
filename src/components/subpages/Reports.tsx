import {
    Box,
    Flex,
    Grid,
    Tr,
    Text,
    HStack,
    Circle,
    Icon,
} from '@chakra-ui/react';
import { BarChart } from '@components/bits-utils/BarChart';
import { ChartLegend } from '@components/bits-utils/ChartLegend';
import { ReportCards } from '@components/bits-utils/ReportCards';
import {
    TableData,
    TableState,
    TableInvoiceActions,
    TableStatus,
} from '@components/bits-utils/TableData';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { formatDate } from '@components/generics/functions/formatDate';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import CsvDownloader from 'react-csv-downloader';
import {
    InvoiceView,
    PaySlipView,
    PayslipUserView,
    UserView,
} from 'src/services';

export const Reports = ({ metrics, team, paymentPartner, chart }) => {
    console.log({ chart });
    const router = useRouter();
    const [fromDate, setFromDate] = useState<any>(new DateObject());

    const switchDate = () => {
        router.push({
            query: {
                chartYear: fromDate.format('YYYY'),
            },
        });
    };
    useNonInitialEffect(() => {
        switchDate();
    }, [fromDate]);

    const columns = [
        {
            id: 'month',
            displayName: 'Month',
        },
        {
            id: 'onShore',
            displayName: 'Onshore',
        },
        {
            id: 'offShore',
            displayName: 'Offshore',
        },
    ];
    const datas = chart.data;
    return (
        <Grid
            templateColumns={[
                'repeat(1, minmax(0, 1fr))',
                'repeat(2, minmax(0, 1fr))',
            ]}
            gap="1rem"
        >
            <ReportCards
                title="Payroll Report"
                url="financials/payrolls"
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
                            <TableData name={formatDate(x.startDate)} />
                            <TableData name={formatDate(x.endDate)} />
                            <TableData name={CUR(Round(x.totalAmount))} />
                        </Tr>
                    ))}
                thead={['Name', 'Start Date', 'End Date', 'Total']}
                link="/"
            />
            <ReportCards
                title="Payslip Report"
                url="financials/payslips"
                data={metrics?.data?.recentPayslips
                    ?.slice(0, 4)
                    .map((x: PaySlipView, i) => (
                        <Tr key={i}>
                            <TableData
                                name={x?.invoice?.createdByUser?.firstName}
                            />
                            <TableData
                                name={formatDate(x?.invoice?.startDate)}
                            />
                            <TableData name={formatDate(x?.invoice?.endDate)} />
                            <TableData name={`${x?.invoice?.totalHours} HRS`} />
                            <TableData
                                name={
                                    x?.invoice?.employeeInformation?.currency ==
                                    'CAD'
                                        ? CAD(x?.invoice?.totalAmount as number)
                                        : Naira(
                                              x?.invoice?.totalAmount as number,
                                          )
                                }
                            />
                        </Tr>
                    ))}
                thead={['Name', 'Start Date', 'End Date', 'Hours', 'Total']}
                link="/"
            />

            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                overflow="hidden"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Text fontSize="13px" fontWeight="700">
                    Reports Between Offshore & Onshore Team members for a
                    Calendar
                </Text>
                <Box>
                    <Flex
                        justify="space-between"
                        py=".5rem"
                        mb="1rem"
                        borderBottom="1px solid #EEF0F6"
                    >
                        <HStack spacing="2rem">
                            <ChartLegend text="Onshore Team" color="#45DAB6" />
                            <ChartLegend text="Offshore Team" color="#28A3EF" />
                        </HStack>
                        <HStack align="center">
                            <CsvDownloader
                                filename="Reports Between Offshore & Onshore Team members for a
                                Calendar"
                                columns={columns}
                                datas={datas}
                            >
                                <Icon as={AiOutlineDownload} />
                            </CsvDownloader>
                            <DatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                format="YYYY"
                                onlyYearPicker
                                render={(value, openCalendar) => {
                                    return (
                                        <HStack
                                            w="fit-content"
                                            px="1rem"
                                            h="1.8rem"
                                            justifyContent="center"
                                            alignItems="center"
                                            border="1px solid"
                                            borderColor="gray.300"
                                            color="gray.500"
                                            boxShadow="sm"
                                            borderRadius="4px"
                                            cursor="pointer"
                                            fontSize=".8rem"
                                            spacing="1rem"
                                            onClick={(value) =>
                                                openCalendar(value)
                                            }
                                        >
                                            <Text mb="0" whiteSpace="nowrap">
                                                {value}
                                            </Text>
                                            <Icon as={FaRegCalendarAlt} />
                                        </HStack>
                                    );
                                }}
                            />
                        </HStack>
                    </Flex>
                    <Box h="290px" w="full">
                        <BarChart chart={chart} />
                    </Box>
                </Box>
            </Box>

            <ReportCards
                title="Team Member Report"
                url="profile-management/team-members"
                data={team?.data?.value?.slice(0, 4).map((x: UserView, i) => (
                    <Tr key={i}>
                        <TableData name={x.fullName} />
                        <TableData name={x.employeeInformation?.jobTitle} />

                        <TableData name={x.employeeInformation?.payrollType} />
                        <TableStatus name={x.isActive} />
                    </Tr>
                ))}
                thead={['Full Name', 'Job Title', 'Payroll Type', 'Status']}
                link="/"
            />
            <ReportCards
                title="Client Report"
                url="profile-management/clients"
                data={metrics?.data?.recentCLients
                    ?.slice(0, 4)
                    .map((x: UserView) => (
                        <Tr key={x.id}>
                            <TableData name={x.organizationName} />
                            <TableData name={x.organizationEmail} />
                            <TableData name={x.organizationPhone} />
                            <TableStatus name={x.isActive} />
                        </Tr>
                    ))}
                thead={['CLIENT NAME', 'EMAIL', 'Phone', 'STATUS']}
                link="/"
            />
            <ReportCards
                title="Invoice received from payment partner Report"
                url="financials/invoices-payment"
                data={paymentPartner?.data?.value
                    ?.slice(0, 4)
                    .map((x: InvoiceView) => (
                        <Tr key={x.id}>
                            <TableData
                                name={
                                    x.payrollGroupName ||
                                    x.paymentPartnerName ||
                                    x.name
                                }
                            />
                            <TableData name={x.invoiceReference} />
                            <TableData
                                name={CAD(Round(x.totalAmount as number))}
                            />
                            <TableData name={formatDate(x.dateCreated)} />
                            <TableState name={x.status as string} />
                        </Tr>
                    ))}
                thead={[
                    // 'Invoice No',
                    'Client Name',
                    'Invoice',
                    'Amount',
                    'Date',
                    'Status',
                ]}
                link="/"
                hides
            />
        </Grid>
    );
};
