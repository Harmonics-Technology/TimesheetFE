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
} from "@chakra-ui/react";
import TimeSheetEstimation, {
    TimeSheetEstimationBtn,
} from "@components/bits-utils/TimeSheetEstimation";
import {
    TimeSheetMonthlyView,
    TimeSheetMonthlyViewIEnumerableStandardResponse,
    TimeSheetService,
} from "src/services";
import moment from "moment";

const Timesheet = ({
    timeSheets,
}: {
    timeSheets: TimeSheetMonthlyViewIEnumerableStandardResponse;
}) => {
    console.log({ timeSheets });
    const sheet = timeSheets.data;
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(new Date());
    const [hours, setHours] = useState<string>("");
    const [monthlyTimesheets, setMonthlyTimesheets] = useState<
        TimeSheetMonthlyView[]
    >(sheet as TimeSheetMonthlyView[]);

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
                        onClick={() => setActiveDate(subMonths(activeDate, 1))}
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
                        onClick={() => setActiveDate(addMonths(activeDate, 1))}
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
                    {monthlyTimesheets[0].employeeInformationId}
                </Flex>
            </div>
        );
    };

    const getWeekDaysNames = () => {
        const weekStartDate = startOfWeek(activeDate);
        const weekDays: any[] = [];
        for (let day = 0; day < 7; day++) {
            weekDays.push(
                <div className="day weekNames">
                    {format(addDays(weekStartDate, day), "E")}
                </div>,
            );
        }
        return (
            <div className="weekContainer">
                <Box className="day weekNames" color="brand.400"></Box>
                {weekDays}
                <Box className="day weekNames" color="brand.400">
                    Total
                </Box>
            </div>
        );
    };

    const generateDatesForCurrentWeek = (date, selectedDate, activeDate) => {
        const approveTimeSheetForADay = async (userId, chosenDate) => {
            console.log({ userId, chosenDate });
            try {
                const data = await TimeSheetService.approveTimeSheetForADay(
                    userId,
                    chosenDate,
                );
                console.log({ data });
            } catch (error) {
                console.log(error);
            }
        };
        const addHours = async (userId, chosenDate, hours) => {
            window.setTimeout(async () => {
                console.log({ userId, chosenDate, hours });
                // try {
                //     const data = await TimeSheetService.addWorkHoursForADay(
                //         userId,
                //         chosenDate,
                //         hours,
                //     );
                //     console.log({ data });
                // } catch (error) {
                //     console.log(error);
                // }
            }, 2000);
        };
        let currentDate: Date = date;
        const week: any[] = [];
        for (let day = 0; day < 7; day++) {
            const cloneDate = currentDate;
            const timesheets = monthlyTimesheets?.filter(
                (x) =>
                    new Date(x.date as string).toLocaleDateString() ==
                    currentDate.toLocaleDateString(),
            )[0];
            const userId = timesheets?.employeeInformationId;
            const userDate = moment(timesheets?.date).format("YYYY-MM-DD");
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
                            onChange={() =>
                                approveTimeSheetForADay(userId, userDate)
                            }
                            defaultChecked={timesheets?.isApproved || false}
                        ></Checkbox>
                    </Flex>

                    <Input
                        defaultValue={timesheets?.hours}
                        placeholder="---"
                        border="0"
                        w="50%"
                        h="auto"
                        textAlign="center"
                        onChange={(e) => setHours(e.target.value)}
                        onKeyUp={() => addHours(userId, userDate, hours)}
                    />
                </Box>,
            );
            currentDate = addDays(currentDate, 1);
        }
        return (
            <>
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize=".9rem"
                >
                    Week
                </Flex>
                <>{week}</>
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize=".9rem"
                >
                    40hr 35m
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

        while (currentDate <= endDate) {
            allWeeks.push(
                generateDatesForCurrentWeek(
                    currentDate,
                    selectedDate,
                    activeDate,
                ),
            );
            currentDate = addDays(currentDate, 7);
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
                <Grid templateColumns="repeat(5,1fr)" w="80%" mr="auto">
                    <TimeSheetEstimation
                        label="Expected Total Hours"
                        data="100"
                    />
                    <TimeSheetEstimation label="Total Hours Worked" data="25" />
                    <TimeSheetEstimation label="Total Payout" data="1000" />
                    <TimeSheetEstimation label="Actual Payout" data="50" />
                    <TimeSheetEstimationBtn id={1} />
                </Grid>
            </Box>
        </Box>
    );
};

export default Timesheet;
