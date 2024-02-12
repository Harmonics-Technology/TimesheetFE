import { Box, FormLabel, HStack, Icon, Image, Text } from '@chakra-ui/react';
import React from 'react';
import { GrSecure } from 'react-icons/gr';

export const CardField = ({
    data,
    label,
    fontSize = '1rem',
    icon = false,
    border = '5px solid #F5F5F5',
    p = '1.7rem',
    br = '.7rem',
}: {
    data: any;
    label?: any;
    fontSize?: any;
    icon?: boolean;
    border?: any;
    p?: any;
    br?: any;
}) => {
    return (
        <Box>
            {label && (
                <FormLabel
                    htmlFor={label}
                    textTransform="capitalize"
                    width="fit-content"
                    fontSize={fontSize}
                >
                    {label}
                </FormLabel>
            )}
            <Box borderRadius={br} border={border} p={p} bgColor="white">
                <HStack spacing=".9rem">
                    {/* "/assets/mastercard.png" */}
                    <Box h="1.5rem" overflow="hidden">
                        <Image
                            src={
                                data?.brand == 'mastercard'
                                    ? '/assets/mastercard.png'
                                    : data?.brand == 'visa'
                                    ? '/assets/visa.png'
                                    : data?.brand == 'verve'
                                    ? '/assets/verve.png'
                                    : '/assets/card.png'
                            }
                            h="full"
                            w="auto"
                        />
                    </Box>
                    {Array(3)
                        .fill(3)
                        .map((_) => (
                            <Text
                                fontWeight="600"
                                color="#252f40"
                                fontSize={fontSize}
                                fontFamily="Open Sans"
                            >
                                ****
                            </Text>
                        ))}
                    <Text
                        fontWeight="600"
                        color="#252f40"
                        fontSize={fontSize}
                        fontFamily="Open Sans"
                    >
                        {data?.lastFourDigit}
                    </Text>
                    {icon && (
                        <Icon
                            fontWeight="700"
                            fontSize={fontSize}
                            as={GrSecure}
                            ml="1rem !important"
                            cursor="pointer"
                        />
                    )}
                </HStack>
            </Box>
        </Box>
    );
};
