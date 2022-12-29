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

interface adminProps {
    timeSheets: TimeSheetApprovedView[];
}

function TimesheetClient({ timeSheets }: adminProps) {
    console.log({ timeSheets });
    const router = useRouter();

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
                        'Email',
                        'Total Hours',
                        'No. of Days',
                        // 'Approved No. of Hours',
                        '',
                    ]}
                >
                    <>
                        {timeSheets?.map((x: TimeSheetApprovedView) => (
                            <Tr key={x.employeeInformationId}>
                                <TableData name={x.name} />
                                <TableData name={x.email} />
                                <TableData
                                    name={`${
                                        x.totalHours as unknown as string
                                    } Hours`}
                                />
                                <TableData
                                    name={`${
                                        x.numberOfDays as unknown as string
                                    } Days`}
                                />
                                {/* <TableData
                                    name={`${
                                        x.approvedNumberOfHours as unknown as string
                                    } Hours`}
                                /> */}

                                <TableContractAction
                                    id={x.employeeInformationId}
                                    timeSheets={true}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={timeSheets} />
            </Box>
        </>
    );
}

export default TimesheetClient;
