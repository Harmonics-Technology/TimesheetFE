import { Box, FormLabel, HStack, Icon, Text } from '@chakra-ui/react';
import useComponentVisible from '@components/generics/useComponentVisible';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { BiTimeFive } from 'react-icons/bi';

import TimePicker from 'react-time-picker';
import { CustomDatePick } from './CustomDatePick';
// import TimePicker from 'react-multi-date-picker/plugins/time_picker';

export const CustomDateTime = ({
    onChange,
    value,
    label,
    useEnd,
    placeholder,
    yearOnly,
}: {
    onChange: any;
    value: any;
    label: any;
    useEnd: any;
    placeholder?: any;
    yearOnly?: boolean;
}) => {
    const {
        ref: timeRef,
        isComponentVisible: startVisible,
        setIsComponentVisible: startIsVisible,
    } = useComponentVisible(false);

    const newValue = moment(value).format('YYYY-MM-DD HH:mm');
    const [date, setDate] = useState<any>(value);
    // console.log({ value, date });
    // new DateObject(newValue.split(' ')[0]) || new DateObject(),
    const [time, setTime] = useState<any>(
        newValue?.split(' ')[1] || moment().format('HH:mm'),
    );

    const newDate = date ? date.format('YYYY-MM-DD') : undefined;
    //

    useEffect(() => {
        onChange(newDate ? newDate + ' ' + time : undefined);
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
                    <CustomDatePick
                        date={date}
                        setDate={setDate}
                        placeholder={placeholder}
                        onlyYear={yearOnly}
                    />
                </Box>

                {!useEnd && (
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
                )}
            </HStack>
        </Box>
    );
};
