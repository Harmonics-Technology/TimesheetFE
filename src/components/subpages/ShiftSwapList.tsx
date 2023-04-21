import {
    Box,
    Button,
    Flex,
    Grid,
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
    UsersShiftViewPagedCollectionStandardResponse,
} from 'src/services';
import { useDebouncedCallback } from 'use-debounce';

interface swapProps {
    allShift: UsersShiftViewPagedCollectionStandardResponse;
}

export const ShiftSwapList = ({ allShift }: swapProps) => {
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

                <Button
                    variant="outline"
                    color="brand.400"
                    borderColor="brand.400"
                    fontSize="12px"
                    borderRadius="5px"
                    onClick={() => router.push(`${router.asPath}/history`)}
                >
                    View Shift Approval History
                </Button>
            </Flex>

            <Box>
                {allShift?.data?.value?.filter((x: any) => !x.isApproved)
                    .length != 0 ? (
                    allShift.data?.value
                        ?.filter((x: any) => !x.isApproved)
                        .map((x: any) => (
                            <Grid
                                templateColumns={'repeat(5, 1fr)'}
                                alignItems="center"
                                borderBottom="1px solid #EBEFF2"
                                py="1rem"
                            >
                                <ShiftSwapTemplate
                                    userName={x.shiftToSwap?.user?.fullName}
                                    userShift={`${
                                        x.shiftToSwap?.title
                                    } ${moment(x.shiftToSwap?.start).format(
                                        'ddd DD/MM/YYYY',
                                    )}`}
                                />
                                <Text
                                    mb="0"
                                    color="brand.400"
                                    fontWeight="700"
                                    fontSize="14px"
                                    textAlign="center"
                                >
                                    Swap Shift with
                                </Text>
                                <ShiftSwapTemplate
                                    userName={x.shift?.user?.fullName}
                                    userShift={`${x.shift?.title} ${moment(
                                        x.start,
                                    ).format('ddd DD/MM/YYYY')}`}
                                    status={x?.status.toLowerCase()}
                                />
                                <Box mx="auto">
                                    <ShiftCustomBtn
                                        name={
                                            x.isApproved
                                                ? 'approved'
                                                : 'pending'
                                        }
                                    />
                                </Box>

                                {!x.isApproved && (
                                    <HStack spacing=".5rem">
                                        <ShiftCustomBtn
                                            name={'decline'}
                                            icon={MdCancel}
                                            onClick={() => treatSwap(x.id, 3)}
                                            loading={loading}
                                        />
                                        <ShiftCustomBtn
                                            name={'approve'}
                                            icon={MdVerified}
                                            onClick={() => treatSwap(x.id, 2)}
                                            loading={loading}
                                        />
                                    </HStack>
                                )}
                            </Grid>
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
