/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Flex, Select, Text, HStack, Input, Tr } from '@chakra-ui/react';
import {
    TableContractAction,
    TableData,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import {
    AdminPaymentScheduleView,
    TimeSheetApprovedView,
    TimeSheetHistoryView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';
import { PayScheduleNotify } from '@components/bits-utils/PayScheduleNotify';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
    paymentSchedule: AdminPaymentScheduleView[];
}

function TimeSheetApproval({ timeSheets, paymentSchedule }: adminProps) {
    console.log({ paymentSchedule });
    const router = useRouter();
    const isWeekly = paymentSchedule.find((x) => x.scheduleType == 'Weekly');
    const isBiWeekly = paymentSchedule.find(
        (x) => x.scheduleType == 'Bi-Weekly',
    );
    const isMonthly = paymentSchedule.find((x) => x.scheduleType == 'Monthly');
    const schedules = [
        isWeekly && isWeekly?.scheduleType,
        isBiWeekly && isBiWeekly?.scheduleType,
        isMonthly && isMonthly?.scheduleType,
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                {!isWeekly || !isBiWeekly || !isMonthly ? (
                    <PayScheduleNotify scheduleDone={schedules} />
                ) : (
                    <Box>
                        <FilterSearch hide={true} />
                        <Tables
                            tableHead={[
                                'Name',
                                'Job Title',
                                'Begining Period',
                                'Ending Period',
                                'Total Hours',
                                'Approved Hours',
                                'Action',
                            ]}
                        >
                            <>
                                {timeSheets?.data?.value?.map(
                                    (x: TimeSheetApprovedView, i) => (
                                        <Tr key={i}>
                                            <TableData name={x?.name} />
                                            {/* <TableData name={x.email} /> */}
                                            <TableData
                                                name={
                                                    x?.employeeInformation
                                                        ?.jobTitle
                                                }
                                            />
                                            <TableData
                                                name={formatDate(x?.startDate)}
                                            />
                                            <TableData
                                                name={formatDate(x?.endDate)}
                                            />
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

                                            <TableContractAction
                                                id={x?.employeeInformationId}
                                                timeSheets={true}
                                            />
                                        </Tr>
                                    ),
                                )}
                            </>
                        </Tables>
                        <Pagination data={timeSheets} />
                    </Box>
                )}
            </Box>
        </>
    );
}

export default TimeSheetApproval;
