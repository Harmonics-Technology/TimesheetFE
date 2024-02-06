import {
    Box,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
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
import InputBlank from '@components/bits-utils/InputBlank';
import PayscheduleBottomNote from '@components/bits-utils/PayscheduleBottomNote';
import { PayscheduleSidenote } from '@components/bits-utils/PayscheduleSidenote';
import moment from 'moment';
import { CustomDateTime } from '@components/bits-utils/CustomDateTime';
import { CustomDatePick } from '@components/bits-utils/CustomDatePick';

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
        watch,
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
    const endDate = moment(watch('startDate')).add(27, 'days');
    const [year, setYear] = useState();

    const onSubmit = async (data: PayScheduleGenerationModel) => {
        data.superAdminId = superAdminId;
        try {
            const result =
                payType == 1
                    ? await FinancialService.generateCustomFullMonthPaymentSchedule(
                          data.paymentDateDays,
                          superAdminId,
                          Number(moment(year).format('YYYY')),
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
        <Grid
            h="full"
            borderBottom="1px solid #C2CFE0"
            py="1.5rem"
            mb="1rem"
            templateColumns={['1fr', 'repeat(2, 1fr)']}
        >
            <Box w="full">
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
                    {/* <LabelSign
                        data={data ? 'Configured!' : 'Not Configured!'}
                    /> */}
                </Flex>
                <form>
                    <VStack w="90%" spacing="1.5rem" align="flex-start">
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
                            <HStack w="full" spacing="1rem" align="flex-end">
                                <PrimaryInput<PayScheduleGenerationModel>
                                    label="Payment Day"
                                    name="paymentDateDays"
                                    error={errors.paymentDateDays}
                                    placeholder={
                                        payday || 'Enter the number of days'
                                    }
                                    defaultValue=""
                                    register={register}
                                />
                                <Box w="full">
                                    <FormLabel
                                        htmlFor={'Select Year'}
                                        textTransform="capitalize"
                                        fontSize={'.8rem'}
                                    >
                                        {'Select Year'}
                                    </FormLabel>
                                    <Box w="100%">
                                        <CustomDatePick
                                            date={year}
                                            setDate={setYear}
                                            onlyYear={true}
                                            format="YYYY"
                                        />
                                    </Box>
                                </Box>
                            </HStack>
                        )}
                        {(payType as any) == 2 && (
                            <>
                                <HStack
                                    w="full"
                                    spacing="1rem"
                                    align="flex-end"
                                >
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
                                    <InputBlank
                                        label="End Date"
                                        defaultValue=""
                                        placeholder={endDate?.format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                </HStack>
                                <HStack w="90%" spacing="1rem" align="flex-end">
                                    <PrimaryInput<PayScheduleGenerationModel>
                                        label="Payment Date Offset (in days)"
                                        name="paymentDateDays"
                                        error={errors.paymentDateDays}
                                        defaultValue=""
                                        register={register}
                                        placeholder={
                                            payday || 'Enter the number of days'
                                        }
                                    />
                                    <InputBlank
                                        label="Day"
                                        defaultValue=""
                                        placeholder={moment(endDate)
                                            .add(
                                                watch('paymentDateDays'),
                                                'days',
                                            )
                                            .format('dddd')}
                                    />
                                </HStack>
                                <Box mt="32px">
                                    <PayscheduleBottomNote />
                                </Box>
                            </>
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
            <PayscheduleSidenote />
        </Grid>
    );
};
