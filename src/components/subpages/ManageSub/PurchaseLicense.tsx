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
import InputBlank from '@components/bits-utils/InputBlank';
import { CAD } from '@components/generics/functions/Naira';
import { PurchaseNewLicensePlanModel, UserService } from 'src/services';

const schema = yup.object().shape({
    noOfLicense: yup.string().required(),
});
export const PurchaseLicense = ({
    base,
    superAdminId,
}: {
    base: any;
    superAdminId: string;
}) => {
    const [selected, setSelected] = useState<any>();
    const { user } = useContext(UserContext);
    const [confirmation, setConfirmation] = useState<boolean>(false);
    const toast = useToast();
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        trigger,
        formState: { errors, isSubmitting, isValid },
    } = useForm<PurchaseNewLicensePlanModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });

    const startDate = moment().format('DD/MM/YYYY');
    const endDate = moment().add(1, 'month').format('DD/MM/YYYY');
    const license = watch('noOfLicense');
    const value = Number((license as number) * selected?.amount) || 0;

    const showConfirmation = () => {
        if (!isValid) {
            trigger();
            return;
        }
        setConfirmation(true);
    };

    const onSubmit = async (data: PurchaseNewLicensePlanModel) => {
        data.totalAmount = value;
        data.subscriptionId = selected?.id;
        data.superAdminId = superAdminId;
        data.noOfLicense = Number(data.noOfLicense);
        try {
            const result = await UserService.purchaseNewLicensePlan(data);
            if (result.status) {
                if (result?.data?.data?.clientSecret) {
                    // router.push(
                    //     `${process.env.NEXT_PUBLIC_TTS}/summary/${result.data?.data?.id}?client_secret=${result?.data?.data?.clientSecret}&clientId=${result?.data?.data?.clientId}&from=${router.asPath}`,
                    // );
                    window.open(
                        `${process.env.NEXT_PUBLIC_TTS}/summary/${result.data?.data?.id}?client_secret=${result?.data?.data?.clientSecret}&clientId=${result?.data?.data?.clientId}&from=${router.asPath}`,
                    );
                    return;
                }
                toast({
                    title: result.message,
                    status: 'success',
                    position: 'top-right',
                });
                router.push('/');
                return;
            }

            toast({
                title: result.message,
                status: 'error',
                position: 'top-right',
            });
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                position: 'top-right',
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
                                    color="brand.400"
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
                                    color="brand.400"
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
                                loading={isSubmitting}
                                onClick={() => handleSubmit(onSubmit)()}
                            />
                        </HStack>
                    </Box>
                ) : (
                    <Box
                        mt="18px"
                        bgColor="white"
                        p="1rem"
                        borderRadius="8px"
                        minH="60vh"
                    >
                        <Text mb="1rem" fontWeight={500}>
                            Select License Plan
                        </Text>

                        <Grid
                            templateColumns={['1fr', 'repeat(4, 1fr)']}
                            gap="2rem"
                        >
                            {base?.map((x, i) => (
                                <SubCard
                                    amount={x?.totalMonthlyAmount}
                                    desc={x?.description}
                                    title={x?.name}
                                    bg={
                                        i == 0
                                            ? 'brand.400'
                                            : i == 1
                                            ? '#2383bd'
                                            : '#e8b44f'
                                    }
                                    onClick={setSelected}
                                    selected={selected}
                                    key={i}
                                    id={x.id}
                                />
                            ))}
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
                                        <PrimaryInput<PurchaseNewLicensePlanModel>
                                            label="Number Of License Purchased"
                                            name="noOfLicense"
                                            error={errors.noOfLicense}
                                            placeholder="10"
                                            defaultValue=""
                                            register={register}
                                        />
                                        <InputBlank
                                            label="Total Value Of License Purchased"
                                            placeholder="$50.00"
                                            defaultValue=""
                                            value={`${CAD(value)}.00`}
                                            readonly
                                        />
                                    </VStack>
                                    <Box w="full" mt="49px">
                                        <Button
                                            w="full"
                                            h="40px"
                                            bgColor="brand.400"
                                            color="white"
                                            borderRadius="5px"
                                            onClick={() => showConfirmation()}
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
