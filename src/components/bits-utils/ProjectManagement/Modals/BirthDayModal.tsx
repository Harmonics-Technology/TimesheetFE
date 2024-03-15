import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Text,
    Box,
    HStack,
    Flex,
    Image,
} from '@chakra-ui/react';

type Props = {
    isOpen?: any;
    onClose?: any;
    user: any;
    type?: any;
};

export const BirthDayModal = ({ isOpen, onClose, user, type }: Props) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            // closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '40%']}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Flex justify="center" mb="1rem">
                            <Box w="290px">
                                <Image src="/assets/hb.png" w="full" h="auto" />
                            </Box>
                        </Flex>
                        <Text
                            fontSize="1.1rem"
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="500"
                            userSelect="none"
                        >
                            {`${user?.organizationName} is wishing you Happy ${type}
                            !!!`}
                        </Text>
                    </>
                </ModalHeader>

                {/* <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <HStack px=".8rem" spacing={4} w="full">
                            <Button
                                variant="solid"
                                height="3rem"
                                width="full"
                                bgColor="brand.400"
                                color="white"
                            >
                                Thank You
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody> */}
            </ModalContent>
        </Modal>
    );
};
