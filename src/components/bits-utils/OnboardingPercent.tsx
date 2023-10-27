import {
    Box,
    HStack,
    Text,
    useToast,
    Button,
    TableContainer,
    Table,
    Thead,
    Tbody,
    Td,
    Th,
    Tr,
    Icon,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { PrimaryInput } from './PrimaryInput';
import {
    OnboardingFeeModel,
    OnboardingFeeView,
    OnboardingFeeService,
} from 'src/services';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { UserContext } from '@components/context/UserContext';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';

export const OnboardingPercent = ({ data }: { data: OnboardingFeeView[] }) => {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<OnboardingFeeModel>({
        mode: 'all',
        defaultValues: {
            onboardingType: 'PERCENTAGE',
        },
    });
    const toast = useToast();
    const router = useRouter();
    function dataExists(fee: number) {
        return data.some(function (el) {
            return el.fee == fee;
        });
    }

    const onSubmit = async (data: OnboardingFeeModel) => {
        data.superAdminId = user?.superAdminId;
        if (dataExists(data.fee as number)) {
            toast({
                title: 'The value you are trying to add already exists',
                status: 'error',
                position: 'top-right',
            });
            return;
        }
        try {
            const result = await OnboardingFeeService.addFee(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                position: 'top-right',
                title: err?.body?.message || err.message,
                status: 'error',
            });
        }
    };

    const DeleteFeeBtn = ({ feeId }: { feeId: string }) => {
        const [loading, setLoading] = useState<boolean>(false);
        const deleteFee = async () => {
            try {
                setLoading(true);
                const result = await OnboardingFeeService.deleteFee(feeId);
                if (result.status) {
                    setLoading(false);
                    toast({
                        title: result.message,
                        status: 'success',
                        position: 'top-right',
                    });
                    router.replace(router.asPath);
                    return;
                }
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'error',
                    position: 'top-right',
                });
                return;
            } catch (err: any) {
                toast({
                    position: 'top-right',
                    title: err?.body?.message || err.message,
                    status: 'error',
                });
            }
        };
        return (
            <Td>
                {loading ? (
                    <BeatLoader size={7} />
                ) : (
                    <Icon
                        as={RiDeleteBin6Line}
                        onClick={() => deleteFee()}
                        cursor="pointer"
                    />
                )}
            </Td>
        );
    };
    return (
        <Box
            bgColor="white"
            borderRadius="10px"
            h="70vh"
            w="full"
            p="2rem 2rem"
            boxShadow="sm"
        >
            <HStack
                mb="3rem"
                bgColor="gray.300"
                p=".3rem .5rem"
                w="fit-content"
            >
                {/* <Link href={`/${role}/settings/hst`} passHref>
                    <Text
                        // bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                    >
                        HST Settings
                    </Text>
                </Link> */}
                <Link
                    href={`/${role}/account-management/onboarding-fee`}
                    passHref
                >
                    <Text
                        // bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                    >
                        Flat Rate Settings
                    </Text>
                </Link>
                <Link
                    href={`/${role}/account-management/onboarding-percent`}
                    passHref
                >
                    <Text
                        bgColor="white"
                        mb="0"
                        p=".2rem 1rem"
                        cursor="pointer"
                        fontWeight="600"
                    >
                        Percentage Fee Settings
                    </Text>
                </Link>
            </HStack>
            <HStack w="full" gap="2rem" align="flex-start">
                <Box w="30%">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Box w="70%">
                            <Text fontWeight="600" fontSize=".9rem" mb="0">
                                Percentage Amount (%)
                            </Text>
                            <PrimaryInput<OnboardingFeeModel>
                                label=""
                                name="fee"
                                error={errors.fee}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                        </Box>
                        <Button
                            bgColor="brand.400"
                            color="white"
                            px="2rem"
                            h="2.2rem"
                            fontSize=".9rem"
                            textTransform="uppercase"
                            mt=".8rem"
                            type="submit"
                            isLoading={isSubmitting}
                        >
                            Add
                        </Button>
                    </form>
                </Box>
                <Box w="50%">
                    <Text fontWeight="600" fontSize=".9rem">
                        Available Percentages (%)
                    </Text>
                    <TableContainer mb="1rem" w="100%">
                        <Table>
                            <Thead>
                                <Tr bgColor="gray.100">
                                    <Th>Fee (%)</Th>
                                    <Th>Action</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {data?.length <= 0 ? (
                                    <Tr>
                                        <Td
                                            textAlign="center"
                                            my="1rem"
                                            fontStyle="italic"
                                            fontSize=".8rem"
                                        >
                                            No data available
                                        </Td>
                                    </Tr>
                                ) : (
                                    <>
                                        {data
                                            ?.sort(
                                                (a, b) =>
                                                    (a.fee as number) -
                                                    (b.fee as number),
                                            )
                                            .map((x: OnboardingFeeView) => (
                                                <Tr key={x.id}>
                                                    <Td>{x.fee}%</Td>
                                                    <DeleteFeeBtn
                                                        feeId={x.id as string}
                                                    />
                                                </Tr>
                                            ))}
                                    </>
                                )}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Box>
            </HStack>
        </Box>
    );
};
