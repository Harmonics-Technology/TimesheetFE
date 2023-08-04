import { Box, Flex, Text, VStack, useToast } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import TitleText from '@components/bits-utils/TitleText';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import { UserContext } from '@components/context/UserContext';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ControlSettingView, UserService } from 'src/services';
import * as yup from 'yup';

const schema = yup.object().shape({
    oldPassword: yup.string().required(),
    newPassword: yup.string().required(),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('newPassword'), null], 'Passwords must match'),
});

interface PasswordReset {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const SecurityInformation = ({
    controls,
}: {
    controls: ControlSettingView;
}) => {
    const toast = useToast();
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordVisibleA, setPasswordVisibleA] = useState<boolean>(false);
    const [passwordVisibleB, setPasswordVisibleB] = useState<boolean>(false);
    const [isTwoFa, setisTwoFa] = useState(controls?.twoFactorEnabled);
    const { user } = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<PasswordReset>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const onSubmit = async (data: PasswordReset) => {
        try {
            const result = await UserService.updatePassword(data.newPassword);
            if (result.status) {
                // console.log({ result });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.push('/login');
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
    const updateControl = async () => {
        const superAdminId = user?.superAdminId;
        const twoFactorEnabled = isTwoFa;
        setLoading(true);
        try {
            const result = await UserService.updateControlSettings({
                twoFactorEnabled,
                superAdminId,
            });
            if (result.status) {
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
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
            setLoading(false);
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
        updateControl();
    }, [isTwoFa]);
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
            <Box mt="2rem" pb="3rem" borderBottom="1px solid #C2CFE0">
                <Text fontSize=".875rem" color="#1B1D21" mb="1rem">
                    Password Update Or Change
                </Text>
                <form>
                    <VStack spacing="1.5rem" align="flex-start" w="80%">
                        <PrimaryInput<PasswordReset>
                            register={register}
                            name="oldPassword"
                            error={errors.oldPassword}
                            defaultValue=""
                            placeholder="*********"
                            type={passwordVisible ? 'text' : 'password'}
                            icon={true}
                            passwordVisible={passwordVisible}
                            changeVisibility={() =>
                                setPasswordVisible(!passwordVisible)
                            }
                            label="Old Password"
                            fontSize="1rem"
                        />
                        <PrimaryInput<PasswordReset>
                            register={register}
                            name="newPassword"
                            error={errors.newPassword}
                            defaultValue=""
                            placeholder="*********"
                            type={passwordVisible ? 'text' : 'password'}
                            icon={true}
                            passwordVisible={passwordVisibleA}
                            changeVisibility={() =>
                                setPasswordVisibleA(!passwordVisibleA)
                            }
                            label="New Password"
                            fontSize="1rem"
                        />
                        <PrimaryInput<PasswordReset>
                            register={register}
                            name="confirmPassword"
                            error={errors.confirmPassword}
                            defaultValue=""
                            label="Confirm Password"
                            placeholder="*********"
                            fontSize="1rem"
                            type={passwordVisibleB ? 'text' : 'password'}
                            icon={true}
                            passwordVisible={passwordVisibleB}
                            changeVisibility={() =>
                                setPasswordVisibleB(!passwordVisibleB)
                            }
                        />

                        <ShiftBtn
                            text="Update Password"
                            bg="brand.400"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                        />
                    </VStack>
                </form>
            </Box>

            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%" gap="8rem">
                    <TitleText
                        title="Two Factor Authentication"
                        text="Two-factor authentication (2FA), also known as two-step verification, is a security feature used to enhance the protection of online accounts and systems. It adds an extra layer of security by requiring users to provide two different types of credentials to verify their identity when logging in or accessing sensitive information. Enable two factor authentication for Users, Clients and Team members on the application"
                    />

                    <ToggleSwitch
                        label="twofactor"
                        onChange={() => setisTwoFa(!isTwoFa)}
                        checked={isTwoFa}
                        loading={loading}
                    />
                </Flex>
            </Box>
        </Box>
    );
};
