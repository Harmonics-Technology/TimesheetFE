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
