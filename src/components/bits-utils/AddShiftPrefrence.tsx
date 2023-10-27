import {
    Box,
    Flex,
    FormLabel,
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
import React, { useContext, useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { ShiftService, ShiftTypeModel } from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { AiOutlineBgColors } from 'react-icons/ai';
import { HexColorPicker, HexColorInput } from 'powerful-color-picker';
import { useRouter } from 'next/router';
import { PrimaryInput } from './PrimaryInput';
import { CustomDatePicker } from './CustomDatePicker';
import useComponentVisible from '@components/generics/useComponentVisible';
import { UserContext } from '@components/context/UserContext';

interface ExportProps {
    isOpen: any;
    onClose: any;
}

const schema = yup.object().shape({});

export const AddShiftPreference = ({ isOpen, onClose }: ExportProps) => {
    const router = useRouter();
    const toast = useToast();

    const [fromDate, setFromDate] = useState<any>();
    const [toDate, setToDate] = useState<any>();
    const [color, setColor] = useState<any>();

    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ShiftTypeModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const closeModal = () => {
        onClose();
    };

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
        data.superAdminId = superAdminId;
        data.start = fromDate;
        data.end = toDate;
        data.color = color;
        try {
            const result = await ShiftService.createShiftType(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
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
                borderRadius="10px"
                w={['88%', '35%']}
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
                            Add New Shift
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
                                <PrimaryInput<ShiftTypeModel>
                                    name="name"
                                    error={errors.name}
                                    placeholder="Enter shift name"
                                    defaultValue=""
                                    register={register}
                                    label="Shift Name"
                                />
                                <HStack gap="1rem" w="full">
                                    <VStack
                                        w="full"
                                        align="flex-start"
                                        spacing="0"
                                    >
                                        <FormLabel fontSize=".875rem">
                                            Start Time
                                        </FormLabel>
                                        <CustomDatePicker
                                            date={fromDate}
                                            setDate={setFromDate}
                                            dateRef={startRef}
                                            isVisible={startVisible}
                                            setIsVisible={startIsVisible}
                                        />
                                    </VStack>
                                    <VStack
                                        w="full"
                                        align="flex-start"
                                        spacing="0"
                                    >
                                        <FormLabel fontSize=".875rem">
                                            End Time
                                        </FormLabel>
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
                                        label="Duration"
                                        readonly
                                        register={register}
                                    />

                                    <VStack
                                        w="full"
                                        align="flex-start"
                                        spacing="0"
                                    >
                                        <FormLabel fontSize=".875rem">
                                            Color
                                        </FormLabel>
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
                                            onClick={() =>
                                                setIsComponentVisible(true)
                                            }
                                        >
                                            <HStack>
                                                <Square
                                                    size="1rem"
                                                    bgColor={color}
                                                />
                                                <Text
                                                    mb="0"
                                                    whiteSpace="nowrap"
                                                >
                                                    {color || 'Select color'}
                                                </Text>
                                            </HStack>
                                            <Icon as={AiOutlineBgColors} />
                                        </HStack>
                                        {isComponentVisible && (
                                            <Box
                                                pos="absolute"
                                                right="7%"
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
                                    </VStack>
                                </HStack>
                            </VStack>
                            <HStack
                                gap="1rem"
                                justify="space-between"
                                mt="3rem"
                            >
                                <ShiftBtn
                                    text="Cancel"
                                    bg="#FF5B79"
                                    onClick={closeModal}
                                />
                                <ShiftBtn
                                    text="Confirm"
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
