import { HStack, Text, Icon, Box } from '@chakra-ui/react';
import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

export const CustomDatePicker = ({
    icon,
    date,
    setDate,
    dateRef,
    isVisible,
    setIsVisible,
}: {
    icon?: boolean;
    date: any;
    setDate: any;
    dateRef: any;
    isVisible: boolean;
    setIsVisible: any;
}) => {
    return (
        // <DatePicker
        //     // containerClassName="custom-container"
        //     containerStyle={{
        //         width: '100%',
        //     }}
        //     value={date}
        //     onChange={setDate}
        //     format="hh:mm A"
        //     disableDayPicker
        //     plugins={[<TimePicker hideSeconds />]}
        //     ref={dateRef}
        //     render={(value, openCalendar) => {
        //         return (
        //             <HStack
        //                 w="100%"
        //                 px="1rem"
        //                 h="2.5rem"
        //                 justifyContent="space-between"
        //                 alignItems="center"
        //                 border="1px solid"
        //                 borderColor="gray.300"
        //                 color="gray.500"
        //                 boxShadow="sm"
        //                 borderRadius="0"
        //                 cursor="pointer"
        //                 fontSize=".9rem"
        //                 onClick={(value) => openCalendar(value)}
        //             >
        //                 <Text mb="0" whiteSpace="nowrap">
        //                     {value}
        //                 </Text>
        //                 {icon && <Icon as={FaRegCalendarAlt} />}
        //             </HStack>
        //         );
        //     }}
        // />
        <Box w="full" ref={dateRef} pos="relative">
            <HStack
                w="100%"
                px="1rem"
                h="2.5rem"
                justifyContent="space-between"
                alignItems="center"
                border="1px solid"
                borderColor="gray.300"
                color="gray.500"
                boxShadow="sm"
                borderRadius="0"
                cursor="pointer"
                fontSize=".9rem"
                onClick={() => setIsVisible(!isVisible)}
            >
                <Text mb="0" whiteSpace="nowrap">
                    {date}
                </Text>
                {icon && <Icon as={FaRegCalendarAlt} />}
            </HStack>
            {isVisible && (
                <Box
                    pos="absolute"
                    top="100%"
                    zIndex="100"
                    bgColor="white"
                    w="full"
                    p="0rem 0 1rem"
                    // boxShadow='md'
                >
                    <TimePicker
                        onChange={setDate}
                        value={date}
                        format="hh mm a"
                        disableClock
                        className="timePicker"
                        clearIcon={null}
                    />
                </Box>
            )}
        </Box>
    );
};
