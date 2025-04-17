import { Box, Circle, Flex, HStack, Text } from '@chakra-ui/react';
import { ChartLegend } from '@components/bits-utils/ChartLegend';
import LineChart from '@components/bits-utils/Charts/LineChart';
import React from 'react';

export const ChartLargeCard = ({
    title,
    sub,
    children,
    legend,
    fs,
    fsb,
    isFlex,
}: {
    title: string;
    sub?: string;
    children: any;
    legend?: any;
    fs?: any;
    fsb?: any;
    isFlex?: boolean;
}) => {
    return (
        <Flex
            p="1.5rem 1.2rem"
            bgColor="white"
            borderRadius=".62rem"
            border=" 0.5px solid #C2CFE0"
            align="center"
            justify="flex-start"
        >
            <Box textAlign="left" w="full">
                <HStack
                    justify="space-between"
                    align={isFlex ? 'flex-start' : 'flex-end'}
                    flexDir={isFlex ? 'column' : 'row'}
                >
                    <Box>
                        <Text
                            fontSize={fs || '1.125rem'}
                            fontWeight="600"
                            color="#2D3748"
                            mb="0"
                        >
                            {title}
                        </Text>
                        {sub && (
                            <Text
                                fontSize={fsb || '.875rem'}
                                fontWeight="400"
                                color="#696969"
                                mb="0"
                            >
                                {sub}
                            </Text>
                        )}
                    </Box>
                    <HStack spacing="1rem">
                        {legend &&
                            legend.map((x, i) => (
                                <ChartLegend
                                    text={x.text}
                                    color={x.color}
                                    size=".75rem"
                                    key={i}
                                />
                            ))}
                    </HStack>
                </HStack>
                <Box h="15rem" mt="1rem" w="full">
                    {children}
                </Box>
            </Box>
        </Flex>
    );
};
