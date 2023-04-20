import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Input,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import { ShiftCustomBtn } from '@components/bits-utils/ShiftCustomBtn';
import ShiftSwapTemplate from '@components/bits-utils/ShiftSwapTemplate';
import TableNoContentWrapper from '@components/bits-utils/TableNoContentWrapper';
import { UserContext } from '@components/context/UserContext';
import moment from 'moment';
import router, { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { MdCancel, MdVerified } from 'react-icons/md';
import {
    ShiftService,
    ShiftViewPagedCollectionStandardResponse,
} from 'src/services';
import { useDebouncedCallback } from 'use-debounce';

interface swapProps {
    allShift: ShiftViewPagedCollectionStandardResponse;
}

export const SwapShiftListTeam = ({ allShift }: swapProps) => {
    console.log({ allShift });
    const [search, setSearch] = useState('');
    const debounced = useDebouncedCallback(
        (search) => {
            setSearch(search);
            router.push({
                query: {
                    ...router.query,
                    search: search,
                },
            });
        },
        // delay in ms
        800,
    );
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const treatSwap = async (id, type) => {
        try {
            setLoading(true);
            const result = await ShiftService.approveSwap(id, type);
            if (result.status) {
                // console.log({ result });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.reload();
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box>
            <Flex
                justify="space-between"
                borderBottom="1px solid #EBEFF2"
                py="1rem"
                align="center"
            >
                <Box w="20%">
                    <Input
                        type="search"
                        placeholder="search"
                        onChange={(e) => debounced(e.target.value)}
                        borderRadius="0"
                    />
                </Box>

                {/* <Button
                    variant="outline"
                    color="brand.400"
                    borderColor="brand.400"
                    fontSize="12px"
                    borderRadius="5px"
                    onClick={() => router.push(`${router.asPath}/history`)}
                >
                    View Shift Approval History
                </Button> */}
            </Flex>

            <Box>
                {allShift?.data?.value?.length != 0 ? (
                    allShift?.data?.value?.map((x) => (
                        <>
                            <Flex
                                justify="space-between"
                                align="center"
                                borderBottom="1px solid #EBEFF2"
                                py="1rem"
                            >
                                <ShiftSwapTemplate
                                    userName={
                                        x.swapperId == user?.id
                                            ? 'My'
                                            : x.swapee?.fullName
                                    }
                                    userShift={`${
                                        x.swapperId == user?.id
                                            ? x.swapper?.title
                                            : x.swapee.title
                                    } ${moment(
                                        x.swapperId == user?.id
                                            ? x.swapper?.start
                                            : x.swapee.start,
                                    ).format('ddd DD/MM/YYYY')}`}
                                />

                                <Text
                                    mb="0"
                                    color="brand.400"
                                    fontWeight="700"
                                    fontSize="14px"
                                >
                                    Swap Shift with
                                </Text>
                                {/* <ShiftSwapTemplate
                                    userName={
                                        x.swapperId == user?.id
                                            ? 'My'
                                            : x.shiftToSwap?.user?.fullName
                                    }
                                    userShift={`${
                                        x.swapperId == user?.id
                                            ? x.title
                                            : x.shiftToSwap?.title
                                    } ${moment(
                                        x.swapperId == user?.id
                                            ? x.start
                                            : x.shiftToSwap?.start,
                                    ).format('ddd DD/MM/YYYY')}`}
                                    status={x?.swapStatus}
                                /> */}
                                <ShiftSwapTemplate
                                    userName={
                                        x.swapperId == user?.id
                                            ? x.swapee?.fullName
                                            : 'My'
                                    }
                                    userShift={`${
                                        x.swapperId == user?.id
                                            ? x.shiftToSwap?.title
                                            : x.title
                                    } ${moment(
                                        x.swapperId == user?.id
                                            ? x.shiftToSwap?.start
                                            : x.start,
                                    ).format('ddd DD/MM/YYYY')}`}
                                    status={x?.swapStatus}
                                />

                                <ShiftCustomBtn name={x.status} />

                                <Box w="18%">
                                    {x.swapperId != user?.id &&
                                        x.status != 'APPROVED' && (
                                            <HStack spacing=".5rem">
                                                <ShiftCustomBtn
                                                    name={'Decline'}
                                                    icon={MdCancel}
                                                    onClick={() =>
                                                        treatSwap(x.id, 2)
                                                    }
                                                    loading={loading}
                                                />
                                                <ShiftCustomBtn
                                                    name={'Approve'}
                                                    icon={MdVerified}
                                                    onClick={() =>
                                                        treatSwap(x.id, 1)
                                                    }
                                                    loading={loading}
                                                />
                                            </HStack>
                                        )}
                                </Box>
                            </Flex>
                        </>
                    ))
                ) : (
                    <>
                        <Flex h="20vh" justify="center" align="center">
                            <Icon as={BsFillInfoCircleFill} />
                            <Text mb="0">
                                There's currently no data available. Check back
                                later
                            </Text>
                        </Flex>
                    </>
                )}
            </Box>
        </Box>
    );
};
