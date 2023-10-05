import { Box, FormLabel, HStack, Icon, Text } from '@chakra-ui/react';
import useOnClickOutside from '@components/generics/useClickOutside';
import useComponentVisible from '@components/generics/useComponentVisible';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BiTimeFive } from 'react-icons/bi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import TimePicker from 'react-time-picker';
import { CustomDatePick } from './CustomDatePick';
// import TimePicker from 'react-multi-date-picker/plugins/time_picker';

export const CustomDateTime = ({ onChange, value, label, useEnd }) => {
    const {
        ref: timeRef,
        isComponentVisible: startVisible,
        setIsComponentVisible: startIsVisible,
    } = useComponentVisible(false);

    const newValue = moment(value).format('YYYY-MM-DD HH:mm');
    const [date, setDate] = useState<any>();
    // new DateObject(newValue.split(' ')[0]) || new DateObject(),
    const [time, setTime] = useState<any>(
        newValue?.split(' ')[1] || moment().format('HH:mm'),
    );

    const newDate = date?.format('YYYY-MM-DD');
    //

    useEffect(() => {
        onChange(newDate + 'T' + time);
    }, [date, time]);
    return (
        <Box w="full">
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={'.8rem'}
            >
                {label}
            </FormLabel>
            <HStack gap="2rem">
                <Box w={useEnd ? '100%' : '60%'}>
                    <CustomDatePick date={date} setDate={setDate} />
                </Box>

                {
                    !useEnd && (
                        <Box w="40%">
                    <Box w="full" ref={timeRef} pos="relative">
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
                            onClick={() => startIsVisible(!startVisible)}
                        >
                            <Text mb="0" whiteSpace="nowrap">
                                {time}
                            </Text>
                            <Icon as={BiTimeFive} />
                        </HStack>
                        {startVisible && (
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
                                    onChange={setTime}
                                    value={time}
                                    format="hh mm a"
                                    disableClock
                                    className="timePicker"
                                    clearIcon={null}
                                />
                            </Box>
                        )}
                    </Box>
                </Box>
                    )
                }

                
            </HStack>
        </Box>
    );
};
