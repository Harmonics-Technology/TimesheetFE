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
    Square,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import { ShiftService } from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import dynamic from 'next/dynamic';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { useRouter } from 'next/router';
import moment from 'moment';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { endOfWeek, format, startOfWeek } from 'date-fns';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: any;
    employee: any;
    employeeId?: string | null | undefined;
    shiftId?: string | null | undefined;
    shiftSwapId?: string | null | undefined;
}

const schema = yup.object().shape({});

export const SwapRequestModal = ({
    isOpen,
    onClose,
    data,
    employee,
}: ExportProps) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ExportProps>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const router = useRouter();
    const toast = useToast();
    const selectedUser = watch('employeeId');
    const start = router?.query?.from || startOfWeek(new Date());
    const end = router?.query?.to || endOfWeek(new Date());

    const [employeeShift, setEmployeeShift] = useState<any>();
    const [loading, setLoading] = useState<any>();

    const getEmployeeShift = async (id: any) => {
        if (id === undefined) {
            return;
        }
        setLoading(true);
        console.log({ id });
        try {
            const data = await ShiftService.getUserShift(
                0,
                20,
                format(new Date(start as any), 'yyyy-MM-dd'),
                format(new Date(end as any), 'yyyy-MM-dd'),
                id,
            );
            setLoading(false);
            console.log({ data });
            if (data.status) {
                setEmployeeShift(data.data?.value);
                return;
            }
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useNonInitialEffect(() => {
        getEmployeeShift(selectedUser);
    }, [selectedUser]);

    const onSubmit = async (data: ExportProps) => {
        console.log({ data });
        try {
            const result = await ShiftService.swapShift(
                data.shiftId as string,
                data.shiftSwapId as string,
            );
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
                            Request For Shift Swap
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
                                    <SelectrixBox<ExportProps>
                                        control={control}
                                        name="shiftSwapId"
                                        label="My Shift"
                                        error={errors.shiftSwapId}
                                        keys="userId"
                                        keyLabel="fullName"
                                        options={employee}
                                        placeholder={
                                            'Select the day and shift you want swap'
                                        }
                                    />
                                </HStack>

                                <Grid
                                    templateColumns={[
                                        'repeat(1,1fr)',
                                        'repeat(2,1fr)',
                                    ]}
                                    gap="1rem 2rem"
                                    minW="0"
                                >
                                    <SelectrixBox<ExportProps>
                                        control={control}
                                        name="employeeId"
                                        label="Employee"
                                        error={errors.employeeId}
                                        keys="userId"
                                        keyLabel="fullName"
                                        options={employee.data?.value}
                                        placeholder={
                                            'Select the day and shift you want swap'
                                        }
                                    />

                                    <SelectrixBox<ExportProps>
                                        control={control}
                                        name="shiftId"
                                        error={errors.shiftId}
                                        keys="id"
                                        keyLabel="fullName"
                                        label="Employee Shift"
                                        options={
                                            employeeShift !== undefined
                                                ? employeeShift
                                                : []
                                        }
                                    />
                                </Grid>

                                <Text
                                    my="1rem !important"
                                    color="brand.400"
                                    fontWeight="700"
                                    fontSize="14px"
                                >
                                    Swap Shift
                                </Text>

                                <Box>
                                    <Text>New Shift</Text>
                                    <Box
                                        w="full"
                                        border="1px solid #c4c4c4"
                                        borderRadius="3px"
                                        h="34px"
                                    >
                                        <Flex align="center" gap=".5rem">
                                            <Icon
                                                as={IoCheckmarkCircle}
                                                color="brand.400"
                                            />
                                            <Text
                                                mb="0"
                                                fontSize=".8rem"
                                                fontWeight="500"
                                                color="#263238"
                                            ></Text>
                                        </Flex>
                                    </Box>
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
