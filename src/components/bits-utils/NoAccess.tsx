import { Flex, Heading, Button, Text, Box, Image } from '@chakra-ui/react';
import router from 'next/router';
import React from 'react';

const NoAccess = () => {
    return (
        <Flex
            minHeight="70vh"
            direction="column"
            justifyContent="center"
            bgColor="white"
            borderRadius="8px"
        >
            {/* <MotionBox
        animate={{ y: 20 }}
        transition={{
            repeat: Infinity,
            duration: 2,
            repeatType: 'reverse',
        }}
        width={{ base: '100%', sm: '70%', md: '60%' }}
        margin="0 auto"
    >
        <Image
            src="/Under construction-amico.svg"
            alt="Error 500 Illustration"
        />
    </MotionBox> */}
            <Box h="10rem" mx="auto">
                <Image src="/assets/no-access.png" h="full" />
            </Box>

            <Box marginY={4} mx="auto" w="50%">
                <Heading textAlign="center" size="xl" fontWeight={400}>
                    Access Denied!
                </Heading>
                <Text fontSize=".9rem" textAlign="center">
                    You do not have access to view this page. Kindly contact
                    your organization admin to grant you access
                </Text>

                <Box textAlign="center" marginTop={4}>
                    <Button
                        onClick={() => router.back()}
                        bgColor="brand.400"
                        color="white"
                        px="1rem"
                        h="2.9rem"
                        size="sm"
                    >
                        Let&apos;s Head Back
                    </Button>
                </Box>
            </Box>
        </Flex>
    );
};

export default NoAccess;
