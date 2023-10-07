import {
    Box,
    Checkbox,
    Circle,
    Flex,
    FormLabel,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { ProjectManagementService } from 'src/services';

import router, { useRouter } from 'next/router';
import { ProgressSlider } from './ProgressSlider';

import TaskTitleHolder from './TaskTitleHolder';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data?: any;
}
export const ApproveTimesheet = ({ isOpen, onClose, data }: ExportProps) => {
    console.log({data})
    const [cancel, setCancel] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>();
    const [startDate, setstartDate] = useState<string>( moment( data.start).format('YYYY-MM-DD'));
    const [endDate, setendDate] = useState<string>(moment( data.end).format('YYYY-MM-DD'));
    const toast = useToast();

    const approveTimesheet = async (approve) => {
        const formData = {
            projectTaskAsigneeId: data.assigneeId,
            timesheetId: data.id,
            approve: approve,
            reason: !approve ? comment : undefined,
            startDate,
            endDate,
        };
        setLoading(true);
        try {
            const result = await ProjectManagementService.treatTimesheet(
                formData,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                setLoading(true);
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(true);
            return;
        } catch (err: any) {
            setLoading(true);
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

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
                        >
                            Approve Timesheet
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        {/* <Loading loading={loading} /> */}
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
                                                : data.approved == 'APPROVED'
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
                                    readonly
                                />
                            </Box>

                            {cancel ? (
                                <>
                                    <VStack gap="1rem" align="flex-start">
                                        <FormLabel
                                            color={'#1b1d21'}
                                            fontSize=".8rem"
                                        >
                                            Comment
                                        </FormLabel>
                                        <Textarea
                                            padding={'1rem'}
                                            minH={'6rem'}
                                            resize="none"
                                            focusBorderColor="none"
                                            fontSize=".8rem"
                                            _focusVisible={{
                                                borderColor: 'gray.300',
                                                boxShadow: 'none',
                                            }}
                                            borderRadius="5px"
                                            onChange={(e) =>
                                                setComment(e.target.value)
                                            }
                                        />
                                    </VStack>
                                    <HStack
                                        gap="1rem"
                                        justify="space-between"
                                        mt="2rem"
                                    >
                                        <ShiftBtn
                                            text="Cancel"
                                            bg="#FF5B79"
                                            onClick={() =>
                                                setCancel((prev) => !prev)
                                            }
                                        />
                                        <ShiftBtn
                                            text="Send"
                                            bg="brand.400"
                                            onClick={() =>
                                                approveTimesheet(false)
                                            }
                                            loading={loading}
                                        />
                                    </HStack>
                                </>
                            ) : (
                                <HStack gap="1rem" justify="space-between">
                                    <ShiftBtn
                                        text="Decline"
                                        bg="#FF5B79"
                                        onClick={() =>
                                            setCancel((prev) => !prev)
                                        }
                                    />
                                    <ShiftBtn
                                        text="Approve"
                                        bg="brand.400"
                                        onClick={() => approveTimesheet(true)}
                                        loading={loading}
                                    />
                                </HStack>
                            )}
                        </form>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
