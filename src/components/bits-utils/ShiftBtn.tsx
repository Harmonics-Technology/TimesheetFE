import { Button } from '@chakra-ui/react';
import React from 'react';

interface shiftBtnProps {
    color?: any;
    bg?: any;
    text: any;
    onClick?: any;
}

export const ShiftBtn = ({
    color = 'white',
    bg = 'brand.400',
    text,
    onClick,
}: shiftBtnProps) => {
    return (
        <Button
            color={color}
            bgColor={bg}
            borderRadius="5px"
            fontSize=".9rem"
            onClick={onClick}
        >
            {text}
        </Button>
    );
};
