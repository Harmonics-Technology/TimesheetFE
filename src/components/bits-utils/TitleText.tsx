import { VStack, Text, HStack, Square } from '@chakra-ui/react';
import validateEmail from '@components/generics/functions/validateEmail';
import React from 'react';
import parser from 'react-html-parser';

const TitleText = ({
    title,
    text,
    color,
    fontSize,
    gap = '.9rem',
}: {
    title: string;
    text: string | undefined | any;
    color?: any;
    fontSize?: any;
    gap?: any;
}) => {
    return (
        <VStack spacing={gap} align="flex-start">
            <Text
                fontSize={fontSize || '.875rem'}
                color="#1b1d21"
                fontWeight="500"
                mb="0"
                textTransform="capitalize"
            >
                {title}
            </Text>
            <HStack align="center">
                {color && <Square size=".875rem" bgColor={color} />}
                <Text
                    fontSize=".81rem"
                    color="#8C8C8C"
                    fontWeight="500"
                    mb="0"
                    textTransform={
                        validateEmail(text) ? 'lowercase' : 'capitalize'
                    }
                >
                    {parser(text)}
                </Text>
            </HStack>
        </VStack>
    );
};

export default TitleText;

export const TitleLabel = ({
    fontSize,
    label,
}: {
    fontSize?: string;
    label: string;
}) => {
    return (
        <Text
            fontSize={fontSize || '.875rem'}
            color="#1b1d21"
            fontWeight="600"
            mb=".8rem"
            textTransform="capitalize"
        >
            {label}
        </Text>
    );
};

export const TitleDesc = ({
    title,
    text,
    fontSize,
    gap = '0rem',
    active,
}: {
    title: string;
    text?: string | undefined | any;
    color?: any;
    fontSize?: any;
    gap?: any;
    active?: any;
}) => {
    return (
        <VStack spacing={gap} align="flex-start">
            <Text
                fontSize={fontSize || '14px'}
                color="#696969"
                fontWeight="400"
                mb="0"
                textTransform="capitalize"
            >
                {title}
            </Text>
            <HStack>
                <Text
                    fontSize="12px"
                    color="#696969"
                    fontWeight="300"
                    mb="0"
                    fontStyle="italic"
                >
                    {parser(
                        text ||
                            `(Notifications are now ${
                                active
                                    ? 'ON You’ll receive updates.'
                                    : 'OFF You won’t receive updates.'
                            } )`,
                    )}
                </Text>
            </HStack>
        </VStack>
    );
};
