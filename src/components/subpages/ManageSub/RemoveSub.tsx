import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Box,
    Text,
    HStack,
    VStack,
    useToast,
    Icon,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { CAD } from '@components/generics/functions/Naira';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { MdRemoveCircle } from 'react-icons/md';
import { MiniStackText } from './MiniStackText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';

interface ILicenseModify {
    totalLicense: number | string | undefined;
}

export const RemoveSub = ({ isOpen, onClose }: any) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILicenseModify>({
        mode: 'all',
    });
    const toast = useToast();
    const router = useRouter();

    const onSubmit = async (data: ILicenseModify) => {
        try {
            let result;
            if (result.status) {
                toast({
                    title: `Upgrade Requested`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
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
            return;
        } catch (err: any) {
            toast({
                title: err.body.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                motionPreset="slideInBottom"
                isCentered
                trapFocus={false}
            >
                <ModalOverlay
                    bg="blackAlpha.300"
                    backdropFilter="blur(10px) "
                />

                <ModalContent
                    py={5}
                    borderRadius="0px"
                    w={['88%', '40%']}
                    // overflow="hidden"
                    maxH="100vh"
                    pos="fixed"
                    mt="1rem"
                    mb="1rem"
                    maxW="100%"
                >
                    <ModalHeader>
                        <VStack align="flex-start">
                            <Text
                                color="#1b1d21"
                                fontSize="20px"
                                fontWeight={700}
                            >
                                Remove License
                            </Text>
                            <Text
                                color="#696969"
                                fontSize="14px"
                                fontWeight="400"
                            >
                                Decrease your total license quantity to remove
                                licenses from this subscription. To increase
                                your license quantity, <b>Buy License</b>
                            </Text>
                            {/* <Icon as={GrClose} onClick={onClose} cursor="pointer" /> */}
                        </VStack>
                    </ModalHeader>

                    <ModalBody>
                        <Box minH="65vh" overflowY="auto" w="100%" mx="auto">
                            <VStack
                                gap="38px"
                                w="full"
                                mt="10px"
                                align="flex-start"
                            >
                                <Box w="full">
                                    <Text
                                        color="#2d3748"
                                        fontSize="14px"
                                        fontWeight={600}
                                        mb="11px"
                                    >
                                        Current Quantity
                                    </Text>
                                    <VStack align="flex-start" gap="15px">
                                        <MiniStackText
                                            title="Total Licenses"
                                            value={10}
                                        />
                                        <MiniStackText
                                            title="Monthly Cost"
                                            value={'$50.00 plus applicable TAX'}
                                        />
                                    </VStack>
                                </Box>
                                <Box w="full">
                                    <Text
                                        color="#2d3748"
                                        fontSize="14px"
                                        fontWeight={600}
                                        mb="11px"
                                    >
                                        New Quantity
                                    </Text>
                                    <VStack align="flex-start" gap="15px">
                                        <HStack w="full">
                                            <Box w="30%">
                                                <Text
                                                    color="#696969"
                                                    fontSize="14px"
                                                >
                                                    Total License
                                                </Text>
                                            </Box>
                                            <HStack w="70%">
                                                <PrimaryInput<ILicenseModify>
                                                    label=""
                                                    name="totalLicense"
                                                    error={errors.totalLicense}
                                                    placeholder="10"
                                                    defaultValue=""
                                                    register={register}
                                                    w="120px"
                                                />
                                                <HStack color="#Da586f">
                                                    <Icon as={MdRemoveCircle} />
                                                    <Text fontSize="14px">
                                                        Reduce
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                        </HStack>
                                        <MiniStackText
                                            title="Monthly Cost"
                                            value={
                                                '$48.00, plus applicable TAX. The price is calculated using tier pricing'
                                            }
                                        />
                                    </VStack>
                                </Box>
                            </VStack>
                            <Text color="#696969" fontSize="14px" mt="40px">
                                Prices exclude Tax. New charges will be included
                                on your next bill for this subscription, unless
                                you cancel first. It will include a pro-rated
                                charge for the license you added
                            </Text>
                            <HStack
                                justifyContent="space-between"
                                align="center"
                                mt="65px"
                            >
                                <ShiftBtn
                                    color="white"
                                    bg="#da5867"
                                    h="44px"
                                    text="Cancel"
                                    onClick={() => onClose()}
                                    w="full"
                                />
                                <ShiftBtn
                                    color="white"
                                    bg="brand.400"
                                    h="44px"
                                    text="Remove License"
                                    onClick={() => handleSubmit(onSubmit)()}
                                    w="full"
                                />
                            </HStack>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};
