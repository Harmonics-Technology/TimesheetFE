import { Button, Icon } from '@chakra-ui/react';
import React from 'react';

interface shiftBtnProps {
    name: any;
    icon?: any;
    onClick?: any;
}

export const ShiftCustomBtn = ({ name, icon, onClick }: shiftBtnProps) => {
    return (
        <Button
            fontSize="12px"
            bgColor={
                name == 'ACTIVE' || name == 'APPROVED' || name == 'Approve'
                    ? 'brand.400'
                    : name == 'PENDING'
                    ? 'brand.700'
                    : name == 'Decline' || name == 'SUBMITTED'
                    ? '#FF5B79'
                    : name == 'INVOICED'
                    ? '#28a3ef'
                    : name == 'In progress'
                    ? 'gray.400'
                    : 'red'
            }
            borderRadius="5px"
            color="white"
            fontWeight="bold"
            padding=".2rem 1rem"
            width="fit-content"
            cursor="pointer"
            textTransform="capitalize"
            boxShadow="0px 3.5px 5.5px rgba(0, 0, 0, 0.02)"
            onClick={onClick}
        >
            {icon && <Icon as={icon} pr=".5rem" />} {name || 'Inactive'}
        </Button>
    );
};
