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
    TimeSheetApprovedView,
    TimeSheetHistoryView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { formatDate } from '@components/generics/functions/formatDate';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}

function TimesheetClient({ timeSheets }: adminProps) {
    const router = useRouter();
    const date = router.query.from as string;

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <FilterSearch />
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
                            (x: TimeSheetHistoryView, i) => (
                                <Tr key={i}>
                                    <TableData name={x.name} />
                                    <TableData
                                        name={x.employeeInformation?.jobTitle}
                                    />
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableData
                                        name={x.totalHours as unknown as string}
                                    />
                                    <TableData
                                        name={
                                            x.approvedNumberOfHours as unknown as string
                                        }
                                    />

                                    <TableContractAction
                                        id={x.employeeInformationId}
                                        supervisor={true}
                                        date={date}
                                    />
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
                <Pagination data={timeSheets} />
            </Box>
        </>
    );
}

export default TimesheetClient;
