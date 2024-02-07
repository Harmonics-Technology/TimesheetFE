import { Box, Button, Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import React from 'react';

export const SubCard = ({ title, amount, desc, onClick, bg }) => {
    return (
        <Box borderRadius="8px" overflow="hidden" border="1px solid #C2CFE0">
            <Flex
                height="40px"
                w="full"
                p="1.5rem"
                align="center"
                bg={bg}
                color="white"
            >
                {title}
            </Flex>
            <VStack
                p="1.5rem 1.5rem"
                justify="space-between"
                h="190px"
                align="flex-start"
            >
                <Box>
                    <HStack mb=".5rem">
                        <Text fontSize="22px" fontWeight={500} color="#252f40">
                            {CAD(amount)}
                        </Text>
                        <Text fontSize="18px" fontWeight={400} color="#8c8c8c">
                            /month
                        </Text>
                    </HStack>
                    <Text fontSize="12px" fontWeight={400} color="#696969">
                        {desc}
                    </Text>
                </Box>
                <Box w="full">
                    <Button
                        onClick={() => onClick({ title, amount, desc })}
                        borderRadius="5px"
                        variant="outline"
                        border="1px solid"
                        borderColor="brand.400"
                        fontSize="12px"
                        color="brand.400"
                        h="30px"
                        w="full"
                    >
                        Select Plan
                    </Button>
                </Box>
            </VStack>
        </Box>
    );
};
