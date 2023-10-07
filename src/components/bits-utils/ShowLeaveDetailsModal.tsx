import {
    Box,
    Circle,
    Flex,
    Grid,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from '@chakra-ui/react';
import React from 'react';
import { GrClose } from 'react-icons/gr';
import { SingleDetailsInfo } from './SingleDetailsInfo';
import { LeaveView } from 'src/services';
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';
import { TableState } from './TableData';
import { IconPickerItem } from 'react-icons-picker';
import getBusinessDateCount from './GetBusinessDays';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: LeaveView;
}

export const ShowLeaveDetailsModal = ({
    isOpen,
    onClose,
    data,
}: ExportProps) => {
    const status = data?.status;

    console.log({data})
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="10px"
                w={['88%', '30%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <Flex
                        justify="space-between"
                        mx="1rem"
                        borderBottom="2px solid"
                        borderColor="gray.300"
                    >
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="bold"
                        >
                            Leave Details
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 2]}>
                        <VStack>
                            <HStack justify="space-between" w="full" px=".7rem">
                                <Box>
                                    <Text
                                        fontSize="1.1rem"
                                        fontWeight="bold"
                                        mb=".5rem"
                                    >
                                        {
                                            data?.employeeInformation?.user
                                                ?.fullName
                                        }
                                    </Text>
                                    <Flex align="center" gap=".5rem">
                                        <IconPickerItem
                                            value={
                                                data?.leaveType?.leaveTypeIcon
                                            }
                                            color="#2EAFA3"
                                        />
                                        <Text mb="0" fontSize=".8rem">
                                            {data?.leaveType?.name}
                                        </Text>
                                    </Flex>
                                </Box>
                                <Box textAlign="right">
                                    <Text fontSize=".8rem">
                                        Leave Application Date
                                    </Text>
                                    <Text fontSize=".6rem">
                                        {formatDate(data?.dateCreated)}
                                    </Text>
                                </Box>
                            </HStack>
                            <VStack
                                spacing="0"
                                border="1px solid"
                                borderColor="gray.100"
                                gap="1rem"
                                w="full"
                                p=".8rem 1rem"
                            >
                                <SingleDetailsInfo
                                    label="Status"
                                    content={''}
                                    icon={data?.status}
                                />
                                <SingleDetailsInfo
                                    label="Start Date"
                                    content={formatDate(data?.startDate)}
                                />
                                <SingleDetailsInfo
                                    label="End Date"
                                    content={formatDate(data?.endDate)}
                                />
                                <SingleDetailsInfo
                                    label="Duration"
                                    content={getBusinessDateCount(
                                        new Date(
                                            data?.startDate as unknown as Date,
                                        ),
                                        new Date(
                                            data?.endDate as unknown as Date,
                                        ),
                                    )}
                                />
                                <SingleDetailsInfo
                                    label="Supervisor"
                                    content={
                                        data?.employeeInformation?.supervisor
                                            ?.fullName
                                    }
                                />
                                <SingleDetailsInfo
                                    label="Total No of eligible leave"
                                    content={
                                        data?.employeeInformation
                                            ?.numberOfDaysEligible || 0
                                    }
                                />
                                <SingleDetailsInfo
                                    label="Number of eligible leave used"
                                    content={
                                        data?.employeeInformation
                                            ?.numberOfLeaveDaysTaken || 0
                                    }
                                />
                                <SingleDetailsInfo
                                    label="Current eligible leave balance"
                                    content={
                                        (data?.employeeInformation
                                            ?.numberOfDaysEligible as number) -
                                            (data?.employeeInformation
                                                ?.numberOfLeaveDaysTaken as number) ||
                                        0
                                    }
                                />
                                 <SingleDetailsInfo
                                    label="Number of Leave Days Earned"
                                    content={
                                        data?.leaveDaysEarned ||
                                        0
                                    }
                                />
                            </VStack>

                            {/* <Grid
                                templateColumns={'repeat(2,1fr)'}
                                gap="1rem"
                                w="full"
                            >
                                <SingleDetailsInfo
                                    label="Leave Type"
                                    content={data?.leaveType?.name}
                                    icon={data?.leaveType?.leaveTypeIcon}
                                />
                                <SingleDetailsInfo
                                    label="Leave Duration"
                                    content={moment(data?.endDate).diff(
                                        moment(data?.startDate),
                                        'days',
                                    )}
                                />
                                <SingleDetailsInfo
                                    label="User"
                                    content={
                                        data?.employeeInformation?.user
                                            ?.fullName
                                    }
                                />
                                <SingleDetailsInfo
                                    label="Work Assignee"
                                    content={data?.workAssignee?.fullName}
                                />
                            </Grid> */}
                            {/* <SingleDetailsInfo
                                label="Leave Reason"
                                content={data?.reasonForLeave}
                            /> */}
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
