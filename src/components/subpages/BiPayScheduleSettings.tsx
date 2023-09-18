import { Box, Flex, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { LabelSign } from '@components/bits-utils/LabelSign';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { UserContext } from '@components/context/UserContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FinancialService, PayScheduleGenerationModel } from 'src/services';
import * as yup from 'yup';

const schema = yup.object().shape({
    startDate: yup.string().required(),
    paymentDateDays: yup.string().required(),
});

export const BiPayScheduleSettings = ({ data }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PayScheduleGenerationModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const toast = useToast();
    const router = useRouter();
    const { user } = useContext(UserContext);

    const onSubmit = async (data: PayScheduleGenerationModel) => {
        data.superAdminId = user?.superAdminId;
        try {
            const result =
                await FinancialService.generateCustomBiWeeklyPaymentSchedule(
                    data,
                );
            if (result.status) {
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
        <Box py="1.5rem" mb="1rem" borderBottom="1px solid #C2CFE0">
            <Flex justify="space-between">
                <VStack align="flex-start" mb="1.5rem">
                    <Text
                        color="#002861"
                        fontSize="0.93rem"
                        fontWeight="500"
                        mb="0"
                    >
                        Bi-weekly Payment Schedule
                    </Text>
                    <Text color="#002861" fontSize="0.93rem" mb="0">
                        Payment is processed for a Bi-weekly period
                    </Text>
                </VStack>
                <LabelSign data={data ? 'Configured!' : 'Not Configured!'} />
            </Flex>
            <form>
                <HStack w="40%" spacing="1rem">
                    <PrimaryDate<PayScheduleGenerationModel>
                        control={control}
                        name="startDate"
                        label="Beginning Period or  Start Date"
                        error={errors.startDate}
                        // min={new Date()}
                    />
                    <PrimaryInput<PayScheduleGenerationModel>
                        label="Payment period"
                        name="paymentDateDays"
                        error={errors.paymentDateDays}
                        placeholder="Enter the number of days"
                        defaultValue=""
                        register={register}
                    />
                </HStack>
                <Box my="2rem">
                    <ShiftBtn
                        text="Save"
                        bg="brand.400"
                        onClick={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                    />
                </Box>
            </form>
        </Box>
    );
};
