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
    Image,
} from '@chakra-ui/react';
import useWindowSize from '@components/generics/useWindowSize';
import Confetti from 'react-confetti';

type Props = {
    isOpen?: any;
    onClose?: any;
    user: any;
    type?: any;
};

export const BirthDayModal = ({ isOpen, onClose, user, type }: Props) => {
    const { width, height } = useWindowSize();
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                motionPreset="slideInBottom"
                isCentered
                // closeOnOverlayClick={false}
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) "
                />

                <ModalContent maxW="100%" h="100vh" bgColor="transparent">
                    <Confetti
                        width={width}
                        height={height}
                        // recycle={false}
                    />
                    <Box
                        w={['88%', '40%']}
                        py={5}
                        borderRadius="0px"
                        overflow="hidden"
                        maxH="100vh"
                        pos="fixed"
                        mt="1rem"
                        mb="1rem"
                        mx="auto"
                        bgColor="white"
                        left="50%"
                        top="50%"
                        transform="translate(-50%,-50%)"
                    >
                        <ModalHeader textAlign="center">
                            <>
                                <Flex justify="center" mb="1rem">
                                    <Box w="290px">
                                        <Image
                                            src="/assets/hb.png"
                                            w="full"
                                            h="auto"
                                        />
                                    </Box>
                                </Flex>
                                <Text
                                    fontSize="1.1rem"
                                    mb="1rem"
                                    px={['1.5rem', '3.3rem']}
                                    fontWeight="500"
                                    userSelect="none"
                                >
                                    {`${user?.organizationName} is wishing you Happy ${type}
                            !!!`}
                                </Text>
                            </>
                        </ModalHeader>

                        <ModalBody>
                            <Box maxH="77vh" overflowY="auto" px={5}>
                                {/* <Confetti
                            width={width}
                            height={height}
                            // recycle={false}
                        /> */}
                                <HStack
                                    px=".8rem"
                                    spacing={4}
                                    w="full"
                                    justify="center"
                                    mb="1.5rem"
                                >
                                    <Button
                                        variant="solid"
                                        height="2.34rem"
                                        width="100px"
                                        bgColor="brand.800"
                                        color="white"
                                        borderRadius="5px"
                                        border="0"
                                        onClick={onClose}
                                    >
                                        Close
                                    </Button>
                                </HStack>
                            </Box>
                        </ModalBody>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};
