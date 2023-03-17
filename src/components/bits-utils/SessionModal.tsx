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
    useToast,
    Flex,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaTimesCircle, FaTrash } from 'react-icons/fa';

type Props = {
    isOpen?: any;
    onClose?: any;
    route: any;
};

const SessionModal = ({ isOpen, onClose, route }: Props) => {
    const router = useRouter();
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '30%']}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Flex
                            justify="center"
                            color="red"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <FaTimesCircle />
                        </Flex>
                        <Text
                            fontSize="1.1rem"
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="500"
                            userSelect="none"
                        >
                            Your session has expired
                            <br />
                            Please Login again!
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <HStack px=".8rem" spacing={4} w="full">
                            <Button
                                variant="solid"
                                height="3rem"
                                width="full"
                                bgColor="brand.400"
                                color="white"
                                onClick={() => router.push(route)}
                            >
                                Login
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default SessionModal;
