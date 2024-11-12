import {
    Box,
    Flex,
    HStack,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    VStack,
} from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { GrClose } from 'react-icons/gr';
import { AttachmentView } from 'src/services';
import { formatFileSize } from '@components/generics/functions/getFileSize';

interface ExportProps {
    isOpen: any;
    onClose: any;
    data: AttachmentView;
}

export const SingleData = ({ label, value }) => {
    return (
        <HStack gap=".1rem" fontSize=".9rem" fontWeight="400">
            <Text mb="0rem">{label}:</Text>
            <Text mb="0rem">{value}</Text>
        </HStack>
    );
};

export const AttachmentDetailModal = ({
    isOpen,
    onClose,
    data,
}: ExportProps) => {
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
                borderRadius="10px"
                w={['88%', '30%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <Flex
                        justify="space-between"
                        borderBottom="2px solid"
                        borderColor="gray.300"
                        pb=".3rem"
                    >
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="600"
                        >
                            Document Information
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 2]}>
                        <VStack align="flex-start" gap=".8rem">
                            <SingleData label="Name" value={data?.title} />
                            <SingleData
                                label="Date"
                                value={moment(data?.dateCreated).format(
                                    'DD/MM/YYYY hh:mm A',
                                )}
                            />
                            <SingleData label="File" value={data?.extension} />
                            <SingleData label="Size" value={formatFileSize(data?.fileSize)} />
                            <SingleData
                                label="Project"
                                value={data?.project?.name}
                            />
                            {data?.projectTask && (
                                <SingleData
                                    label="Project Task"
                                    value={data?.projectTask?.name}
                                />
                            )}
                            <SingleData
                                label="Attached/Uploaded By"
                                value={data?.createdByUser?.fullName}
                            />
                        </VStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
