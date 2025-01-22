import { Button } from '@chakra-ui/react';
import React, { ReactNode } from 'react';
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
    prefix?: ReactNode;
    suffix?: ReactNode;
    outline?: boolean;
    cursor?: any;
}

export const ShiftBtn = ({
    color = 'white',
    bg = 'brand.400',
    border,
    text,
    onClick,
    loading,
    h = '2.1rem',
    fontSize = '.9rem',
    w,
    px = '2rem',
    disabled,
    type = 'button',
    prefix,
    suffix,
    outline,
    cursor,
}: shiftBtnProps) => {
    return (
        <Button
            color={outline ? bg : color}
            bgColor={outline ? color : bg}
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
            cursor={cursor}
        >
            {prefix && prefix} {text} {suffix && suffix}
        </Button>
    );
};
