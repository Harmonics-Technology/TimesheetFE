import {
    Box,
    Circle,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Square,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import { LeaveService, TeamMemberModel } from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { FaLess, FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';
import { AiOutlineBgColors, AiOutlineFieldTime } from 'react-icons/ai';
import { HexColorPicker, HexColorInput } from 'powerful-color-picker';
import dynamic from 'next/dynamic';
import { PrimaryTextarea } from './PrimaryTextArea';
import { useRouter } from 'next/router';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: any;
}

const schema = yup.object().shape({});

export const AddShiftModal = ({ isOpen, onClose, data }: ExportProps) => {
    const router = useRouter();
    const toast = useToast();
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);

    const [fromDate, setFromDate] = useState<any>(
        data?.start || new DateObject(),
    );
    const [toDate, setToDate] = useState<any>(
        data?.end || new DateObject().add(5, 'hours'),
    );
    const [color, setColor] = useState(data?.bgColor || '#' + randomColor);
    const [showColor, setShowColor] = useState(false);
    const [repeat, setRepeat] = useState(false);
    const [repeatEndDate, setRepeatEndDate] = useState<any>(
        new DateObject().add(10, 'days'),
    );
    const [selectedId, setSelectedId] = useState<any>([]);
    console.log({ data, randomColor });

    const toggleSelected = (value: any) => {
        const existingValue = selectedId?.find((e) => e.id === value.id);
        if (existingValue) {
            const newArray = selectedId?.filter((x) => x.id !== value.id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, value]);
    };

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {},
    });

    const repeating = [
        { id: 0, name: 'SU' },
        { id: 1, name: 'MO' },
        { id: 2, name: 'TU' },
        { id: 3, name: 'WE' },
        { id: 4, name: 'TH' },
        { id: 5, name: 'FR' },
        { id: 6, name: 'SA' },
    ];

    console.log({
        fromDate: fromDate?.format('YYYY-MM-DD HH:MM:ss'),
    });

    const rrule = `FREQ=WEEKLY;DTSTART=${fromDate.format(
        'YYYYMMDDTHHMMssZ',
    )};UNTIL=${repeatEndDate.format('YYYYMMDDTHHMMssZ')};BYDAY=${selectedId.map(
        (x) => x.name,
    )}`;

    const title =
        fromDate.format('A') == 'AM' ? 'Morning shift' : 'Night Shift';

    const onSubmit = async (data: any) => {
        try {
            const result = await LeaveService.createLeave(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
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
                            textAlign="center"
                            fontWeight="semibold"
                        >
                            Add Shift
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        <form>
                            <VStack
                                align="flex-start"
                                w="full"
                                spacing="0"
                                gap="1rem"
                                mb="1rem"
                            >
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        Assign shift To:
                                    </Text>
                                    <SelectrixBox<TeamMemberModel>
                                        control={control}
                                        name="clientId"
                                        error={errors.clientId}
                                        keys="id"
                                        keyLabel="fullName"
                                        options={[]}
                                        placeholder={
                                            data?.slotName || 'Select a user'
                                        }
                                    />
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        From:
                                    </Text>
                                    <Flex w="full" gap="1rem">
                                        <DatePicker
                                            // containerClassName="custom-container"
                                            containerStyle={{
                                                width: '60%',
                                            }}
                                            value={fromDate}
                                            onChange={setFromDate}
                                            format="dddd, MMM DD, YYYY"
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="100%"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                FaRegCalendarAlt
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                        <DatePicker
                                            containerStyle={{
                                                width: '40%',
                                            }}
                                            disableDayPicker
                                            format="hh:mm A"
                                            value={fromDate}
                                            onChange={setFromDate}
                                            plugins={[
                                                <TimePicker hideSeconds />,
                                            ]}
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="100%"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        alignItems="center"
                                                        justify="space-between"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                AiOutlineFieldTime
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                    </Flex>
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        To:
                                    </Text>
                                    <Flex w="full" gap="1rem">
                                        <DatePicker
                                            // containerClassName="custom-container"
                                            containerStyle={{
                                                width: '60%',
                                            }}
                                            value={toDate}
                                            onChange={setToDate}
                                            format="dddd, MMM DD, YYYY"
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="100%"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                FaRegCalendarAlt
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                        <DatePicker
                                            containerStyle={{
                                                width: '40%',
                                            }}
                                            disableDayPicker
                                            format="hh:mm A"
                                            value={toDate}
                                            onChange={setToDate}
                                            plugins={[
                                                <TimePicker hideSeconds />,
                                            ]}
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="100%"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        alignItems="center"
                                                        justify="space-between"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                AiOutlineFieldTime
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                    </Flex>
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        Select Color:
                                    </Text>
                                    <HStack
                                        w="100%"
                                        px="1rem"
                                        h="2.5rem"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        color="gray.500"
                                        boxShadow="sm"
                                        borderRadius="0"
                                        cursor="pointer"
                                        fontSize=".9rem"
                                        onClick={() => setShowColor(!showColor)}
                                    >
                                        <HStack>
                                            <Square
                                                size="2rem"
                                                bgColor={color}
                                            />
                                            <Text mb="0" whiteSpace="nowrap">
                                                {color}
                                            </Text>
                                        </HStack>
                                        <Icon as={AiOutlineBgColors} />
                                    </HStack>
                                    <Box
                                        pos="absolute"
                                        right="50%"
                                        zIndex="900"
                                        display={showColor ? 'block' : 'none'}
                                        bgColor="white"
                                        p="1rem"
                                        borderRadius="5px"
                                    >
                                        <HexColorPicker
                                            color={color}
                                            onChange={setColor}
                                        />
                                        <HexColorInput
                                            color={color}
                                            onChange={setColor}
                                            className="colorPicker"
                                        />
                                    </Box>
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        Repeats
                                    </Text>
                                    <HStack w="full">
                                        <Box w="100%">
                                            <Selectrix
                                                options={[
                                                    {
                                                        key: false,
                                                        label: 'Does not repeat',
                                                    },
                                                    {
                                                        key: true,
                                                        label: 'Repeats',
                                                    },
                                                ]}
                                                onChange={(value) =>
                                                    setRepeat(value.key)
                                                }
                                                style={{
                                                    width: '70%',
                                                }}
                                            />
                                        </Box>
                                        <HStack
                                            gap="0rem"
                                            pointerEvents={
                                                !repeat ? 'none' : 'unset'
                                            }
                                        >
                                            {repeating.map((x) => (
                                                <Circle
                                                    bgColor={
                                                        selectedId?.find(
                                                            (e) => e.id == x.id,
                                                        )
                                                            ? 'brand.400'
                                                            : 'gray.200'
                                                    }
                                                    color={
                                                        selectedId?.find(
                                                            (e) => e.id == x.id,
                                                        )
                                                            ? 'white'
                                                            : 'gray.600'
                                                    }
                                                    border={
                                                        selectedId?.find(
                                                            (e) => e.id == x.id,
                                                        )
                                                            ? '2px solid #ffac00'
                                                            : 'none'
                                                    }
                                                    fontSize=".7rem"
                                                    size="1.5rem"
                                                    cursor={
                                                        !repeat
                                                            ? 'not-allowed'
                                                            : 'pointer'
                                                    }
                                                    _hover={{
                                                        border: '2px solid #ffac00',
                                                    }}
                                                    onClick={() =>
                                                        toggleSelected(x)
                                                    }
                                                >
                                                    {x.name.charAt(0)}
                                                </Circle>
                                            ))}
                                        </HStack>
                                    </HStack>
                                </HStack>
                                {repeat && (
                                    <HStack gap="2rem" w="full">
                                        <Text fontSize=".9rem" w="20%">
                                            Repeat Ends
                                        </Text>
                                        <DatePicker
                                            containerStyle={{
                                                width: '100%',
                                            }}
                                            value={repeatEndDate}
                                            onChange={setRepeatEndDate}
                                            format="dddd, MMM DD, YYYY"
                                            render={(value, openCalendar) => {
                                                return (
                                                    <HStack
                                                        w="100%"
                                                        px="1rem"
                                                        h="2.5rem"
                                                        justifyContent="space-between"
                                                        alignItems="center"
                                                        border="1px solid"
                                                        borderColor="gray.300"
                                                        color="gray.500"
                                                        boxShadow="sm"
                                                        borderRadius="0"
                                                        cursor="pointer"
                                                        fontSize=".9rem"
                                                        onClick={(value) =>
                                                            openCalendar(value)
                                                        }
                                                    >
                                                        <Text
                                                            mb="0"
                                                            whiteSpace="nowrap"
                                                        >
                                                            {value}
                                                        </Text>
                                                        <Icon
                                                            as={
                                                                FaRegCalendarAlt
                                                            }
                                                        />
                                                    </HStack>
                                                );
                                            }}
                                        />
                                    </HStack>
                                )}
                                <Box
                                    borderY="1px solid #e5e5e5"
                                    py="1rem"
                                    w="full"
                                >
                                    <HStack gap="2rem" w="full">
                                        <Text fontSize=".9rem" w="20%">
                                            Note:
                                        </Text>
                                        <PrimaryTextarea<TeamMemberModel>
                                            name="address"
                                            error={errors.address}
                                            placeholder=""
                                            defaultValue=""
                                            register={register}
                                        />
                                    </HStack>
                                </Box>
                            </VStack>
                            <HStack ga-="1rem" justify="flex-end">
                                <ShiftBtn
                                    text="Cancel"
                                    bg="#FF5B79"
                                    onClick={onClose}
                                />
                                <ShiftBtn
                                    text="Add Shift"
                                    bg="brand.400"
                                    onClick={handleSubmit(onSubmit)}
                                />
                            </HStack>
                        </form>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
