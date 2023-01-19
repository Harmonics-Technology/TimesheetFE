import { Box, Tr } from '@chakra-ui/react';
import {
    TableContractAction,
    TableData,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import {
    RecentTimeSheetView,
    TimeSheetHistoryViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}

function TeamTimesheetHistory({ timeSheets }: adminProps) {
    console.log({ timeSheets });

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
                        'Year',
                        'Month',
                        'Number of Days',
                        'Approved No. of Hours',
                        '',
                    ]}
                >
                    <>
                        {timeSheets?.data?.value?.map((x: any, i) => (
                            <Tr key={i}>
                                <TableData name={x.year} />
                                <TableData name={x.month} />
                                <TableData
                                    name={`${
                                        x.numberOfDays as unknown as string
                                    } Days`}
                                />
                                <TableData
                                    name={`${
                                        x.hours as unknown as string
                                    } Hours`}
                                />
                                <TableContractAction
                                    id={x.employeeInformationId}
                                    timeSheets={true}
                                    date={`${x.year}-${x.month}`}
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

export default TeamTimesheetHistory;
