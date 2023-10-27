import {
    Box,
    Checkbox,
    Circle,
    Flex,
    FormLabel,
    HStack,
    Icon,
    ListItem,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Textarea,
    UnorderedList,
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
import { CustomDateTime } from './CustomDateTime';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data?: any;
    id?: any;
}
export const ApproveAllTimesheet = ({
    isOpen,
    onClose,
    data,
    id,
}: ExportProps) => {
    const [cancel, setCancel] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>();
    const toast = useToast();

    console.log({ data });
    const approveTimesheet = async (approve) => {
        const formData = {
            employeeInformationId: id,
            approve: approve,
            reason: !approve ? comment : undefined,
            dates: data,
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
                router.replace(router.asPath);
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
                title: err?.message || err?.body?.message,
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
                        {/* <form>
                            <VStack
                                align="flex-start"
                                w="full"
                                spacing="0"
                                gap="1rem"
                                mb="2rem"
                            >
                                <CustomDateTime
                                    onChange={setstartDate}
                                    value={startDate}
                                    label="From"
                                    useEnd={true}
                                />
                                <CustomDateTime
                                    onChange={setendDate}
                                    value={endDate}
                                    label="To"
                                    useEnd={true}
                                />
                            </VStack>

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
                        </form> */}
                        <Text>
                            Are you sure you want to approve timesheets
                            contained in the selected days
                        </Text>
                        <UnorderedList
                            my="1rem"
                            gap="1rem"
                            display="flex"
                            flexDir="column"
                            flexWrap="wrap"
                        >
                            {data.map((x) => (
                                <ListItem key={x} fontWeight={500}>
                                    {moment(x).format('Do MMMM, YYYY')}
                                </ListItem>
                            ))}
                        </UnorderedList>
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
                                        onClick={() => approveTimesheet(false)}
                                        loading={loading}
                                    />
                                </HStack>
                            </>
                        ) : (
                            <HStack gap="1rem" justify="space-between">
                                <ShiftBtn
                                    text="Decline"
                                    bg="#FF5B79"
                                    onClick={() => setCancel((prev) => !prev)}
                                />
                                <ShiftBtn
                                    text="Approve"
                                    bg="brand.400"
                                    onClick={() => approveTimesheet(true)}
                                    loading={loading}
                                />
                            </HStack>
                        )}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
