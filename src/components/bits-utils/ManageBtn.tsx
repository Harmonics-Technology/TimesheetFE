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
}: {
    bg: string;
    onClick?: any;
    btn: string;
    disabled?: boolean;
    isLoading?: boolean;
    w?: any;
    h?: any;
}) => {
    return (
        <Button
            h={h}
            w={w}
            borderRadius="5px"
            color="#ebeff2"
            fontSize="0.62rem"
            fontWeight="700"
            isLoading={isLoading}
            bgColor={bg}
            onClick={onClick}
            isDisabled={disabled}
        >
            {btn}
        </Button>
    );
};
