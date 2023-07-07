import {
    Box,
    FormControl,
    FormLabel,
    Grid,
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
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import TwoFaModal from '@components/bits-utils/TwoFaModal';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { yupResolver } from '@hookform/resolvers/yup';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
    const [twofaState, settwofaState] = useState(
        userInfo?.twoFactorEnabled || false,
    );
    const {
        isOpen: open2Fa,
        onOpen: onOpen2Fa,
        onClose: close2Fa,
    } = useDisclosure();
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

    const onSubmit = async (data: UpdateUserModel) => {
        try {
            const result = await UserService.updateUser(data);
            // console.log({ result });
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
        } catch (error: any) {
            console.log(error);
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useNonInitialEffect(() => {
        twoFaSubmitFun();
    }, [twofaState]);
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
            <form>
                <Box mt="2rem">
                    <Text fontSize=".875rem" color="#1B1D21">
                        Personal Information
                    </Text>
                    <VStack align="flex-start" spacing="1.5rem" w="80%">
                        <PrimaryInput<UpdateUserModel>
                            label="Company Name"
                            name="organizationName"
                            error={errors.organizationName}
                            placeholder=""
                            defaultValue={''}
                            register={register}
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
                        />
                    </VStack>
                </Box>
                <Box mt="2rem">
                    <Text fontSize=".875rem" color="#1B1D21">
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
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Person Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={''}
                                register={register}
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
                                placeholder={userInfo?.phoneNumber as string}
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
                        >
                            Two factor authentication
                        </Text>
                        <Text
                            color="#484747"
                            fontWeight="400"
                            lineHeight="150%"
                            fontSize="14px"
                        >
                            Two-Factor Authentication is an enhanced security
                            measure. Once enabled, you will be required to give
                            two types of Identification when you login.
                        </Text>
                    </Box>

                    <FormControl
                        display="flex"
                        alignItems="flex-start"
                        gap="1rem"
                    >
                        <ToggleSwitch
                            label="two_fa_setup"
                            onChange={() => settwofaState(!twofaState)}
                            checked={
                                userInfo?.twoFactorEnabled == true
                                    ? true
                                    : false
                            }
                        />
                        {loading ? (
                            <Spinner />
                        ) : (
                            <FormLabel
                                htmlFor="two_fa_setup"
                                mb="0"
                                fontSize="14px"
                                fontWeight="500"
                            >
                                Enable
                            </FormLabel>
                        )}
                    </FormControl>
                </VStack>
            </Box>
            <TwoFaModal isOpen={open2Fa} onClose={close2Fa} data={twoFaData} />
        </Box>
    );
};
