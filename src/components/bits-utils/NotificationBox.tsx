import { Box, Divider, Flex, Circle, Text } from '@chakra-ui/react';
import React from 'react';

export const NotificationBox = ({ data }: { data?: any }) => {
    return (
        <Box
            // pos="absolute"
            w="full"
            bgColor="white"
            boxShadow="md"
            borderRadius="10px"
            right="0"
            bottom="-200%"
            p="1rem .8rem"
            // fontFamily="'Montserrat', sans-serif"
        >
            <Text fontSize=".8rem" fontWeight="bold" color="black">
                Notifications
            </Text>
            <Divider my="1rem" borderColor="gray.300" />
            <Box>
                <Text fontSize=".7rem" noOfLines={2}>
                    Temperod hdehehbkjb scjhbksdncd icjdsk avc ajh kbn oacihbkna
                </Text>
                <Flex justify="space-between" align="center">
                    <Text
                        mb="0"
                        fontSize=".7rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color={'brand.400'}
                    >
                        Mark as Read
                    </Text>
                    <Circle bg={'brand.400'} size=".4rem" />
                </Flex>
            </Box>
            <Divider my="1rem" borderColor="gray.300" />
        </Box>
    );
};
