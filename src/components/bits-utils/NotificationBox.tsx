import { Box, Divider, Flex, Circle, Text } from '@chakra-ui/react';
import React from 'react';
import { NotificationView } from 'src/services';

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
            {data?.data?.value?.length < 1 ? (
                <Text fontSize=".8rem" color="gray.400">
                    No notifications!!!
                </Text>
            ) : (
                data?.data?.value?.map((x: NotificationView) => (
                    <>
                        <Box>
                            <Text
                                fontSize=".6rem"
                                noOfLines={1}
                                mb=".2rem"
                                fontWeight="bold"
                            >
                                {x.title}
                            </Text>
                            <Text fontSize=".7rem" noOfLines={2}>
                                {x.message}
                            </Text>
                            <Flex justify="space-between" align="center">
                                <Text
                                    mb="0"
                                    fontSize=".7rem"
                                    fontWeight="bold"
                                    cursor="pointer"
                                    // onClick={x.isRead ? }
                                    color={x.isRead ? 'gray.300' : 'brand.400'}
                                >
                                    {x.isRead ? 'Read' : 'Mark as Read'}
                                </Text>
                                <Circle
                                    bg={x.isRead ? 'gray.300' : 'brand.400'}
                                    size=".4rem"
                                />
                            </Flex>
                        </Box>
                        <Divider my="1rem" borderColor="gray.300" />
                    </>
                ))
            )}
        </Box>
    );
};
