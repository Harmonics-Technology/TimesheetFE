import { HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import React from 'react';

export const IconTray = ({
    color,
    icon,
    text,
    onClick,
    isLoading,
}: {
    color: string;
    icon: any;
    text: string;
    onClick?: any;
    isLoading?: boolean;
}) => {
    return (
        <HStack color={color} cursor="pointer" onClick={onClick}>
            {isLoading ? (
                <Spinner size="sm" />
            ) : (
                <Icon fontWeight="700" fontSize=".75rem" as={icon} />
            )}
            <Text fontWeight="700" fontSize=".75rem" textTransform="uppercase">
                {text}
            </Text>
        </HStack>
    );
};
