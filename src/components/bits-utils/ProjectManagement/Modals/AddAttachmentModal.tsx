import {
    DrawerFooter,
    Flex,
    Button,
    Box,
    FormLabel,
    Icon,
    Spinner,
    VStack,
    Text,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import { Widget } from '@uploadcare/react-widget';
import React, { useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import BeatLoader from 'react-spinners/BeatLoader';

export const AddAttachmentModal = ({
    isOpen,
    onClose,
    isLoading,
    setLoading,
    uploadAttachement,
}) => {
    const widgetApi = useRef<any>(null);
    const [fileDoc, setFileDoc] = useState<any>();

    const uploadFunction = async (file) => {
        file.progress(() => {
            setLoading({ id: 'uploading' });
        });
        file.done((info) => {
            setFileDoc(info);
        });
    };
    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Upload Document'}
        >
            <Box>
                <Box w="full">
                    <FormLabel
                        textTransform="capitalize"
                        width="fit-content"
                        fontSize=".8rem"
                    >
                        Upload Document or Requirement
                    </FormLabel>
                    <Flex
                        border={'1px dashed #9e9e9e'}
                        h="9rem"
                        align="center"
                        justify="center"
                        w="full"
                    >
                        <VStack
                            color="black"
                            fontSize=".8rem"
                            align="center"
                            cursor="pointer"
                            fontWeight="600"
                            onClick={() => widgetApi.current.openDialog()}
                        >
                            <Icon as={AiOutlineCloudUpload} fontSize="2rem" />
                            <Text noOfLines={1} mb="0">
                                Upload
                            </Text>
                            <Text noOfLines={1} mb="0">
                                Drag and drop or Browse
                            </Text>
                        </VStack>
                        <Box display="none">
                            <Widget
                                publicKey="fda3a71102659f95625f"
                                clearable
                                onFileSelect={uploadFunction}
                                ref={widgetApi}
                                systemDialog={true}
                                inputAcceptTypes={'.docx,.pdf, .doc'}
                            />
                        </Box>
                    </Flex>
                </Box>
                <Flex
                    bgColor="#C2CFE0"
                    borderRadius="25px"
                    border={'1px dashed #C2CFE0'}
                    h="1.6rem"
                    px="1.5rem"
                    fontSize=".6rem"
                    color="white"
                    justify="center"
                    align="center"
                    w="fit-content"
                >
                    {isLoading.id == 'uploading' ? (
                        <Spinner size="sm" />
                    ) : isLoading.id !== 'uploading' && fileDoc?.url !== '' ? (
                        fileDoc?.url?.name
                    ) : (
                        ' PDF DOC'
                    )}
                </Flex>
            </Box>
            <DrawerFooter my="2rem" p="0" w="full">
                <Flex justify="space-between" w="full">
                    <Button
                        bgColor="#FF5B79"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={() => onClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        onClick={() => uploadAttachement(fileDoc)}
                        isLoading={isLoading.id === 'files'}
                        spinner={<BeatLoader color="white" size={10} />}
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        Save
                    </Button>
                </Flex>
            </DrawerFooter>
        </DrawerWrapper>
    );
};
