import {
    Box,
    Button,
    Circle,
    Grid,
    HStack,
    Text,
    useToast,
    Image,
    Flex,
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    VStack,
    Tr,
    FormControl,
    FormLabel,
    Switch,
    Icon,
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import {
    AdminPaymentScheduleViewListStandardResponse,
    ControlSettingView,
    Enable2FAView,
    PaymentSchedule,
    PaymentScheduleListStandardResponse,
    UpdateUserModel,
    UserService,
    UserView,
} from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import Cookies from 'js-cookie';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import { Widget } from '@uploadcare/react-widget';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import ConfirmModal from '@components/bits-utils/ConfirmModal';
import ProfileConfirmModal from '@components/bits-utils/ProfileConfirmModal';
import BeatLoader from 'react-spinners/BeatLoader';
import { BsCameraFill } from 'react-icons/bs';
import { FcCancel } from 'react-icons/fc';
import TableCards from '@components/bits-utils/TableCards';
import { TableData } from '@components/bits-utils/TableData';
import PaymentScheduleModal from '@components/bits-utils/PaymentScheduleModal';
import AdminPaymentScheduleModal from '@components/bits-utils/AdminPaymentScheduleModal';
import { subDays } from 'date-fns';
import { formatDate } from '@components/generics/functions/formatDate';
import TwoFaModal from '@components/bits-utils/TwoFaModal';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { Logout } from '@components/bits-utils/LogUserOut';

const schema = yup.object().shape({
    dateOfBirth: yup.string().required(),
    address: yup.string().required(),
    phoneNumber: yup.string().required(),
});

function MyProfile({
    user,
    paymentSchedule,
    controls,
}: {
    user: any;
    paymentSchedule?: PaymentScheduleListStandardResponse;
    controls?: ControlSettingView;
}) {
    // console.log({ controls });
    const isTfa = controls?.twoFactorEnabled;
    const {
        register,
        handleSubmit,
        handleSubmit: handleTwoFaSubmit,
        control,
        formState: { errors, isSubmitting, isSubmitting: twoFaSubmit },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: user?.id,
            role: user?.role,
            isActive: user?.isActive,
            firstName: user?.firstName,
            lastName: user?.lastName,
            address: user?.address,
            phoneNumber: user?.phoneNumber,
            organizationName: user?.organizationName,
            profilePicture: user?.profilePicture,
            dateOfBirth: user?.dateOfBirth,
        },
    });
    const toast = useToast();
    const [showLoading, setShowLoading] = useState(false);
    const [pictureUrl, setPictureUrl] = useState<any>('');
    const widgetApi = useRef<any>();
    const router = useRouter();

    const reloadPage = () => {
        setShowLoading(false);
        router.reload();
    };
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const {
        isOpen: openSchedule,
        onOpen: onOpenSchedule,
        onClose: onCloseSchedule,
    } = useDisclosure();
    const updatePicture = async (data: UpdateUserModel, info, callback?) => {
        data.firstName = user?.firstName;
        data.lastName = user?.lastName;
        data.isActive = user?.isActive;
        data.id = user?.id;
        data.organizationAddress = user?.organizationAddress;
        data.organizationEmail = user?.organizationEmail;
        data.organizationPhone = user?.organizationPhone;
        data.phoneNumber = user?.phoneNumber;
        data.role = user?.role;
        data.profilePicture = info?.cdnUrl;
        console.log({ data });
        try {
            const result = await UserService.updateUser(data);
            console.log({ result });
            if (result.status) {
                toast({
                    title: 'Profile Picture Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                callback();
                return;
            }
            callback();
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            callback();
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoading(true);
            });
            file.done((info) => {
                console.log('File uploaded: ', info), setPictureUrl(info);
                if (info) {
                    updatePicture(user, info, reloadPage);
                    // setShowLoading(false);
                }
            });
        }
    };

    const onSubmit = async (data: UpdateUserModel) => {
        if (pictureUrl !== '') {
            data.profilePicture = pictureUrl.cdnUrl;
        }
        try {
            const result = await UserService.updateUser(data);
            console.log({ result });
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const {
        isOpen: open2Fa,
        onOpen: onOpen2Fa,
        onClose: close2Fa,
    } = useDisclosure();
    const [twoFaData, setTwoFaData] = useState<Enable2FAView>();
    const [loading, setLoading] = useState(false);
    const [twofaState, settwofaState] = useState(
        user?.twoFactorEnabled || false,
    );
    // console.log({ twoFaData, twofaState });

    const twoFaSubmitFun = async () => {
        setLoading(true);
        try {
            const result = await UserService.enable2Fa(twofaState);
            if (result.status) {
                setLoading(false);
                // console.log({ result });
                if (result.data?.enable2FA) {
                    setTwoFaData(result.data);
                    onOpen2Fa();
                    return;
                }
                toast({
                    title: 'Successful, Please login again!',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Logout('/login');
                return;
            }

            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
                status: 'success',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        }
    };

    // useNonInitialEffect(() => {
    //     twoFaSubmitFun();
    // }, [twofaState]);

    return (
        <Box>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex
                    justify="space-between"
                    align={['unset', 'center']}
                    flexDirection={['column', 'row']}
                >
                    <HStack gap="1rem" align="center" mb={['1rem', '0']}>
                        <Circle
                            size="4rem"
                            fontSize="2rem"
                            color="white"
                            // overflow="hidden"
                            pos="relative"
                            role="group"
                            bgColor={
                                showLoading ? 'rgba(0,0,0,0.2)' : 'brand.600'
                            }
                            _hover={{
                                bgColor: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            {user?.profilePicture ? (
                                <Image
                                    src={user?.profilePicture}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    borderRadius="50%"
                                    opacity={showLoading ? 0.3 : 1}
                                    _groupHover={{
                                        opacity: '0.3',
                                    }}
                                />
                            ) : (
                                <FaUser />
                            )}
                            <Box
                                w="full"
                                h="full"
                                bgColor="rgba(0,0,0,0.2)"
                                pos="absolute"
                                borderRadius="50%"
                                opacity={showLoading ? 1 : 0}
                                _groupHover={{
                                    opacity: 1,
                                }}
                            >
                                <Menu>
                                    <MenuButton
                                        pos="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                    >
                                        <VStack color="white" fontSize="1rem">
                                            {showLoading ? (
                                                <Spinner />
                                            ) : (
                                                <BsCameraFill />
                                            )}
                                            {/* <Text fontSize=".5rem">
                                                Edit Profile Icon
                                            </Text> */}
                                        </VStack>
                                    </MenuButton>
                                    <MenuList fontSize=".8rem">
                                        <MenuItem>
                                            <Text
                                                fontWeight="500"
                                                color="brand.200"
                                                mb="0"
                                                onClick={() =>
                                                    widgetApi.current.openDialog()
                                                }
                                            >
                                                {user?.profilePicture !== null
                                                    ? 'Change Photo'
                                                    : 'Upload Photo'}
                                            </Text>
                                        </MenuItem>
                                        <MenuItem>
                                            <Text
                                                fontWeight="500"
                                                color="brand.200"
                                                mb="0"
                                                onClick={onOpen}
                                            >
                                                {user?.profilePicture !== null
                                                    ? 'Remove Photo'
                                                    : ''}
                                            </Text>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Circle>
                        <Box>
                            <Text
                                fontSize=".8rem"
                                color="brand.300"
                                fontWeight="bold"
                            >
                                {user?.role} Profile
                            </Text>
                            <Text fontSize=".8rem" color="brand.300" mb="0">
                                {user?.fullName}
                            </Text>
                        </Box>
                    </HStack>
                    <Box>
                        {/* <Button
                            bgColor="brand.600"
                            color="white"
                            display={
                                paymentSchedule == undefined ? 'none' : 'block'
                            }
                            fontSize=".8rem"
                            h="2.5rem"
                            borderRadius="0"
                            border="2px solid"
                            onClick={
                                user?.role === 'Team Member'
                                    ? onOpened
                                    : onOpenSchedule
                            }
                            w={['full', 'inherit']}
                        >
                            View Payment Schedule
                        </Button> */}

                        <Box display="none">
                            <Widget
                                publicKey="fda3a71102659f95625f"
                                clearable
                                onFileSelect={(file) => showLoadingState(file)}
                                ref={widgetApi}
                                systemDialog={true}
                                inputAcceptTypes={'.jpg,.jpeg,.png,.gif,.heic'}
                            />
                        </Box>
                    </Box>
                </Flex>
            </Box>
            <form>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    gap="1rem 1rem"
                    my="1.5rem"
                >
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Personal Information
                        </Text>
                        <Grid gap=".5rem">
                            <PrimaryInput<UpdateUserModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={user?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={user?.lastName as string}
                                register={register}
                            />
                            {/* <PrimaryInput<UpdateUserModel>
                                label="Preferred Name"
                                name="isActive"
                                error={errors.isActive}
                                placeholder=""
                                defaultValue={'Adelowomi'}
                                register={register}
                            /> */}
                            <PrimaryDate<UpdateUserModel>
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                error={errors.dateOfBirth}
                                defaultValue={moment(user?.dateOfBirth).format(
                                    'DD MM YYYY',
                                )}
                                max={subDays(new Date(), 1)}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Contact Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Email"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Address"
                                name="address"
                                error={errors.address}
                                placeholder=""
                                defaultValue={user?.address as string}
                                register={register}
                            />
                            <PrimaryPhoneInput<UpdateUserModel>
                                label="Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder={user?.phoneNumber as string}
                                control={control}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Job Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Company Name"
                                placeholder=""
                                defaultValue={user?.clientName as string}
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Job Title"
                                placeholder=""
                                defaultValue={
                                    user?.employeeInformation
                                        ?.jobTitle as string
                                }
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Supervisor"
                                placeholder=""
                                defaultValue={
                                    user?.employeeInformation?.supervisor
                                        ?.fullName as string
                                }
                                disableLabel={true}
                            />
                        </Grid>
                    </Box>
                </Grid>
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    w="full"
                    mb="1.5rem"
                    pos="relative"
                >
                    <VStack align="flex-start" w={['full', '60%']} gap="1rem">
                        <Box>
                            <Text
                                color="#484747"
                                fontWeight="500"
                                lineHeight="150%"
                                mb="1rem"
                            >
                                Two factor authentication
                            </Text>
                            <Text
                                color="#484747"
                                fontWeight="400"
                                lineHeight="150%"
                                fontSize="14px"
                            >
                                Two-Factor Authentication is an enhanced
                                security measure. Once enabled, you will be
                                required to give two types of Identification
                                when you login.
                            </Text>
                        </Box>

                        <FormControl
                            display="flex"
                            alignItems="center"
                            gap="1rem"
                        >
                            <Switch
                                id="email-alerts"
                                onChange={() => settwofaState(!twofaState)}
                                defaultChecked={
                                    user?.twoFactorEnabled == true
                                        ? true
                                        : false
                                }
                            />
                            {loading ? (
                                <Spinner />
                            ) : (
                                <FormLabel
                                    htmlFor="email-alerts"
                                    mb="0"
                                    fontSize="14px"
                                    fontWeight="500"
                                >
                                    Enable
                                </FormLabel>
                            )}
                        </FormControl>
                        {/* <form>
                            <Box w="50%">
                                <PrimaryInput<UpdateUserModel>
                                    label="Email (you will recieve an OTP code in your Email)"
                                    name="organizationEmail"
                                    error={errors.organizationEmail}
                                    placeholder=""
                                    defaultValue={user?.email as string}
                                    register={register}
                                    // disableLabel={true}
                                />
                                <Text
                                    color="#484747"
                                    fontWeight="400"
                                    lineHeight="150%"
                                    fontSize="14px"
                                >
                                    Or
                                </Text>
                                <PrimaryPhoneInput<UpdateUserModel>
                                    label="Phone number (you will recieve an OTP code via sms)"
                                    name="phoneNumber"
                                    error={errors.phoneNumber}
                                    placeholder={user?.phoneNumber as string}
                                    control={control}
                                />

                                <Button
                                    color="white"
                                    bgColor="brand.400"
                                    borderRadius="0"
                                    height="35px"
                                    px="2rem"
                                    fontSize="13px"
                                    fontWeight="700"
                                    mt="1rem"
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    isLoading={twoFaSubmit}
                                    onClick={() =>
                                        handleTwoFaSubmit(twoFaSubmitFun)
                                    }
                                >
                                    Confirm
                                </Button>
                            </Box>
                        </form> */}
                    </VStack>
                    {!isTfa && (
                        <HStack
                            pos="absolute"
                            bgColor="rgba(250,250,250,.8)"
                            w="full"
                            h="full"
                            top="0"
                            justify="center"
                            align="center"
                            onClick={() => void 0}
                        >
                            <Icon as={FcCancel} />
                            <Text>
                                This feature has been disabled by your
                                organization admin
                            </Text>
                        </HStack>
                    )}
                </Box>

                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="4rem"
                        fontSize="15px"
                        // type="submit"
                        isLoading={isSubmitting}
                        onClick={handleSubmit(onSubmit)}
                        spinner={<BeatLoader color="white" size={10} />}
                        w="98%"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update</Box>
                    </Button>
                </Box>
            </form>
            <ProfileConfirmModal
                isOpen={isOpen}
                onClose={onClose}
                user={user}
            />
            <TwoFaModal isOpen={open2Fa} onClose={close2Fa} data={twoFaData} />
            {paymentSchedule !== undefined && (
                <>
                    <PaymentScheduleModal
                        isOpen={isOpened}
                        onClose={onClosed}
                        paymentSchedule={
                            paymentSchedule as PaymentScheduleListStandardResponse
                        }
                    />

                    <AdminPaymentScheduleModal
                        isOpen={openSchedule}
                        onClose={onCloseSchedule}
                        paymentSchedule={
                            paymentSchedule as AdminPaymentScheduleViewListStandardResponse
                        }
                    />
                </>
            )}
        </Box>
    );
}

export default MyProfile;
