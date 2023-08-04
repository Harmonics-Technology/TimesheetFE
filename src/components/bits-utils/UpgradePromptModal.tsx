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
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { GiUpgrade } from 'react-icons/gi';

type Props = {
    isOpen?: any;
    onClose?: any;
    user?: any;
    loading?: any;
};

const UpgradePromptModal = ({ isOpen, onClose }: Props) => {
    const router = useRouter();
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
                            color="black"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <GiUpgrade />
                        </Flex>
                        {/* <Text
                            fontSize="1rem"
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="600"
                        >
                            Are you sure you want to remove profile picture?
                        </Text> */}
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <Text fontSize="1.2rem" mb="2rem">
                            Your current subscription plan does not include this
                            feature, please upgrade to enable this feature.
                        </Text>
                        <HStack spacing={4} w="full">
                            <Button
                                variant="outline"
                                height="3rem"
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
                                Close
                            </Button>
                            <Button
                                variant="solid"
                                height="3rem"
                                width="full"
                                bgColor="brand.400"
                                color="white"
                                onClick={() => {
                                    router.push(
                                        `/SuperAdmin/account-management/manage-subscription`,
                                    );
                                    onClose();
                                }}
                                _hover={{
                                    bgColor: 'white',
                                    color: 'brand.400',
                                    border: '2px solid',
                                    borderColor: 'brand.400',
                                }}
                            >
                                Upgrade
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default UpgradePromptModal;
