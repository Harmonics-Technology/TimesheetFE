import { Box, Circle, HStack, VStack, Text, BoxProps } from '@chakra-ui/react';
import React, { ReactNode } from 'react';

interface IContainerProps {
    bg: string;
    text: string;
    num: any;
    children: ReactNode;
}

export const ContainerBox = ({
    bg,
    text,
    num,
    children,
    ...rest
}: IContainerProps & BoxProps) => {
    return (
        <Box
            bgColor="#f5f5f5"
            borderRadius="16px 16px 0 0"
            w="full"
            p="20px"
            {...rest}
            minH="80vh"
        >
            <VStack w="full" align="flex-start" gap="23px" mb="28px">
                <HStack>
                    <HStack gap="19px">
                        <Circle bgColor={bg} size="8px" gap="8px" />
                        <Text fontWeight={500} color="#0d062d">
                            {text}
                        </Text>
                    </HStack>
                    <Circle
                        size="20px"
                        fontSize="12px"
                        color="#625f6d"
                        fontWeight={500}
                        bgColor="#E0E0E0"
                    >
                        {num}
                    </Circle>
                </HStack>
                <Box h="3px" bgColor={bg} w="full" />
            </VStack>
            {children}
        </Box>
    );
};
