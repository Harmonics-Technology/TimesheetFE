import { Box, Flex, Button, Tr, useDisclosure, Icon } from '@chakra-ui/react';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Pagination from '@components/bits-utils/Pagination';
import {
    TableData,
    TableStatus,
    TableActions,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import React from 'react';
import { BsDownload } from 'react-icons/bs';
import {
    ShiftView,
    UsersShiftViewPagedCollectionStandardResponse,
} from 'src/services';

interface employeeShiftProps {
    allShift: UsersShiftViewPagedCollectionStandardResponse;
}

export const EmployeeShift = ({ allShift }: employeeShiftProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const thead = [
        'Employee',
        'Job Title',
        'Start Date',
        'End Date',
        'Total Hours',
        'Status',
        'Action',
    ];
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Flex justify="flex-end" mb="1rem">
                <Button
                    bgColor="brand.400"
                    color="white"
                    p=".5rem 1.5rem"
                    height="fit-content"
                    // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    onClick={onOpen}
                    borderRadius="5px"
                >
                    Export <Icon as={BsDownload} ml=".5rem" />
                </Button>
            </Flex>
            <FilterSearch searchOptions="Search by: Full Name, Job Title, Role, Payroll Type or Status" />
            <Tables tableHead={thead}>
                <>
                    {allShift?.data?.value?.map((x: ShiftView) => (
                        <Tr key={x.id}>
                            <TableData name={x.user?.fullName} />
                            <TableData
                                name={x.user?.employeeInformation?.jobTitle}
                            />

                            <TableData name={formatDate(x.start)} />
                            <TableData name={formatDate(x.end)} />
                            <TableData name={x.hours} />
                            <TableState
                                name={
                                    moment(x.end).diff(moment(), 'days') <= 0
                                        ? 'Completed'
                                        : 'Unfinished'
                                }
                            />
                            {/* <TableActions
                                id={x.id}
                                route="team-members"
                                email={x.email}
                            /> */}
                        </Tr>
                    ))}
                </>
            </Tables>
            <Pagination data={allShift} />
            <ExportReportModal
                isOpen={isOpen}
                onClose={onClose}
                data={thead}
                record={2}
                fileName={'Team members'}
                model="users"
            />
        </Box>
    );
};
