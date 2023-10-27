import {
    Box,
    Flex,
    Grid,
    HStack,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import InputBlank from '@components/bits-utils/InputBlank';
import { LabelSign } from '@components/bits-utils/LabelSign';
import { PayscheduleSidenote } from '@components/bits-utils/PayscheduleSidenote';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import { yupResolver } from '@hookform/resolvers/yup';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { FinancialService, PayScheduleGenerationModel } from 'src/services';
import * as yup from 'yup';
import PayscheduleBottomNote from '../bits-utils/PayscheduleBottomNote';

const schema = yup.object().shape({
    startDate: yup.string().required(),
    paymentDateDays: yup
        .number()
        .required()
        .max(7, 'Select between 1 - 7 days'),
});

export const WeeklyPaySchedule = ({ data, bPeriod, payday }) => {
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
    const { user } = useContext(UserContext);
    const endDate = moment(watch('startDate')).add(4, 'days');
    const onSubmit = async (data: PayScheduleGenerationModel) => {
        data.superAdminId = user?.superAdminId;
        try {
            const result =
                await FinancialService.generateCustomWeeklyPaymentSchedule(
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
                            Weekly Payment Schedule
                        </Text>
                        <Text color="#002861" fontSize="0.93rem" mb="0">
                            Payment is processed for a Weekly period
                        </Text>
                    </VStack>
                    {/* <LabelSign
                        data={data ? 'Configured!' : 'Not Configured!'}
                    /> */}
                </Flex>
                <form>
                    <HStack w="90%" spacing="1rem" align="flex-end" mb="1rem">
                        <Box w="full">
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
                        </Box>
                        <Box w="full">
                            <InputBlank
                                label="End Date"
                                defaultValue=""
                                placeholder={endDate?.format('DD/MM/YYYY')}
                            />
                        </Box>
                        {/* <Box w="full">
                        <Text fontSize="12px" color="#8C8C8C" w="full" mb="0">
                            This end date is filled automatically after
                            selecting start date{' '}
                        </Text>
                    </Box> */}
                    </HStack>
                    <HStack w="90%" spacing="1rem" align="flex-end">
                        <Box w="full">
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
                        </Box>
                        <Box w="full">
                            <InputBlank
                                label="Day"
                                defaultValue=""
                                placeholder={moment(endDate)
                                    .add(watch('paymentDateDays'), 'days')
                                    .format('dddd')}
                            />
                        </Box>
                        {/* <Box w="full">
                        <Text fontSize="12px" color="#8C8C8C" w="full" mb="0">
                            The day is picked automatically after inputting the
                            num ber of days
                        </Text>
                    </Box> */}
                    </HStack>
                    <Box mt="32px">
                        <PayscheduleBottomNote />
                    </Box>
                    <Box m="2rem 0 20px">
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
