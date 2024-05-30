import { Box, HStack, Text, VStack } from '@chakra-ui/react';
import shadeColor from '@components/generics/functions/shadeColor';
import React from 'react';

interface IOperationProps {
    text: string;
    bg: string;
    title: any;
    sub: any;
    isMine?: boolean | null | undefined;
    subBtm: any;
    onClick: any;
    onDragStart: any;
    onDragEnd: any;
}

export const OperationCard = ({
    text,
    bg,
    title,
    sub,
    isMine,
    subBtm,
    onClick,
    onDragStart,
    onDragEnd,
}: IOperationProps) => {
    return (
        <Box
            borderRadius="16px"
            bgColor="white"
            p="17px 20px"
            onClick={onClick}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            w="full"
            h="177px"
        >
            <HStack
                borderRadius="4px"
                bgColor={shadeColor(bg, '.2')}
                color={bg}
                fontSize="12px"
                fontWeight={500}
                justify="center"
                h="23px"
                px="1rem"
                w="fit-content"
                textTransform="capitalize"
                mb="7px"
            >
                <Text>{text}</Text>
            </HStack>
            <VStack
                align="flex-start"
                w="full"
                h="115px"
                justify="space-between"
            >
                <VStack gap="7px" align="flex-start" w="full">
                    <Text
                        fontWeight={600}
                        color="#0d062d"
                        fontSize="18px"
                        noOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text
                        fontWeight={400}
                        color="#787486"
                        fontSize="12px"
                        noOfLines={2}
                    >
                        {sub}
                    </Text>
                </VStack>
                <HStack
                    justify={isMine ? 'space-between' : 'flex-end'}
                    w="full"
                >
                    {isMine && (
                        <Text fontWeight={500} color="#787486" fontSize="12px">
                            My Task
                        </Text>
                    )}
                    <Text fontWeight={400} color="#787486" fontSize="12px">
                        {subBtm}
                    </Text>
                </HStack>
            </VStack>
        </Box>
    );
};
