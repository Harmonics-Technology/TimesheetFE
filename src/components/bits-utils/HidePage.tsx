import { Box, Circle, Flex, Image, Text } from '@chakra-ui/react';

function HidePage() {
    return (
        <Flex
            w="full"
            bgColor="brand.400"
            h="70vh"
            overflow="hidden"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
        >
            <Circle
                size="6rem"
                bgColor="white"
                p="1.4rem"
                border="5px solid white"
            >
                <Image
                    w="full"
                    h="full"
                    objectFit="cover"
                    src="/assets/logo.png"
                />
            </Circle>
            <Box textAlign="center" mt="1rem" color="white">
                <Text fontSize="1.2rem" fontWeight="600" mb="1rem">
                    Oh, hi there!
                </Text>
                <Text fontSize="1rem" fontWeight="400" w="80%" mx="auto">
                    Unfortunately, timesheet can not be viewed on this device,
                    kindly use a device with a larger screen size or maximize
                    your computer screen to use timesheet.
                </Text>
            </Box>
        </Flex>
    );
}

export default HidePage;
