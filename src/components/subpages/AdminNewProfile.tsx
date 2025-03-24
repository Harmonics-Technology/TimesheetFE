import {
    Box,
    Circle,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    HStack,
    Image,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import InputBlank from '@components/bits-utils/InputBlank';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { Logout } from '@components/bits-utils/LogUserOut';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import ProfileConfirmModal from '@components/bits-utils/ProfileConfirmModal';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import TwoFaModal from '@components/bits-utils/TwoFaModal';
import { yupResolver } from '@hookform/resolvers/yup';
import { Widget } from '@uploadcare/react-widget';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { BsCameraFill } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import {
    Enable2FAView,
    UpdateUserModel,
    UserService,
    UserView,
} from 'src/services';
import * as yup from 'yup';

const schema = yup.object().shape({});

export const AdminNewProfile = ({ data }: { data: UserView }) => {
    const userInfo: UserView = data;
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: userInfo?.id,
            role: userInfo?.role,
            isActive: userInfo?.isActive,
            firstName: userInfo?.firstName,
            lastName: userInfo?.lastName,
            phoneNumber: userInfo?.phoneNumber,
            organizationName: userInfo?.organizationName,
            organizationAddress: userInfo?.organizationAddress,
            organizationPhone: userInfo?.organizationPhone,
        },
    });
    const toast = useToast();
    const router = useRouter();
    const [twoFaData, setTwoFaData] = useState<Enable2FAView>();
    const [loading, setLoading] = useState(false);
    const [showLoading, setShowLoading] = useState(false);
    const widgetApi = useRef<any>();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [twofaState, settwofaState] = useState(
        userInfo?.twoFactorEnabled || false,
    );
    const {
        isOpen: open2Fa,
        onOpen: onOpen2Fa,
        onClose: close2Fa,
    } = useDisclosure();

    const reloadPage = () => {
        setShowLoading(false);
        onClose();
        router.replace(router.asPath);
    };

    const updatePicture = async (data: UpdateUserModel, info, callback?) => {
        data.firstName = userInfo?.firstName;
        data.lastName = userInfo?.lastName;
        data.isActive = userInfo?.isActive;
        data.id = userInfo?.id;
        data.organizationAddress = userInfo?.organizationAddress;
        data.organizationEmail = userInfo?.organizationEmail;
        data.organizationPhone = userInfo?.organizationPhone;
        data.phoneNumber = userInfo?.phoneNumber;
        data.role = userInfo?.role;
        data.profilePicture = info?.cdnUrl;

        try {
            const result = await UserService.updateUser(data);

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
                setShowLoading(true);
            });
            file.done((info) => {
                if (info) {
                    updatePicture(userInfo, info, reloadPage);
                    // setShowLoading(false);
                }
            });
        }
    };

    const twoFaSubmitFun = async (value) => {
        setLoading(true);
        try {
            const result = await UserService.enable2Fa(value);
            if (result.status) {
                setLoading(false);
                //
                if (result.data?.enable2FA) {
                    console.log({ res: result?.data });
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

    const trigger2fa = (value: any) => {
        settwofaState(value);
        twoFaSubmitFun(value);
    };

    const onSubmit = async (data: UpdateUserModel) => {
        try {
            const result = await UserService.updateUser(data);
            //
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box>
            <LeaveTab
                tabValue={[
                    {
                        text: 'Personal Information',
                        url: `/account-management/personal-info`,
                    },
                    {
                        text: 'Security Information',
                        url: `/account-management/security-info`,
                    },
                ]}
            />
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                mt="1rem"
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
                            {userInfo?.profilePicture ? (
                                <Image
                                    src={userInfo?.profilePicture}
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
                                                {userInfo?.profilePicture !==
                                                null
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
                                                {userInfo?.profilePicture !==
                                                null
                                                    ? 'Remove Photo'
                                                    : ''}
                                            </Text>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
                        </Circle>
                        <ProfileConfirmModal
                            isOpen={isOpen}
                            onClose={onClose}
                            user={userInfo}
                        />
                        <Box>
                            <Text
                                fontSize=".8rem"
                                color="brand.300"
                                fontWeight="bold"
                                textTransform="capitalize"
                            >
                                {userInfo?.role} Profile
                            </Text>
                            <Text fontSize=".8rem" color="brand.300" mb="0">
                                {userInfo?.fullName}
                            </Text>
                        </Box>
                    </HStack>
                    <Box>
                        <Text fontSize="13px" color="#718096">
                            Your Timba ID: <b>{userInfo?.timbaId}</b>
                        </Text>

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
            <Box w="full" bgColor="white" p="2rem" borderRadius="8px" mt="1rem">
                <form>
                    <Box>
                        <Text fontSize=".875rem" color="#1B1D21" mb="1rem">
                            Personal Information
                        </Text>
                        <VStack align="flex-start" spacing="1.5rem" w="80%">
                            <Grid
                                gap="1rem 1.5rem"
                                templateColumns={{
                                    base: 'repeat(1, 2fr)',
                                    lg: 'repeat(2, 1fr)',
                                }}
                                w="full"
                            >
                                <PrimaryInput<UpdateUserModel>
                                    label="First Name"
                                    name="firstName"
                                    error={errors.firstName}
                                    placeholder=""
                                    defaultValue={''}
                                    register={register}
                                    schema={schema}
                                />
                                <PrimaryInput<UpdateUserModel>
                                    label="Last Name"
                                    name="lastName"
                                    error={errors.lastName}
                                    placeholder=""
                                    defaultValue={''}
                                    register={register}
                                    schema={schema}
                                />
                            </Grid>
                            <PrimaryInput<UpdateUserModel>
                                label="Company Name"
                                name="organizationName"
                                error={errors.organizationName}
                                placeholder=""
                                defaultValue={''}
                                register={register}
                                schema={schema}
                            />
                            <Grid
                                gap="1rem"
                                templateColumns={{
                                    base: 'repeat(1, 2fr)',
                                    lg: 'repeat(2, 1fr)',
                                }}
                                w="full"
                            >
                                <InputBlank
                                    label="Email"
                                    placeholder=""
                                    defaultValue={
                                        userInfo?.organizationEmail as string
                                    }
                                    disableLabel={true}
                                />
                                <PrimaryPhoneInput<UpdateUserModel>
                                    label="Phone Number"
                                    name="organizationPhone"
                                    error={errors.organizationPhone}
                                    placeholder={
                                        userInfo?.organizationPhone as string
                                    }
                                    control={control}
                                />
                            </Grid>
                            <PrimaryTextarea<UpdateUserModel>
                                label="Address"
                                name="organizationAddress"
                                error={errors.organizationAddress}
                                placeholder=""
                                defaultValue={''}
                                register={register}
                                schema={schema}
                            />
                        </VStack>
                    </Box>
                    <Box mt="2rem" display="none">
                        <Text fontSize=".875rem" color="#1B1D21" mb="1rem">
                            Contact Person
                        </Text>
                        <VStack align="flex-start" spacing="1.5rem" w="80%">
                            <Grid
                                gap="1rem 1.5rem"
                                templateColumns={{
                                    base: 'repeat(1, 2fr)',
                                    lg: 'repeat(2, 1fr)',
                                }}
                                w="full"
                            >
                                <PrimaryInput<UpdateUserModel>
                                    label="Contact Person First Name"
                                    name="firstName"
                                    error={errors.firstName}
                                    placeholder=""
                                    defaultValue={''}
                                    register={register}
                                    schema={schema}
                                />
                                <PrimaryInput<UpdateUserModel>
                                    label="Contact Person Last Name"
                                    name="lastName"
                                    error={errors.lastName}
                                    placeholder=""
                                    defaultValue={''}
                                    register={register}
                                    schema={schema}
                                />
                                <InputBlank
                                    label="Email"
                                    placeholder=""
                                    defaultValue={userInfo?.email as string}
                                    disableLabel={true}
                                />
                                <PrimaryPhoneInput<UpdateUserModel>
                                    label="Phone Number"
                                    name="phoneNumber"
                                    error={errors.phoneNumber}
                                    placeholder={
                                        userInfo?.phoneNumber as string
                                    }
                                    control={control}
                                />
                            </Grid>
                        </VStack>
                    </Box>
                    <Box mt="1rem">
                        <ShiftBtn
                            text="Save"
                            bg="brand.400"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                        />
                    </Box>
                </form>
                <Box py="1.5rem" mt="1.5rem" borderTop="1px solid #c5c6cb">
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
                            alignItems="flex-start"
                            gap="1rem"
                        >
                            <ToggleSwitch
                                label="two_fa_setup"
                                onChange={() => trigger2fa(!twofaState)}
                                checked={twofaState}
                            />
                            {loading ? (
                                <Spinner />
                            ) : (
                                <FormLabel
                                    htmlFor="two_fa_setup"
                                    mt=".4rem"
                                    fontSize="14px"
                                    fontWeight="500"
                                >
                                    Enable
                                </FormLabel>
                            )}
                        </FormControl>
                    </VStack>
                </Box>
            </Box>
            <TwoFaModal isOpen={open2Fa} onClose={close2Fa} data={twoFaData} />
        </Box>
    );
};
