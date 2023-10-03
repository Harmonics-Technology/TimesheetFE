import {
    Box,
    HStack,
    Text,
    Icon,
    Flex,
    Button,
    VStack,
    Circle,
} from '@chakra-ui/react';
import React from 'react';

export const CancelServiceBox = ({
    title,
    icon,
    sub,
    minSub,
    maxSub,
    onClick,
    btnText,
}: {
    title: string;
    icon: any;
    sub: string;
    minSub?: string;
    maxSub?: string;
    onClick: any;
    btnText: string;
}) => {
    return (
        <Box
            borderRadius=".9rem"
            border="2px solid"
            borderColor="brand.400"
            p="1.5rem"
            w="100%"
        >
            <VStack
                w="full"
                align="flex-start"
                justify="space-between"
                h="12rem"
            >
                <HStack justify="space-between" w="full">
                    <Text
                        fontSize="1.125rem"
                        fontWeight="500"
                        color="#2d3748"
                        mb="0"
                    >
                        {title}
                    </Text>
                    <Circle
                        size="2rem"
                        border="2px solid"
                        borderColor="brand.400"
                    >
                        <Icon as={icon} color="brand.400" fontSize="1.5rem" />
                    </Circle>
                </HStack>
                <Box>
                    <Text fontSize=".93rem" color="#2d3748" mb=".5rem">
                        {sub}
                    </Text>
                    {minSub && (
                        <Text fontSize=".875rem" color="#8c8c8c" mb="0">
                            {minSub}
                        </Text>
                    )}
                    {maxSub && (
                        <Text
                            fontSize="1.25rem"
                            color="#073367"
                            mb="0"
                            fontWeight="600"
                        >
                            {maxSub}
                        </Text>
                    )}
                </Box>
                <Flex w="full">
                    <Button
                        w="full"
                        h="2.15rem"
                        color="white"
                        bgColor="brand.400"
                        borderRadius=".3rem"
                        fontSize=".875rem"
                        fontWeight={600}
                        onClick={onClick}
                    >
                        {btnText}
                    </Button>
                </Flex>
            </VStack>
        </Box>
    );
};
