import { HStack, Text } from '@chakra-ui/react';

function Footer() {
    const year = new Date().getFullYear();
    return (
        <HStack
            fontSize=".9rem"
            fontWeight="600"
            mt="1.5rem"
            justify={['center', 'flex-start']}
            w="95%"
            mx="auto"
        >
            <Text color="brand.300" mb="0">
                &copy;{year}, Powered by{' '}
            </Text>
            <Text color="brand.200" mb="0">
                Proinsight Consulting
            </Text>
        </HStack>
    );
}

export default Footer;
