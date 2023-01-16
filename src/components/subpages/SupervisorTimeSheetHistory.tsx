/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Flex, Select, Text, HStack, Input, Tr } from '@chakra-ui/react';
import {
    TableContract,
    TableContractAction,
    TableData,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import {
    TimeSheetHistoryView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}

function TimesheetHistory({ timeSheets }: adminProps) {
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
                        'Job Title',
                        'Total Hours',
                        'No. of Days',
                        '',
                    ]}
                >
                    <>
                        {timeSheets?.data?.value?.map(
                            (x: TimeSheetHistoryView) => (
                                <Tr key={x.employeeInformationId}>
                                    <TableData name={x.name} />
                                    <TableData name={x.email} />
                                    <TableData
                                        name={x.employeeInformation?.jobTitle}
                                    />
                                    <TableData
                                        name={x.totalHours as unknown as string}
                                    />
                                    <TableData
                                        name={
                                            x.numberOfDays as unknown as string
                                        }
                                    />

                                    <TableContractAction
                                        id={x.employeeInformationId}
                                        supervisor={true}
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

export default TimesheetHistory;
