import {
    Box,
    Flex,
    Button,
    Tr,
    useDisclosure,
    Icon,
    Text,
    HStack,
    Square,
} from '@chakra-ui/react';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Pagination from '@components/bits-utils/Pagination';
import ShiftFilter from '@components/bits-utils/ShiftFilter';
import {
    TableData,
    TableStatus,
    TableActions,
    TableState,
    TableDataShiftDate,
    ShiftSwapActions,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { BsDownload } from 'react-icons/bs';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import {
    UsersShiftViewPagedCollectionStandardResponse,
    UserView,
} from 'src/services';

interface employeeShiftProps {
    allShift: UsersShiftViewPagedCollectionStandardResponse;
}

export const SwapShiftList = ({ allShift }: employeeShiftProps) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const thead = [
        'Employee Name',
        'Shift',
        'Date',
        'New Shift',
        'Date',
        'Swap shift with',
        'Status',
    ];
    // console.log({ userInfo });
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1rem 0rem 0"
            // boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Flex justify="space-between" mb="1.5rem" align="center">
                <HStack
                    gap=".5rem"
                    align="center"
                    cursor="pointer"
                    onClick={() => router.back()}
                >
                    <Square
                        fontSize=".9rem"
                        color="brand.400"
                        bgColor="gray.200"
                        borderRadius="6px"
                        size="2rem"
                    >
                        <MdOutlineArrowBackIos />
                    </Square>
                    <Text
                        mb="0"
                        color="black"
                        fontWeight="500"
                        fontSize=".9rem"
                    >
                        Back
                    </Text>
                </HStack>
                {/* <Text fontSize=".9rem" fontWeight="600">
                    {userInfo?.fullName}'s Shift
                </Text> */}
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
            <ShiftFilter />
            <Tables tableHead={thead}>
                <>
                    {allShift?.data?.value?.map((x: any) => {
                        // setData(x);
                        return (
                            <Tr key={x.id}>
                                <TableData
                                    name={x.shiftToSwap?.user?.fullName}
                                />
                                <TableData name={x.shiftToSwap?.title} />
                                <TableDataShiftDate
                                    name={formatDate(x.shiftToSwap?.start)}
                                    date={`${moment(
                                        x.shiftToSwap?.start,
                                    ).format('LT')} - ${moment(
                                        x.shiftToSwap?.start,
                                    ).format('LT')}`}
                                />
                                <TableData name={x.shift?.title} />
                                <TableDataShiftDate
                                    name={formatDate(x?.shift?.start)}
                                    date={`${moment(x?.shift?.start).format(
                                        'LT',
                                    )} - ${moment(x?.shift?.start).format(
                                        'LT',
                                    )}`}
                                />
                                <TableData name={x?.shift?.user?.fullName} />
                                <TableState
                                    name={x.isApproved ? 'APPROVED' : 'PENDING'}
                                />
                                <ShiftSwapActions id={x.id} />
                            </Tr>
                        );
                    })}
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
