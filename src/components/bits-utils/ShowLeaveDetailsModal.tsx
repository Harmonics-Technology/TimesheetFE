import {
    Box,
    Flex,
    Grid,
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
                borderRadius="0px"
                w={['88%', '50%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="semibold"
                        >
                            Leave Details
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        <VStack>
                            <Box
                                ml="auto"
                                p=".5rem 1.5rem"
                                borderRadius="25px"
                                color="white"
                                bgColor={
                                    status == 'ACTIVE' || status == 'APPROVED'
                                        ? 'brand.400'
                                        : status == 'PENDING'
                                        ? 'brand.700'
                                        : 'red'
                                }
                            >
                                {status}
                            </Box>
                            <Grid
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
                                <SingleDetailsInfo
                                    label="Leave Start Date"
                                    content={formatDate(data?.startDate)}
                                />
                                <SingleDetailsInfo
                                    label="Leave End Date"
                                    content={formatDate(data?.endDate)}
                                />
                            </Grid>
                            <SingleDetailsInfo
                                label="Leave Reason"
                                content={data?.reasonForLeave}
                            />
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
