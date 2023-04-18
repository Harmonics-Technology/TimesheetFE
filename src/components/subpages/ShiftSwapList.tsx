import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import { ShiftCustomBtn } from '@components/bits-utils/ShiftCustomBtn';
import ShiftSwapTemplate from '@components/bits-utils/ShiftSwapTemplate';
import TableNoContentWrapper from '@components/bits-utils/TableNoContentWrapper';
import { UserContext } from '@components/context/UserContext';
import moment from 'moment';
import router from 'next/router';
import React, { useContext, useState } from 'react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
import { MdCancel, MdVerified } from 'react-icons/md';
import { ShiftViewPagedCollectionStandardResponse } from 'src/services';
import { useDebouncedCallback } from 'use-debounce';

interface swapProps {
    allShift: ShiftViewPagedCollectionStandardResponse;
}

export const ShiftSwapList = ({ allShift }: swapProps) => {
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
                {allShift?.data?.value?.filter((x) => !x.isSwapped).length !=
                0 ? (
                    allShift.data?.value
                        ?.filter((x) => !x.isSwapped)
                        .map((x) => (
                            <Flex
                                justify="space-between"
                                align="center"
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
                                >
                                    Swap Shift with
                                </Text>
                                <ShiftSwapTemplate
                                    userName={x.user?.fullName}
                                    userShift={`${x.title} ${moment(
                                        x.start,
                                    ).format('ddd DD/MM/YYYY')}`}
                                    status={x?.swapStatus}
                                />
                                <ShiftCustomBtn
                                    name={x.isSwapped ? 'APPROVED' : 'PENDING'}
                                />

                                <HStack spacing=".5rem">
                                    <ShiftCustomBtn
                                        name={'Decline'}
                                        icon={MdCancel}
                                    />
                                    <ShiftCustomBtn
                                        name={'Approve'}
                                        icon={MdVerified}
                                    />
                                </HStack>
                            </Flex>
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
