import React from 'react';
import { Box, Text, Link } from '@chakra-ui/react';

const NotFoundPage = () => {
    return (
        <Box h="80vh" pos="relative">
            <Box
                maxW="560px"
                w="full"
                lineHeight="1.1"
                p={['110px 15px 0', '0 0 0 160px']}
                pos="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%,-50%)"
            >
                <Box
                    pos="absolute"
                    left="0"
                    top="0"
                    display="inline-block"
                    w={['110px', '140px']}
                    h={['110px', '140px']}
                    bgImage="url('/assets/emoji.png')"
                    bgSize="cover"
                    _before={{
                        content: "' '",
                        pos: 'absolute',
                        w: 'full',
                        h: 'full',
                        transform: 'scale(2.4)',
                        borderRadius: '50%',
                        bgColor: '#f2f5f8',
                        zIndex: '-1',
                    }}
                ></Box>
                <Text
                    as="h1"
                    fontFamily="Nunito"
                    fontSize="65px"
                    fontWeight="700"
                    mb="10px"
                    color="#151723"
                    textTransform="uppercase"
                >
                    404
                </Text>
                <Text
                    as="h2"
                    fontFamily="Nunito"
                    fontSize="21px"
                    fontWeight="400"
                    mb="0"
                    color="#151723"
                    textTransform="uppercase"
                >
                    Oops! Page Not Found
                </Text>
                <Text as="p" fontFamily="Nunito" mb="1rem" color="#999fa5">
                    Sorry but the page you are looking for does not exist, have
                    been removed. name changed or is temporarily unavailable
                </Text>
                <Link
                    href="# "
                    fontWeight="700"
                    borderRadius="40px"
                    textDecoration="none"
                    fontFamily="Nunito"
                    color="brand.100"
                >
                    Back to homepage
                </Link>
            </Box>
        </Box>
    );
};

export default NotFoundPage;
