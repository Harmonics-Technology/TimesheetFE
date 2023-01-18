import { Box, Divider, Flex, Circle, Text, Spinner } from '@chakra-ui/react';
import React from 'react';
import { NotificationView } from 'src/services';
import Pagination from './Pagination';
import Loading from './Loading';

export const NotificationBox = ({
    data,
    markAsRead,
    loading,
}: {
    data?: any;
    markAsRead: any;
    loading: boolean;
}) => {
    console.log({ data });
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

            <Loading loading={loading} />

            <>
                {data?.data?.value?.length < 1 ? (
                    <Text fontSize=".8rem" color="gray.400">
                        No notifications!!!
                    </Text>
                ) : (
                    data?.data?.value?.map((x: NotificationView, i) => (
                        <Box key={i}>
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
                                        onClick={
                                            x.isRead
                                                ? undefined
                                                : () => markAsRead(x.id)
                                        }
                                        color={
                                            x.isRead ? 'gray.300' : 'brand.400'
                                        }
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
                        </Box>
                    ))
                )}
            </>

            {/* <Pagination data={data} /> */}
        </Box>
    );
};
