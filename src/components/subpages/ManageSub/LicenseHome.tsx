import {
    Box,
    Flex,
    HStack,
    Text,
    Tr,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { LicenseTopBtmText } from './LicenseTopBtmText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { LicenseProgressUsage } from './LicenseProgressUsage';
import { MdCheckCircle } from 'react-icons/md';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import Tables from '@components/bits-utils/Tables';
import { TableData, TableStatus } from '@components/bits-utils/TableData';
import moment from 'moment';
import { RemoveSub } from './RemoveSub';
import { CAD } from '@components/generics/functions/Naira';
import { AddSub } from './AddSub';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { LicenseNav } from './LicenseNav';
import { SingleSubView } from './SingleSubView';

export const LicenseHome = ({ data }: { data: any }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();
    const [selected, setSelected] = useState<any>();
    return (
        <>
            <LicenseNav />
            {selected ? (
                <SingleSubView setSelected={setSelected} />
            ) : (
                <Box>
                    <Box
                        bgColor="white"
                        borderRadius="8px"
                        pos="relative"
                        p="1rem"
                    >
                        <Box h="58px" borderBottom=" 1px solid #c2cfe0">
                            <Text fontSize="14px" color="#696969">
                                My Other License
                            </Text>
                            <HStack gap="8px">
                                <Text
                                    fontSize="14px"
                                    color="#2383BD"
                                    cursor="pointer"
                                >
                                    Timba Premium Plan
                                </Text>
                            </HStack>
                        </Box>
                        <HStack
                            gap="3rem"
                            justify="space-between"
                            align="flex-start"
                            mt="1.2rem"
                        >
                            <VStack w="full" align="flex-start" gap="16px">
                                <LicenseTopBtmText
                                    fontSizea="14px"
                                    top="Current license Plan"
                                    fontSizeb="16px"
                                    title="Timba Standard Plan"
                                />
                                <LicenseProgressUsage
                                    progress={80}
                                    title="5/10 license assigned"
                                    sub={`5 of 10 users in total assigned to this license`}
                                />
                                <HStack gap="1rem" my="21px">
                                    <ShiftBtn
                                        color="white"
                                        bg="brand.400"
                                        h="28px"
                                        text="Buy License"
                                        onClick={onOpens}
                                        px="1rem"
                                    />
                                    <ShiftBtn
                                        color="white"
                                        bg="#da5867"
                                        h="28px"
                                        text="Remove License"
                                        onClick={onOpen}
                                        px="1rem"
                                    />
                                </HStack>
                            </VStack>
                            <VStack w="full" align="flex-start" gap="32px">
                                <LicenseTopBtmText
                                    top="Payment Method"
                                    title="Master *****7689"
                                    sub="Edit/manage payment method"
                                />
                                <LicenseTopBtmText
                                    top="Subscription status"
                                    title="Active"
                                    sub="Cancel subscription"
                                    icon={MdCheckCircle}
                                />
                            </VStack>
                            <VStack w="full" align="flex-start" gap="32px">
                                <LicenseTopBtmText
                                    top="Billing Frequency"
                                    title="Monthly  $50.00"
                                    sub="Edit billing frequency"
                                />
                                <LicenseTopBtmText
                                    top="Subscription Renewal Date"
                                    title="June 31st, 2023 (15days)"
                                />
                            </VStack>
                            <VStack w="full" align="flex-start" gap="32px">
                                <LicenseTopBtmText
                                    top="Subscription Date"
                                    title="June 31st, 2023 "
                                />
                            </VStack>
                        </HStack>
                        <Box pos="absolute" bottom="10%" right="2%">
                            <ShiftBtn
                                color="white"
                                bg="brand.400"
                                h="28px"
                                text="View More"
                                onClick={() => setSelected({ data })}
                                px="1rem"
                            />
                        </Box>
                    </Box>
                    <Box mt="1rem" bgColor="white" borderRadius="8px" p="1rem">
                        <Flex justify="space-between" mb="1rem">
                            <Text fontWeight="500" color="#2d3748">
                                Subscription History
                            </Text>
                            <SubSearchComponent />
                        </Flex>

                        <Tables
                            tableHead={[
                                'Subscription Type',
                                'Start Date',
                                'End Date',
                                'Duration',
                                'Amount',
                                'Status',
                                // 'Actions',
                            ]}
                            bg="brand.400"
                            color="white"
                        >
                            <>
                                {Array(4)
                                    .fill(4)
                                    ?.map((x: any) => (
                                        <Tr key={x.id}>
                                            <TableData
                                                name={x.subscription?.name}
                                            />
                                            <TableData
                                                name={moment(
                                                    x.startDate,
                                                ).format('DD/MM/YYYY')}
                                            />
                                            <TableData
                                                name={moment(x.endDate).format(
                                                    'DD/MM/YYYY',
                                                )}
                                            />
                                            <TableData
                                                name={`${x.duration} Months`}
                                            />
                                            <TableData
                                                name={CAD(x.totalAmount)}
                                            />
                                            <TableStatus
                                                name={
                                                    x.status == 'ACTIVE'
                                                        ? true
                                                        : false
                                                }
                                            />
                                            {/* <TableSubscriptionActions
                                    openRenew={onOpen}
                                    setData={setSubData}
                                    x={x}
                                /> */}
                                        </Tr>
                                    ))}
                            </>
                        </Tables>

                        {isOpen && (
                            <RemoveSub isOpen={isOpen} onClose={onClose} />
                        )}
                        {isOpens && (
                            <AddSub isOpen={isOpens} onClose={onCloses} />
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};
