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
    disabled?: any;
    type?: 'button' | 'submit' | 'reset' | undefined;
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
    disabled,
    type = 'button',
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
            isDisabled={disabled}
            type={type}
            spinner={<BeatLoader color="white" size={10} />}
        >
            {text}
        </Button>
    );
};
