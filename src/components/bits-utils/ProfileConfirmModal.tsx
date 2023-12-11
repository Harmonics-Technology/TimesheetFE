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
    useToast,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaTimesCircle, FaTrash } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';
import { UpdateUserModel, UserService } from 'src/services';

type Props = {
    isOpen?: any;
    onClose?: any;
    user?: any;
    loading?: any;
};

const ProfileConfirmModal = ({ isOpen, onClose, user }: Props) => {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const updatePicture = async (data: UpdateUserModel) => {
        data.firstName = user?.firstName;
        data.lastName = user?.lastName;
        data.isActive = user?.isActive;
        data.id = user?.id;
        data.organizationAddress = user?.organizationAddress;
        data.organizationEmail = user?.organizationEmail;
        data.organizationPhone = user?.organizationPhone;
        data.phoneNumber = user?.phoneNumber;
        data.role = user?.role;
        data.profilePicture = null;

        try {
            setLoading(true);
            const result = await UserService.updateUser(data);

            if (result.status) {
                toast({
                    title: 'Profile Picture Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                onClose();
                Cookies.set('user', JSON.stringify(result.data));
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            setLoading(false);
            toast({
                title: `Check your network connection and try again`,
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
                            color="red"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <FaTimesCircle />
                        </Flex>
                        <Text
                            fontSize="1rem"
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="600"
                        >
                            Are you sure you want to remove profile picture?
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <HStack px=".8rem" spacing={4} w="full">
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
                                No
                            </Button>
                            <Button
                                variant="solid"
                                height="3rem"
                                width="full"
                                bgColor="red"
                                color="white"
                                // _hover={{
                                //   bgColor: 'white',
                                //   color: 'brand.800',
                                //   border: '1px solid',
                                //   borderColor: 'brand.800',
                                // }}

                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                                onClick={() => updatePicture(user)}
                            >
                                Yes
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ProfileConfirmModal;
