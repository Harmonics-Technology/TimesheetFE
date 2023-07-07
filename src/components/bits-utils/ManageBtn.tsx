import { Button } from '@chakra-ui/react';
import React from 'react';

export const ManageBtn = ({
    bg,
    onClick,
    btn,
    disabled,
    isLoading,
}: {
    bg: string;
    onClick?: any;
    btn: string;
    disabled?: boolean;
    isLoading?: boolean;
}) => {
    return (
        <Button
            h="1.5rem"
            w="3.75rem"
            borderRadius="5px"
            color="#ebeff2"
            fontSize="0.62rem"
            fontWeight="700"
            isLoading={isLoading}
            bgColor={bg}
            onClick={onClick}
            // disabled={disabled}
        >
            {btn}
        </Button>
    );
};
