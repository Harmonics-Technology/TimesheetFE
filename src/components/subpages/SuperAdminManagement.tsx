import { Box, Button, Grid, Text, useToast } from '@chakra-ui/react';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import roles from '../generics/roles.json';
import { UpdateUserModel, UserService, UserView } from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import { useRouter } from 'next/router';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import BeatLoader from 'react-spinners/BeatLoader';
import { LicenseEditBox } from '@components/bits-utils/LicenseEditBox';
import { LicenseRevoke } from '@components/bits-utils/LicenseRevoke';

const schema = yup.object().shape({
    firstName: yup.string().required(),
    lastName: yup.string().required(),
    // role: yup.string().required(),
    isActive: yup.string().required(),
    id: yup.string().required(),
});
interface SuperadminProfileProps {
    userProfile?: UserView;
    subs: any;
}
function SuperadminProfile({ userProfile, subs }: SuperadminProfileProps) {
    //
    const {
        register,
        handleSubmit,
        control,
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
    //

    const toast = useToast();
    const router = useRouter();
    const onSubmit = async (data: UpdateUserModel) => {
        // data.isActive = data.isActive === ('true' as unknown as boolean);
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
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
            <Text
                fontWeight="600"
                fontSize="1.1rem"
                mb="3rem"
                textTransform="capitalize"
                color="brand.200"
            >
                Basic Info
            </Text>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                    gap="1rem 2rem"
                >
                    <PrimaryInput<UpdateUserModel>
                        label="First Name"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue={userProfile?.firstName as string}
                        register={register}
                    />
                    <PrimaryInput<UpdateUserModel>
                        label="Last Name"
                        name="lastName"
                        error={errors.lastName}
                        placeholder=""
                        defaultValue={userProfile?.lastName as string}
                        register={register}
                    />
                    <InputBlank
                        label="Email"
                        placeholder=""
                        defaultValue={userProfile?.email as string}
                        disableLabel={true}
                    />
                    <SelectrixBox<UpdateUserModel>
                        control={control}
                        name="role"
                        error={errors.role}
                        keys="title"
                        keyLabel="title"
                        label="Role"
                        placeholder={userProfile?.role as string}
                        options={roles.slice(0, 3)}
                    />

                    <SelectrixBox<UpdateUserModel>
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
                    />
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
                    <LicenseRevoke
                        userId={userProfile?.id}
                        text="Revoke License"
                        disabled={!curentLicense}
                        setSelectedLicense={setSelectedLicense}
                    />
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
                        type="submit"
                        isLoading={isSubmitting}
                        spinner={<BeatLoader color="white" size={10} />}
                        fontSize="14px"
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

export default SuperadminProfile;
