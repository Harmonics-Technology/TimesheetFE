import { Box, Circle, Flex, Text, Icon, HStack } from '@chakra-ui/react';
import { CAD, CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';
import shadeColor from '@components/generics/functions/shadeColor';
import React, { useState } from 'react';
import { LiaAngleDownSolid } from 'react-icons/lia';

export const MiniCards = ({
    value,
    title,
    color,
    icon,
    isPrice,
    setBudget,
    budget,
    allBudget,
}: {
    value: number | undefined | null;
    title: string;
    color: string;
    icon: any;
    isPrice?: boolean;
    setBudget?: any;
    budget?: any;
    allBudget?: any;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const hasBudget = allBudget && allBudget?.length > 1;
    return (
        <Box pos="relative">
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
                    <Box pos="relative">
                        <HStack
                        // onClick={
                        //     hasBudget
                        //         ? () => setIsOpen((prev) => !prev)
                        //         : () => void 0
                        // }
                        >
                            <Text
                                fontSize="1.5rem"
                                fontWeight="600"
                                color="black"
                                mb="0"
                                cursor={hasBudget ? 'pointer' : 'default'}
                            >
                                {hasBudget
                                    ? `${
                                          getCurrencySymbol(budget?.currency) ??
                                          '$'
                                      } ${Round(value)}`
                                    : isPrice
                                    ? CAD(Round(value))
                                    : CUR(Round(value))}
                            </Text>
                            {/* {hasBudget && <Icon as={LiaAngleDownSolid} />} */}
                        </HStack>
                        {isOpen && (
                            <Box
                                pos="absolute"
                                bgColor="white"
                                py=".3rem"
                                // bottom={0}
                                borderRadius="6px"
                                boxShadow="sm"
                            >
                                {allBudget?.map((x) => (
                                    <Text
                                        fontSize="1rem"
                                        fontWeight="600"
                                        color="black"
                                        mb="0"
                                        p=".3rem 1rem"
                                        cursor="pointer"
                                        w="full"
                                        onClick={() => {
                                            setBudget(x);
                                            setIsOpen((prev) => !prev);
                                        }}
                                        _hover={{
                                            bgColor: 'gray.100',
                                        }}
                                    >
                                        {x?.currency || 'N'}
                                    </Text>
                                ))}
                            </Box>
                        )}
                    </Box>
                    <Text fontSize=".81rem" color="#8c8c8c" mb="0">
                        {title}
                    </Text>
                </Box>
                <Circle size="3rem" bgColor={shadeColor(color, 0.1)}>
                    <Icon as={icon} color={color} fontSize="1.5rem" />
                </Circle>
            </Flex>
        </Box>
    );
};
