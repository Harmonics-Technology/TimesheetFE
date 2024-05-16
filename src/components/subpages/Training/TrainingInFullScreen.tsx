import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { TrainingService } from 'src/services';

export const TrainingInFullScreen = ({
    isOpen,
    onClose,
    file,
    userId,
    trainingId,
}) => {
    const videoId = file.fileUrl.split('v=')[1];

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const markTrainingComplete = async () => {
        setLoading(true);
        try {
            const result = await TrainingService.completeTraining(
                userId,
                trainingId,
                file.id,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                onClose();
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
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
                w={['88%', '80%']}
                overflow="hidden"
                minW="0"
                maxW="100%"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between" mb="1rem">
                        <Text
                            fontWeight="500"
                            userSelect="none"
                            fontSize=".9rem"
                        >
                            {file?.title}
                        </Text>
                        <FaTimes onClick={onClose} />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <Box>
                            <Text fontSize=".9rem" w="90%" mb="1rem" mx="auto">
                                You are about to take a training that has been
                                assigned to you, please be as honest as possible
                                during the course of taking the training and
                                click on the 'Mark as Complete' button to
                                continue
                            </Text>
                            <Box
                                w="90%"
                                h="500px"
                                border="0.55px solid"
                                borderColor="#6A7F9D"
                                borderRadius="20px"
                                overflow="hidden"
                                mx="auto"
                            >
                                {file?.category == 'Video' ? (
                                    <Box w="full" h="full" overflow="hidden">
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="YouTube Video"
                                        />
                                    </Box>
                                ) : (
                                    <Flex
                                        justify="center"
                                        align="center"
                                        w="full"
                                        h="full"
                                    >
                                        <iframe
                                            width="100%"
                                            height="100%"
                                            src={file?.fileUrl}
                                            allowFullScreen
                                            title="Document"
                                        />
                                    </Flex>
                                )}
                            </Box>
                        </Box>
                        <HStack spacing={4} w="full" my="42px" justify="center">
                            <Button
                                variant="solid"
                                width="fit-content"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="8px"
                                fontSize="1rem"
                                w="80%"
                                h="4rem"
                                px="1rem"
                                isLoading={loading}
                                onClick={() => markTrainingComplete()}
                                isDisabled={file?.isCompleted}
                            >
                                Mark as Complete
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
