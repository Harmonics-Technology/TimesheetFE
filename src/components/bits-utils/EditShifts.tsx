import {
    VStack,
    HStack,
    FormLabel,
    Square,
    Text,
    Icon,
    Box,
    useToast,
} from '@chakra-ui/react';
import { HexColorPicker, HexColorInput } from 'powerful-color-picker';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineBgColors } from 'react-icons/ai';
import { ShiftTypeModel, ShiftService } from 'src/services';
import * as yup from 'yup';
import { CustomDatePicker } from './CustomDatePicker';
import { PrimaryInput } from './PrimaryInput';
import { ShiftBtn } from './ShiftBtn';
import useComponentVisible from '@components/generics/useComponentVisible';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { DateObject } from 'react-multi-date-picker';

const schema = yup.object().shape({});

export const EditShifts = ({ setShowEdit, showEdit }) => {
    const router = useRouter();
    const toast = useToast();

    const formValues = showEdit.data;
    const [fromDate, setFromDate] = useState<any>(formValues?.start);
    const [toDate, setToDate] = useState<any>(formValues?.end);
    const [color, setColor] = useState<any>(formValues?.color);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ShiftTypeModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            name: formValues?.name,
            color: formValues?.color,
            duration: formValues?.duration,
            end: formValues?.end,
            start: formValues?.start,
            id: formValues?.id,
            superAdminId: formValues?.superAdminId,
        },
    });

    const { ref, isComponentVisible, setIsComponentVisible } =
        useComponentVisible(false);

    const {
        ref: startRef,
        isComponentVisible: startVisible,
        setIsComponentVisible: startIsVisible,
    } = useComponentVisible(false);
    const {
        ref: endRef,
        isComponentVisible: endVisible,
        setIsComponentVisible: endIsVisible,
    } = useComponentVisible(false);

    console.log({ fromDate, toDate });

    useEffect(() => {
        setValue(
            'duration',
            Number(toDate?.split(':')[0]) - Number(fromDate?.split(':')[0]) ||
                0,
        );
    }, [toDate, fromDate]);

    useEffect(() => {
        setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }, []);

    const onSubmit = async (data: ShiftTypeModel) => {
        data.start = fromDate;
        data.end = toDate;
        data.color = color;

        // data.duration = hourDiff;
        try {
            const result = await ShiftService.updateShiftType(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                setShowEdit({ id: '', value: false });
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
        <form>
            <VStack
                align="flex-start"
                w="full"
                spacing="0"
                gap="1rem"
                mb="1rem"
            >
                <PrimaryInput<ShiftTypeModel>
                    name="name"
                    error={errors.name}
                    placeholder="Enter shift name"
                    defaultValue=""
                    register={register}
                    label="Shift Name"
                />
                <HStack gap="1rem" w="full">
                    <VStack w="full" align="flex-start" spacing="0">
                        <FormLabel fontSize=".875rem">Start Time</FormLabel>
                        <CustomDatePicker
                            date={fromDate}
                            setDate={setFromDate}
                            dateRef={startRef}
                            isVisible={startVisible}
                            setIsVisible={startIsVisible}
                        />
                    </VStack>
                    <VStack w="full" align="flex-start" spacing="0">
                        <FormLabel fontSize=".875rem">End Time</FormLabel>
                        <CustomDatePicker
                            date={toDate}
                            setDate={setToDate}
                            dateRef={endRef}
                            isVisible={endVisible}
                            setIsVisible={endIsVisible}
                        />
                    </VStack>
                </HStack>
                <HStack gap="1rem" w="full">
                    <PrimaryInput<ShiftTypeModel>
                        name="duration"
                        error={errors.duration}
                        placeholder="Duration in hours"
                        defaultValue=""
                        label="Duration"
                        // readonly
                        register={register}
                    />

                    <VStack w="full" align="flex-start" spacing="0">
                        <FormLabel fontSize=".875rem">Color</FormLabel>
                        <HStack
                            pos="relative"
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
                            onClick={() => setIsComponentVisible(true)}
                        >
                            <HStack>
                                <Square size="1rem" bgColor={color} />
                                <Text mb="0" whiteSpace="nowrap">
                                    {color || 'Select color'}
                                </Text>
                            </HStack>
                            <Icon as={AiOutlineBgColors} />
                            {isComponentVisible && (
                                <Box
                                    pos="absolute"
                                    right="0%"
                                    zIndex="900"
                                    bgColor="white"
                                    p="1rem"
                                    borderRadius="5px"
                                    ref={ref}
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
                            )}
                        </HStack>
                    </VStack>
                </HStack>
            </VStack>
            <HStack gap="1rem" justify="space-between" mt="2rem">
                <ShiftBtn
                    text="Save"
                    bg="brand.400"
                    onClick={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                />
            </HStack>
        </form>
    );
};
