import {
    Box,
    Button,
    Grid,
    HStack,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { SubCard } from './SubCard';
import TitleText from '@components/bits-utils/TitleText';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';
import { SingleConfirmationText } from './SingleConfirmationText';
import { UserContext } from '@components/context/UserContext';
import moment from 'moment';
import { LicenseNav } from './LicenseNav';

interface ILicenseSub {
    noOfLicensePurchase: number | string | undefined;
    totalValue: number | string | undefined;
}
const schema = yup.object().shape({
    noOfLicensePurchase: yup.string().required(),
    totalValue: yup.string().required(),
});
export const PurchaseLicense = () => {
    const [selected, setSelected] = useState<any>();
    const { user } = useContext(UserContext);
    const [confirmation, setConfirmation] = useState<boolean>(true);
    const toast = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ILicenseSub>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const startDate = moment().format('DD/MM/YYYY');
    const endDate = moment(startDate).add(1, 'month').format('DD/MM/YYYY');
    const license = watch('noOfLicensePurchase');
    const value = watch('totalValue');

    const onSubmit = async (data: ILicenseSub) => {
        try {
            let result;
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                });
                return;
            }
            toast({
                title: result.message,
                status: 'error',
            });
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
            });
        }
    };
    return (
        <>
            <LicenseNav />
            <Box bgColor="white" w="full" borderRadius="8px">
                {confirmation ? (
                    <Box w="70%" mx="auto" py="4rem">
                        <Box
                            borderRadius="5px"
                            border="1px solid #C2CFE0"
                            p="1rem 2rem 105px"
                            mb="31px"
                            bgColor="white"
                        >
                            <Text
                                fontSize="20px"
                                fontWeight={500}
                                color="#1b1d21"
                                textAlign="center"
                            >
                                Subscription Confirmation
                            </Text>

                            <Box mt="30px">
                                <SingleConfirmationText
                                    title="Company Name"
                                    sub={user?.companyName}
                                />
                                <SingleConfirmationText
                                    title="Duration"
                                    sub={'1 Month'}
                                />
                                <SingleConfirmationText
                                    title="Start Date"
                                    sub={startDate}
                                />
                                <SingleConfirmationText
                                    title="Due Date"
                                    sub={endDate}
                                />
                                <SingleConfirmationText
                                    title="License Package"
                                    sub={selected?.title}
                                />
                                <SingleConfirmationText
                                    title="Value of License"
                                    sub={selected?.amount}
                                    color="brand.100"
                                    fw={700}
                                    price
                                />
                                <SingleConfirmationText
                                    title="Number of License"
                                    sub={license}
                                />
                                <SingleConfirmationText
                                    title="Total Value of License Purchased"
                                    sub={value}
                                    color="brand.100"
                                    fw={700}
                                    price
                                />
                            </Box>
                        </Box>
                        <HStack justifyContent="space-between" align="center">
                            <ShiftBtn
                                color="white"
                                bg="#da5867"
                                h="44px"
                                text="Cancel"
                                onClick={() => setConfirmation(false)}
                            />
                            <ShiftBtn
                                color="white"
                                bg="brand.400"
                                h="44px"
                                text="Proceed To Checkout"
                                onClick={() => handleSubmit(onSubmit)()}
                            />
                        </HStack>
                    </Box>
                ) : (
                    <Box mt="18px" bgColor="white" p="1rem" borderRadius="8px">
                        <Text mb="1rem" fontWeight={500}>
                            Select License Plan
                        </Text>

                        <Grid
                            templateColumns={['1fr', 'repeat(4, 1fr)']}
                            gap="2rem"
                        >
                            <SubCard
                                amount="5"
                                desc="The best way to start organizing your company"
                                title="Timba Basic Plan"
                                bg="brand.400"
                                onClick={setSelected}
                            />
                            <SubCard
                                amount="10"
                                desc="The best way to start organizing your company"
                                title="Timba Standard Plan"
                                onClick={setSelected}
                                bg="#2383bd"
                            />
                            <SubCard
                                amount="20"
                                desc="The best way to start organizing your company"
                                title="Timba Premium Plan"
                                onClick={setSelected}
                                bg="#e8b44f"
                            />
                        </Grid>

                        {selected && (
                            <Box
                                bgColor="white"
                                p="1rem"
                                borderRadius="8px"
                                mt="1rem"
                            >
                                <Box w="50%">
                                    <TitleText
                                        title="Purchase License Plan"
                                        fontSize="1rem"
                                        gap="0"
                                        text={`You have Selected ${selected?.title}, which is <b>$${selected?.amount}/month</b>`}
                                    />

                                    <VStack
                                        gap="1.5rem"
                                        align="flex-start"
                                        mt="2rem"
                                    >
                                        <PrimaryInput<ILicenseSub>
                                            label="Number Of License Purchased"
                                            name="noOfLicensePurchase"
                                            error={errors.noOfLicensePurchase}
                                            placeholder="10"
                                            defaultValue=""
                                            register={register}
                                        />
                                        <PrimaryInput<ILicenseSub>
                                            label="Total Value Of License Purchased"
                                            name="totalValue"
                                            error={errors.totalValue}
                                            placeholder="$50.00"
                                            defaultValue=""
                                            register={register}
                                        />
                                    </VStack>
                                    <Box w="full" mt="49px">
                                        <Button
                                            w="full"
                                            h="40px"
                                            bgColor="brand.400"
                                            color="white"
                                            borderRadius="5px"
                                            onClick={() =>
                                                setConfirmation(true)
                                            }
                                        >
                                            Buy License
                                        </Button>
                                    </Box>
                                </Box>
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        </>
    );
};
