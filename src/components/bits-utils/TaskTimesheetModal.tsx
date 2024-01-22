import {
    Box,
    Flex,
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
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';

import { ProgressSlider } from './ProgressSlider';

import TaskTitleHolder from './TaskTitleHolder';
import moment from 'moment';
import { EditTimesheetTaskModal } from './EditTimesheetTaskModal';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data?: any;
}
export const TaskTimesheetModal = ({ isOpen, onClose, data }: ExportProps) => {
    const [edit, setEdit] = useState<boolean>();

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            trapFocus={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '30%']}
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
                            textAlign="center"
                            fontWeight="semibold"
                            noOfLines={1}
                        >
                            {edit
                                ? `Edit ${data?.title}`
                                : `View ${data?.title}`}
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        {edit ? (
                            <EditTimesheetTaskModal
                                onClose={onClose}
                                data={data}
                            />
                        ) : (
                            <form>
                                <VStack
                                    align="flex-start"
                                    w="full"
                                    spacing="0"
                                    gap="1rem"
                                    mb="2rem"
                                >
                                    <HStack
                                        justify="space-between"
                                        w="full"
                                        align="flex-start"
                                    >
                                        <TaskTitleHolder
                                            title="Project Task"
                                            sub={data.title}
                                        />

                                        <Flex
                                            justify="center"
                                            align="center"
                                            bgColor={
                                                data.approved == 'PENDING'
                                                    ? 'brand.700'
                                                    : data.approved ==
                                                      'APPROVED'
                                                    ? 'brand.400'
                                                    : 'red'
                                            }
                                            color="white"
                                            borderRadius="10px"
                                            fontSize=".8rem"
                                            p=".2rem 1rem"
                                        >
                                            {data?.approved}
                                        </Flex>
                                    </HStack>
                                    <TaskTitleHolder
                                        title="Start Date & Time"
                                        sub={moment(data.start).format(
                                            'dddd DD MMMM, YYYY hh:mm A',
                                        )}
                                    />
                                    <TaskTitleHolder
                                        title="End Date & Time"
                                        sub={moment(data.end).format(
                                            'dddd DD MMMM, YYYY hh:mm A',
                                        )}
                                    />
                                    {data.reason && (
                                        <TaskTitleHolder
                                            title="Rejection reason"
                                            sub={data.reason}
                                        />
                                    )}
                                </VStack>
                                <Box>
                                    <TaskTitleHolder title="Percentage Of Completion" />

                                    <ProgressSlider
                                        sliderValue={data?.progress}
                                        setSliderValue={() => void 0}
                                        label=""
                                    />
                                </Box>
                                {data?.approved !== 'APPROVED' && (
                                    <Box>
                                        <TaskTitleHolder title="Click here to edit this timesheet" />
                                        <ShiftBtn
                                            text="Edit"
                                            color="brand.400"
                                            border="1px solid"
                                            bg="transparent"
                                            onClick={() => setEdit(true)}
                                        />
                                    </Box>
                                )}
                            </form>
                        )}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
