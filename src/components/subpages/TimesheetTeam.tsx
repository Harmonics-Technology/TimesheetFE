import React, {
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from 'react';
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
import { MdArrowDropDown } from 'react-icons/md';
import {
    Box,
    Text,
    Flex,
    Grid,
    Select,
    Input,
    InputGroup,
    useToast,
    useDisclosure,
    Button,
} from '@chakra-ui/react';
import TimeSheetEstimation, {
    TimeSheetEstimationBtn,
} from '@components/bits-utils/TimeSheetEstimation';
import {
    TimeSheetMonthlyView,
    TimeSheetService,
    TimeSheetView,
    TimesheetHoursAdditionModel,
} from 'src/services';
import moment from 'moment';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/router';
import Naira, { CAD } from '@components/generics/functions/Naira';
import useClickOutside from '@components/generics/useClickOutside';
import { Round } from '@components/generics/functions/Round';
import Cookies from 'js-cookie';
import { UserContext } from '@components/context/UserContext';

const TimesheetTeam = ({
    timeSheets,
    id,
}: {
    timeSheets: TimeSheetMonthlyView;
    id: string;
}) => {
    const router = useRouter();
    // console.log({ timeSheets });
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
    const toast = useToast();

    let hoursWorked: any[] = [] || 0;
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
        Round((expectedPay * approvedHours) / expectedHours) || 0;

    const [selected, setSelected] = useState<TimesheetHoursAdditionModel[]>([]);

    const [view, setView] = useState('monthly');
    useEffect(() => {
        const timesheetView = Cookies.get('timesheetView');
        setView(timesheetView as string);
    }, []);

    const [increaseWeek, setIncreaseWeek] = useState(0);
    const [weekDate, setWeekDate] = useState({
        startWeek: moment(activeDate).startOf('month').format('MMM DD'),
        endWeek: moment(activeDate).endOf('month').format('MMM DD'),
    });

    console.log({ weekDate });
    const [selectedInput, setSelectedInput] = useState<
        TimesheetHoursAdditionModel[]
    >([]);
    const { user } = useContext(UserContext);
    const hoursEligible = user?.numberOfHoursEligible;

    const fillTimeInDate = (item: TimesheetHoursAdditionModel) => {
        const existingValue = selectedInput.find((e) => e.date == item.date);
        if (existingValue) {
            const newArray = selectedInput.filter((x) => x.date !== item.date);
            setSelectedInput([...newArray, item]);
            return;
        }
        setSelectedInput([...selectedInput, item]);
    };

    console.log({ selectedInput });
    console.log({ timeSheets, increaseWeek });

    // function ApproveAllTimeSheet() {
    //     const [loading, setLoading] = useState(false);
    //     const updateSelected = async () => {
    //         // setChecked(!checked);
    //         await monthlyTimesheets.forEach(async (timeSheet) => {
    //             if (timeSheet.employeeInformation) {
    //                 setLoading(true);
    //                 await approveTimeSheetForADay(
    //                     timeSheet.employeeInformationId,
    //                     timeSheet.date,
    //                 );
    //             }
    //             setLoading(false);
    //             return;
    //         });
    //         router.reload();
    //     };
    //     // console.log({ loading });
    //     return (
    //         <TimeSheetEstimationBtn
    //             id={1}
    //             loading={loading}
    //             title="Approve all TimeSheet"
    //             click={() => updateSelected()}
    //         />
    //     );
    // }

    const addHours = async (item) => {
        // console.log({ userId, date, hours });

        try {
            const data = await TimeSheetService.addWorkHoursForADay(
                // item.userId,
                item.date,
                item.hours,
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

    const setViewToStorage = (value) => {
        setView(value);
        Cookies.set('timesheetView', value);
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
                    selectedInput,
                );
                console.log({ data });
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
                console.log(error);
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
    const preventTomorrow = addDays(new Date(), 1).toISOString();

    const navigateWeek = (dir: string, weeks: any) => {
        // console.log({ dir });
        if (dir == 'prev' && increaseWeek !== 0) {
            setIncreaseWeek((increaseWeek) => increaseWeek - 1);
            setWeekDate({
                startWeek: weeks
                    .at(increaseWeek - 1)
                    .props.children.at(1)
                    .at(0)
                    .props.children.at(0)
                    .props.children.at(0).props.children,
                endWeek: weeks
                    .at(increaseWeek - 1)
                    .props.children.at(1)
                    .at(-1)
                    .props.children.at(0)
                    .props.children.at(0).props.children,
            });
            return;
        }
        if (dir == 'prev' && increaseWeek === 0) {
            prevMonth();
            return;
        }

        if (dir == 'next' && increaseWeek !== weeks.length) {
            setIncreaseWeek((increaseWeek) => increaseWeek + 1);
            setWeekDate({
                startWeek: weeks
                    .at(increaseWeek)
                    .props.children.at(1)
                    .at(0)
                    .props.children.at(0)
                    .props.children.at(0).props.children,
                endWeek: weeks
                    .at(increaseWeek)
                    .props.children.at(1)
                    .at(-1)
                    .props.children.at(0)
                    .props.children.at(0).props.children,
            });
            return;
        }
        if (dir == 'next' && increaseWeek === weeks.length) {
            nextMonth();
            return;
        }
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
                    _focusVisible={{
                        border: 0,
                        boxShadow: 'none',
                    }}
                    className="select"
                    onChange={(e) => setViewToStorage(e.target.value)}
                >
                    <option selected hidden>
                        {view == 'weekly'
                            ? 'Weekly Activities'
                            : 'Monthly Activities'}
                    </option>
                    <option value="monthly">Monthly Activities</option>
                    <option value="weekly">Weekly Activities</option>
                </Select>
                {view == 'weekly' ? (
                    <Flex
                        align="center"
                        color={['black', 'white']}
                        fontSize={['.8rem', '1rem']}
                    >
                        <AiOutlineLeft
                            className="navIcon"
                            onClick={() => navigateWeek('prev', allWeeks)}
                        />
                        <Box
                            borderRadius="15px"
                            bgColor="#f5f5ff"
                            p=".3rem .8rem"
                            border={['1px solid gray', 'none']}
                            color="#000"
                        >
                            {`${weekDate.startWeek} - ${weekDate.endWeek}`}
                        </Box>
                        <AiOutlineRight
                            className="navIcon"
                            onClick={() => navigateWeek('next', allWeeks)}
                        />
                    </Flex>
                ) : (
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
                )}
                <Flex
                    px="2rem"
                    border="1px solid"
                    // borderColor="gray.400"
                    borderRadius="30px"
                    fontSize="1rem"
                    h="2.8rem"
                    align="center"
                    // ml="6rem"
                    display={['none', 'flex']}
                >
                    {`Viewing ${'My'} Timesheet`}
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

            // console.log({ notFilled });

            week.push(
                <Flex
                    border={['0', '1px solid #e5e5e5']}
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
                            fontSize={['.6rem', '.9rem']}
                            p={['0', '1rem']}
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
                            color={
                                timesheets?.onLeave &&
                                timesheets?.onLeaveAndEligibleForLeave
                                    ? 'blue'
                                    : (timesheets?.onLeave &&
                                          !timesheets?.onLeaveAndEligibleForLeave) ||
                                      (timesheets?.hours as number) >
                                          hoursEligible
                                    ? 'red'
                                    : 'green'
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
            // week.push(format(currentDate, 'MMM, d'));
            currentDate = addDays(currentDate, 1);
            const dayHour = timesheets?.hours as number;
            total.push(timesheets?.hours == undefined ? 0 : dayHour);
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

    const allWeeks: any[] = [];
    const getDates = () => {
        const startOfTheSelectedMonth = startOfMonth(activeDate);
        const endOfTheSelectedMonth = endOfMonth(activeDate);
        const startDate = startOfWeek(startOfTheSelectedMonth);
        const endDate = endOfWeek(endOfTheSelectedMonth);

        let currentDate = startDate;

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
        // console.log({ allWeeks });

        return (
            <>
                {view == 'weekly' ? (
                    <>
                        {allWeeks.splice(increaseWeek, 1).map((x, i) => (
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
                                    templateColumns={[
                                        'repeat(8,1fr)',
                                        'repeat(9,1fr)',
                                    ]}
                                    border={['0']}
                                >
                                    {x}
                                </Grid>
                                {/* <Flex mx="auto" w="fit-content">
                                    <Button
                                        onClick={() => navigateWeek('prev', 0)}
                                    >
                                        {'<'}
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            navigateWeek('next', allWeeks)
                                        }
                                    >
                                        {'>'}
                                    </Button>
                                </Flex> */}
                            </Box>
                        ))}
                    </>
                ) : (
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
                                    templateColumns={[
                                        'repeat(8,1fr)',
                                        'repeat(9,1fr)',
                                    ]}
                                    border={['0']}
                                >
                                    {x}
                                </Grid>
                            </Box>
                        ))}
                    </>
                )}
            </>
        );
    };
    return (
        <Box>
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
                        data={`${timeSheets?.totalApprovedHours || 0} HR`}
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

export default TimesheetTeam;
