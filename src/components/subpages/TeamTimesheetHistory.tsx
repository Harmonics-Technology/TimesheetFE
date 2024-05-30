import { Box, Button, Flex, Icon, Tr, useDisclosure } from '@chakra-ui/react';
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
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { BsDownload } from 'react-icons/bs';

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
    timesheet?: boolean;
    id?: string;
}

function TeamTimesheetHistory({
    timeSheets,
    timesheet = false,
    id,
}: adminProps) {
    const thead = [
        'Name',
        'Begining Period',
        'Ending Period',
        'Approved Hours',
        'Action',
    ];
    const { onOpen, onClose, isOpen } = useDisclosure();

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="flex-end" mb="1rem">
                    <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpen}
                        borderRadius="25px"
                    >
                        Export <Icon as={BsDownload} ml=".5rem" />
                    </Button>
                </Flex>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        // 'Year',
                        // 'Month',
                        'Begining Period',
                        'Ending Period',
                        'Total Hours',
                        'Approved Hours',
                        'Action',
                    ]}
                >
                    <>
                        {timeSheets?.data?.value?.map((x: any, i) => (
                            <Tr key={i}>
                                <TableData name={x.name} />
                                {/* <TableData name={x.year} /> */}
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableData name={x.hours} />
                                <TableData name={`${x.approvedHours} `} />
                                <TableContractAction
                                    id={x.employeeInformationId}
                                    date={`${x?.startDate}`}
                                    end={`${x?.endDate}`}
                                    team={true}
                                    timeSheets={timesheet}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={timeSheets} />
            </Box>
            {isOpen && (
                <ExportReportModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={thead}
                    record={2}
                    fileName={'Team Member Timesheet Approval'}
                    model="timesheet"
                    id={id}
                />
            )}
        </>
    );
}

export default TeamTimesheetHistory;
