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
} from 'date-fns';

import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai';
import { MdArrowDropDown, MdOutlineBookmarkAdd } from 'react-icons/md';
import { BiX, BiCheck } from 'react-icons/bi';
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
    RejectTimeSheetModel,
    TimeSheetMonthlyView,
    TimeSheetService,
    TimeSheetView,
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

interface approveDate {
    userId: string;
    chosenDate: string;
    hours?: string;
    checked?: boolean;
    status?: string;
}

const schema = yup.object().shape({
    reason: yup.string().required(),
});

const TimesheetPayrollManager = ({
    timeSheets,
    id,
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
}) => {
    console.log({ id });
    const router = useRouter();
    console.log({ timeSheets });
    const sheet = timeSheets?.timeSheet;
    const { date } = router.query;
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
    // console.log({ totalHours });
    const expectedHours = (timeSheets?.expectedWorkHours as number) || 0;
    const approvedHours = (timeSheets?.totalApprovedHours as number) || 0;
    const expectedPay = (timeSheets?.expectedPay as number) || 0;
    const currency = timeSheets?.currency;
    const actualPayout =
        Math.round((expectedPay * approvedHours) / expectedHours) || 0;

    const [loading, setLoading] = useState(false);
    const [allChecked, setAllChecked] = useState<boolean>(false);
    // console.log({ allChecked });
    const [selected, setSelected] = useState<approveDate[]>([]);
    const [selectedInput, setSelectedInput] = useState<approveDate[]>([]);

    const fillTimeInDate = (item: approveDate) => {
        const existingValue = selectedInput.find(
            (e) => e.chosenDate == item.chosenDate,
        );
        if (existingValue) {
            const newArray = selectedInput.filter(
                (x) => x.chosenDate !== item.chosenDate,
            );
            setSelectedInput([...newArray, item]);
            return;
        }
        setSelectedInput([...selectedInput, item]);
    };
    // console.log({ selectedInput });
    // console.log({ selected });

    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RejectTimeSheetModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {},
    });

    const reloadPage = () => {
        router.reload();
    };

    const [reject, setReject] = useState<approveDate>({
        userId: '',
        chosenDate: '',
    });
    const showReject = (userId, chosenDate) => {
        console.log({ chosenDate });
        setReject({ userId, chosenDate });
    };
    const preventTomorrow = addDays(new Date(), 1).toISOString();
    console.log({ reject });
    const onSubmit = async (data: RejectTimeSheetModel) => {
        data.date = reject.chosenDate;
        data.employeeInformationId = reject.userId;
        console.log({ data });
        try {
            const result = await TimeSheetService.rejectTimeSheetForADay(data);
            if (result.status) {
                console.log({ result });
                router.reload();
                return;
            }
            console.log({ result });
        } catch (error) {
            console.log({ error });
            toast({
                title: 'An error occured',
                status: 'error',
                position: 'top-right',
            });
        }
    };

    // const generatePayroll = async (id) => {
    //     console.log({ id });
    //     try {
    //         const data = await TimeSheetService.generatePayroll(id);
    //         if (data.status) {
    //             console.log({ data });
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
    //         console.log(error);
    //     }
    // };
    // const approveTimeSheetForADay = async (userId, chosenDate) => {
    //     try {
    //         const data = await TimeSheetService.approveTimeSheetForADay(
    //             userId,
    //             chosenDate,
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
    //         console.log(error);
    //     }
    // };

    const addHours = async (userId, chosenDate, hours) => {
        // console.log({ userId, chosenDate, hours });

        try {
            const data = await TimeSheetService.addWorkHoursForADay(
                userId,
                chosenDate,
                hours,
            );
            console.log({ data });
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
            console.log(error);
            toast({
                status: 'error',
                title: error.body.message || error.message,
                position: 'top-right',
            });
        }
    };

    // function ApproveAllTimeSheet() {
    //     const updateSelected = async (callback) => {
    //         // setAllChecked(!allChecked);
    //         monthlyTimesheets?.forEach(async (timeSheet: TimeSheetView) => {
    //             console.log({ timeSheet });
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

    function ApproveSelected() {
        const [loading, setLoading] = useState(false);
        const updateSelected = async (callback) => {
            selectedInput.forEach(async (select) => {
                if (select.hours !== '' && select.userId !== undefined) {
                    setLoading(true);
                    await addHours(
                        select.userId,
                        select.chosenDate,
                        select.hours,
                    );
                }
                setLoading(false);
                callback();
            });
            return;
        };
        return (
            <TimeSheetEstimationBtn
                id={1}
                loading={loading}
                title="Update TimeSheet"
                click={() => updateSelected(reloadPage)}
                bg="brand.400"
            />
        );
    }

    const nextMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(addMonths(activeDate, 1)).format('YYYY-MM-DD'),
            },
        });
        router.reload();
    };
    const prevMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(subMonths(activeDate, 1)).format('YYYY-MM-DD'),
            },
        });
        router.reload();
    };

    const getHeader = () => {
        return (
            <div className="header">
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
                    className="select"
                    _focus={{
                        border: 0,
                    }}
                >
                    <option value="">Monthly Activities</option>
                    <option value="">Weekly Activities</option>
                </Select>
                <Flex align="center">
                    <AiOutlineLeft
                        className="navIcon"
                        onClick={() => prevMonth()}
                    />
                    <Box
                        borderRadius="15px"
                        bgColor="#f5f5ff"
                        p={['.3rem .5rem', '.3rem .8rem']}
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
                    // ml="6rem"
                >
                    {`Viewing ${timeSheets?.fullName || ''} Timesheet`}
                </Flex>
            </div>
        );
    };

    const getWeekDaysNames = () => {
        const weekStartDate = startOfWeek(activeDate);
        const weekDays: any[] = [];
        for (let day = 0; day < 7; day++) {
            weekDays.push(
                <div className="day weekNames" key={day}>
                    {format(addDays(weekStartDate, day), 'E')}
                </div>,
            );
        }
        return (
            <Box className="weekContainer">
                <Box className="day weekNames" color="red.400">
                    Week
                </Box>
                {weekDays}
                <Box className="day weekNames" color="brand.400">
                    Total
                </Box>
            </Box>
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
            // console.log({ timesheets });

            week.push(
                <Box
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
                                        chosenDate: userDate,
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
                                        <PrimaryTextarea<RejectTimeSheetModel>
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
                                ) || timesheets?.hours === 0
                                    ? '---'
                                    : timesheets?.hours
                            }
                            placeholder="---"
                            textAlign="center"
                            h="full"
                            border="0"
                            readOnly={
                                // timesheets?.status === 'APPROVED' ||
                                moment(timesheets?.date).format(
                                    'YYYY-MM-DD',
                                ) ===
                                moment(preventTomorrow).format('YYYY-MM-DD')
                            }
                            disabled={
                                timesheets == undefined ||
                                isWeekend(new Date(timesheets?.date as string))
                            }
                            onChange={(e) =>
                                fillTimeInDate({
                                    userId: userId,
                                    chosenDate: userDate,
                                    hours: e.target.value,
                                })
                            }
                        />

                        {timesheets?.status == 'APPROVED' ? (
                            <FaCheck color="green" onClick={onOpen} />
                        ) : timesheets?.status == 'REJECTED' ? (
                            <FaTimes color="red" onClick={onOpen} />
                        ) : null}
                    </InputGroup>
                </Box>,
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
                >
                    {weekNumber}
                </Flex>
                <>{week}</>
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize=".9rem"
                >
                    {sumOfHours} HR
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

        return <div className="dayContainer">{allWeeks}</div>;
    };

    return (
        <Box>
            <Box>
                {getHeader()}
                <Box
                    w="full"
                    bgColor="white"
                    p="0rem 2rem 0rem"
                    // pos="relative"
                    // borderRadius="10px"
                >
                    {getWeekDaysNames()}
                    {getDates()}
                </Box>
                {/* <Box></Box> */}
            </Box>
            <Box
                w="100%"
                ml="auto"
                bgColor="white"
                mt="0rem"
                // borderRadius="10px"
                p="1rem 2rem"
            >
                <Grid templateColumns="repeat(5,1fr)" w="100%" mr="auto">
                    <TimeSheetEstimation
                        label="Expected Total Hours"
                        data={`${expectedHours} HR`}
                        tip="Number of hours you are expected to work this month"
                    />
                    <TimeSheetEstimation
                        label="Total Hours Approved"
                        data={`${timeSheets?.totalApprovedHours} HR`}
                        tip="Number of hours approved by supervisor"
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
                </Grid>
            </Box>
        </Box>
    );
};

export default TimesheetPayrollManager;
