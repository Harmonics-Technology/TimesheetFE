import { Box, HStack, Text, useToast, Button } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { PrimaryInput } from './PrimaryInput';
import {
    OnboardingFeeModel,
    OnboardingFeeView,
    OnboardingFeeService,
} from 'src/services';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';

export const OnboardingFee = ({ data }: { data: OnboardingFeeView }) => {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFeeModel>({
        mode: 'all',
        defaultValues: {
            onboardingTypeId: 2,
        },
    });
    const toast = useToast();
    const onSubmit = async (data: OnboardingFeeModel) => {
        try {
            const result = await OnboardingFeeService.addFee(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    position: 'top-right',
                });
                router.reload();
                return;
            }
        } catch (err: any) {
            toast({
                position: 'top-right',
                title: err?.body?.message || err.message,
                status: 'error',
            });
        }
    };
    return (
        <Box
            bgColor="white"
            borderRadius="10px"
            h="70vh"
            w="full"
            p="2rem 2rem"
            boxShadow="sm"
        >
            <HStack
                mb="3rem"
                bgColor="gray.300"
                w="fit-content"
                p=".3rem .5rem"
            >
                <Link href={`/${role}/settings/hst`} passHref>
                    <Text
                        // bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                    >
                        HST Settings
                    </Text>
                </Link>
                <Link href={`/${role}/settings/onboarding-fee`} passHref>
                    <Text
                        bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                        fontWeight="600"
                    >
                        Fixed Fee Settings
                    </Text>
                </Link>
                <Link href={`/${role}/settings/onboarding-percent`} passHref>
                    <Text
                        // bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                    >
                        Percentage Fee Settings
                    </Text>
                </Link>
            </HStack>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box w="20%">
                    <Text fontWeight="600" fontSize=".9rem" mb="0">
                        Fixed Amount ($)
                    </Text>
                    <PrimaryInput<OnboardingFeeModel>
                        label=""
                        name="fee"
                        error={errors.fee}
                        placeholder=""
                        defaultValue={data?.fee}
                        register={register}
                    />
                </Box>
                <Button
                    bgColor="brand.400"
                    color="white"
                    px="2rem"
                    h="2.2rem"
                    fontSize=".9rem"
                    textTransform="uppercase"
                    mt=".8rem"
                    type="submit"
                    isLoading={isSubmitting}
                >
                    Save
                </Button>
            </form>
        </Box>
    );
};
