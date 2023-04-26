import React from 'react';
import { Text } from '@chakra-ui/react';

export const SingleText = ({ text }) => {
    return (
        <Text mb="0" fontSize=".9rem" fontWeight="500" lineHeight="150%">
            {text}
        </Text>
    );
};
