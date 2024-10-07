import { Box, HStack, Text, Icon } from '@chakra-ui/react';
import React from 'react';
import { BiTimeFive } from 'react-icons/bi';
import TimePicker from 'react-time-picker';

export const CustomTime = ({
    timeRef,
    startIsVisible,
    startVisible,
    setTime,
    time,
    w,
}) => {
    return (
        <Box w={w}>
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
    );
};
