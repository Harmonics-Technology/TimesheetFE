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
    Heading,
    Button,
} from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import useWindowSize from '@components/generics/useWindowSize';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import Confetti from 'react-confetti';
import { LiaTimesSolid } from 'react-icons/lia';

type Props = {
    isOpen?: any;
    onClose?: any;
    isAdminAllowed: boolean;
    expiredSub: any;
};

export const SubscriptionPromptModal = ({
    isOpen,
    onClose,
    isAdminAllowed,
    expiredSub,
}: Props) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');

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
                    <Box
                        w={['88%', '40%']}
                        py={10}
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
                                {isAdminAllowed && (
                                    <HStack
                                        height="2.34rem"
                                        width="2.34rem"
                                        // bgColor="brand.800"
                                        // color="white"
                                        // borderRadius="50%"
                                        onClick={onClose}
                                        justify="center"
                                        cursor="pointer"
                                        ml="auto"
                                        mb="1rem"
                                    >
                                        <LiaTimesSolid />
                                    </HStack>
                                )}

                                <Heading
                                    fontSize="1.4rem"
                                    fontWeight="700"
                                    userSelect="none"
                                >
                                    Your Subscription Is Inactive
                                </Heading>
                            </>
                        </ModalHeader>

                        <ModalBody>
                            <Box maxH="77vh" overflowY="auto" px={0} mb="5">
                                <Text
                                    fontSize="1rem"
                                    mb="1.5rem"
                                    userSelect="none"
                                    color="#696969"
                                    textAlign="center"
                                >
                                    It looks like your{' '}
                                    {expiredSub
                                        ?.map((x) => x?.subscriptionType)
                                        ?.join(',')}{' '}
                                    subscription is currently inactive. You have{' '}
                                    {expiredSub
                                        ?.map(
                                            (x) =>
                                                `${x?.noOfLicenceUsed} ${x?.subscriptionType}`,
                                        )
                                        .join(',')}{' '}
                                    licenses assigned. You can reactivate your
                                    subscription by clicking on the button below
                                </Text>
                                <Button
                                    display="flex"
                                    variant="solid"
                                    height="40px"
                                    width="fit-content"
                                    px="1.5rem"
                                    mx="auto"
                                    bgColor="brand.400"
                                    color="white"
                                    borderRadius="5px"
                                    fontSize=".9rem"
                                    _hover={{
                                        bgColor: 'white',
                                        color: 'brand.400',
                                        border: '1px solid',
                                        borderColor: 'brand.400',
                                    }}
                                    onClick={() => {
                                        router.push(
                                            `/${role}/account-management/billing-information`,
                                        );
                                    }}
                                >
                                    Reactivate Subscription
                                </Button>
                            </Box>
                        </ModalBody>
                    </Box>
                </ModalContent>
            </Modal>
        </>
    );
};
