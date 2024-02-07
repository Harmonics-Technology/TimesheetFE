import { Button } from '@chakra-ui/react';
import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface shiftBtnProps {
    color?: any;
    bg?: any;
    border?: any;
    text: any;
    onClick?: any;
    loading?: any;
    h?: any;
    fontSize?: any;
    w?: any;
    px?: any;
}

export const ShiftBtn = ({
    color = 'white',
    bg = 'brand.400',
    border,
    text,
    onClick,
    loading,
    h,
    fontSize = '.9rem',
    w,
    px = '2rem',
}: shiftBtnProps) => {
    return (
        <Button
            color={color}
            bgColor={bg}
            borderRadius="5px"
            fontSize={fontSize}
            onClick={onClick}
            isLoading={loading}
            border={border}
            fontWeight={500}
            px={px}
            w={w}
            h={h}
            spinner={<BeatLoader color="white" size={10} />}
        >
            {text}
        </Button>
    );
};
