import {
    Box,
    Button,
    Circle,
    Grid,
    HStack,
    Text,
    useToast,
    Image,
    Flex,
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import { UpdateUserModel, UserService, UserView } from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import Cookies from 'js-cookie';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import { Widget } from '@uploadcare/react-widget';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';

const schema = yup.object().shape({
    // firstName: yup.string().required(),
    // lastName: yup.string().required(),
    // role: yup.string().required(),
    // isActive: yup.string().required(),
    // id: yup.string().required(),
});

function MyProfile({ user }: { user: UserView }) {
    // console.log({ user });
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<UpdateUserModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            id: user?.id,
            role: user?.role,
            isActive: user?.isActive,
            firstName: user?.firstName,
            lastName: user?.lastName,
            address: user?.address,
            phoneNumber: user?.phoneNumber,
            organizationName: user?.organizationName,
            profilePicture: user?.profilePicture,
        },
    });
    const toast = useToast();
    const [showLoading, setShowLoading] = useState(false);
    const [pictureUrl, setPictureUrl] = useState<any>('');
    const widgetApi = useRef<any>();
    const router = useRouter();

    const reloadPage = () => {
        setShowLoading(false);
        router.reload();
    };
    const updatePicture = async (data: UpdateUserModel, info, callback) => {
        data.firstName = user?.firstName;
        data.lastName = user?.lastName;
        data.isActive = user?.isActive;
        data.id = user?.id;
        data.organizationAddress = user?.organizationAddress;
        data.organizationEmail = user?.organizationEmail;
        data.organizationPhone = user?.organizationPhone;
        data.phoneNumber = user?.phoneNumber;
        data.role = user?.role;
        data.profilePicture = info?.cdnUrl;
        console.log({ data });
        try {
            const result = await UserService.updateUser(data);
            console.log({ result });
            if (result.status) {
                toast({
                    title: 'Profile Picture Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                callback();
                return;
            }
            callback();
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            callback();
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                console.log('File progress: ', info.progress),
                    setShowLoading(true);
            });
            file.done((info) => {
                console.log('File uploaded: ', info), setPictureUrl(info);
                if (info) {
                    updatePicture(user, info, reloadPage);
                    // setShowLoading(false);
                }
            });
        }
    };

    const onSubmit = async (data: UpdateUserModel) => {
        console.log({ data });
        if (pictureUrl !== '') {
            data.profilePicture = pictureUrl.cdnUrl;
        }
        try {
            const result = await UserService.updateUser(data);
            console.log({ result });
            if (result.status) {
                toast({
                    title: 'Profile Update Success',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                Cookies.set('user', JSON.stringify(result.data));
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error) {
            console.log(error);
            toast({
                title: `Check your network connection and try again`,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex
                    justify="space-between"
                    align={['unset', 'center']}
                    flexDirection={['column', 'row']}
                >
                    <HStack gap="1rem" align="center" mb={['1rem', '0']}>
                        <Circle
                            bgColor="brand.600"
                            size="4rem"
                            fontSize="2rem"
                            color="white"
                            overflow="hidden"
                        >
                            {user?.profilePicture ? (
                                <Image
                                    src={user?.profilePicture}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                />
                            ) : (
                                <FaUser />
                            )}
                        </Circle>
                        <Box>
                            <Text
                                fontSize=".8rem"
                                color="brand.300"
                                fontWeight="bold"
                            >
                                {user?.role} Profile
                            </Text>
                            <Text fontSize=".8rem" color="brand.300" mb="0">
                                {user?.fullName}
                            </Text>
                        </Box>
                    </HStack>
                    <Box>
                        <Button
                            bgColor="brand.600"
                            color="white"
                            fontSize=".8rem"
                            borderRadius="0"
                            border="2px solid"
                            // borderColor="brand.600"
                            isLoading={showLoading}
                            onClick={() => widgetApi.current.openDialog()}
                            w={['full', 'inherit']}
                        >
                            {user.profilePicture == null
                                ? 'Add Profile Photo'
                                : 'Change Profile Photo'}
                        </Button>
                        <Box display="none">
                            <Widget
                                publicKey="fda3a71102659f95625f"
                                clearable
                                onFileSelect={(file) => showLoadingState(file)}
                                ref={widgetApi}
                                systemDialog={true}
                                inputAcceptTypes={'.jpg,.jpeg,.png,.gif,.heic'}
                            />
                        </Box>
                    </Box>
                </Flex>
            </Box>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    gap="1rem 1rem"
                    my="1.5rem"
                >
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Personal Information
                        </Text>
                        <Grid gap=".5rem">
                            <PrimaryInput<UpdateUserModel>
                                label="First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={user?.firstName as string}
                                register={register}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue={user?.lastName as string}
                                register={register}
                            />
                            {/* <PrimaryInput<UpdateUserModel>
                                label="Preferred Name"
                                name="isActive"
                                error={errors.isActive}
                                placeholder=""
                                defaultValue={"Adelowomi"}
                                register={register}
                            /> */}
                            <PrimaryDate<UpdateUserModel>
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                error={errors.dateOfBirth}
                                placeholder={moment(user?.dateOfBirth).format(
                                    'DD MM YYYY',
                                )}
                                max={new DateObject().subtract(1, 'days')}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Contact Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Email"
                                placeholder=""
                                defaultValue={user?.email as string}
                                disableLabel={true}
                            />
                            <PrimaryInput<UpdateUserModel>
                                label="Address"
                                name="address"
                                error={errors.address}
                                placeholder=""
                                defaultValue={user?.address as string}
                                register={register}
                            />
                            <PrimaryPhoneInput<UpdateUserModel>
                                label="Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder={user?.phoneNumber as string}
                                control={control}
                            />
                        </Grid>
                    </Box>
                    <Box
                        bgColor="white"
                        borderRadius="15px"
                        padding="1.5rem"
                        boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    >
                        <Text
                            fontWeight="600"
                            fontSize="1.1rem"
                            mb="2rem"
                            textTransform="capitalize"
                            color="brand.200"
                        >
                            Job Information
                        </Text>
                        <Grid gap=".5rem">
                            <InputBlank
                                label="Company Name"
                                placeholder=""
                                defaultValue={user?.organizationName as string}
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Job Title"
                                placeholder=""
                                defaultValue={
                                    user?.employeeInformation
                                        ?.jobTitle as string
                                }
                                disableLabel={true}
                            />
                            <InputBlank
                                label="Supervisor"
                                placeholder=""
                                defaultValue={
                                    user?.employeeInformation?.supervisor
                                        ?.fullName as string
                                }
                                disableLabel={true}
                            />
                        </Grid>
                    </Box>
                </Grid>

                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                    display="flex"
                    justifyContent="center"
                >
                    <Button
                        bgColor="brand.400"
                        color="white"
                        height="4rem"
                        fontSize="15px"
                        type="submit"
                        isLoading={isSubmitting}
                        w="98%"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    >
                        <Box pr=".5rem">
                            <VscSaveAs />
                        </Box>
                        <Box>Update</Box>
                    </Button>
                </Box>
            </form>
        </Box>
    );
}

export default MyProfile;
