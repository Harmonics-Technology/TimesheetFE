import {
    Box,
    Flex,
    HStack,
    Icon,
    Image,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import { getCurrencyName } from '@components/generics/functions/getCurrencyName';
import React, { useState } from 'react';
import { TfiAngleDown } from 'react-icons/tfi';

export const CurrencySelector = ({
    selectedCountry,
    currency,
    setSelectedCountry,
    searchable,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [newData, setNewData] = useState(currency);
    const search = (e: any) => {
        const filteredData = currency?.filter((x) =>
            x.currency?.toLowerCase().includes(e.target.value.toLowerCase()),
        );

        setNewData(filteredData);
    };
    return (
        <Box w="full">
            <Flex
                borderRadius="3px"
                border="1px solid #c4c4c4"
                px="1rem"
                h="3rem"
                w="full"
                align="center"
            >
                <HStack
                    justify="space-between"
                    w="full"
                    cursor="pointer"
                    onClick={() => setIsOpen((prev) => !prev)}
                >
                    {selectedCountry ? (
                        <HStack gap="1rem">
                            <Box w="24px" h="24px">
                                <Image
                                    src={selectedCountry?.flag}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                />
                            </Box>
                            <Text fontSize="13px" color="#263238">
                                {`${
                                    selectedCountry?.currency
                                } (${getCurrencyName(
                                    selectedCountry.currency,
                                )})`}
                            </Text>
                        </HStack>
                    ) : (
                        <Text fontSize="13px" color="#263238">
                            Select Currency
                        </Text>
                    )}

                    <Icon as={TfiAngleDown} />
                </HStack>
            </Flex>

            {isOpen && (
                <Box
                    borderRadius="3px"
                    border="1px solid #c4c4c4"
                    mt=".5rem"
                    p="0 0 .5rem"
                    h="15rem"
                    overflow="auto"
                >
                    <VStack align="flex-start" gap="0">
                        <>
                            {searchable && (
                                <Input
                                    placeholder="Search"
                                    fontSize=".7rem"
                                    // border="1px solid #e5e5e5"
                                    borderRadius="0"
                                    pos="sticky"
                                    top="0"
                                    onChange={(e) => search(e)}
                                    bgColor="white"
                                    w="full"
                                    zIndex="9"
                                    borderBottom="1px solid #e5e5e5"
                                />
                            )}
                            {newData
                                .sort((a, b) =>
                                    a?.currency?.localeCompare(b?.currency),
                                )
                                .map((x: any) => (
                                    <HStack
                                        gap="1rem"
                                        onClick={() => {
                                            setSelectedCountry(x);
                                            setIsOpen((prev) => !prev);
                                        }}
                                        py=".5rem"
                                        w="full"
                                        px="1rem"
                                        cursor="pointer"
                                        _hover={{
                                            bgColor: 'gray.300',
                                        }}
                                    >
                                        <Box w="24px" h="24px">
                                            <Image
                                                src={x?.flag}
                                                w="100%"
                                                h="100%"
                                                objectFit="cover"
                                            />
                                        </Box>
                                        <Text
                                            fontSize="13px"
                                            color="#263238"
                                        >{`${x?.currency} (${
                                            getCurrencyName(x.currency) ||
                                            x.name
                                        })`}</Text>
                                    </HStack>
                                ))}
                        </>
                    </VStack>
                </Box>
            )}
        </Box>
    );
};
