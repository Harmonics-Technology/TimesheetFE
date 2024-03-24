import { HStack, Text, Image } from '@chakra-ui/react';
import { getCurrencyName } from '@components/generics/functions/getCurrencyName';
import React from 'react';

export const CurrencyTag = ({
    currency,
    label,
    flag,
}: {
    currency: any;
    label: string;
    flag?: any;
}) => {
    return (
        <HStack align="center" color="#263238" fontSize=".8rem">
            <Text>{label} </Text>
            <HStack>
                {flag && <Image src={flag} w="24px" h="24px" />}
                <Text fontWeight={600}>{`${currency} (${getCurrencyName(
                    currency,
                )})`}</Text>
            </HStack>
        </HStack>
    );
};
