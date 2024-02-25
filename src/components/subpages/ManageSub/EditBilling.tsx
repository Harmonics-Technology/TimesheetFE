import { Box, Button, Grid, Text, VStack, useToast } from '@chakra-ui/react';
import InputBlank from '@components/bits-utils/InputBlank';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateCardDetailsModel, UserService } from 'src/services';
import { CardField } from './CardField';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';

export const EditBilling = ({ data, setEditCard, countries }) => {
    const { user } = useContext(UserContext);
    const {
        register,
        handleSubmit,
        control,
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
                router.replace(router.asPath);
                setEditCard(undefined);
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
        <>
            <Box bgColor="white" borderRadius="8px" mt="1rem" p="1rem">
                <Text
                    color="brand.400"
                    fontWeight={500}
                    fontSize="14px"
                    cursor="pointer"
                    mb="1rem"
                    onClick={() => setEditCard(undefined)}
                >
                    Back
                </Text>
                <Box w="50%">
                    <Text mb="1rem" fontWeight={500}>
                        Billing Information Details
                    </Text>
                    <VStack>
                        <Grid
                            templateColumns={['1fr', 'repeat(2, 1fr)']}
                            gap="1.5rem"
                            w="full"
                        >
                            <PrimaryInput<UpdateCardDetailsModel>
                                name="name"
                                error={errors.name}
                                placeholder="Company Name"
                                defaultValue=""
                                register={register}
                                label="Company Name"
                            />
                            <SelectBlank
                                label="Country"
                                options={countries?.map((x) => (
                                    <option value={x?.name}>{x?.name}</option>
                                ))}
                            />
                            <InputBlank
                                placeholder="11, Isaac street"
                                defaultValue=""
                                label="Street Address"
                            />
                            <InputBlank
                                placeholder="Ontario"
                                defaultValue=""
                                label="City"
                            />
                            <InputBlank
                                placeholder="Toronto"
                                defaultValue=""
                                label="State"
                            />
                            <InputBlank
                                placeholder=""
                                defaultValue=""
                                label="Postal Code(optional)"
                            />
                        </Grid>
                    </VStack>
                </Box>
            </Box>
            <Box bgColor="white" borderRadius="8px" mt="1rem" p="1rem">
                <Box w="50%">
                    <Text mb="1rem" fontWeight={500}>
                        Payment Information
                    </Text>
                    <VStack align="flex-start" mb="30px">
                        <Grid
                            templateColumns={['1fr', 'repeat(2, 1fr)']}
                            gap="1.5rem"
                        >
                            <CardField
                                data={data}
                                label="Card Number"
                                border="1px solid #CBD5E0"
                                fontSize=".8rem"
                                p=".53rem .8rem"
                                br="0px"
                            />

                            <InputBlank
                                placeholder=""
                                defaultValue=""
                                label="Name on Card"
                                fontSize=".8rem"
                            />
                            <PrimaryDate<any>
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                error={errors?.email}
                            />
                            <InputBlank
                                placeholder=""
                                defaultValue=""
                                label="CVV"
                            />
                        </Grid>
                    </VStack>
                    <Button
                        w="50%"
                        h="40px"
                        bgColor="brand.400"
                        color="white"
                        borderRadius="5px"
                        onClick={() => handleSubmit(onSubmit)()}
                    >
                        Save
                    </Button>
                </Box>
            </Box>
        </>
    );
};
