import { Box, HStack, Text, VStack, useToast } from '@chakra-ui/react';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { TeamMemberModel, UserService } from 'src/services';
import * as yup from 'yup';

const schema = yup.object().shape({});

export const MonthPayScheduleSettings = () => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<TeamMemberModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const toast = useToast();
    const router = useRouter();

    const payType = watch('isActive');

    const onSubmit = async (data: TeamMemberModel) => {
        try {
            const result = await UserService.addTeamMember(data);
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
            console.log(error);
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
            <VStack align="flex-start" mb='1.5rem'>
                <Text
                    color="#002861"
                    fontSize="0.93rem"
                    fontWeight="500"
                    mb="0"
                >
                    Monthly Payment Schedule
                </Text>
                <Text color="#002861" fontSize="0.93rem" mb="0">
                    Payment is processed for either a full month or a 4 weeks
                    period
                </Text>
            </VStack>
            <form>
                <VStack w="40%" spacing="1.5rem">
                    <SelectrixBox<TeamMemberModel>
                        control={control}
                        name="isActive"
                        error={errors.isActive}
                        keys="id"
                        keyLabel="label"
                        label="Payment Type"
                        options={[
                            { id: 1, label: 'Full Month' },
                            { id: 2, label: '4 Weeks Period' },
                        ]}
                    />
                    {(payType as any) == 1 ? (
                        <PrimaryInput<TeamMemberModel>
                            label="Payment Day"
                            name="clientRate"
                            error={errors.clientRate}
                            placeholder="Enter the payment day"
                            defaultValue=""
                            register={register}
                        />
                    ) : (
                        <HStack w="full" spacing="1rem">
                            <PrimaryDate<TeamMemberModel>
                                control={control}
                                name="startDate"
                                label="Beginning Period or  Start Date"
                                error={errors.startDate}
                                // min={new Date()}
                            />
                            <PrimaryInput<TeamMemberModel>
                                label="Payment Day"
                                name="clientRate"
                                error={errors.clientRate}
                                placeholder="Enter the payment day"
                                defaultValue=""
                                register={register}
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
