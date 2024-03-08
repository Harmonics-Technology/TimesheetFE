import {
    Box,
    Button,
    Flex,
    Grid,
    Text,
    useToast,
    Icon,
    VStack,
    Circle,
    HStack,
} from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { UpdateUserModel, UserService, UserView } from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import {
    getCurrencyName,
    getPrefix,
    onBoardingFees,
} from '@components/generics/functions/getCurrencyName';
import { LicenseEditBox } from '@components/bits-utils/LicenseEditBox';
import { BsPencil, BsTrash3 } from 'react-icons/bs';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { BiPlus } from 'react-icons/bi';
import { LiaTimesSolid } from 'react-icons/lia';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';

const schema = yup.object().shape({});
interface PaymentPartnerProps {
    userProfile?: UserView;
    subs: any;
    currencies: any;
    userFees: any;
}

function PaymentPartner({
    userProfile,
    subs,
    currencies,
    userFees,
}: PaymentPartnerProps) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: userProfile?.id,
            isActive: userProfile?.isActive,
            role: userProfile?.role,
        },
    });
    const router = useRouter();
    const toast = useToast();
    const curentLicense = subs?.find(
        (x) => x.subscriptionId === userProfile?.clientSubscriptionId,
    );
    const [selectedLicense, setSelectedLicense] = useState<any>(curentLicense);
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    const [addFees, setAddFees] = useState(false);
    const [payFees, setPayFees] = useState<any>(userFees?.value);
    const [feeSetUp, setFeeSetUp] = useState<any>({
        onboardingFeeType: '',
        fee: '',
        id: '',
    });
    const editFees = (data: any) => {
        setAddFees(true);
        setFeeSetUp({
            onboardingFeeType: data.onboardingFeeType,
            fee: data.fee,
            id: data.id,
        });
    };

    const noFeeSetUpYet = !feeSetUp.onboardingFeeType || !feeSetUp.fee;

    const addToList = () => {
        if (noFeeSetUpYet) {
            return;
        }
        const isInList = payFees.find((x: any) => x.id == feeSetUp.id);
        const exists = payFees.find(
            (x: any) =>
                x.onboardingFeeType == feeSetUp.onboardingFeeType &&
                x.fee == feeSetUp.fee,
        );
        setFeeSetUp({ onboardingFeeType: '', fee: '' });
        if (isInList) {
            const foundItems = payFees.filter((x) => !(x.id === feeSetUp.id));
            setPayFees([...foundItems, feeSetUp]);
            return;
        }
        if (!exists) {
            setPayFees([...payFees, feeSetUp]);
            return;
        }
    };
    const removeFromList = (data: any) => {
        const foundItems = payFees.filter(
            (x) =>
                !(
                    x.onboardingFeeType === data.onboardingFeeType &&
                    x.fee === data.fee
                ),
        );
        setPayFees(foundItems);
    };

    const fixedUserFees = payFees?.filter(
        (x) => x.onboardingFeeType == 'fixedamount',
    );
    const percentageUserFees = payFees?.filter(
        (x) => x.onboardingFeeType == 'percentage',
    );

    const uniqueItems = getUniqueListBy(currencies, 'currency');

    const onSubmit = async (data: UpdateUserModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        data.onboardingFees = payFees;
        if (data == userProfile) {
            return;
        }

        try {
            const result = await UserService.adminUpdateUser(data);
            //
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
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
        } catch (error) {
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            minH="80vh"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(1,1fr)']}
                    gap="1rem 2rem"
                >
                    <Box>
                        {/* <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="3rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Basic Info
                        </Text> */}
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<UpdateUserModel>
                                label="Organisation Name"
                                name="organizationName"
                                error={errors.organizationName}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationName as string
                                }
                                register={register}
                            />
                            <InputBlank
                                label="Organisation Email"
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationEmail as string
                                }
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Phone Number"
                                name="phoneNumber"
                                error={errors.organizationPhone}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationPhone as string
                                }
                                register={register}
                            />
                            {/* <SelectrixBox<UpdateUserModel>
                                control={control}
                                name="isActive"
                                error={errors.isActive}
                                keys="id"
                                keyLabel="label"
                                label="Profile Status"
                                placeholder={
                                    userProfile?.isActive === true
                                        ? 'Active'
                                        : 'Not Active'
                                }
                                options={[
                                    { id: true, label: 'Active' },
                                    { id: false, label: 'Not Active' },
                                ]}
                            /> */}
                        </Grid>

                        <Grid
                            templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                            gap="1rem 2rem"
                            mt="1rem"
                        >
                            <PrimarySelect<UpdateUserModel>
                                register={register}
                                error={errors.currency}
                                name="currency"
                                label="Currency"
                                placeholder={
                                    userProfile?.currency || 'Select Currency'
                                }
                                options={
                                    <>
                                        {uniqueItems
                                            ?.sort((a, b) =>
                                                a?.currency?.localeCompare(
                                                    b?.currency,
                                                ),
                                            )
                                            .map((x) => (
                                                <option value={x.currency}>
                                                    {x.currency} (
                                                    {getCurrencyName(
                                                        x.currency,
                                                    ) || x.name}
                                                    )
                                                </option>
                                            ))}
                                    </>
                                }
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Address"
                                name="organizationAddress"
                                error={errors.organizationAddress}
                                placeholder=""
                                defaultValue={
                                    userProfile?.organizationAddress || ''
                                }
                                register={register}
                            />
                        </Grid>
                    </Box>
                    <Box display="none">
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="3rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Contact Details
                        </Text>
                        <Grid
                            templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                        >
                            <PrimaryInput<UpdateUserModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={userProfile?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={userProfile?.lastName as string}
                                register={register}
                            />
                            <InputBlank
                                label="Conatct Email"
                                placeholder=""
                                defaultValue={userProfile?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Contact Phone Number"
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                defaultValue={
                                    userProfile?.phoneNumber as string
                                }
                                register={register}
                            />
                        </Grid>
                    </Box>
                </Grid>
                <Box borderY="1px solid #d9d9d9" py="1rem" my="2rem">
                    <Text
                        fontWeight="600"
                        fontSize="1.1rem"
                        mb="1rem"
                        textTransform="capitalize"
                        color="brand.200"
                    >
                        License Plan Assigned
                    </Text>
                    <LicenseEditBox
                        data={subs}
                        updateFunction={addLicense}
                        items={selectedLicense}
                        customKeys={{
                            key: 'subscriptionId',
                            label: 'subscriptionType',
                            used: 'noOfLicenceUsed',
                            total: 'noOfLicensePurchased',
                        }}
                        removeFn={removeLicense}
                        id="assignLicense"
                        extraField={'users in total assigned to this license'}
                        checkbox
                    />
                </Box>
                <Box w="50%">
                    <Text
                        fontWeight="600"
                        fontSize="1.1rem"
                        mb="1rem"
                        textTransform="capitalize"
                        color="brand.200"
                    >
                        Payment Processing Fee
                    </Text>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem .5rem"
                        mt="1rem"
                        w="full"
                    >
                        <Box w="full">
                            <Text
                                fontWeight="500"
                                fontSize="13px"
                                mb="1rem"
                                textTransform="capitalize"
                                color="#1a202c"
                            >
                                Flat Rate Onboarding Fee
                            </Text>
                            <VStack align="flex-start" gap=".5rem">
                                {fixedUserFees?.map((x: any) => (
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                        h="45px"
                                        w="full"
                                        border="1px solid #e5e5e5"
                                        color="#6a7f9d"
                                        fontSize="13px"
                                        key={x.id}
                                        px="1rem"
                                        // onClick={() => editFees(x)}
                                    >
                                        <Text>
                                            {getPrefix(
                                                x.onboardingFeeType,
                                                watch,
                                            )}{' '}
                                            {x.fee} {'Flat Fee'}
                                        </Text>
                                        <HStack>
                                            <Icon
                                                as={BsPencil}
                                                onClick={() => editFees(x)}
                                            />
                                            {!x.id && (
                                                <Icon
                                                    as={BsTrash3}
                                                    onClick={() =>
                                                        removeFromList(x)
                                                    }
                                                />
                                            )}
                                        </HStack>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                        <Box w="full">
                            <Text
                                fontWeight="500"
                                fontSize="13px"
                                mb="1rem"
                                textTransform="capitalize"
                                color="#1a202c"
                            >
                                Percentage Onboarding Fee
                            </Text>
                            <VStack align="flex-start" gap=".5rem">
                                {percentageUserFees?.map((x: any) => (
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                        h="45px"
                                        w="full"
                                        border="1px solid #e5e5e5"
                                        color="#6a7f9d"
                                        fontSize="13px"
                                        key={x.id}
                                        px="1rem"
                                        // onClick={() => editFees(x)}
                                    >
                                        <Text>
                                            {getPrefix(
                                                x.onboardingFeeType,
                                                watch,
                                            )}{' '}
                                            {x.fee} {'Percentage Fee'}
                                        </Text>
                                        <HStack>
                                            <Icon
                                                as={BsPencil}
                                                onClick={() => editFees(x)}
                                            />
                                            {!x.id && (
                                                <Icon
                                                    as={BsTrash3}
                                                    onClick={() =>
                                                        removeFromList(x)
                                                    }
                                                />
                                            )}
                                        </HStack>
                                    </Flex>
                                ))}
                            </VStack>
                        </Box>
                    </Grid>
                    {addFees && (
                        <Box mt="2rem">
                            <Text
                                fontWeight="600"
                                fontSize="1.1rem"
                                mb="1rem"
                                textTransform="capitalize"
                                color="brand.200"
                            >
                                Add Processing Fee
                            </Text>
                            <Grid
                                templateColumns={['1fr', 'repeat(2,1fr)']}
                                gap="1rem 2rem"
                                mt="1rem"
                            >
                                <SelectBlank
                                    label="Processing Fee Type"
                                    placeholder="Select Fee Type"
                                    value={feeSetUp.onboardingFeeType}
                                    options={
                                        <>
                                            {onBoardingFees(watch)?.map((x) => (
                                                <option value={x.id}>
                                                    {x.name}
                                                </option>
                                            ))}
                                        </>
                                    }
                                    onChange={(e) =>
                                        setFeeSetUp({
                                            ...feeSetUp,
                                            onboardingFeeType: e.target.value,
                                        })
                                    }
                                />
                                <InputBlank
                                    label="Processing  Fee"
                                    placeholder=""
                                    defaultValue=""
                                    value={feeSetUp.fee}
                                    onChange={(e) =>
                                        setFeeSetUp({
                                            ...feeSetUp,
                                            fee: Number(e.target.value),
                                        })
                                    }
                                />
                            </Grid>
                            <Flex justify="flex-end" mt="1rem">
                                <Button
                                    bgColor="brand.400"
                                    color="white"
                                    w="24px"
                                    h="24px"
                                    minW="0"
                                    p="0"
                                    borderRadius="50%"
                                    onClick={() => addToList()}
                                    isDisabled={noFeeSetUpYet}
                                >
                                    <Icon as={BiPlus} />
                                </Button>
                            </Flex>
                            {/* {payFees?.length > 0 && (
                                <HStack
                                    my="1rem"
                                    py="1rem"
                                    borderY="1px solid"
                                    borderColor="gray.300"
                                    gap="1rem"
                                >
                                    {payFees?.map((x) => (
                                        <HStack gap=".3rem">
                                            <Circle
                                                bgColor="#829ab5"
                                                color="white"
                                                size="18px"
                                                fontSize={'12px'}
                                                onClick={() =>
                                                    removeFromList(x)
                                                }
                                            >
                                                <Icon as={LiaTimesSolid} />
                                            </Circle>
                                            <Flex
                                                align="center"
                                                px="17px"
                                                border="1px solid #c4c4c4"
                                                bgColor="#ebeff2"
                                                borderRadius="10px"
                                                h="33px"
                                            >
                                                <Text
                                                    color="#6a7f9d"
                                                    fontSize="12px"
                                                >
                                                    {getPrefix(
                                                        x.onboardingFeeType,
                                                        watch,
                                                    )}{' '}
                                                    {x.fee}{' '}
                                                    {x.onboardingFeeType}
                                                </Text>
                                            </Flex>
                                        </HStack>
                                    ))}
                                </HStack>
                            )} */}
                        </Box>
                    )}
                    <Button
                        borderRadius="10px"
                        bgColor="brand.400"
                        color="white"
                        fontSize="12px"
                        fontWeight={500}
                        mt="2rem"
                        h="37px"
                        onClick={() => setAddFees((prev) => !prev)}
                    >
                        {addFees ? 'Hide form' : '+ Add Processing Fee'}
                    </Button>
                </Box>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                    gap="1rem 2rem"
                    my="2rem"
                >
                    <Button
                        bgColor="gray.500"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={() => router.back()}
                    >
                        Back
                    </Button>
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="3rem"
                        fontSize="14px"
                        type="submit"
                        isLoading={isSubmitting}
                        spinner={<BeatLoader color="white" size={10} />}
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update Profile</Box>
                    </Button>
                </Grid>
            </form>
        </Box>
    );
}

export default PaymentPartner;
