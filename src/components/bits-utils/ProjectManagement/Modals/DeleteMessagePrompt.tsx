import {
    Modal,
    ModalBody,
    ModalContent,
    ModalOverlay,
    ModalHeader,
    Flex,
    Text, HStack, Button
} from '@chakra-ui/react';
import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

const DeleteMessagePrompt = ({
    isOpen,
    onClose,
    onSubmit
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void,
}) => {
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
                <ModalHeader textAlign="center" justifyContent='center' alignItems='center' display='flex'>
                    <FaInfoCircle fontSize={40} />
                </ModalHeader>

                <ModalBody>
                    <Text textAlign='center' mb='8'>Are you sure you want to delete this task?</Text>
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
                            onClick={() => {
                                onClose();
                            }}
                        >
                            No
                        </Button>
                        <Button
                            variant="solid"
                            height="2.6rem"
                            width="full"
                            bgColor="brand.400"
                            color="white"
                            _hover={{
                                bgColor: 'white',
                                color: 'brand.400',
                                border: '1px solid',
                                borderColor: 'brand.400',
                            }}
                            // isLoading={loading}
                            // spinner={<BeatLoader color="white" size={10} />}
                            onClick={() => onSubmit()}
                        >
                            Yes
                        </Button>
                    </HStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default DeleteMessagePrompt;
