import {
    Alert,
    Flex,
    Box,
    HStack,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Button,
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

interface alertProps {
    title?: string;
    desc: string;
    link?: boolean;
    btn?: any;
    url?: any;
    loading?: any;
    onClick?: any;
    color?: any;
    btnLink?: any
}

export const ActivateUserAlert = ({
    title,
    desc,
    link,
    btn,
    url,
    loading,
    onClick,
    btnLink,
    color = 'info',
}: alertProps) => {
    return (
        <Alert status={color} variant={['top-accent', 'left-accent']} mb="1rem">
            <Flex
                justify="space-between"
                w="full"
                align="center"
                flexDir={['column', 'row']}
            >
                <Box>
                    {title && (
                        <HStack>
                            <AlertIcon />
                            <AlertTitle>{title}</AlertTitle>
                        </HStack>
                    )}
                    <AlertDescription textAlign="center" as="p">
                        {desc}
                    </AlertDescription>
                </Box>
                {link && (
                    <Link passHref href={url}>
                        <Button ml="auto">{btnLink}</Button>
                    </Link>
                )}
                {btn && (
                    <Button
                        ml="auto"
                        isLoading={loading}
                        onClick={onClick}
                        borderRadius="25px"
                    >
                        {btn}
                    </Button>
                )}
            </Flex>
        </Alert>
    );
};
