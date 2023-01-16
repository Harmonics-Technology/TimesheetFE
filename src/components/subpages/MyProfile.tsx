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
    useDisclosure,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    VStack,
    Tr,
} from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import { FaTimes, FaUser } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { VscSaveAs } from 'react-icons/vsc';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import { UserContext } from '@components/context/UserContext';
import {
    AdminPaymentScheduleViewListStandardResponse,
    PaymentSchedule,
    PaymentScheduleListStandardResponse,
    UpdateUserModel,
    UserService,
    UserView,
} from 'src/services';
import InputBlank from '@components/bits-utils/InputBlank';
import Cookies from 'js-cookie';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { DateObject } from 'react-multi-date-picker';
import moment from 'moment';
import { Widget } from '@uploadcare/react-widget';
import { useRouter } from 'next/router';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import ConfirmModal from '@components/bits-utils/ConfirmModal';
import ProfileConfirmModal from '@components/bits-utils/ProfileConfirmModal';
import BeatLoader from 'react-spinners/BeatLoader';
import { BsCameraFill } from 'react-icons/bs';
import TableCards from '@components/bits-utils/TableCards';
import { TableData } from '@components/bits-utils/TableData';
import PaymentScheduleModal from '@components/bits-utils/PaymentScheduleModal';
import AdminPaymentScheduleModal from '@components/bits-utils/AdminPaymentScheduleModal';
import { subDays } from 'date-fns';

const schema = yup.object().shape({
    dateOfBirth: yup.string().required(),
    address: yup.string().required(),
    phoneNumber: yup.string().required(),
});

function MyProfile({
    user,
    paymentSchedule,
}: {
    user: UserView;
    paymentSchedule: PaymentScheduleListStandardResponse;
}) {
    console.log({ user });
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
            dateOfBirth: user?.dateOfBirth,
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
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const {
        isOpen: openSchedule,
        onOpen: onOpenSchedule,
        onClose: onCloseSchedule,
    } = useDisclosure();
    const updatePicture = async (data: UpdateUserModel, info, callback?) => {
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

    // const logedInUser = {
    //     id: user?.id,
    //     role: user?.role,
    //     isActive: user?.isActive,
    //     firstName: user?.firstName,
    //     lastName: user?.lastName,
    //     address: user?.address,
    //     phoneNumber: user?.phoneNumber,
    //     organizationName: user.organizationName,
    //     profilePicture: user?.profilePicture,
    //     dateOfBirth: user?.dateOfBirth,
    // };
    const onSubmit = async (data: UpdateUserModel) => {
        // console.log({ data });
        // console.log({ logedInUser });
        // if (data === logedInUser) {
        //     console.log('Same');
        //     return;
        // }
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
                            size="4rem"
                            fontSize="2rem"
                            color="white"
                            // overflow="hidden"
                            pos="relative"
                            role="group"
                            bgColor={
                                showLoading ? 'rgba(0,0,0,0.2)' : 'brand.600'
                            }
                            _hover={{
                                bgColor: 'rgba(0,0,0,0.2)',
                            }}
                        >
                            {user?.profilePicture ? (
                                <Image
                                    src={user?.profilePicture}
                                    w="full"
                                    h="full"
                                    objectFit="cover"
                                    borderRadius="50%"
                                    opacity={showLoading ? 0.3 : 1}
                                    _groupHover={{
                                        opacity: '0.3',
                                    }}
                                />
                            ) : (
                                <FaUser />
                            )}
                            <Box
                                w="full"
                                h="full"
                                bgColor="rgba(0,0,0,0.2)"
                                pos="absolute"
                                borderRadius="50%"
                                opacity={showLoading ? 1 : 0}
                                _groupHover={{
                                    opacity: 1,
                                }}
                            >
                                <Menu>
                                    <MenuButton
                                        pos="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                    >
                                        <VStack color="white" fontSize="1rem">
                                            {showLoading ? (
                                                <Spinner />
                                            ) : (
                                                <BsCameraFill />
                                            )}
                                            {/* <Text fontSize=".5rem">
                                                Edit Profile Icon
                                            </Text> */}
                                        </VStack>
                                    </MenuButton>
                                    <MenuList fontSize=".8rem">
                                        <MenuItem>
                                            <Text
                                                fontWeight="500"
                                                color="brand.200"
                                                mb="0"
                                                onClick={() =>
                                                    widgetApi.current.openDialog()
                                                }
                                            >
                                                {user?.profilePicture !== null
                                                    ? 'Change Photo'
                                                    : 'Upload Photo'}
                                            </Text>
                                        </MenuItem>
                                        <MenuItem>
                                            <Text
                                                fontWeight="500"
                                                color="brand.200"
                                                mb="0"
                                                onClick={onOpen}
                                            >
                                                {user?.profilePicture !== null
                                                    ? 'Remove Photo'
                                                    : ''}
                                            </Text>
                                        </MenuItem>
                                    </MenuList>
                                </Menu>
                            </Box>
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
                            display={
                                user?.role === 'Supervisor' ||
                                user?.role === 'client' ||
                                user?.role === 'Internal Supervisor' ||
                                user?.role === 'Internal Admin'
                                    ? 'none'
                                    : 'block'
                            }
                            fontSize=".8rem"
                            h="2.5rem"
                            borderRadius="0"
                            border="2px solid"
                            onClick={
                                user?.role === 'Team Member'
                                    ? onOpened
                                    : onOpenSchedule
                            }
                            w={['full', 'inherit']}
                        >
                            View Payment Schedule
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
                                defaultValue={'Adelowomi'}
                                register={register}
                            /> */}
                            <PrimaryDate<UpdateUserModel>
                                control={control}
                                name="dateOfBirth"
                                label="Date of Birth"
                                error={errors.dateOfBirth}
                                defaultValue={moment(user?.dateOfBirth).format(
                                    'DD MM YYYY',
                                )}
                                max={subDays(new Date(), 1)}
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
                                defaultValue={user?.clientName as string}
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
                        spinner={<BeatLoader color="white" size={10} />}
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
            <ProfileConfirmModal
                isOpen={isOpen}
                onClose={onClose}
                user={user}
            />
            {user?.role !== 'Supervisor' &&
                user?.role !== 'client' &&
                user?.role !== 'Internal Supervisor' &&
                user?.role !== 'Internal Admin' && (
                    <>
                        <PaymentScheduleModal
                            isOpen={isOpened}
                            onClose={onClosed}
                            paymentSchedule={paymentSchedule}
                        />

                        <AdminPaymentScheduleModal
                            isOpen={openSchedule}
                            onClose={onCloseSchedule}
                            paymentSchedule={
                                paymentSchedule as AdminPaymentScheduleViewListStandardResponse
                            }
                        />
                    </>
                )}
        </Box>
    );
}

export default MyProfile;
