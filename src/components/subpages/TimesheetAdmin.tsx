import React, { useState } from "react";
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
} from "date-fns";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { MdArrowDropDown } from "react-icons/md";
import {
    Box,
    Checkbox,
    Flex,
    Grid,
    Select,
    Input,
    Tooltip,
    InputRightElement,
    InputGroup,
    Spinner,
    HStack,
    useToast,
} from "@chakra-ui/react";
import TimeSheetEstimation, {
    TimeSheetEstimationBtn,
} from "@components/bits-utils/TimeSheetEstimation";
import {
    TimeSheetMonthlyView,
    TimeSheetService,
    TimeSheetView,
} from "src/services";
import moment from "moment";
import { FaCheck, FaCheckCircle } from "react-icons/fa";
import { useRouter } from "next/router";

interface approveDate {
    userId: string;
    chosenDate: string;
    hours?: string;
    checked?: boolean;
}

const TimesheetAdmin = ({
    timeSheets,
}: {
    timeSheets: TimeSheetMonthlyView;
}) => {
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
    const [checked, setChecked] = useState(false);
    const toast = useToast();
    const totalHours = 60;
    const actualPayout = Math.round(
        ((timeSheets?.expectedPay as number) * totalHours) /
            (timeSheets?.expectedWorkHours as number),
    );

    // let userId = "";
    const [selected, setSelected] = useState<approveDate[]>([]);
    const [selectedInput, setSelectedInput] = useState<approveDate[]>([]);
    console.log({ selectedInput });
    console.log({ selected });

    function ApproveAllTimeSheet() {
        const [loading, setLoading] = useState(false);
        const updateSelected = async () => {
            setLoading(true);
            setChecked(!checked);
            monthlyTimesheets.forEach(async (timeSheet) => {
                if (timeSheet.employeeInformation) {
                    await approveTimeSheetForADay(
                        timeSheet.employeeInformationId,
                        timeSheet.date,
                    );
                    router.reload();
                }
            });
            setLoading(false);
            router.reload();
        };
        return (
            <TimeSheetEstimationBtn
                id={1}
                loading={loading}
                title="Approve all TimeSheet"
                click={() => updateSelected()}
            />
        );
    }
    function ApproveSelected() {
        const [loading, setLoading] = useState(false);
        const selected = async () => {
            updateSelected();
            // router.reload();
        };
        return (
            <TimeSheetEstimationBtn
                id={1}
                loading={loading}
                title="Update TimeSheet"
                click={() => selected()}
                bg="brand.200"
            />
        );
    }
    const approveTimeSheetForADay = async (userId, chosenDate) => {
        // setLoading(true);
        try {
            const data = await TimeSheetService.approveTimeSheetForADay(
                userId,
                chosenDate,
            );
            if (data.status) {
                // setLoading(false);
                console.log({ data });
                return;
            }
            toast({
                title: data.message,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
            console.log({ data });
            return;
        } catch (error) {
            console.log(error);
        }
    };

    const updateSelected = async () => {
        setLoading(true);
        selected.forEach(async (select) => {
            if (select.checked === true && select.userId) {
                await approveTimeSheetForADay(select.userId, select.chosenDate);
            }
        });
        selectedInput.forEach(async (select) => {
            if (select.hours !== "" && select.userId !== undefined) {
                await addHours(select.userId, select.chosenDate, select.hours);
            }
        });
        // setLoading(false);
        // router.reload();
    };
    const nextMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(addMonths(activeDate, 1)).format("YYYY-MM-DD"),
            },
        });
        router.reload();
    };
    const prevMonth = async () => {
        await router.push({
            query: {
                ...router.query,
                date: moment(subMonths(activeDate, 1)).format("YYYY-MM-DD"),
            },
        });
        router.reload();
    };

    const addHours = async (userId, chosenDate, hours) => {
        console.log({ userId, chosenDate, hours });
        try {
            setLoading(true);
            const data = await TimeSheetService.addWorkHoursForADay(
                userId,
                chosenDate,
                hours,
            );
            if (data.status) {
                setLoading(false);
                console.log({ data });
                return;
            }
        } catch (error) {
            console.log(error);
        }
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
                    fontSize="1.3rem"
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
                        p=".3rem .8rem"
                        color="#000"
                    >
                        {`${format(activeDate, "MMM 01")} - ${format(
                            lastDayOfMonth(activeDate),
                            "MMM dd",
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
                    {`Viewing ${timeSheets?.fullName} Timesheet`}
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
                    {format(addDays(weekStartDate, day), "E")}
                </div>,
            );
        }
        return (
            <div className="weekContainer">
                <Box className="day weekNames" color="red.400">
                    Week
                </Box>
                {weekDays}
                <Box className="day weekNames" color="brand.400">
                    Total
                </Box>
            </div>
        );
    };
    const [loading, setLoading] = useState<boolean>(false);
    const generateDatesForCurrentWeek = (
        date,
        selectedDate,
        activeDate,
        weekNumber,
    ) => {
        let currentDate: Date = date;
        const total: any[] = [];
        const week: any[] = [];
        for (let day = 0; day < 7; day++) {
            const cloneDate = currentDate;
            const timesheets = monthlyTimesheets?.filter(
                (x) =>
                    new Date(x.date as string).toLocaleDateString() ==
                    currentDate.toLocaleDateString(),
            )[0];
            const userId = timesheets?.employeeInformationId as string;
            // console.log({ userId });
            const userDate = moment(timesheets?.date).format("YYYY-MM-DD");
            const [hours, setHours] = useState<string>("");
            const [singleCheck, setSingleCheck] = useState(false);
            const isApproved = timesheets?.isApproved;
            // console.log({ singleCheck });

            week.push(
                <Box
                    className={`day ${
                        isSameMonth(currentDate, activeDate)
                            ? ""
                            : "inactiveDay"
                    } ${
                        isSameDay(currentDate, selectedDate)
                            ? "selectedDay"
                            : ""
                    }
    ${isSameDay(currentDate, new Date()) ? "today" : ""}`}
                    onClick={() => {
                        setSelectedDate(cloneDate);
                    }}
                >
                    <Flex>
                        <div>{format(currentDate, "MMM, d")}</div>
                        <Checkbox
                            disabled={!isSameMonth(currentDate, activeDate)}
                            ml=".5rem"
                            onChange={() => {
                                setSingleCheck(!singleCheck);
                                selected.push({
                                    userId: userId,
                                    chosenDate: userDate,
                                    checked: isApproved
                                        ? singleCheck
                                        : !singleCheck,
                                });
                            }}
                            defaultChecked={
                                timesheets?.isApproved || singleCheck || false
                            }
                            // isChecked={
                            //     singleCheck || timesheets?.isApproved || checked
                            // }
                        ></Checkbox>
                    </Flex>

                    <InputGroup
                        border="0"
                        w="50%"
                        h="1.5rem"
                        mt=".3rem"
                        alignItems="center"
                    >
                        <Input
                            type="tel"
                            defaultValue={timesheets?.hours}
                            placeholder="---"
                            textAlign="center"
                            h="full"
                            border="0"
                            // disabled={timesheets?.isApproved}
                            onChange={(e) =>
                                selectedInput.push({
                                    userId: userId,
                                    chosenDate: userDate,
                                    hours: e.target.value,
                                })
                            }
                        />
                        {/* {hours !== "" && (
                            <InputRightElement
                                h="full"
                                onClick={() =>
                                    addHours(userId, userDate, hours)
                                }
                                children={
                                    loading ? (
                                        <Spinner size="xs" />
                                    ) : (
                                        <FaCheckCircle color="brand.400" />
                                    )
                                }
                            />
                        )} */}
                        {timesheets?.isApproved && <FaCheck color="green" />}
                    </InputGroup>
                </Box>,
            );
            currentDate = addDays(currentDate, 1);
            const dayHour = timesheets?.hours as number;
            total.push(<>{timesheets?.hours == undefined ? 0 : dayHour}</>);
            // console.log({ total });
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
                    {total}
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
                <Grid templateColumns="repeat(6,1fr)" w="100%" mr="auto">
                    <TimeSheetEstimation
                        label="Expected Total Hours"
                        data={timeSheets?.expectedWorkHours}
                        tip="Number of hours you are expected to work this month"
                    />
                    <TimeSheetEstimation
                        label="Total Hours Worked"
                        data={totalHours}
                        tip="Number of hours you worked this month"
                    />
                    <TimeSheetEstimation
                        label="Expected Payout"
                        data={timeSheets?.expectedPay}
                        tip="Total amount you are expected to be paid this month"
                    />
                    <TimeSheetEstimation
                        label="Actual Payout"
                        data={actualPayout}
                        tip="Number of hours you worked this month x Rate per hour"
                    />
                    {/* <TimeSheetEstimationBtn
                        id={1}
                        loading={loading}
                        title="Update TimeSheet"
                        click={() => approveSelected()}
                        bg="brand.200"
                    /> */}
                    <ApproveSelected />
                    <ApproveAllTimeSheet />
                </Grid>
                {/* <HStack></HStack> */}
            </Box>
        </Box>
    );
};

export default TimesheetAdmin;
