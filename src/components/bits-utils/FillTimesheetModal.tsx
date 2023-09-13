import {
    Box,
    Checkbox,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import { ProjectManagementService, ProjectTimesheetModel } from 'src/services';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import Loading from './Loading';
import useComponentVisible from '@components/generics/useComponentVisible';
import { CustomDateTime } from './CustomDateTime';
import { ProgressSlider } from './ProgressSlider';
import { DateObject } from 'react-multi-date-picker';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data?: any;
    superAdminId?: any;
    userId?: any;
    projectId?: any;
}

const schema = yup.object().shape({});

export const FillTimesheetModal = ({
    isOpen,
    onClose,
    data,
    superAdminId,
    userId,
    projectId,
}: ExportProps) => {
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectTimesheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const router = useRouter();
    const toast = useToast();

    const [startDate, setstartDate] = useState<any>(new DateObject());
    const [endDate, setendDate] = useState<any>(new DateObject());
    const [isBillable, setisBillable] = useState<any>();
    const [loading, setLoading] = useState<any>();

    const [sliderValue, setSliderValue] = useState(0);

    const onSubmit = async (data: ProjectTimesheetModel) => {
        console.log({ data });
        data.projectId = projectId;
        data.projectTaskAsigneeId = subTasks.filter(
            (x) => x.id == data.projectSubTaskId,
        )[0]?.projectTaskAsigneeId;
        try {
            const result =
                await ProjectManagementService.fillTimesheetForProject(data);
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

    useEffect(() => {
        setValue('startDate', startDate);
    }, [startDate]);
    useEffect(() => {
        setValue('endDate', endDate);
    }, [endDate]);
    useEffect(() => {
        setValue('percentageOfCompletion', sliderValue);
    }, [sliderValue]);
    useEffect(() => {
        setValue('billable', isBillable);
    }, [isBillable]);

    console.log({ startDate: watch('startDate') });

    const newData = [
        ...(data || []),
        { id: 'operational', name: 'Operational Task' },
    ];
    const taskId = watch('projectTaskId');
    const [subTasks, setSubTasks] = useState<any>([]);
    const [err, setErr] = useState<any>([]);
    const [operationalTasks, setOperationalTasks] = useState<any>([]);
    useNonInitialEffect(() => {
        async function getTasks() {
            setErr('');
            setOperationalTasks([]);
            setSubTasks([]);
            setLoading(true);
            if (taskId == 'operational') {
                try {
                    const res =
                        await ProjectManagementService.listOperationalTasks(
                            0,
                            25,
                            superAdminId,
                            2,
                            userId,
                        );
                    if (res?.status) {
                        setOperationalTasks(res?.data?.value);
                        setLoading(false);
                        return;
                    }
                    setErr(res?.message);
                    setLoading(false);
                } catch (error: any) {
                    console.log({ error });
                    setErr(error?.body?.message || error?.message);
                    setLoading(false);
                }
                return;
            }
            try {
                const res = await ProjectManagementService.listSubTasks(
                    0,
                    25,
                    taskId as string,
                    2,
                );
                if (res?.status) {
                    setSubTasks(res?.data?.value);
                    setLoading(false);
                    return;
                }
                setErr(res?.message);
                setLoading(false);
            } catch (error: any) {
                console.log({ error });
                setErr(error?.body?.message || error?.message);
                setLoading(false);
            }
        }
        getTasks();
    }, [taskId]);

    console.log({ subTasks, operationalTasks });
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
                    <Box mb="1rem">
                        {loading ? (
                            <Spinner size={'sm'} />
                        ) : err ? (
                            <Text fontSize=".8rem" color="red.300">
                                {err}
                            </Text>
                        ) : null}
                    </Box>
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="center"
                            fontWeight="semibold"
                        >
                            Fill My Timesheet For The {'ERP'} Project
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
                                mb="1rem"
                                borderBottom="1px solid #e6e7e7"
                            >
                                <SelectrixBox<ProjectTimesheetModel>
                                    control={control}
                                    name="projectTaskId"
                                    label="Project Task"
                                    error={errors.projectTaskId}
                                    keys="id"
                                    keyLabel="name"
                                    options={newData}
                                    placeholder={'Select a task'}
                                />
                                {subTasks.length > 0 && (
                                    <SelectrixBox<ProjectTimesheetModel>
                                        control={control}
                                        name="projectSubTaskId"
                                        label="Sub Task"
                                        error={errors.projectSubTaskId}
                                        keys="id"
                                        keyLabel="name"
                                        options={subTasks}
                                        placeholder={'Select a subTask'}
                                    />
                                )}
                                {operationalTasks.length > 0 && (
                                    <SelectrixBox<ProjectTimesheetModel>
                                        control={control}
                                        name="projectTaskId"
                                        label="Operational Task"
                                        error={errors.projectTaskId}
                                        keys="id"
                                        keyLabel="name"
                                        options={operationalTasks}
                                        placeholder={'Select operational task'}
                                    />
                                )}
                                <CustomDateTime
                                    onChange={setstartDate}
                                    value={startDate}
                                    label="Start Date & Time"
                                />
                                <CustomDateTime
                                    onChange={setendDate}
                                    value={endDate}
                                    label="End Date & Time"
                                />
                                <ProgressSlider
                                    sliderValue={sliderValue}
                                    setSliderValue={setSliderValue}
                                    label="Percentage Of Completion"
                                />
                                <Checkbox
                                    fontSize=".8rem"
                                    color="#8c8c8c"
                                    colorScheme="brand"
                                    mb="2rem"
                                    onChange={() =>
                                        setisBillable((prev) => !prev)
                                    }
                                >
                                    Check this box if this task is a billable
                                    task
                                </Checkbox>
                            </VStack>
                            <HStack gap="1rem" justify="flex-end">
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
