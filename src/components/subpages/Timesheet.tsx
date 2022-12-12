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
} from "date-fns";

import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { Box, Checkbox, Flex, Grid, Text } from "@chakra-ui/react";
import TimeSheetEstimation, {
    TimeSheetEstimationBtn,
} from "@components/bits-utils/TimeSheetEstimation";

const Timesheet = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [activeDate, setActiveDate] = useState(new Date());

    const getHeader = () => {
        return (
            <div className="header">
                <div
                    className="todayButton"
                    onClick={() => {
                        setSelectedDate(new Date());
                        setActiveDate(new Date());
                    }}
                >
                    Today
                </div>
                <AiOutlineLeft
                    className="navIcon"
                    onClick={() => setActiveDate(subMonths(activeDate, 1))}
                />
                <AiOutlineRight
                    className="navIcon"
                    onClick={() => setActiveDate(addMonths(activeDate, 1))}
                />
                <h2 className="currentMonth">
                    {format(activeDate, "MMMM yyyy")}
                </h2>
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
                {weekDays}
                <Box className="day weekNames" color="brand.400">
                    Total
                </Box>
            </div>
        );
    };

    const generateDatesForCurrentWeek = (date, selectedDate, activeDate) => {
        let currentDate = date;
        const week: any[] = [];
        for (let day = 0; day < 7; day++) {
            const cloneDate = currentDate;
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
                    <div>{format(currentDate, "d")}</div>
                    <Checkbox
                        mt="1rem"
                        disabled={!isSameMonth(currentDate, activeDate)}
                    >
                        8hr 06m
                    </Checkbox>
                </Box>,
            );
            currentDate = addDays(currentDate, 1);
        }
        return (
            <>
                {week}
                <Flex
                    className="day"
                    justify="center"
                    fontWeight="500"
                    fontSize="1.1rem"
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
            <Flex bgColor="white" p="2rem" borderRadius="10px">
                <Box w="full">
                    {getHeader()}
                    {getWeekDaysNames()}
                    {getDates()}
                </Box>
                {/* <Box></Box> */}
            </Flex>
            <Box
                w="100%"
                ml="auto"
                bgColor="white"
                mt="2rem"
                borderRadius="10px"
                p="2rem"
            >
                <Grid templateColumns="repeat(5,1fr)" w="100%" ml="auto">
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
