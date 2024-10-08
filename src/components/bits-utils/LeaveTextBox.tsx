import { HStack, Text } from '@chakra-ui/react';
import React from 'react';

export const LeaveTextBox = ({
    title,
    value,
    suffix,
}: {
    title: string;
    value?: any;
    suffix?: any;
}) => {
    return (
        <HStack fontSize="13px" gap=".7rem">
            <Text color="#263238" fontWeight={400}>
                {title}
            </Text>
            {value && (
                <Text color="#6d7eac" fontWeight={400}>
                    <span
                        style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            paddingRight: '.2rem',
                        }}
                    >
                        {value}
                    </span>
                    <span>{suffix}</span>
                </Text>
            )}
        </HStack>
    );
};
