import { Box, Circle, Flex, Text, Icon } from '@chakra-ui/react';
import { CAD, CUR } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import React from 'react';

export const MiniCards = ({
    value,
    title,
    color,
    icon,
    isPrice,
}: {
    value: number | undefined | null;
    title: string;
    color: string;
    icon: any;
    isPrice?: boolean;
}) => {
    return (
        <Flex
            justify="space-between"
            p="1.5rem 1.2rem"
            bgColor="white"
            borderRadius=".62rem"
            border=" 0.5px solid #C2CFE0"
            align="center"
            h="6.5rem"
        >
            <Box>
                <Text fontSize="1.5rem" fontWeight="600" color="black" mb="0">
                    {isPrice ? CAD(value) : CUR(value)}
                </Text>
                <Text fontSize=".81rem" color="#8c8c8c" mb="0">
                    {title}
                </Text>
            </Box>
            <Circle size="3rem" bgColor={shadeColor(color, 0.1)}>
                <Icon as={icon} color={color} fontSize="1.5rem" />
            </Circle>
        </Flex>
    );
};
