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
import { PrimarySelect } from './PrimarySelect';
import Loading from './Loading';
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
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ExportProps>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    // employee = employee.data?.value;

    //

    const router = useRouter();
    const toast = useToast();
    const selectedUser = watch('employeeId');
    const start = router?.query?.from || startOfWeek(new Date());
    const end = router?.query?.to || endOfWeek(new Date());

    const [employeeShift, setEmployeeShift] = useState<any>();
    const [loading, setLoading] = useState<any>();
    const [selected, setSelected] = useState<any>();

    const getEmployeeShift = async (id: any) => {
        if (id === undefined) {
            return;
        }
        setLoading(true);

        try {
            const data = await ShiftService.getUserShift(
                0,
                20,
                format(new Date(start as any), 'yyyy-MM-dd'),
                format(new Date(end as any), 'yyyy-MM-dd'),
                id,
            );
            setLoading(false);

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
                w={['88%', '40%']}
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
                        <Loading loading={loading} />
                        <form>
                            <VStack
                                align="flex-start"
                                w="full"
                                spacing="0"
                                gap="1rem"
                                mb="1rem"
                            >
                                <SelectrixBox<ExportProps>
                                    control={control}
                                    name="shiftSwapId"
                                    label="My Shift"
                                    error={errors.shiftSwapId}
                                    keys="id"
                                    keyLabel="start"
                                    options={data?.data}
                                    placeholder={
                                        'Select the day and shift you want swap'
                                    }
                                    renderOption={(option, index) => {
                                        return (
                                            <>
                                                {option ? (
                                                    <Flex
                                                        key={index}
                                                        gap=".4rem"
                                                    >
                                                        {`${moment(
                                                            option.label,
                                                        ).format(
                                                            'ddd DD/MM/YYYY',
                                                        )} - ${
                                                            moment(
                                                                option.label,
                                                            ).format('A') ==
                                                            'AM'
                                                                ? 'Morning Shift'
                                                                : 'Night Shift'
                                                        }`}
                                                    </Flex>
                                                ) : (
                                                    'Select the day and shift you want to swap'
                                                )}
                                            </>
                                        );
                                    }}
                                    renderSelection={(
                                        selected,
                                        settings,
                                        deselect,
                                    ) => {
                                        //
                                        return (
                                            <Box className="react-selectrix rs-toggle">
                                                <Flex gap=".4rem">
                                                    {(
                                                        <Flex gap=".4rem">
                                                            {`${moment(
                                                                selected?.label,
                                                            ).format(
                                                                'ddd DD/MM/YYYY',
                                                            )} - ${
                                                                moment(
                                                                    selected?.label,
                                                                ).format('A') ==
                                                                'AM'
                                                                    ? 'Morning Shift'
                                                                    : 'Night Shift'
                                                            }`}
                                                        </Flex>
                                                    ) || 'Select a type'}
                                                </Flex>
                                            </Box>
                                        );
                                    }}
                                />

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
                                        placeholder={'Select employee'}
                                    />
                                    <SelectrixBox<ExportProps>
                                        control={control}
                                        name="shiftId"
                                        label="Employee Shift"
                                        error={errors.shiftId}
                                        keys="id"
                                        keyLabel="start"
                                        options={
                                            employeeShift !== undefined
                                                ? employeeShift
                                                : []
                                        }
                                        customOnchange={(value) => {
                                            setValue('shiftId', value.key);
                                            setSelected(value);
                                        }}
                                        placeholder={'Select the shift'}
                                        renderOption={(option, index) => {
                                            //
                                            return (
                                                <Flex key={index} gap=".4rem">
                                                    {`${moment(
                                                        option.label,
                                                    ).format(
                                                        'ddd DD/MM/YYYY',
                                                    )} - ${
                                                        moment(
                                                            option.label,
                                                        ).format('A') == 'AM'
                                                            ? 'Morning Shift'
                                                            : 'Night Shift'
                                                    }`}
                                                </Flex>
                                            );
                                        }}
                                        renderSelection={(
                                            selected,
                                            settings,
                                            deselect,
                                        ) => {
                                            // const data = setSelected(selected);
                                            return (
                                                <Box className="react-selectrix rs-toggle">
                                                    <Flex gap=".4rem">
                                                        {(
                                                            <Flex
                                                                gap=".4rem"
                                                                noOfLines={1}
                                                            >
                                                                {`${moment(
                                                                    selected?.label,
                                                                ).format(
                                                                    'ddd DD/MM/YYYY',
                                                                )} - ${
                                                                    moment(
                                                                        selected?.label,
                                                                    ).format(
                                                                        'A',
                                                                    ) == 'AM'
                                                                        ? 'Morning Shift'
                                                                        : 'Night Shift'
                                                                }`}
                                                            </Flex>
                                                        ) ||
                                                            settings.placeholder}
                                                    </Flex>
                                                </Box>
                                            );
                                        }}
                                    />
                                </Grid>

                                <Text
                                    my=".5rem !important"
                                    color="brand.400"
                                    fontWeight="700"
                                    fontSize="14px"
                                >
                                    Swap Shift
                                </Text>

                                <Box w="full">
                                    <Text mb=".5rem">New Shift</Text>
                                    <Flex
                                        w="full"
                                        border="1px solid #c4c4c4"
                                        borderRadius="3px"
                                        h="36px"
                                        align="center"
                                        px="1rem"
                                    >
                                        {selected && (
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
                                                >
                                                    {`${moment(
                                                        selected?.label,
                                                    ).format(
                                                        'ddd DD/MM/YYYY',
                                                    )} - ${
                                                        moment(
                                                            selected?.label,
                                                        ).format('A') == 'AM'
                                                            ? 'Morning Shift'
                                                            : 'Night Shift'
                                                    }`}
                                                </Text>
                                            </Flex>
                                        )}
                                    </Flex>
                                </Box>
                            </VStack>
                            <HStack ga-="1rem" justify="flex-end">
                                <ShiftBtn
                                    text="Cancel"
                                    bg="#FF5B79"
                                    onClick={onClose}
                                />
                                <ShiftBtn
                                    text="Submit"
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
