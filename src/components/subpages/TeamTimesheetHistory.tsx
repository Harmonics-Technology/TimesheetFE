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
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
    timesheet?: boolean;
}

function TeamTimesheetHistory({ timeSheets, timesheet = false }: adminProps) {
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
                        'Name',
                        'Year',
                        'Month',
                        'Begining Period',
                        'Ending Period',
                        'Approved Hours',
                        'Action',
                    ]}
                >
                    <>
                        {timeSheets?.data?.value?.map((x: any, i) => (
                            <Tr key={i}>
                                <TableData name={x.name} />
                                <TableData name={x.year} />
                                <TableData name={x.month} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableData
                                    name={`${
                                        x.hours as unknown as string
                                    } Hours`}
                                />
                                <TableContractAction
                                    id={x.employeeInformationId}
                                    date={`${x.year}-${x.month}`}
                                    team={true}
                                    timeSheets={timesheet}
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
