import { VStack, useToast } from '@chakra-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import React, { useContext, useEffect } from 'react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { LeaveTypeModel, LeaveService } from 'src/services';
import { PrimaryInput } from './PrimaryInput';
import { ShiftBtn } from './ShiftBtn';
import { UserContext } from '@components/context/UserContext';

const schema = yup.object().shape({
    name: yup.string().required(),
});

export const AddEditLeave = ({ data }: { data?: any }) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<LeaveTypeModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            name: data?.name,
        },
    });
    const router = useRouter();
    const toast = useToast();
    const { user } = useContext(UserContext);

    useEffect(() => {
        reset({ name: data?.name });
    }, [data]);

    const id = data?.id;
    const superAdminId = user?.superAdminId;

    const onSubmit = async (data: LeaveTypeModel) => {
        data.superAdminId = superAdminId;
        try {
            const result = await LeaveService.addLeaveType(data);
            if (result.status) {
                toast({
                    title: `Successfully created`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                reset({ name: '' });
                router.replace(router.asPath);
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
    const editLeaveType = async (data: LeaveTypeModel) => {
        data.superAdminId = superAdminId;

        try {
            const result = await LeaveService.updateLeaveType(id, data);
            if (result.status) {
                toast({
                    title: `Leave type updated`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                reset({ name: '' });
                router.replace(router.asPath);
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
            <VStack align="flex-start" spacing="1.5rem">
                <PrimaryInput<LeaveTypeModel>
                    label="Leave Type"
                    name="name"
                    error={errors.name}
                    placeholder="Leave Type"
                    defaultValue={data?.name || ''}
                    register={register}
                />
                <ShiftBtn
                    text="Save"
                    bg="brand.400"
                    onClick={
                        data !== undefined
                            ? handleSubmit(editLeaveType)
                            : handleSubmit(onSubmit)
                    }
                    loading={isSubmitting}
                />
            </VStack>
        </form>
    );
};
