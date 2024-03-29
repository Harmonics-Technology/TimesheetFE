import React, { useCallback, useRef, useState } from 'react';
import {
    format,
    startOfWeek,
    addDays,
    startOfMonth,
    endOfMonth,
    endOfWeek,
    isSameMonth,
    isSameDay,
    subMonths,
    addMonths,
    lastDayOfMonth,
    isWeekend,
    eachDayOfInterval,
} from 'date-fns';

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { MdArrowDropDown, MdOutlineBookmarkAdd } from 'react-icons/md';
import { BiX, BiCheck } from 'react-icons/bi';
import dynamic from 'next/dynamic';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});
import {
    Box,
    Checkbox,
    Flex,
    Grid,
    Select,
    Input,
    InputGroup,
    useToast,
    HStack,
    Circle,
    useDisclosure,
    Text,
} from '@chakra-ui/react';
import TimeSheetEstimation, {
    TimeSheetEstimationBtn,
} from '@components/bits-utils/TimeSheetEstimation';
import {
    RejectTimesheetModel,
    TimeSheetMonthlyView,
    TimeSheetService,
    TimeSheetView,
    TimesheetHoursAdditionModel,
} from 'src/services';
import moment from 'moment';
import { FaCheck, FaCheckCircle, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Naira, { CAD } from '@components/generics/functions/Naira';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button } from '..';
import BeatLoader from 'react-spinners/BeatLoader';
import useClickOutside from '@components/generics/useClickOutside';
import { Round } from '@components/generics/functions/Round';
import { TimeSheetHighlight } from '@components/bits-utils/TimeSheetHighlight';

const schema = yup.object().shape({
    reason: yup.string().required(),
});

const TimesheetPayrollManager = ({
    timeSheets,
    id,
    payPeriod,
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
    payPeriod: any;
}) => {
    const router = useRouter();

    const { date } = router.query;
    const { end } = router.query;

    //

    const HighlightDate = (value: any) => {
        router.push({
            query: {
                ...router.query,
                date: value?.split(' - ')[0] || new Date(),
                end: value?.split(' - ')[1] || new Date(),
            },
        });
    };
    const dates = eachDayOfInterval({
        start: new Date(
            moment(date as string).format('MM/DD/YYYY') ||
                (moment() as unknown as string),
        ),
        end: new Date(
            moment((end as string) || (date as string)).format(
                'MM/DD/YYYY',
            ) as unknown as string,
        ),
    });
    const newDates = dates?.map((x) => moment(x).format('DD/MM/YY'));

    const newOptions = payPeriod?.map((obj) => ({
        id: `${obj.weekDate} - ${obj.lastWorkDayOfCycle}`,
        label: `${moment(obj.weekDate).format('MMM DD')} - ${moment(
            obj.lastWorkDayOfCycle,
        ).format('MMM DD, YYYY')}`,
    }));

    const sheet = timeSheets?.timeSheet;
    const newDate = new Date(date as unknown as string);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(
        //@ts-ignore
        newDate instanceof Date && !isNaN(newDate) ? newDate : new Date(),
    );
    const [monthlyTimesheets, setMonthlyTimesheets] = useState<TimeSheetView[]>(
        sheet as TimeSheetView[],
    );
    // const [checked, setChecked] = useState(false);
    const toast = useToast();
    let hoursWorked: any[] = [];
    monthlyTimesheets?.forEach((x) => {
        hoursWorked.push(x.hours);
    });
    if (hoursWorked.length > 0) {
        hoursWorked = hoursWorked.reduce((a, b) => a + b);
    }
    const totalHours =
        hoursWorked.length == 0 ? 0 : (hoursWorked as unknown as number);
    //
    const expectedHours = (timeSheets?.expectedWorkHours as number) || 0;
    const approvedHours = (timeSheets?.totalApprovedHours as number) || 0;
    const expectedPay = (timeSheets?.expectedPay as number) || 0;
    const currency = timeSheets?.currency;
    const actualPayout =
        Round((expectedPay * approvedHours) / expectedHours) || 0;

    const [loading, setLoading] = useState(false);
    const [allChecked, setAllChecked] = useState<boolean>(false);
    //
    const [selected, setSelected] = useState<TimesheetHoursAdditionModel[]>([]);
    const [selectedInput, setSelectedInput] = useState<
        TimesheetHoursAdditionModel[]
    >([]);

    const fillTimeInDate = (item: TimesheetHoursAdditionModel) => {
        const existingValue = selectedInput.find((e) => e.date == item.date);
        if (existingValue) {
            const newArray = selectedInput.filter((x) => x.date !== item.date);
            setSelectedInput([...newArray, item]);
            return;
        }
        setSelectedInput([...selectedInput, item]);
    };
    //
    //

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RejectTimesheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {},
    });

    const reloadPage = () => {
        router.reload();
    };

    const preventTomorrow = addDays(new Date(), 1).toISOString();
    const [reject, setReject] = useState<any>([]);
    const showReject = (userId, chosenDate) => {
        const existing = reject.find((x) => x.userId == userId);
        if (existing) {
            setReject(reject.filter((x) => x.user !== userId));
            return;
        }
        setReject([...reject, { userId, chosenDate }]);
        // setReject({ userId, chosenDate });
    };

    const onSubmit = async (data: RejectTimesheetModel) => {
        data.timeSheets = reject.map((x) => {
            return {
                employeeInformationId: x.userId,
                date: x.chosenDate,
            };
        });

        try {
            const result = await TimeSheetService.rejectTimeSheetForADay(
                id,
                reject.at(0)?.chosenDate,
                data,
            );
            if (result.status) {
                router.reload();
                return;
            }
        } catch (error: any) {
            //
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                position: 'top-right',
            });
        }
    };

    // const generatePayroll = async (id) => {
    //
    //     try {
    //         const data = await TimeSheetService.generatePayroll(id);
    //         if (data.status) {
    //
    //             return;
    //         }
    //         toast({
    //             title: data.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //         return;
    //     } catch (error: any) {
    //         toast({
    //             title: error?.body.message || error.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //
    //     }
    // };
    // const approveTimeSheetForADay = async (userId, date) => {
    //     try {
    //         const data = await TimeSheetService.approveTimeSheetForADay(
    //             userId,
    //             date,
    //         );
    //         if (data.status) {
    //             return;
    //         }
    //         toast({
    //             title: data.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //         return;
    //     } catch (error) {
    //
    //     }
    // };

    // function ApproveAllTimeSheet() {
    //     const updateSelected = async (callback) => {
    //         // setAllChecked(!allChecked);
    //         monthlyTimesheets?.forEach(async (timeSheet: TimeSheetView) => {
    //
    //             if (
    //                 timeSheet.employeeInformation &&
    //                 timeSheet.status == 'PENDING'
    //             ) {
    //                 setLoading(true);
    //                 await approveTimeSheetForADay(
    //                     timeSheet.employeeInformationId,
    //                     timeSheet.date,
    //                 );
    //             }
    //             return;
    //         });
    //         setLoading(false);
    //         callback();
    //     };
    //     return (
    //         <TimeSheetEstimationBtn
    //             id={1}
    //             loading={loading}
    //             title="Approve all TimeSheet"
    //             click={() => updateSelected(reloadPage)}
    //         />
    //     );
    // }

    const addHours = async (item) => {
        //

        try {
            const data = await TimeSheetService.addWorkHoursForADay(
                item.date,
                item.hours,
            );

            if (data.status) {
                return;
            }
            toast({
                status: 'error',
                title: data.message,
                position: 'top-right',
            });
            return;
        } catch (error: any) {
            toast({
                status: 'error',
                title: error.body.message || error.message,
                position: 'top-right',
            });
        }
    };

    const asyncForEach = async (array, callback) => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    };
    function ApproveSelected() {
        const [loading, setLoading] = useState(false);
        const updateSelected = async () => {
            try {
                setLoading(true);
                const data = await TimeSheetService.addWorkHoursForADay(
                    id,
                    selectedInput.at(0)?.date,
                    selectedInput,
                );

                if (data.status) {
                    setLoading(false);
                    toast({
                        status: 'success',
                        title: 'Successful',
                        position: 'top-right',
                    });
                    router.reload();
                    return;
                }
                toast({
                    status: 'error',
                    title: data.message,
                    position: 'top-right',
                });
                return;
            } catch (error: any) {
                toast({
                    status: 'error',
                    title: error.body.message || error.message,
                    position: 'top-right',
                });
            }
        };
        // const updateSelected = async () => {
        //     await asyncForEach(selectedInput, async (num) => {
        //         setLoading(true);
        //         await addHours(num);
        //     });
        //     setLoading(false);
        //     toast({
        //         status: 'success',
        //         title: 'Successful',
        //         position: 'top-right',
        //     });
        //     router.reload();
        //     return;
        // };
        return (
            <TimeSheetEstimationBtn
                id={1}
                loading={loading}
                title="Update TimeSheet"
                click={() => updateSelected()}
                disabled={selectedInput.length < 1}
                bg="brand.400"
            />
        );
    }

    const nextMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(addMonths(activeDate, 1)).format('YYYY-MM-DD'),
                end: undefined,
            },
        });
        router.reload();
    };
    const prevMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(subMonths(activeDate, 1)).format('YYYY-MM-DD'),
                end: undefined,
            },
        });
        router.reload();
    };

    const getHeader = () => {
        return (
            <Flex
                align="center"
                justify="space-between"
                bgColor={['white', 'brand.400']}
                h="4rem"
                px={['0rem', '1rem']}
                color="white"
            >
                {/* <div
                    className="todayButton"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setActiveDate(new Date());
                    }}
                >
                    Today
                </div> */}
                <Select
                    border="0"
                    w="fit-content"
                    fontSize={['.8rem', '1.3rem']}
                    fontWeight="600"
                    icon={<MdArrowDropDown />}
                    bgColor="brand.400"
                    h="1.8rem"
                    _focus={{
                        border: 0,
                    }}
                >
                    <option value="">Monthly Activities</option>
                    <option value="">Weekly Activities</option>
                </Select>
                <Flex
                    align="center"
                    color={['black', 'white']}
                    fontSize={['.8rem', '1rem']}
                >
                    <AiOutlineLeft
                        className="navIcon"
                        onClick={() => prevMonth()}
                    />
                    <Box
                        borderRadius="15px"
                        bgColor="#f5f5ff"
                        p=".3rem .8rem"
                        border={['1px solid gray', 'none']}
                        color="#000"
                    >
                        {`${format(activeDate, 'MMM 01')} - ${format(
                            lastDayOfMonth(activeDate),
                            'MMM dd',
                        )}`}
                    </Box>
                    <AiOutlineRight
                        className="navIcon"
                        onClick={() => nextMonth()}
                    />
                </Flex>
                <Flex
                    px="2rem"
                    border="1px solid"
                    // borderColor="gray.400"
                    borderRadius="30px"
                    fontSize="1rem"
                    h="2.8rem"
                    align="center"
                    display={['none', 'flex']}
                    // ml="6rem"
                >
                    {`Viewing ${timeSheets?.fullName || ''} Timesheet`}
                </Flex>
            </Flex>
        );
    };

    const getWeekDaysNames = (weekNumber?: any) => {
        const weekStartDate = startOfWeek(activeDate);
        const weekDays: any[] = [];
        for (let day = 0; day < 7; day++) {
            weekDays.push(
                <Flex
                    key={day}
                    w="full"
                    align="center"
                    justify={['center', 'center']}
                    fontSize={['.6rem', '.8rem']}
                    cursor="pointer"
                    fontWeight={['600', '600']}
                    color={['gray.500', 'black']}
                    textTransform={['uppercase', 'uppercase']}
                    mb={['.5rem', '0']}
                    mt={['0', '1rem']}
                    border={['0', '1px solid #e5e5e5']}
                    h={['auto', '3rem']}
                >
                    {format(addDays(weekStartDate, day), 'E')}
                </Flex>,
            );
        }
        return (
            <>
                <Box
                    className="day weekNames"
                    color="black"
                    display={['block', 'none']}
                    textTransform="uppercase"
                    fontWeight="600"
                    mb=".5rem"
                    p="0 .6rem"
                >
                    Week {weekNumber}
                </Box>
                <Grid templateColumns={['repeat(8,1fr)', 'repeat(9,1fr)']}>
                    <Flex
                        w="full"
                        display={['none', 'flex']}
                        align="center"
                        justify={['center', 'center']}
                        fontSize={['.6rem', '.8rem']}
                        cursor="pointer"
                        fontWeight={['600', '600']}
                        color={['gray.500', 'red.400']}
                        textTransform={['uppercase', 'uppercase']}
                        mb={['.5rem', '0']}
                        mt={['0', '1rem']}
                        border={['0', '1px solid #e5e5e5']}
                        h={['auto', '3rem']}
                    >
                        Week
                    </Flex>
                    {weekDays}
                    <Flex
                        w="full"
                        align="center"
                        justify={['center', 'center']}
                        fontSize={['.6rem', '.8rem']}
                        cursor="pointer"
                        fontWeight={['600', '500']}
                        color={['gray.500', 'brand.400']}
                        textTransform={['uppercase', 'uppercase']}
                        mb={['.5rem', '0']}
                        mt={['0', '1rem']}
                        border={['0', '1px solid #e5e5e5']}
                        h={['auto', '3rem']}
                    >
                        Total
                    </Flex>
                </Grid>
            </>
        );
    };
    const generateDatesForCurrentWeek = (
        date,
        selectedDate,
        activeDate,
        weekNumber,
    ) => {
        let currentDate: Date = date;
        const total: any[] = [];
        const week: any[] = [];
        let sumOfHours = 0;
        for (let day = 0; day < 7; day++) {
            const cloneDate = currentDate;
            const timesheets = monthlyTimesheets?.filter(
                (x) =>
                    new Date(x.date as string).toLocaleDateString() ==
                    currentDate.toLocaleDateString(),
            )[0];
            const userId = timesheets?.employeeInformationId as string;
            const userDate = moment(timesheets?.date).format('YYYY-MM-DD');
            const status = timesheets?.status as string;
            const [singleCheck, setSingleCheck] = useState(false);
            const [singleReject, setSingleReject] = useState(false);
            const {
                isOpen: isVisible,
                onClose,
                onOpen,
            } = useDisclosure({ defaultIsOpen: false });
            const close = useCallback(() => onClose(), []);
            const popover = useRef(null);
            useClickOutside(popover, close);
            const notFilled =
                moment(timesheets?.date) > moment(timesheets?.dateModified);
            //

            week.push(
                <Flex
                    border={[
                        '0',
                        newDates?.length > 1 &&
                        newDates.includes(
                            moment((userDate as string) || '01/01/2021').format(
                                'DD/MM/YY',
                            ),
                        )
                            ? '0.1rem solid rgba(46, 175, 163, .7)'
                            : '1px solid #e5e5e5',
                    ]}
                    height={['auto', '4rem']}
                    // color={['gray.500', 'inherit']}
                    fontSize={['.5rem', '.8rem']}
                    pt={['0', '0rem']}
                    className={`day ${
                        isSameMonth(currentDate, activeDate)
                            ? ''
                            : 'inactiveDay'
                    } ${
                        isSameDay(currentDate, selectedDate)
                            ? 'selectedDay'
                            : ''
                    }
    ${isSameDay(currentDate, new Date()) ? 'today' : ''}`}
                    onClick={() => {
                        setSelectedDate(cloneDate);
                    }}
                >
                    <Flex pos="relative">
                        <div>{format(currentDate, 'MMM, d')}</div>
                        {/* <HStack gap="0rem" ml=".5rem">
                            <Circle
                                size="1rem"
                                bgColor={
                                    !singleCheck ? 'gray.400' : 'green.500'
                                }
                                color="white"
                                onClick={() => {
                                    setSingleCheck(!singleCheck);
                                    selected.push({
                                        userId: userId,
                                        date: userDate,
                                        checked: !singleCheck,
                                        status: status,
                                    });
                                }}
                                disabled={
                                    timesheets?.status === 'APPROVED' ||
                                    timesheets == undefined ||
                                    moment(timesheets?.date).format(
                                        'YYYY-MM-DD',
                                    ) ===
                                        moment(preventTomorrow).format(
                                            'YYYY-MM-DD',
                                        )
                                }
                                as={Button}
                                minW="unset"
                                p="0"
                            >
                                <BiCheck />
                            </Circle>
                            <Circle
                                size="1rem"
                                bgColor={!singleReject ? 'gray.400' : 'red.500'}
                                color="white"
                                onClick={() => {
                                    setSingleReject(!singleReject);
                                    showReject(userId, userDate);
                                }}
                                disabled={
                                    timesheets?.status === 'REJECTED' ||
                                    timesheets == undefined ||
                                    moment(timesheets?.date).format(
                                        'YYYY-MM-DD',
                                    ) ===
                                        moment(preventTomorrow).format(
                                            'YYYY-MM-DD',
                                        )
                                }
                                as={Button}
                                minW="unset"
                                p="0"
                            >
                                <BiX />
                            </Circle>
                            {singleReject && (
                                <Box
                                    w="280px"
                                    h="fit-content"
                                    bgColor="white"
                                    pos="absolute"
                                    p=".5rem 1rem .8rem"
                                    zIndex="300"
                                    borderRadius="8px"
                                    // top="12rem"
                                    boxShadow="0px 3px 10px 5px rgba(0,0,0,0.2)"
                                >
                                    <Flex
                                        justify="flex-end"
                                        onClick={() =>
                                            setSingleReject(!singleReject)
                                        }
                                    >
                                        <FaTimes />
                                    </Flex>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <PrimaryTextarea<RejectTimesheetModel>
                                            label="Reason"
                                            name="reason"
                                            error={errors.reason}
                                            placeholder=""
                                            defaultValue=""
                                            h="3.5rem"
                                            register={register}
                                        />
                                        <Button
                                            isLoading={isSubmitting}
                                            spinner={
                                                <BeatLoader
                                                    color="white"
                                                    size="10"
                                                />
                                            }
                                            type="submit"
                                            w="full"
                                            bgColor="brand.600"
                                            color="white"
                                            h="2rem"
                                            fontSize=".8rem"
                                        >
                                            Reject
                                        </Button>
                                    </form>
                                </Box>
                            )}
                        </HStack> */}
                        {isVisible && (
                            <Box
                                pos="absolute"
                                w="300px"
                                h="auto"
                                // borderRadius="10px"
                                borderBottom="4px solid"
                                borderColor={
                                    timesheets.isApproved == true
                                        ? 'green'
                                        : 'red'
                                }
                                top="-100px"
                                p="1rem"
                                zIndex={800}
                                bgColor={
                                    timesheets.isApproved == true
                                        ? 'green.100'
                                        : 'red.100'
                                }
                                ref={popover}
                            >
                                <Text fontWeight="700" mb="1rem">
                                    {timesheets.isApproved == true
                                        ? 'Approved!'
                                        : 'Rejected'}
                                </Text>
                                <Text fontWeight="500" mb="0">
                                    {timesheets.isApproved == true
                                        ? 'Good Job!'
                                        : timesheets.rejectionReason}
                                </Text>
                            </Box>
                        )}
                    </Flex>

                    <InputGroup
                        border="0"
                        w="50%"
                        h="1.5rem"
                        mt=".3rem"
                        alignItems="center"
                    >
                        <Input
                            type="number"
                            defaultValue={
                                isWeekend(
                                    new Date(timesheets?.date as string),
                                ) ||
                                moment(timesheets?.date).format(
                                    'DD/MM/YYYY',
                                ) ===
                                    moment(preventTomorrow).format(
                                        'DD/MM/YYYY',
                                    ) ||
                                (notFilled && timesheets?.hours == 0)
                                    ? // timesheets?.status == 'PENDING'
                                      '---'
                                    : timesheets?.hours
                            }
                            placeholder="---"
                            textAlign="center"
                            h="full"
                            border="0"
                            readOnly={timesheets?.status == 'APPROVED'}
                            disabled={
                                timesheets == undefined ||
                                isWeekend(
                                    new Date(timesheets?.date as string),
                                ) ||
                                moment(timesheets?.date).format(
                                    'DD/MM/YYYY',
                                ) ===
                                    moment(preventTomorrow).format('DD/MM/YYYY')
                            }
                            onChange={(e) =>
                                fillTimeInDate({
                                    date: userDate,
                                    hours: e.target.value as unknown as number,
                                })
                            }
                        />

                        {timesheets?.status == 'APPROVED' ? (
                            <FaCheck color="green" onClick={onOpen} />
                        ) : timesheets?.status == 'REJECTED' ? (
                            <FaTimes color="red" onClick={onOpen} />
                        ) : null}
                    </InputGroup>
                </Flex>,
            );
            currentDate = addDays(currentDate, 1);
            const dayHour = timesheets?.hours as number;
            total.push(dayHour == undefined ? 0 : dayHour);
            sumOfHours = total.reduce((a, b) => a + b, 0);
        }

        return (
            <>
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize=".9rem"
                    display={['none', 'flex']}
                    border={['0', '1px solid #e5e5e5']}
                >
                    {weekNumber}
                </Flex>
                {week}
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize={['.6rem', '.9rem']}
                    border={['0', '1px solid #e5e5e5']}
                >
                    {sumOfHours}
                </Flex>
            </>
        );
    };

    const getDates = () => {
        const startOfTheSelectedMonth = startOfMonth(activeDate);
        const endOfTheSelectedMonth = endOfMonth(activeDate);
        const startDate = startOfWeek(startOfTheSelectedMonth);
        const endDate = endOfWeek(endOfTheSelectedMonth);

        let currentDate = startDate;

        const allWeeks: any[] = [];

        let weekNumber = 1;
        while (currentDate <= endDate) {
            allWeeks.push(
                generateDatesForCurrentWeek(
                    currentDate,
                    selectedDate,
                    activeDate,
                    weekNumber,
                ),
            );
            weekNumber++, (currentDate = addDays(currentDate, 7));
        }

        return (
            <>
                {allWeeks.map((x, i) => (
                    <Box
                        bgColor="white"
                        mb={['1rem', '0']}
                        p={['.5rem', '0']}
                        borderRadius={['8px', '0']}
                        boxShadow="sm"
                    >
                        <Box display={['block', 'none']}>
                            {getWeekDaysNames(++i)}
                        </Box>
                        <Grid
                            templateColumns={['repeat(8,1fr)', 'repeat(9,1fr)']}
                            border={['0']}
                        >
                            {x}
                        </Grid>
                    </Box>
                ))}
            </>
        );
    };

    return (
        <Box pos="relative">
            <TimeSheetHighlight />
            <Box>
                {getHeader()}
                <Box
                    w="full"
                    bgColor={['transparent', 'white']}
                    p={['0', '0rem 2rem 0rem']}
                >
                    <Box display={['none', 'block']}>{getWeekDaysNames()}</Box>
                    {getDates()}
                </Box>
            </Box>
            <Box
                w="100%"
                ml="auto"
                bgColor="white"
                mt="0rem"
                mb={['3rem', '0']}
                p={['1rem 1rem', '1rem 2rem']}
            >
                <Box w="40%" mb="2rem">
                    <Text fontSize=".8rem" fontWeight={500} mb=".3rem">
                        Pay Period
                    </Text>
                    <Selectrix
                        placeholder={`${moment(date).format(
                            'MMM DD,',
                        )} - ${moment(
                            end || lastDayOfMonth(new Date(date as string)),
                        ).format('MMM DD, YYYY')}`}
                        customKeys={{
                            key: 'id',
                            label: 'label',
                        }}
                        options={newOptions}
                        onChange={(e) => HighlightDate(e.key)}
                    />
                </Box>
                <Flex
                    w="100%"
                    mr="auto"
                    flexWrap="wrap"
                    display={['flex', 'grid']}
                    gridTemplateColumns={'repeat(5,1fr)'}
                    gap={['0rem 1rem', '0']}
                >
                    <TimeSheetEstimation
                        label="Expected Total Hours"
                        data={`${expectedHours} HR`}
                        tip="Number of hours you are expected to work this month"
                    />

                    {/* <TimeSheetEstimation
                        label="Total Hours Worked"
                        data={`${totalHours} HR`}
                        tip="Number of hours you worked this month"
                    /> */}
                    <TimeSheetEstimation
                        label="Total Hours Approved"
                        data={`${timeSheets?.totalApprovedHours} HR`}
                        tip="Number of hours approved by your supervisor"
                    />
                    <TimeSheetEstimation
                        label="Expected Payout"
                        data={
                            currency === 'NGN'
                                ? Naira(expectedPay)
                                : CAD(expectedPay)
                        }
                        tip="Total amount you are expected to be paid this month"
                    />
                    <TimeSheetEstimation
                        label="Actual Payout"
                        data={
                            currency === 'NGN'
                                ? Naira(actualPayout)
                                : CAD(actualPayout)
                        }
                        tip="Number of hours you worked this month x Rate per hour"
                    />

                    <ApproveSelected />
                    {/* <ApproveAllTimeSheet /> */}
                </Flex>
            </Box>
        </Box>
    );
};

export default TimesheetPayrollManager;
