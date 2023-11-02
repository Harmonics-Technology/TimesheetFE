import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalBody,
    HStack,
    Button,
    Box,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';

export const PaymentPrompt = ({ isOpen, onClose, onSubmit, loading }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '35%']}
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
                            color="gray.500"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <FaInfoCircle />
                        </Flex>
                        <Text
                            fontSize="1rem"
                            mb="1rem"
                            px={['1.5rem', '.5rem']}
                            fontWeight="400"
                        >
                            Has this invoice been processed? Please note that a
                            notification will be sent to the recipient letting
                            them know the selected invoice has been processed
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <HStack px=".8rem" spacing={4} w="full">
                            <Button
                                variant="outline"
                                height="2.6rem"
                                width="full"
                                borderColor="black"
                                // bgColor="black"
                                // _hover={{
                                //   bgColor: 'white',
                                //   color: 'black',
                                //   border: '1px solid',
                                //   borderColor: 'black',
                                // }}
                                onClick={onClose}
                            >
                                No
                            </Button>
                            <Button
                                variant="solid"
                                height="2.6rem"
                                width="full"
                                bgColor="brand.400"
                                color="white"
                                // _hover={{
                                //   bgColor: 'white',
                                //   color: 'brand.800',
                                //   border: '1px solid',
                                //   borderColor: 'brand.800',
                                // }}

                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                                onClick={() => {
                                    onSubmit();
                                    onClose();
                                }}
                            >
                                Yes
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
