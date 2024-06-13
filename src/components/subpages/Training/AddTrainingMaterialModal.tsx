import {
    Box,
    Button,
    Flex,
    HStack,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import InputBlank from '@components/bits-utils/InputBlank';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { Widget } from '@uploadcare/react-widget';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { TrainingService } from 'src/services';

export const AddTrainingMaterialModal = ({ isOpen, onClose, trainingId }) => {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fileType, setFileType] = useState('');
    const [documentFile, setDocumentFile] = useState<any>({
        title: '',
        fileUrl: '',
        id: '',
        loading: false,
        category: '',
    });
    const widgetApi = useRef<any>();
    const uploadFunction = (file) => {
        if (file) {
            file.progress(() => {
                setDocumentFile({ loading: true });
            });
            file.done((info) => {
                setDocumentFile({
                    loading: false,
                    fileUrl: info?.cdnUrl,
                    title: info?.name,
                });
            });
        }
    };
    const noLinkSetUp = !documentFile.title || !documentFile.fileUrl;
    const addTraining = async () => {
        setLoading(true);
        const file = {
            trainingId,
            title: documentFile.title,
            fileUrl: documentFile.fileUrl,
            category: fileType,
        };
        try {
            const result = await TrainingService.addNewFile(file);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                setDocumentFile({ title: '', fileUrl: '' });
                setFileType('Select a type');
                router.replace(router.asPath);
                onClose();
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
                w={['88%', '30%']}
                overflow="hidden"
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
                            Add a training material
                        </Text>
                        <FaTimes onClick={onClose} />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <SelectBlank
                            label="Category"
                            w="full"
                            placeholder="Select Category"
                            defaultValue={''}
                            onChange={(e) => setFileType(e.target.value)}
                            options={['Document', 'Video'].map((x) => (
                                <option value={x}>{x}</option>
                            ))}
                        />
                        <Box mt="1.5rem">
                            {fileType == 'Document' ? (
                                <Box>
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        color="#1a202c"
                                        mb="27px"
                                    >
                                        Upload Files
                                    </Text>
                                    <Box
                                        borderRadius="8px"
                                        p="10px 24px 0"
                                        h="186px"
                                        border="1px dashed"
                                        borderColor="brand.100"
                                    >
                                        <VStack
                                            gap=".8rem"
                                            justify="space-between"
                                            onClick={() =>
                                                widgetApi.current.openDialog()
                                            }
                                        >
                                            <Box w="42px" h="42px">
                                                <Image
                                                    src="/assets/upload.png"
                                                    w="full"
                                                    h="full"
                                                />
                                            </Box>
                                            <Text fontSize=".8rem">
                                                Drag your file(s) to start
                                                uploading
                                            </Text>
                                            <HStack
                                                align="flex-start"
                                                gap="1.3rem"
                                            >
                                                <Box
                                                    bgColor="#e7e7e7"
                                                    h="1px"
                                                    w="80px"
                                                />
                                                <Text
                                                    fontSize="12px"
                                                    color="#6d6d6d"
                                                >
                                                    OR
                                                </Text>
                                                <Box
                                                    bgColor="#e7e7e7"
                                                    h="1px"
                                                    w="80px"
                                                />
                                            </HStack>
                                            {documentFile?.title ? (
                                                <Text
                                                    fontWeight={500}
                                                    fontSize=".9rem"
                                                >
                                                    {documentFile?.title}
                                                </Text>
                                            ) : (
                                                <Button
                                                    bgColor="transparent"
                                                    color="brand.400"
                                                    borderRadius="8px"
                                                    borderColor="brand.400"
                                                    border="1px solid"
                                                    fontSize="12px"
                                                    isLoading={
                                                        documentFile?.loading
                                                    }
                                                >
                                                    Browse files
                                                </Button>
                                            )}
                                        </VStack>
                                        <Box display="none">
                                            <Widget
                                                publicKey="fda3a71102659f95625f"
                                                clearable
                                                onFileSelect={uploadFunction}
                                                ref={widgetApi}
                                                systemDialog={true}
                                                inputAcceptTypes={
                                                    '.docx,.pdf, .doc'
                                                }
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                            ) : fileType == 'Video' ? (
                                <Box w="full">
                                    <Text
                                        fontSize="13px"
                                        fontWeight={500}
                                        color="#1a202c"
                                        mb="27px"
                                    >
                                        Insert Video Link
                                    </Text>
                                    <HStack gap="2rem">
                                        <InputBlank
                                            label="Title"
                                            onChange={(e) =>
                                                setDocumentFile({
                                                    ...documentFile,
                                                    title: e.target.value,
                                                })
                                            }
                                        />
                                        <InputBlank
                                            label="Video Link"
                                            onChange={(e) =>
                                                setDocumentFile({
                                                    ...documentFile,
                                                    fileUrl: e.target.value,
                                                })
                                            }
                                        />
                                    </HStack>
                                </Box>
                            ) : null}
                        </Box>
                        <HStack spacing={4} w="full" my="42px" justify="center">
                            <Button
                                variant="solid"
                                width="fit-content"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="8px"
                                fontSize=".9rem"
                                px="1rem"
                                isLoading={loading}
                                onClick={() => addTraining()}
                                isDisabled={noLinkSetUp}
                            >
                                Add Training Material
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
