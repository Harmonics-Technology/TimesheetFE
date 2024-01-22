import {
    Box,
    Checkbox,
    Circle,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    FormLabel,
    Text,
    VStack,
    useRadioGroup,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useEffect, useState } from 'react';
import { GrClose } from 'react-icons/gr';
import { ShiftBtn } from './ShiftBtn';
import { SelectrixBox } from './Selectrix';
import {
    ProjectManagementService,
    UpdateProjectTimesheet,
    ProjectTimesheetRange,
    ProjectView,
} from 'src/services';
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
import { UserContext } from '@components/context/UserContext';
import { eachDayOfInterval, parseISO, startOfWeek } from 'date-fns';
import dynamic from 'next/dynamic';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface ExportProps {
    onClose: any;
    data?: any;
}

const schema = yup.object().shape({});

export const EditTimesheetTaskModal = ({ onClose, data }: ExportProps) => {
    const { user } = useContext(UserContext);
    const {
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<UpdateProjectTimesheet>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: data?.id,
            billable: data?.bill,
            employeeInformationId: user?.employeeInformationId,
            projectTaskAsigneeId: data?.projectTaskAsigneeId,
            endDate: data?.end,
            percentageOfCompletion: data?.progress,
            startDate: data?.start,
        },
    });
    const router = useRouter();
    const toast = useToast();

    function isValidDateTime(dateTime) {
        return dateTime && !isNaN(new Date(dateTime).getTime());
    }
    const initialStartDate = isValidDateTime(data?.start)
        ? moment(data.start)
        : moment().format('YYYY-MM-DD 09:00');
    const [startDate, setstartDate] = useState<any>(initialStartDate);
    const [endDate, setendDate] = useState<any>(moment(data.end));
    const [isBillable, setisBillable] = useState<any>();
    const [loading, setLoading] = useState<any>();

    const hoursPerDay = user?.employeeInformation?.hoursPerDay || 8;

    const [sliderValue, setSliderValue] = useState(data?.progress);

    const repeating = [
        { id: 0, name: 'SU' },
        { id: 1, name: 'MO' },
        { id: 2, name: 'TU' },
        { id: 3, name: 'WE' },
        { id: 4, name: 'TH' },
        { id: 5, name: 'FR' },
        { id: 6, name: 'SA' },
    ];
    const [selectedId, setSelectedId] = useState<any>([]);

    const formattedStartDate = moment(startDate).day();
    console.log({ startDate, selectedId, formattedStartDate, endDate });
    const toggleSelected = (value: any) => {
        const existingValue = selectedId?.find((e) => e?.id === value?.id);
        if (existingValue) {
            const newArray = selectedId?.filter((x) => x?.id !== value?.id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, value]);
    };

    const [projectTimesheets, setProjectTimesheets] =
        useState<ProjectTimesheetRange>({});

    console.log({ projectTimesheets });
    const [newProjectTimesheet, setNewProjectTimesheet] = useState([]);
    const [duration, setDuration] = useState(
        moment(data?.end).diff(data?.start, 'hour'),
    );

    const firstDateOfWeek = startOfWeek(parseISO(startDate));
    const selectedStartTime = moment(startDate).format('HH:mm');
    const selectedEndTime = moment(endDate).format('HH:mm');
    useEffect(() => {
        const updatedProjectTimesheets = selectedId.map((x, i) => ({
            ...projectTimesheets,
            startDate: moment(firstDateOfWeek)
                .add(x?.id, 'day')
                .format(`YYYY-MM-DD ${selectedStartTime}`),
            endDate: useEnd
                ? moment(
                      moment(firstDateOfWeek)
                          .add(x?.id, 'day')
                          .format(`YYYY-MM-DD ${selectedStartTime}`),
                  )
                      .add(hoursPerDay, 'hour')
                      .format('YYYY-MM-DD HH:mm')
                : moment(
                      moment(firstDateOfWeek)
                          .add(x?.id, 'day')
                          .format(`YYYY-MM-DD ${selectedStartTime}`),
                  )
                      .add(duration, 'hour')
                      .format('YYYY-MM-DD HH:mm'),
        }));

        setNewProjectTimesheet(updatedProjectTimesheets);
    }, [selectedId, projectTimesheets]);

    console.log({ duration });

    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            startDate,
        });
        setSelectedId([repeating.find((x) => x.id == formattedStartDate)]);
        setValue('startDate', startDate);
    }, [startDate]);

    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            endDate,
        });

        const dateDiff = moment(endDate).diff(startDate, 'days') + 1;

        // Get the first selected item based on formattedStartDate
        const firstSelectedItem = repeating.find(
            (x) => x.id === formattedStartDate,
        );

        // Create an array starting with the firstSelectedItem and mapping the rest
        const updatedSelectedId = [
            firstSelectedItem,
            ...Array.from({ length: dateDiff - 1 }, (_, index) => ({
                id: ((firstSelectedItem?.id as any) + index + 1) % 7, // Ensure the id stays within the range [0, 6] by using modulo
                name: repeating[
                    ((firstSelectedItem?.id as any) + index + 1) % 7
                ].name, // Get the corresponding name
            })),
        ];

        setSelectedId(updatedSelectedId);
        setValue('endDate', endDate);
    }, [endDate, startDate, formattedStartDate]);
    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            percentageOfCompletion: sliderValue,
        });
        setValue('percentageOfCompletion', sliderValue);
    }, [sliderValue]);
    useEffect(() => {
        setProjectTimesheets({
            ...projectTimesheets,
            billable: isBillable,
        });
    }, [isBillable]);

    const [useEnd, setUseEnd] = useState<boolean>(true);

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
        setDuration(e);
        const endDate = moment(startDate)
            .add(e, 'hours')
            .format('YYYY-MM-DD HH:mm');
        setValue('endDate', endDate);
        setProjectTimesheets({
            ...projectTimesheets,
            endDate,
        });
    };

    const onSubmit = async (data: UpdateProjectTimesheet) => {
        try {
            const result = await ProjectManagementService.updateFilledTimesheet(
                data,
            );
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
        <form>
            <VStack
                align="flex-start"
                w="full"
                spacing="0"
                gap="1rem"
                mb="1rem"
                borderBottom="1px solid #e6e7e7"
            >
                <Box w="full">
                    <FormLabel textTransform="capitalize" fontSize=".8rem">
                        Project Task
                    </FormLabel>
                    <Selectrix
                        options={[]}
                        w="full"
                        customKeys={{
                            key: 'id',
                            label: 'fullName',
                        }}
                        disabled
                        placeholder={data?.title}
                    />
                </Box>
                <CustomDateTime
                    onChange={setstartDate}
                    value={startDate}
                    label="Start Date & Time"
                    useEnd={false}
                    placeholder={moment(data?.start).format(
                        'dddd, MMM DD, YYYY',
                    )}
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
                        label="End Date"
                        useEnd={useEnd}
                        placeholder={moment(data?.start).format(
                            'dddd, MMM DD, YYYY',
                        )}
                    />
                ) : (
                    <Box w="full" mb=".5rem">
                        <InputBlank
                            placeholder="Duration in hours"
                            label="Duration"
                            defaultValue={duration as unknown as string}
                            onChange={(e) => changeDuration(e.target.value)}
                        />
                        <HStack
                            gap="2rem"
                            w="full"
                            justify="space-between"
                            align="center"
                            mt="1rem"
                            display="none"
                        >
                            <Text
                                fontSize=".8rem"
                                w="full"
                                mb="0"
                                fontWeight={500}
                            >
                                Recur Timeslot:
                            </Text>
                            <HStack w="full">
                                <HStack gap=".2rem">
                                    {repeating.map((x) => (
                                        <Circle
                                            bgColor={
                                                selectedId?.find(
                                                    (e) => e?.id == x?.id,
                                                ) || formattedStartDate == x?.id
                                                    ? 'brand.400'
                                                    : 'gray.200'
                                            }
                                            color={
                                                selectedId?.find(
                                                    (e) => e?.id == x?.id,
                                                ) || formattedStartDate == x?.id
                                                    ? 'white'
                                                    : 'gray.600'
                                            }
                                            border={
                                                selectedId?.find(
                                                    (e) => e?.id == x?.id,
                                                ) || formattedStartDate == x?.id
                                                    ? '2px solid #ffac00'
                                                    : 'none'
                                            }
                                            fontSize=".7rem"
                                            size="1.5rem"
                                            _hover={{
                                                border: '2px solid #ffac00',
                                            }}
                                            onClick={() => toggleSelected(x)}
                                        >
                                            {x.name.charAt(0)}
                                        </Circle>
                                    ))}
                                </HStack>
                            </HStack>
                        </HStack>
                    </Box>
                )}
                <ProgressSlider
                    sliderValue={sliderValue}
                    setSliderValue={setSliderValue}
                    label="Percentage Of Completion"
                />
                {/* <Checkbox
                    fontSize=".8rem"
                    color="#8c8c8c"
                    colorScheme="brand"
                    mb="2rem"
                    onChange={() => setisBillable((prev) => !prev)}
                >
                    Check this box if this task is a billable task
                </Checkbox> */}
            </VStack>
            <HStack gap="1rem" justify="space-between">
                <ShiftBtn text="Cancel" bg="#FF5B79" onClick={onClose} />
                <ShiftBtn
                    text="Submit"
                    bg="brand.400"
                    onClick={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                />
            </HStack>
        </form>
    );
};
