import { VStack, useToast } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { PrimaryInput } from './PrimaryInput';
import { PrimaryRadio } from './PrimaryRadio';
import { ShiftBtn } from './ShiftBtn';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useRouter } from 'next/router';
import {
    LeaveConfigurationModel,
    LeaveConfigurationView,
    LeaveService,
} from 'src/services';
import { UserContext } from '@components/context/UserContext';

const schema = yup.object().shape({});

interface leavesProps {
    leaveConfiguration: LeaveConfigurationView;
}

export const LeaveDaysDefaults = ({ leaveConfiguration }: leavesProps) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<LeaveConfigurationModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            eligibleLeaveDays: leaveConfiguration?.eligibleLeaveDays,
            id: leaveConfiguration?.id,
            isStandardEligibleDays: leaveConfiguration?.isStandardEligibleDays,
            superAdminId: leaveConfiguration?.superAdminId,
        },
    });

    const router = useRouter();
    const toast = useToast();

    const { user } = useContext(UserContext);
    const superAdminId = user?.superAdminId;
    // console.log({ leaveConfiguration });

    const leaveconfig =
        leaveConfiguration?.isStandardEligibleDays == true ? 'Yes' : 'No';

    const onSubmit = async (data: LeaveConfigurationModel) => {
        data.superAdminId = superAdminId;

        (data.isStandardEligibleDays as any) == 'Yes'
            ? (data.isStandardEligibleDays = true)
            : (data.isStandardEligibleDays = false);

        try {
            const result = await LeaveService.updateLeaveConfiguration(data);
            if (result.status) {
                toast({
                    title: `Successful`,
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
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <form>
            <VStack spacing="1rem" align="flex-start">
                <PrimaryInput<LeaveConfigurationModel>
                    label="Standard Leave Eligible Days"
                    name="eligibleLeaveDays"
                    error={errors.eligibleLeaveDays}
                    placeholder=""
                    defaultValue=""
                    register={register}
                    w="10%"
                />
                <PrimaryRadio<LeaveConfigurationModel>
                    label="is this the standard eligible leave for all your staff members in your company"
                    radios={['Yes', 'No']}
                    name="isStandardEligibleDays"
                    control={control}
                    error={errors.isStandardEligibleDays}
                    defaultValue={leaveconfig}
                />
                <ShiftBtn
                    text="Save"
                    bg="brand.400"
                    onClick={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                />
            </VStack>
        </form>
    );
};
