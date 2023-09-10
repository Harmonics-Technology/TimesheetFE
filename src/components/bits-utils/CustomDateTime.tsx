import { Box, FormLabel, HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-multi-date-picker';
import TimePicker from 'react-multi-date-picker/plugins/time_picker';

export const CustomDateTime = ({ onChange, value, label }) => {
    return (
        <Box w="full">
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={'.8rem'}
            >
                {label}
            </FormLabel>
            <DatePicker
                containerStyle={{
                    width: '100%',
                }}
                value={value}
                onChange={onChange}
                format="dddd, MMM DD, YYYY - HH:mm:ss"
                plugins={[<TimePicker position="bottom" />]}
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
                                {value}
                            </Text>
                            <Icon as={FaRegCalendarAlt} />
                        </HStack>
                    );
                }}
            />
        </Box>
    );
};
