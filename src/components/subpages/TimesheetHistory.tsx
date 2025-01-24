/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    Button,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
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
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { BsDownload } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface adminProps {
    timeSheets: TimeSheetHistoryViewPagedCollectionStandardResponse;
}

function TimesheetHistory({ timeSheets }: adminProps) {
    //
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const date = router.query.from as string;

    const thead = [
        'Name',
        'Job Title',
        'Begining Period',
        'Ending Period',
        // 'Total Hours',
        'Approved Hours',
        'Action',
    ];
    const filterClientsInvoice = (filter: string) => {
        router.push({
            query: {
                clientId: filter,
            },
        });
    };

    const newData = [
        { id: 1, title: 'Weekly' },
        { id: 2, title: 'Bi - Weekly' },
        { id: 3, title: 'Monthly' },
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1rem 1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="flex-end" mb="1rem">
                    <ShiftBtn
                        text="Export"
                        onClick={onOpen}
                        px="1rem"
                        suffix={<Icon as={BsDownload} ml=".5rem" />}
                        outline
                    />
                </Flex>
                <FilterSearch
                    filterTitle="Timesheet Frequency"
                    hides
                    data={timeSheets}
                    filter={
                        <Selectrix
                            options={newData}
                            searchable
                            customKeys={{
                                key: 'id',
                                label: 'title',
                            }}
                            onChange={(value: any) =>
                                filterClientsInvoice(value.key)
                            }
                        />
                    }
                />
                <Tables tableHead={thead}>
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
                                    {/* <TableData
                                        name={x.totalHours as unknown as string}
                                    /> */}
                                    {/* <TableData
                                        name={
                                            x.numberOfDays as unknown as string
                                        }
                                    /> */}
                                    <TableData
                                        name={
                                            x.approvedNumberOfHours as unknown as string
                                        }
                                    />

                                    <TableContractAction
                                        id={x.employeeInformationId}
                                        timeSheets={true}
                                        date={date}
                                    />
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
                <Pagination data={timeSheets} loadMore />
            </Box>
            {isOpen && (
                <ExportReportModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={thead}
                    record={3}
                    fileName={'Timesheet History Reports'}
                    model="timesheet"
                />
            )}
        </>
    );
}

export default TimesheetHistory;
