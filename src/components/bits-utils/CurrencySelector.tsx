import { Box, HStack, Icon, Image, Text, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { TfiAngleDown } from 'react-icons/tfi';

export const CurrencySelector = ({
    selectedCountry,
    currency,
    setSelectedCountry,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <Box>
            <Box borderRadius="3px" border="1px solid #c4c4c4">
                <HStack
                    justify="space-between"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    <Text>{selectedCountry?.name || 'Select Currency'}</Text>
                    <Icon as={TfiAngleDown} />
                </HStack>
            </Box>

            {isOpen && (
                <Box borderRadius="3px" border="1px solid #c4c4c4" mt=".5rem">
                    <VStack>
                        {currency.map((x: any) => (
                            <HStack
                                gap="1rem"
                                onClick={() => setSelectedCountry(x)}
                            >
                                <Image src={x?.flag} w="24px" h="24px" />
                                <Text
                                    fontSize="13px"
                                    color="#263238"
                                >{`${x?.currency} (${x?.name})`}</Text>
                            </HStack>
                        ))}
                    </VStack>
                </Box>
            )}
        </Box>
    );
};
