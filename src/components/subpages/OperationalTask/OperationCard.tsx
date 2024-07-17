import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';
import shadeColor from '@components/generics/functions/shadeColor';
import React from 'react';
import { StrippedUserView } from 'src/services';

interface IOperationProps {
    text: string;
    bg: string;
    title: any;
    sub: any;
    user?: StrippedUserView;
    subBtm: any;
    onClick: any;
    onDragStart: any;
    onDragEnd: any;
    assignees?: any;
}

export const OperationCard = ({
    text,
    bg,
    title,
    sub,
    user,
    subBtm,
    onClick,
    onDragStart,
    onDragEnd,
    assignees,
}: IOperationProps) => {
    return (
        <Box
            borderRadius="16px"
            bgColor="white"
            p="10px 15px"
            onClick={onClick}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            w="full"
            h="190px"
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
                h="135px"
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
                <HStack justify={'space-between'} w="full">
                    <Text
                        fontWeight={500}
                        color="#787486"
                        fontSize="12px"
                        noOfLines={2}
                    >
                        Created by <br /> {user?.fullName}
                    </Text>
                    <HStack gap="0">
                        {assignees?.slice(0, 3).map((x: any, i: any) => (
                            <Avatar
                                key={x.id}
                                size={'sm'}
                                name={x?.fullName as string}
                                border="1px solid white"
                                transform={`translateX(${-i * 10}px)`}
                            />
                        ))}
                        {assignees?.length > 3 && (
                            <Text fontSize="0.75rem" color="#455A64">
                                + {assignees?.length - 3}
                            </Text>
                        )}
                    </HStack>
                </HStack>
                <HStack justify={'space-between'} w="full">
                    {/* {isMine && ( */}

                    {/* )} */}
                    <Text fontWeight={400} color="#787486" fontSize="12px">
                        {subBtm}
                    </Text>
                </HStack>
            </VStack>
        </Box>
    );
};
