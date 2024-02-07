import { HStack, Text } from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import React from 'react';

export const SingleConfirmationText = ({
    title,
    sub,
    color,
    fw,
    price,
}: {
    title: string;
    sub: any;
    color?: any;
    fw?: any;
    price?: any;
}) => {
    return (
        <HStack
            justify="space-between"
            align="center"
            w="full"
            borderBottom=" 0.5px dashed #A6A6A6"
            h="46px"
        >
            <Text fontWeight={500} fontSize="14px" color="#1e1e1e">
                {title}
            </Text>
            <Text
                fontSize="14px"
                color={color || '#696969'}
                fontWeight={fw || 400}
            >
                {price ? CAD(sub) : sub}
            </Text>
        </HStack>
    );
};
