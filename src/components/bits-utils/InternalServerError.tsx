import { Box, Button, Heading, Text, Flex, Image } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export const InternalServerError = () => {
    const router = useRouter();

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
                <Image src="/assets/err.gif" h="full" />
            </Box>

            <Box marginY={4} mx="auto" w="50%">
                <Heading textAlign="center" size="xl" fontWeight={400}>
                    Internal Server Error
                </Heading>
                <Text fontSize=".9rem" textAlign="center">
                    Oops! We encountered a technical error while processing your
                    last request. Our engineers have been notified and are
                    working tirelessly to fix this issue. Kindly retry after
                    some minutes
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
