import { VStack, useToast } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateCardDetailsModel, UserService } from 'src/services';
import { PrimaryInput } from './PrimaryInput';
import { ShiftBtn } from './ShiftBtn';

export const EditSavedCard = ({ data, setEditCard }) => {
    const { user } = useContext(UserContext);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UpdateCardDetailsModel>({
        mode: 'all',
        defaultValues: {
            name: data.customerName,
            email: data.customerEmail,
            paymentMethodId: data.id,
        },
    });

    const router = useRouter();
    const toast = useToast();
    const onSubmit = async (data: UpdateCardDetailsModel) => {
        try {
            const result = await UserService.updateUserCardDetails(
                user?.id,
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
                setEditCard({ id: '', value: false });
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
            <VStack
                align="flex-start"
                w="full"
                spacing="0"
                gap="1rem"
                mb="1rem"
            >
                <PrimaryInput<UpdateCardDetailsModel>
                    name="name"
                    error={errors.name}
                    placeholder="Company Name"
                    defaultValue=""
                    register={register}
                    label="Company Name"
                />
                <PrimaryInput<UpdateCardDetailsModel>
                    name="email"
                    error={errors.email}
                    placeholder="Company Email"
                    defaultValue=""
                    register={register}
                    label="Company Email"
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
