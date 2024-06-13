import {
    Box,
    Button,
    Flex,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { TrainingService } from 'src/services';
import ReactPlayer from 'react-player';

export const TrainingInFullScreen = ({
    isOpen,
    onClose,
    file,
    userId,
    trainingId,
}) => {
    const newFile = file?.trainingFile;
    // const videoId = newFile.fileUrl.split('v=')[1];
    const watchedSeconds = file?.lastRecordedProgress || 0;

    const getIframeSrc = (url, fileType) => {
        const fileExtension = fileType.split('.').pop().toLowerCase();
        if (fileExtension === 'doc' || fileExtension === 'docx') {
            return `https://docs.google.com/gview?url=${encodeURIComponent(
                url,
            )}&embedded=true`;
        } else if (fileExtension === 'pdf') {
            return url;
        } else {
            return null;
        }
    };

    const iframeSrc = file
        ? getIframeSrc(newFile?.fileUrl, newFile?.title)
        : null;

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const markTrainingComplete = async () => {
        setLoading(true);
        try {
            const result = await TrainingService.completeTraining(
                userId,
                trainingId,
                newFile.id,
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
    const videoRef = useRef<any>();

    const saveUserVideProgress = async () => {
        const progress = videoRef?.current?.getCurrentTime();
        try {
            const result =
                await TrainingService.createOrUpdateVideoRecordProgress({
                    userId,
                    trainingId,
                    trainingFileId: newFile?.id,
                    lastRecordedProgress: progress,
                });
            router.replace(router.pathname);
            console.log(result.message);
        } catch (err: any) {
            console.log({ err });
        }
    };

    const seekVideo = () => {
        videoRef?.current?.seekTo(watchedSeconds, 'seconds');
        const internalPlayer = videoRef.current.getInternalPlayer();
        if (internalPlayer) {
            internalPlayer.playVideo(); // Autoplay after seeking
            setTimeout(() => {
                internalPlayer.pauseVideo();
            }, 1000);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            trapFocus={false}
            isCentered
            closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '70%']}
                overflow="hidden"
                minW="0"
                maxW="100%"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between">
                        <Text
                            fontWeight="500"
                            userSelect="none"
                            fontSize=".9rem"
                        >
                            {newFile?.title}
                        </Text>
                        <FaTimes onClick={onClose} cursor="pointer" />
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
                                w="80%"
                                h="400px"
                                border="0.55px solid"
                                borderColor="#6A7F9D"
                                borderRadius="20px"
                                overflow="hidden"
                                mx="auto"
                            >
                                {newFile?.category == 'Video' ? (
                                    <Box w="full" h="full" overflow="hidden">
                                        <ReactPlayer
                                            url={newFile?.fileUrl}
                                            width="100%"
                                            height="100%"
                                            ref={videoRef}
                                            controls
                                            onPause={() =>
                                                saveUserVideProgress()
                                            }
                                            onReady={() => seekVideo()}
                                        />
                                        {/* <iframe
                                            width="100%"
                                            height="100%"
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            title="YouTube Video"
                                        /> */}
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
                                            src={iframeSrc}
                                            allowFullScreen
                                            title="Document"
                                        />
                                    </Flex>
                                )}
                            </Box>
                        </Box>
                        <HStack spacing={4} w="full" my="22px" justify="center">
                            <Button
                                variant="solid"
                                width="fit-content"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="8px"
                                fontSize="1rem"
                                w="60%"
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
