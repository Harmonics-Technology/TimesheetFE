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
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { BsDownload, BsEye } from 'react-icons/bs';
import { UsersShiftViewPagedCollectionStandardResponse } from 'src/services';

interface employeeShiftProps {
    allShift: UsersShiftViewPagedCollectionStandardResponse;
}

export const EmployeeShift = ({ allShift }: employeeShiftProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const thead = [
        'Employee',
        // 'Job Title',
        'Start Date',
        'End Date',
        'Total Hours',
        'Status',
        'Action',
    ];
    console.log({ allShift });
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const showSingleUser = (x) => {
        router.push(`/${role}/shift-management/employee-shifts/${x}`);
    };
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            // boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
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
                    {allShift?.data?.value?.map((x: any) => (
                        <Tr key={x.id}>
                            <TableData name={x.fullName} />
                            {/* <TableData
                                name={x.user?.employeeInformation?.jobTitle}
                            /> */}

                            <TableData name={formatDate(x.startDate)} />
                            <TableData name={formatDate(x.endDate)} />
                            <TableData name={x.totalHours} />
                            <TableState
                                name={
                                    moment(x.endDate).diff(moment(), 'days') <=
                                    0
                                        ? 'Completed'
                                        : 'In progress'
                                }
                            />

                            <td>
                                <Icon
                                    as={BsEye}
                                    onClick={() => showSingleUser(x.userId)}
                                    cursor="pointer"
                                />
                            </td>
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
