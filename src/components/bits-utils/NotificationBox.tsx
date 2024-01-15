import {
    Box,
    Divider,
    Flex,
    Circle,
    Text,
    Spinner,
    HStack,
} from '@chakra-ui/react';
import React from 'react';
import { NotificationView } from 'src/services';
import Pagination from './Pagination';
import Loading from './Loading';
import { formatDate } from '@components/generics/functions/formatDate';

export const NotificationBox = ({
    data,
    markAsRead,
    loading,
}: {
    data?: any;
    markAsRead: any;
    loading: any;
}) => {
    const unRead = data?.data?.value?.filter((x) => !x.isRead);

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
            // h="fit-content"
            // fontFamily="'Montserrat', sans-serif"
        >
            <Text fontSize=".8rem" fontWeight="bold" color="black">
                Notifications
            </Text>
            <Divider my="1rem" borderColor="gray.300" />

            {/* <Loading loading={loading} /> */}

            <>
                {data?.data?.value?.length < 1 ? (
                    <Text fontSize=".8rem" color="gray.400">
                        No notifications!!!
                    </Text>
                ) : (
                    unRead?.map((x: NotificationView, i) => (
                        <Box key={i}>
                            <Box>
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    mb=".2rem"
                                >
                                    <Text
                                        fontSize=".6rem"
                                        noOfLines={1}
                                        mb="0"
                                        fontWeight="bold"
                                    >
                                        {x.title}
                                    </Text>
                                    <Circle
                                        bg={x.isRead ? 'gray.300' : 'brand.400'}
                                        size=".4rem"
                                    />
                                </Flex>
                                <Text fontSize=".7rem" noOfLines={2}>
                                    {x.message}
                                </Text>
                                <Flex justify="space-between" align="center">
                                    <HStack>
                                        {loading.id == x?.id ? (
                                            <Spinner size={'sm'} />
                                        ) : (
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
                                                    x.isRead
                                                        ? 'gray.300'
                                                        : 'brand.400'
                                                }
                                            >
                                                {x.isRead
                                                    ? 'Read'
                                                    : 'Mark as Read'}
                                            </Text>
                                        )}
                                    </HStack>
                                    <Text
                                        mb="0"
                                        fontSize=".6rem"
                                        fontWeight="500"
                                        cursor="pointer"
                                        color={
                                            x.isRead ? 'gray.300' : 'gray.400'
                                        }
                                    >
                                        {formatDate(x.dateCreated)}
                                    </Text>
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
