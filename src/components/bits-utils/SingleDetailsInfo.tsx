import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { IconPickerItem } from 'react-icons-picker';

interface detailsProps {
    label: any;
    content: any;
    icon?: any;
}

export const SingleDetailsInfo = ({ label, content, icon }: detailsProps) => {
    return (
        <Flex w="full" align="center" justify="space-between" h="fit-content">
            <Text fontSize=".9rem" fontWeight="600" color="gray.600" mb="0">
                {label}:
            </Text>
            <Flex
                align="center"
                // border="1px solid"
                // borderColor="gray.100"
                // borderRadius="4px"
                // p="1rem"
                // gap=".5rem"
                fontSize=".7rem"
            >
                {icon && (
                    <Box
                        p=".2rem .5rem"
                        borderRadius="25px"
                        bgColor="brand.700"
                        color="white"
                        cursor="grab"
                        fontSize=".7rem"
                        textTransform="capitalize"
                    >
                        {icon.toLowerCase()}
                    </Box>
                )}
                <Text mb="0">{content}</Text>
            </Flex>
        </Flex>
    );
};
