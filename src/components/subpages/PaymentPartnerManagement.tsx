/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Checkbox,
    Icon,
    Circle,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    TableActions,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
    isSuperAdmin?: boolean;
    subs: any;
    currencies: any;
}

import {
    ControlSettingView,
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { PrimaryPhoneInput } from '@components/bits-utils/PrimaryPhoneInput';
import FilterSearch from '@components/bits-utils/FilterSearch';
import BeatLoader from 'react-spinners/BeatLoader';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { UserContext } from '@components/context/UserContext';
import { LicenseSelection } from './ManageSub/LicenseSelection';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import {
    getCurrencyName,
    getPrefix,
    onBoardingFees,
} from '@components/generics/functions/getCurrencyName';
import { BiPlus } from 'react-icons/bi';
import InputBlank from '@components/bits-utils/InputBlank';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { LiaTimesSolid } from 'react-icons/lia';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';

const schema = yup.object().shape({
    // lastName: yup.string().required(),
    // firstName: yup.string().required(),
    // role: yup.string().required(),
    // email: yup.string().email().required(),
    organizationEmail: yup.string().email().required(),
    organizationName: yup.string().required(),
    organizationAddress: yup.string().required(),
    organizationPhone: yup.number().required(),
});

function PaymentPartnerManagement({
    adminList,
    isSuperAdmin,
    subs,
    currencies,
}: adminProps) {
    //
    const { user, accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;
    const {
        register,
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            role: 'Payment Partner',
        },
    });

    const [payFees, setPayFees] = useState<any>([]);
    const [feeSetUp, setFeeSetUp] = useState<any>({
        onboardingFeeType: '',
        fee: '',
    });

    const noFeeSetUpYet = !feeSetUp.onboardingFeeType || !feeSetUp.fee;

    const addToList = () => {
        if (noFeeSetUpYet) {
            return;
        }
        const exists = payFees.find(
            (x: any) =>
                x.onboardingFeeType == feeSetUp.onboardingFeeType &&
                x.fee == feeSetUp.fee,
        );
        setFeeSetUp({ onboardingFeeType: '', fee: '' });
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

    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    //
    const [same, setSame] = useState(true);
    //

    const [selectedLicense, setSelectedLicense] = useState<any>();
    const addLicense = (license) => {
        setSelectedLicense(license);
    };
    const removeLicense = (id) => {
        setSelectedLicense(undefined);
    };

    const uniqueItems = getUniqueListBy(currencies, 'currency');

    const onSubmit = async (data: RegisterModel) => {
        {
            same
                ? ((data.firstName = data.organizationName),
                  (data.email = data.organizationEmail),
                  (data.phoneNumber = data.organizationPhone))
                : null;
        }
        data.superAdminId = user?.superAdminId;
        data.clientSubscriptionId = selectedLicense?.subscriptionId;
        data.onboardingFees = payFees;
        data.dateOfBirth = data.dateOfBirth
            ? data.dateOfBirth
            : new Date().toLocaleDateString();
        if (data.onboardingFees?.length == 0 || !data.onboardingFees) {
            toast({
                title: 'Kindly set up onboarding fees to continue',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        }
        try {
            const result = await UserService.create(data);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                onClose();
                reset();
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
                title: err.body.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = ['Name', 'Email', 'Role', 'Status', 'Action'];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between" mb="1rem">
                    {(userAccess?.adminOBoarding || isSuperAdmin) && (
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            +Payment Partner
                        </Button>
                    )}
                    <Button
                        bgColor="brand.600"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        onClick={onOpens}
                        borderRadius="25px"
                    >
                        Download <Icon as={BsDownload} ml=".5rem" />
                    </Button>
                </Flex>
                <FilterSearch searchOptions="Search by: Name, Email, Role, or Status " />
                <Tables tableHead={thead}>
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="payment-partners"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add new Payment Partner'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PrimaryInput<RegisterModel>
                        label="Organization Name"
                        name="organizationName"
                        error={errors.organizationName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={['1fr', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                        mt="1rem"
                    >
                        <PrimaryInput<RegisterModel>
                            label="Organization Email"
                            name="organizationEmail"
                            error={errors.organizationEmail}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryPhoneInput<RegisterModel>
                            label="Phone Number"
                            name="organizationPhone"
                            error={errors.organizationPhone}
                            placeholder="Organization Phone No."
                            control={control}
                        />
                    </Grid>
                    <PrimaryTextarea<RegisterModel>
                        label="Organization Address"
                        name="organizationAddress"
                        error={errors.organizationAddress}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={['1fr', 'repeat(2,1fr)']}
                        gap="1rem 2rem"
                        mt="1rem"
                    >
                        <PrimarySelect<RegisterModel>
                            register={register}
                            error={errors.currency}
                            name="currency"
                            label="Currency"
                            placeholder="Select Currency"
                            defaultValue={'CAD'}
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
                                                {getCurrencyName(x.currency) ||
                                                    x.name}
                                                )
                                            </option>
                                        ))}
                                </>
                            }
                        />
                        <LicenseSelection
                            addLicense={addLicense}
                            removeLicense={removeLicense}
                            errors={errors}
                            selectedLicense={selectedLicense}
                            subs={subs}
                        />
                    </Grid>
                    <Box w="full">
                        <Flex
                            justify="space-between"
                            align="center"
                            my="1rem"
                            py="1rem"
                            borderY="1px solid"
                            borderColor="gray.300"
                        >
                            <Text
                                textTransform="capitalize"
                                mb="0"
                                fontSize="1.3rem"
                                fontWeight="500"
                            >
                                Processing Fee
                            </Text>
                        </Flex>
                        <Text mb="0" fontSize="13px" fontWeight="400">
                            You can add multiple onboarding fee for a payment
                            partner
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
                                        fee: e.target.value,
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
                        {payFees?.length > 0 && (
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
                                            onClick={() => removeFromList(x)}
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
                                                {x.fee} {x.onboardingFeeType}
                                            </Text>
                                        </Flex>
                                    </HStack>
                                ))}
                            </HStack>
                        )}
                    </Box>
                    <Box w="full" display="none">
                        <Flex
                            justify="space-between"
                            align="center"
                            my="1rem"
                            py="1rem"
                            borderY="1px solid"
                            borderColor="gray.300"
                        >
                            <Text
                                textTransform="uppercase"
                                mb="0"
                                fontSize="1.3rem"
                                fontWeight="500"
                            >
                                Contact Details
                            </Text>
                            <Checkbox
                                onChange={(e) => setSame(e.target.checked)}
                            >
                                Same as above
                            </Checkbox>
                        </Flex>
                        <Grid
                            templateColumns={['1fr', 'repeat(2,1fr)']}
                            gap="1rem 2rem"
                            display={same ? 'none' : 'grid'}
                        >
                            <PrimaryInput<RegisterModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={''}
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Email"
                                name="email"
                                error={errors.email}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryPhoneInput<RegisterModel>
                                label="Contact Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                control={control}
                            />
                        </Grid>
                    </Box>

                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
                            <Button
                                bgColor="gray.500"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
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
                                    <RiMailSendFill />
                                </Box>
                                <Box>Send Invite</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={5}
                fileName={'Payment Partners'}
                model="users"
            />
        </>
    );
}

export default PaymentPartnerManagement;
