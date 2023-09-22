import { Box, Flex, Link, Text } from '@chakra-ui/react';
import React from 'react';
import { TableCard } from './TableCard';

export const TableBox = ({
    title,
    url,
    children,
    tableHead,
}: {
    title: string;
    url?: string;
    children: any;
    tableHead: string[];
}) => {
    return (
        <Flex
            borderRadius=".6rem"
            border="0.5px solid #C2CFE0"
            bgColor="white"
            flexDir="column"
            justify="space-between"
        >
            <Box>
                <Text
                    fontSize=".87rem"
                    fontWeight="600"
                    color="#2D3748"
                    mb="0"
                    p="1rem"
                >
                    {title}
                </Text>
                <TableCard tableHead={tableHead}>{children}</TableCard>
            </Box>
            <Flex justify="flex-end" p="1rem">
                <Link href={url}>
                    <Text color="brand.400" fontSize=".75rem" fontWeight="500">
                        View more
                    </Text>
                </Link>
            </Flex>
        </Flex>
    );
};
