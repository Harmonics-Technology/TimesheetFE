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
import React, { useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import {
    ShiftService,
    ShiftModel,
    ShiftUsersListViewPagedCollectionStandardResponse,
    ShiftTypeViewStandardResponse,
} from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { FaRegCalendarAlt } from 'react-icons/fa';
import dynamic from 'next/dynamic';
import { PrimaryTextarea } from './PrimaryTextArea';
import { useRouter } from 'next/router';
import moment from 'moment';
import { PrimaryDate } from './PrimaryDate';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface ExportProps {
    isOpen: any;
    onClose: any;
    datas: any;
    user: ShiftUsersListViewPagedCollectionStandardResponse;
    shiftTypes: ShiftTypeViewStandardResponse;
}

const schema = yup.object().shape({});

export const AddShiftModal = ({
    isOpen,
    onClose,
    datas,
    user,
    shiftTypes,
}: ExportProps) => {
    const router = useRouter();
    const toast = useToast();

    // const [fromDate, setFromDate] = useState<any>(new DateObject());
    const [userId, setUserId] = useState();
    const [repeat, setRepeat] = useState(false);
    // const [repeatEndDate, setRepeatEndDate] = useState<any>(
    //     new DateObject().add(10, 'days'),
    // );
    const [selectedId, setSelectedId] = useState<any>([]);
    const [data, setData] = useState<any>();

    useEffect(() => {
        setData(datas);
    }, [datas]);

    useEffect(() => {
        // setFromDate(new DateObject(data?.start));
        setUserId(data?.resourceId);
    }, [data]);

    //

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
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ShiftModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            start: new DateObject(data?.start) as unknown as string,
        },
    });

    const closeModal = () => {
        setData({});
        setRepeat(false);
        setSelectedId([]);
        reset({
            userId: '',
            note: '',
    });
        onClose();
    };

    const repeating = [
        { id: 0, name: 'SU' },
        { id: 1, name: 'MO' },
        { id: 2, name: 'TU' },
        { id: 3, name: 'WE' },
        { id: 4, name: 'TH' },
        { id: 5, name: 'FR' },
        { id: 6, name: 'SA' },
    ];

    const fromDate = watch('start');
    const rrule = `FREQ=WEEKLY;DTSTART=${new DateObject(fromDate as string)
        .subtract(1, 'days')
        .format('YYYYMMDDTHHmmssZ')};UNTIL=${new DateObject(
        watch('repeatStopDate') as string,
    ).format('YYYYMMDDTHHmmssZ')};BYDAY=${selectedId.map((x) => x.name)}`;

    //

    const onSubmit = async (data: ShiftModel) => {
        // data.repeatStopDate = repeatEndDate?.format('YYYY-MM-DD HH:mm:ss');
        repeat && (data.repeatQuery = rrule);
        data.userId ? data.userId : (data.userId = userId);
        //
        try {
            const result = await ShiftService.addShift(data);
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
                                    <SelectrixBox<ShiftModel>
                                        control={control}
                                        name="userId"
                                        error={errors.userId}
                                        keys="userId"
                                        keyLabel="fullName"
                                        options={user?.data?.value}
                                        placeholder={
                                            data?.slotName || 'Select a user'
                                        }
                                    />
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        Date:
                                    </Text>
                                    <PrimaryDate<ShiftModel>
                                        control={control}
                                        name="start"
                                        label=""
                                        error={errors.start}
                                        // max={new Date()}
                                    />
                                </HStack>
                                <HStack gap="2rem" w="full">
                                    <Text fontSize=".9rem" w="20%">
                                        Shift Type:
                                    </Text>
                                    <SelectrixBox<ShiftModel>
                                        control={control}
                                        name="shiftTypeId"
                                        error={errors.shiftTypeId}
                                        keys="id"
                                        keyLabel="name"
                                        options={shiftTypes?.data}
                                        placeholder={
                                            data?.slotName ||
                                            'Select a shift type'
                                        }
                                    />
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
                                                searchable={false}
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
                                        <PrimaryDate<ShiftModel>
                                            control={control}
                                            name="repeatStopDate"
                                            label=""
                                            error={errors.repeatStopDate}
                                            // max={new Date()}
                                        />
                                        {/* <DatePicker
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
                                        /> */}
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
                                        <PrimaryTextarea<ShiftModel>
                                            name="note"
                                            error={errors.note}
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
                                    onClick={closeModal}
                                />
                                <ShiftBtn
                                    text="Add Shift"
                                    bg="brand.400"
                                    onClick={handleSubmit(onSubmit)}
                                    loading={isSubmitting}
                                />
                            </HStack>
                        </form>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
