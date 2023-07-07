import { Button } from '@chakra-ui/react';
import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface shiftBtnProps {
    color?: any;
    bg?: any;
    text: any;
    onClick?: any;
    loading?: any;
}

export const ShiftBtn = ({
    color = 'white',
    bg = 'brand.400',
    text,
    onClick,
    loading,
}: shiftBtnProps) => {
    return (
        <Button
            color={color}
            bgColor={bg}
            borderRadius="5px"
            fontSize=".9rem"
            onClick={onClick}
            isLoading={loading}
            px="2rem"
            spinner={<BeatLoader color="white" size={10} />}
        >
            {text}
        </Button>
    );
};
