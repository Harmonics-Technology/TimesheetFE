import { HStack, Icon, Text } from '@chakra-ui/react';
import useOnClickOutside from '@components/generics/useClickOutside';
import React, { useCallback, useRef } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';

export const CustomDatePick = ({
    date,
    setDate,
    placeholder,
    format = 'dddd, MMM DD, YYYY',
}: {
    date: any;
    setDate: any;
    placeholder?: any;
    format?: string;
}) => {
    const dateRef = useRef<any>();
    const handleDatePickerClose = useCallback(
        () => dateRef.current.closeCalendar(),
        [dateRef],
    );
    useOnClickOutside(dateRef, handleDatePickerClose);
    console.log({ placeholder });
    return (
        <DatePicker
            containerStyle={{
                width: '100%',
            }}
            value={date}
            onChange={setDate}
            ref={dateRef}
            format={format}
            // plugins={[<TimePicker position="right" />]}
            render={(value, openCalendar) => {
                return (
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
                        onClick={(value) => openCalendar(value)}
                    >
                        <Text mb="0" whiteSpace="nowrap">
                            {value || placeholder}
                        </Text>
                        <Icon as={FaRegCalendarAlt} />
                    </HStack>
                );
            }}
        />
    );
};
