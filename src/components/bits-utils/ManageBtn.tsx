import { Button } from '@chakra-ui/react';
import React from 'react';

export const ManageBtn = ({
    bg,
    onClick,
    btn,
    disabled,
    isLoading,
    w = '3.75rem',
    h = '1.5rem',
    fontSize = '0.62rem',
    color = '#ebeff2',
    border,
}: {
    bg: string;
    onClick?: any;
    btn: string;
    disabled?: boolean;
    isLoading?: boolean;
    w?: any;
    h?: any;
    fontSize?: any;
    color?: any;
    border?: any;
}) => {
    return (
        <Button
            h={h}
            w={w}
            borderRadius="5px"
            border={border}
            color={color}
            fontSize={fontSize}
            fontWeight="700"
            isLoading={isLoading}
            bgColor={bg}
            onClick={onClick}
            isDisabled={disabled}
            _hover={{
                bgColor: bg,
            }}
        >
            {btn}
        </Button>
    );
};
