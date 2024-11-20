import { HStack, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { BsFillInfoSquareFill } from 'react-icons/bs';

export const PaymentScheduleInfo = () => {
    return (
        <HStack
            bgColor="#f1f4f8"
            p="6px 11px"
            gap="8px"
            color="#6A7F9D"
            align="flex-start"
            my="26px"
            w="90%"
        >
            <Icon as={BsFillInfoSquareFill} fontSize="13px" mt="3px" />
            <Text fontSize="11px" fontWeight={400}>
                Configure the <b>Payment Date Offset</b> to enable seamless use
                of Payroll and Invoice features. This is required to set the
                payment process date but is optional for users not utilizing
                these features.
            </Text>
        </HStack>
    );
};
