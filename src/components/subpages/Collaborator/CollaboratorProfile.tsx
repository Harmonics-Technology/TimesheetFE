import { Box, DrawerFooter, Grid, Text, useToast } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { UpdateCollaboratorModel, UserService, UserView } from 'src/services';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { LicenseEditBox } from '@components/bits-utils/LicenseEditBox';
import { LicenseRevoke } from '@components/bits-utils/LicenseRevoke';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    email: yup.string().email().required(),
    clientSubscriptionId: yup.string().required(),
});

export const CollaboratorProfile = ({
    userProfile,
    subs,
}: {
    userProfile: UserView;
    subs: any;
}) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateCollaboratorModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: userProfile?.id,
            address: userProfile?.address,
            clientSubscriptionId: userProfile?.clientSubscriptionId,
            email: userProfile?.email,
            firstName: userProfile?.firstName,
            jobTitle: (userProfile as any)?.jobTitle,
            lastName: userProfile?.lastName,
            isActive: userProfile?.isActive,
            phoneNumber: userProfile?.phoneNumber,
            isSendingInvoice: userProfile?.isSendingInvoice,
        },
    });

    const router = useRouter();
    const toast = useToast();

    const curentLicense = subs?.find(
        (x) => x.subscriptionId === userProfile?.clientSubscriptionId,
    );

    console.log({ userProfile });
    const [selectedLicense, setSelectedLicense] = useState<any>(curentLicense);
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    const onSubmit = async (data: UpdateCollaboratorModel) => {
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        try {
            const result = await UserService.updateCollaborator(data);
            //
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                // router.replace(router.asPath);
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            toast({
                title: err?.body?.title || err?.message,
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
            <Text
                textTransform="uppercase"
                mb=".8rem"
                fontSize="1.3rem"
                fontWeight="500"
                borderBottom="1px solid #f3f3f3"
            >
                Profile
            </Text>
            <form>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    gap="1rem 2rem"
                >
                    <PrimaryInput<UpdateCollaboratorModel>
                        label="First Name"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue={''}
                        register={register}
                        schema={schema}
                    />
                    <PrimaryInput<UpdateCollaboratorModel>
                        label="Last Name"
                        name="lastName"
                        error={errors.lastName}
                        placeholder=""
                        defaultValue={''}
                        register={register}
                        schema={schema}
                    />
                    <PrimaryInput<UpdateCollaboratorModel>
                        label="Email"
                        name="email"
                        error={errors.email}
                        placeholder=""
                        defaultValue={''}
                        disableLabel={true}
                        register={register}
                        schema={schema}
                    />
                    <PrimaryPhoneInput<UpdateCollaboratorModel>
                        label="Phone Number"
                        name="phoneNumber"
                        error={errors.phoneNumber}
                        placeholder={userProfile?.phoneNumber as string}
                        control={control}
                    />
                    <PrimarySelect<UpdateCollaboratorModel>
                        register={register}
                        schema={schema}
                        error={errors.isActive}
                        name="isActive"
                        label="Profile Status"
                        placeholder={'Please select'}
                        options={
                            <>
                                {[
                                    { id: true, label: 'Active' },
                                    { id: false, label: 'Not Active' },
                                ].map((x) => (
                                    <option value={x.id as any}>
                                        {x.label}
                                    </option>
                                ))}
                            </>
                        }
                    />
                    <PrimaryInput<UpdateCollaboratorModel>
                        label="Job Title"
                        name="jobTitle"
                        error={errors.jobTitle}
                        placeholder=""
                        defaultValue={''}
                        // disableLabel={true}
                        register={register}
                        schema={schema}
                    />
                </Grid>
                <Box mt="1rem">
                    <PrimaryInput<UpdateCollaboratorModel>
                        label="Address"
                        name="address"
                        error={errors.address}
                        placeholder=""
                        defaultValue={''}
                        register={register}
                        schema={schema}
                    />
                </Box>
                <Box my="1.5rem" pos="relative">
                    <PrimaryRadio<UpdateCollaboratorModel>
                        label="Invoice Category"
                        radios={['Receiving invoice', 'Sending invoice']}
                        name="isSendingInvoice"
                        control={control}
                        error={errors.isSendingInvoice}
                        defaultValue={
                            userProfile?.isSendingInvoice
                                ? 'Sending invoice'
                                : 'Receiving invoice'
                        }
                        schema={schema}
                    />
                </Box>
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
                    <LicenseRevoke
                        userId={userProfile?.id}
                        text="Revoke License"
                        disabled={!curentLicense}
                        setSelectedLicense={setSelectedLicense}
                    />
                </Box>
                {/* <DrawerFooter borderTopWidth="1px" mt="2rem" p="0"> */}
                <Grid
                    templateColumns="repeat(2,1fr)"
                    gap="1rem 2rem"
                    my="2rem"
                    w="full"
                >
                    <ShiftBtn
                        text="Back"
                        onClick={() => router.back()}
                        px="1rem"
                        bg="gray.500"
                        w="full"
                        h="2.8rem"
                    />
                    <ShiftBtn
                        text="Update Profile"
                        px="1rem"
                        w="full"
                        onClick={handleSubmit(onSubmit)}
                        loading={isSubmitting}
                        h="2.8rem"
                    />
                </Grid>
                {/* </DrawerFooter> */}
            </form>
        </Box>
    );
};
