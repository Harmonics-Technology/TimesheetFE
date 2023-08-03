import { VStack, Text, HStack, Square } from '@chakra-ui/react';
import React from 'react';

const TitleText = ({
    title,
    text,
    color,
    fontSize,
}: {
    title: string;
    text: string | undefined | any;
    color?: any;
    fontSize?: any;
}) => {
    return (
        <VStack spacing=".9rem" align="flex-start">
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
                {color && <Square size=".875rem" bgColor={text} />}
                <Text
                    fontSize=".81rem"
                    color="#8C8C8C"
                    fontWeight="500"
                    mb="0"
                    textTransform="capitalize"
                >
                    {text}
                </Text>
            </HStack>
        </VStack>
    );
};

export default TitleText;
