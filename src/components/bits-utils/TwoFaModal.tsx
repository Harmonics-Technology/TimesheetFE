import {
    Box,
    Button,
    Flex,
    Grid,
    Icon,
    Image,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react';
import {
    Enable2FAView,
    FinancialService,
    InvoiceView,
    RejectPaymentPartnerInvoiceModel,
    UserService,
    UserView,
} from 'src/services';
import { PrimaryTextarea } from './PrimaryTextArea';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import BeatLoader from 'react-spinners/BeatLoader';
import { GrClose } from 'react-icons/gr';
import { useRouter } from 'next/router';
import OtpInput from 'react-otp-input';
import { useContext, useState } from 'react';
import { UserContext } from '@components/context/UserContext';
import Cookies from 'js-cookie';
import QRCode from 'react-qr-code';

function TwoFaModal({
    isOpen,
    onClose,
    data,
}: {
    isOpen: boolean;
    onClose: any;
    data: Enable2FAView | undefined;
}) {
    const schema = yup.object().shape({});

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<RejectPaymentPartnerInvoiceModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const router = useRouter();
    const toast = useToast();
    const [otp, setOtp] = useState<any>();
    const { user } = useContext(UserContext);
    const twoFactorCode = user?.twoFactorCode;
    //
    const [codeText, setCodeText] = useState(false);
    const [step, setStep] = useState(0);
    const nextStep = () => {
        setStep((curStep) => curStep + 1);
    };
    const prevStep = () => {
        setStep((curStep) => curStep - 1);
    };

    const onSubmit = async () => {
        try {
            const result = await UserService.completeTowFactorAuthentication(
                otp,
                twoFactorCode,
            );
            if (result.status) {
                Cookies.set('user', JSON.stringify(result.data));
                onClose();
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            toast({
                title: 'An error occured',
                status: 'error',
                position: 'top-right',
            });
        }
    };
    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalContent
                    py={5}
                    borderRadius="8px"
                    w={['88%', '35%']}
                    maxW="unset"
                    overflow="hidden"
                    minH="70vh"
                    mt="0"
                    mb="0"
                >
                    <ModalHeader>
                        <Flex justify="space-between">
                            <Text
                                color="black"
                                fontSize="1.1rem"
                                textAlign="left"
                                fontWeight="semibold"
                            >
                                Enable Two Factor Authentication
                            </Text>
                            <Icon
                                as={GrClose}
                                onClick={onClose}
                                cursor="pointer"
                            />
                        </Flex>
                    </ModalHeader>
                    <ModalBody
                        display="flex"
                        flexDir="column"
                        justifyContent="space-between"
                    >
                        {step == 0 ? (
                            <Box borderColor="gray.300">
                                <Flex
                                    bgColor="brand.400"
                                    color="white"
                                    fontSize=".9rem"
                                    px="1rem"
                                    h="2.5rem"
                                    w="fit-content"
                                    align="center"
                                    mb="1rem"
                                >
                                    Step 1
                                </Flex>
                                <Text>
                                    To enable 2FA, you need to install an
                                    authenticator app like Microsoft
                                    authenticator, or Google Authenticator on
                                    your smart phone (App Store or Google play
                                    store).
                                </Text>
                            </Box>
                        ) : step == 1 ? (
                            <Box borderColor="gray.300">
                                <Flex
                                    bgColor="brand.400"
                                    color="white"
                                    fontSize=".9rem"
                                    px="1rem"
                                    h="2.5rem"
                                    w="fit-content"
                                    align="center"
                                    mb="1rem"
                                >
                                    Step 2
                                </Flex>
                                {codeText ? (
                                    <Text>
                                        If you can’t scan this barcode, enter
                                        the text code ({data?.alternativeKey})
                                        on the authenticator app instead.
                                    </Text>
                                ) : (
                                    <>
                                        <Text>
                                            Scan the QR Code below with your
                                            authenticator app.
                                        </Text>
                                        <Flex justify="space-around" py="1rem">
                                            <Image
                                                src={data?.qrCodeUrl as string}
                                                w="auto"
                                                h="auto"
                                            />
                                            {/* <QRCode
                                                size={256}
                                                bgColor="white"
                                                value={
                                                    data?.alternativeKey as string
                                                }
                                                viewBox={`0 0 256 256`}
                                            /> */}
                                        </Flex>
                                    </>
                                )}
                                <Text
                                    onClick={() => setCodeText(!codeText)}
                                    textAlign="center"
                                    cursor="pointer"
                                    py="1rem"
                                    _hover={{
                                        color: 'brand.400',
                                        textDecor: 'underline',
                                    }}
                                >
                                    {codeText
                                        ? 'Scan Code Instead'
                                        : 'Try Security Key Setup'}
                                </Text>
                            </Box>
                        ) : step == 2 ? (
                            <Box>
                                <Flex
                                    bgColor="brand.400"
                                    color="white"
                                    fontSize=".9rem"
                                    px="1rem"
                                    h="2.5rem"
                                    w="fit-content"
                                    align="center"
                                    mb="1rem"
                                >
                                    Step 3
                                </Flex>
                                <Text>
                                    Enter the TOTP generated by the app and
                                    click enable.
                                </Text>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <OtpInput
                                        value={otp}
                                        onChange={setOtp}
                                        numInputs={6}
                                        inputStyle="otp"
                                        containerStyle="otp-container"
                                        renderInput={(props) => (
                                            <input {...props} />
                                        )}
                                        inputType="number"
                                    />
                                    <Button
                                        isLoading={isSubmitting}
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size="10"
                                            />
                                        }
                                        type="submit"
                                        w="full"
                                        bgColor="brand.400"
                                        color="white"
                                        h="3rem"
                                        fontSize=".8rem"
                                        disabled={otp?.length !== 6}
                                    >
                                        Enable
                                    </Button>
                                </form>
                            </Box>
                        ) : null}
                        <Flex
                            justify={step < 1 ? 'flex-end' : 'space-between'}
                            align="center"
                            h="full"
                        >
                            <Button
                                w="30%"
                                bgColor="gray.400"
                                color="white"
                                h="3rem"
                                fontSize=".8rem"
                                display={step > 0 ? 'flex' : 'none'}
                                onClick={prevStep}
                            >
                                Previous
                            </Button>
                            <Button
                                w="30%"
                                bgColor="brand.400"
                                color="white"
                                h="3rem"
                                fontSize=".8rem"
                                display={step !== 2 ? 'flex' : 'none'}
                                onClick={nextStep}
                            >
                                Next
                            </Button>
                        </Flex>
                        {/* <Grid
                            templateColumns={'repeat(3, minmax(0, 1fr))'}
                            gap="1rem"
                        ></Grid> */}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default TwoFaModal;
