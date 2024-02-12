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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MdRemoveCircle } from 'react-icons/md';
import { MiniStackText } from './MiniStackText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import {
    ClientSubscriptionDetailView,
    LicenseUpdateModel,
    UserService,
} from 'src/services';

export const RemoveSub = ({
    isOpen,
    onClose,
    sub,
}: {
    isOpen: any;
    onClose: any;
    sub: ClientSubscriptionDetailView;
}) => {
    const removableLicense =
        (sub?.noOfLicensePurchased as number) -
        (sub?.noOfLicenceUsed as number);
    const schema = yup.object().shape({
        noOfLicense: yup
            .number()
            .min(
                sub?.noOfLicenceUsed as number,
                `The maximum you can remove is ${removableLicense} because you have assigned licenses`,
            )
            .max(
                sub?.noOfLicensePurchased as number,
                'The value entered is above the license purchased, use buy license to add more',
            ),
    });
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<LicenseUpdateModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            noOfLicense: sub?.noOfLicensePurchased,
        },
    });
    const toast = useToast();
    const router = useRouter();

    const licenses = (watch('noOfLicense') as number) || 0;

    const updateLicense = () => {
        if (licenses <= (sub?.noOfLicenceUsed as number)) {
            setValue('noOfLicense', sub?.noOfLicensePurchased);
            return;
        }
        setValue('noOfLicense', Number(licenses) - 1);
    };

    const total = licenses * (sub?.subscriptionPrice as number);

    const onSubmit = async (data: LicenseUpdateModel) => {
        data.superAdminId = sub?.superAdminId;
        data.subscriptionId = sub?.subscriptionId as string;
        data.remove = true;
        data.noOfLicense =
            (sub?.noOfLicensePurchased as number) -
            (data.noOfLicense as number);
        data.totalAmount =
            data.noOfLicense * (sub?.subscriptionPrice as number);
        try {
            const result = await UserService.addOrRemoveLicense(data);
            if (result.status) {
                toast({
                    title: `Successful`,
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
                                            value={sub?.noOfLicensePurchased}
                                        />
                                        <MiniStackText
                                            title="Monthly Cost"
                                            value={`${CAD(
                                                sub?.totalAmount,
                                            )}.00 plus applicable TAX`}
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
                                                <PrimaryInput<LicenseUpdateModel>
                                                    label=""
                                                    name="noOfLicense"
                                                    error={errors.noOfLicense}
                                                    placeholder="10"
                                                    defaultValue=""
                                                    register={register}
                                                    w="120px"
                                                />
                                                <HStack
                                                    color="#Da586f"
                                                    userSelect="none"
                                                    cursor="pointer"
                                                    onClick={() =>
                                                        updateLicense()
                                                    }
                                                >
                                                    <Icon as={MdRemoveCircle} />
                                                    <Text fontSize="14px">
                                                        Reduce
                                                    </Text>
                                                </HStack>
                                            </HStack>
                                        </HStack>
                                        <MiniStackText
                                            title="Monthly Cost"
                                            value={`${CAD(
                                                total,
                                            )}.00, plus applicable TAX. The price is calculated using tier pricing`}
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
                                    loading={isSubmitting}
                                    disabled={
                                        licenses == sub?.noOfLicensePurchased
                                    }
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
