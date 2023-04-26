import {
    Box,
    Flex,
    Icon,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { GrClose } from 'react-icons/gr';
import { IconPicker } from 'icon-picker-react';

interface ExportProps {
    isOpen: any;
    onClose: any;
    setIconLabel: any;
}

export const ChooseIconModal = ({
    isOpen,
    onClose,
    setIconLabel,
}: ExportProps) => {
    const selectIcon = (v) => {
        setIconLabel(v);
        onClose();
    };
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
                w={['88%', '50%']}
                // overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
                maxW="100%"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between">
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="semibold"
                        >
                            Choose an Icon
                        </Text>
                        <Icon as={GrClose} onClick={onClose} cursor="pointer" />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={[2, 5]}>
                        <IconPicker onChange={(v) => selectIcon(v)} />
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
