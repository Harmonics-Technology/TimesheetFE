import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    Box,
    HStack,
    Flex,
    Image,
} from '@chakra-ui/react';
import useWindowSize from '@components/generics/useWindowSize';
import Confetti from 'react-confetti';
import { LiaTimesSolid } from 'react-icons/lia';

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
                                <HStack
                                    height="2.34rem"
                                    width="2.34rem"
                                    bgColor="brand.800"
                                    color="white"
                                    borderRadius="50%"
                                    onClick={onClose}
                                    justify="center"
                                    cursor="pointer"
                                    ml="auto"
                                >
                                    <LiaTimesSolid />
                                </HStack>
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
                                    {`${user?.organizationName} is wishing you a Happy ${type}
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
                            </Box>
                        </ModalBody>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};
