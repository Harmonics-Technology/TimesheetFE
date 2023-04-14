import { Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { IconPickerItem } from 'react-icons-picker';

interface detailsProps {
    label: any;
    content: any;
    icon?: any;
}

export const SingleDetailsInfo = ({ label, content, icon }: detailsProps) => {
    return (
        <Box w="full">
            <Text fontSize=".8rem" fontWeight="600" color="gray.600">
                {label}
            </Text>
            <Flex
                align="center"
                border="1px solid"
                borderColor="gray.100"
                borderRadius="4px"
                p="1rem"
                gap=".5rem"
            >
                {icon && <IconPickerItem value={icon} color="#2EAFA3" />}
                <Text mb="0">{content}</Text>
            </Flex>
        </Box>
    );
};
