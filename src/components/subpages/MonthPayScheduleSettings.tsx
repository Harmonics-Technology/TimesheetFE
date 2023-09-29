import { Box, Flex, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { UserContext } from '@components/context/UserContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});
import { FinancialService, PayScheduleGenerationModel } from 'src/services';
import * as yup from 'yup';
import { LabelSign } from '@components/bits-utils/LabelSign';
import { formatDate } from '@components/generics/functions/formatDate';

const schema = yup.object().shape({});

export const MonthPayScheduleSettings = ({
    data,
    bPeriod,
    payday,
    isMonth,
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<PayScheduleGenerationModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            startDate: bPeriod,
            paymentDateDays: payday,
        },
    });
    const toast = useToast();
    const router = useRouter();

    const [payType, setPayType] = useState(
        isMonth == true ? 1 : isMonth == false ? 2 : 0,
    );
    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;

    const onSubmit = async (data: PayScheduleGenerationModel) => {
        data.superAdminId = superAdminId;
        try {
            const result =
                payType == 1
                    ? await FinancialService.generateCustomFullMonthPaymentSchedule(
                          data.paymentDateDays,
                          superAdminId,
                      )
                    : await FinancialService.generateCustomMonthlyPaymentScheduleWeekPeriod(
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
                        Monthly Payment Schedule
                    </Text>
                    <Text color="#002861" fontSize="0.93rem" mb="0">
                        Payment is processed for either a full month or a 4
                        weeks period
                    </Text>
                </VStack>
                <LabelSign data={data ? 'Configured!' : 'Not Configured!'} />
            </Flex>
            <form>
                <VStack w="40%" spacing="1.5rem" align="flex-start">
                    <Selectrix
                        label="Payment Type"
                        options={[
                            { key: 1, label: 'Full Month' },
                            { key: 2, label: '4 Weeks Period' },
                        ]}
                        onChange={(val) => setPayType(val.key)}
                        placeholder={
                            payType == 1
                                ? 'Full Month'
                                : payType == 2
                                ? '4 Weeks Period'
                                : ''
                        }
                    />
                    {(payType as any) == 1 && (
                        <PrimaryInput<PayScheduleGenerationModel>
                            label="Payment Day"
                            name="paymentDateDays"
                            error={errors.paymentDateDays}
                            placeholder={payday || 'Enter the number of days'}
                            defaultValue=""
                            register={register}
                        />
                    )}
                    {(payType as any) == 2 && (
                        <HStack w="full" spacing="1rem">
                            <PrimaryDate<PayScheduleGenerationModel>
                                control={control}
                                name="startDate"
                                label="Beginning Period or  Start Date"
                                error={errors.startDate}
                                placeholder={
                                    bPeriod
                                        ? formatDate(bPeriod)
                                        : 'Please choose a date'
                                }
                                // min={new Date()}
                            />
                            <PrimaryInput<PayScheduleGenerationModel>
                                label="Payment Day"
                                name="paymentDateDays"
                                error={errors.paymentDateDays}
                                defaultValue=""
                                register={register}
                                placeholder={
                                    payday || 'Enter the number of days'
                                }
                            />
                        </HStack>
                    )}
                </VStack>
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
