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
    useRadioGroup,
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
import InputBlank from './InputBlank';
import moment from 'moment';
import RadioBtn from './RadioBtn';

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

    const [startDate, setstartDate] = useState<any>(moment(data?.startDate));
    const [endDate, setendDate] = useState<any>(moment(data.endDate));
    const [isBillable, setisBillable] = useState<any>();
    const [loading, setLoading] = useState<any>();
    const [projectsId, setProjecstId] = useState(projectId);

    const [sliderValue, setSliderValue] = useState(0);

    const onSubmit = async (data: ProjectTimesheetModel) => {
        data.projectId = projectsId;
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

    const newData = [
        ...(data?.tasks || []),
        { id: 'operational', name: 'Operational Task' },
    ];
    const taskId = watch('projectTaskId');
    const [useEnd, setUseEnd] = useState<boolean>(true);
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
                    setErr(error?.body?.message || error?.message);
                    setLoading(false);
                }
                return;
            }
            setProjecstId(data?.tasks.find((x) => x.id == taskId).projectId);
            try {
                const res = await ProjectManagementService.listSubTasks(
                    0,
                    25,
                    taskId as string,
                );
                if (res?.status) {
                    setSubTasks(res?.data?.value);
                    setLoading(false);
                    return;
                }
                setErr(res?.message);
                setLoading(false);
            } catch (error: any) {
                setErr(error?.body?.message || error?.message);
                setLoading(false);
            }
        }
        getTasks();
    }, [taskId]);

    const radios = ['Use Duration', 'Use End Date'];
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'selection',
        defaultValue: 'Use End Date',
        onChange: (value) => updateClientField(value),
    });

    const updateClientField = (value: any) => {
        if (value == 'Use Duration') {
            setUseEnd(false);
        } else {
            setUseEnd(true);
        }
    };

    const group = getRootProps();

    const changeDuration = (e: any) => {
        const endDate = moment(watch('startDate'))
            .add(e, 'hours')
            .format('YYYY/MM/DD HH:mm');
        setValue('endDate', endDate as any);
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
                                <HStack w="full" {...group} fontSize=".8rem">
                                    {radios.map((value) => {
                                        const radio = getRadioProps({
                                            value,
                                        });
                                        return (
                                            <RadioBtn {...radio} key={value}>
                                                {value}
                                            </RadioBtn>
                                        );
                                    })}
                                </HStack>

                                {useEnd ? (
                                    <CustomDateTime
                                        onChange={setendDate}
                                        value={endDate}
                                        label="End Date & Time"
                                    />
                                ) : (
                                    <Box w="full">
                                        <InputBlank
                                            placeholder="Duration in hours"
                                            label="Duration"
                                            onChange={(e) =>
                                                changeDuration(e.target.value)
                                            }
                                        />
                                        <Text fontSize=".65rem" mt=".3rem">
                                            Your End date and Time is:{' '}
                                            {moment(watch('endDate')).format(
                                                'dddd, MMM DD, YYYY hh:mm A',
                                            )}
                                        </Text>
                                    </Box>
                                )}
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
