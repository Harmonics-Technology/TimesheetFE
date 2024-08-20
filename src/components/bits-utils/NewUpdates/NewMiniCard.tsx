import { Box, Text } from '@chakra-ui/react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';

export const NewMiniCard = ({ text, count, per, loading }) => {
    return (
        <Box
            w="full"
            h="100px"
            borderRadius="15px"
            bgColor="#ffffff"
            pos="relative"
            border="1px soloid #F4F5F6"
            boxShadow="0 4px 4px rgba(0,0,0,.1)"
            overflow="hidden"
        >
            {loading ? (
                <Skeleton height="100%" count={1}></Skeleton>
            ) : (
                <Box p="18px 19px">
                    <Box>
                        <Text
                            color="#8C8C8C"
                            fontSize="13px"
                            lineHeight="24px"
                            mb="6px"
                        >
                            {text}
                        </Text>
                        <Text
                            color="#2F363A"
                            fontSize="28px"
                            fontWeight={500}
                            lineHeight="24px"
                            pb="7px"
                        >
                            {count}
                        </Text>
                    </Box>
                    <Box
                        bgColor="#4FD1C5"
                        borderRadius="4px"
                        lineHeight="24px"
                        color="white"
                        p="2px 7px"
                        fontSize="12px"
                        pos="absolute"
                        bottom={'15px'}
                        right={'10px'}
                    >
                        {per}%
                    </Box>
                </Box>
            )}
        </Box>
    );
};
