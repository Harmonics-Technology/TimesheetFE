import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    Tr,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { LabelSign } from '@components/bits-utils/LabelSign';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import { RenewSubscription } from '@components/bits-utils/RenewSubscription';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableData,
    TableStatus,
    TableSubscriptionActions,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { UpgradeSubModal } from '@components/bits-utils/UpgradeSubModal';
import { UserContext } from '@components/context/UserContext';
import { TextWithBottom } from '@components/generics/TextWithBottom';
import { CAD } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { UserService, UserView } from 'src/services';

export const SubscriptionDetails = ({ data }) => {
    const { user, subType } = useContext(UserContext);
    const userInfo: UserView = user;
    const role = user?.role.replaceAll(' ', '');
    const curSub = user?.subscriptiobDetails?.data;
    const { onOpen, isOpen, onClose } = useDisclosure();
    const router = useRouter();
    const daysLeft = moment(userInfo?.subscriptiobDetails?.data?.endDate).diff(
        moment(),
        'day',
    );

    // const currentSub: any = user?.subscriptiobDetails?.data?.subscription;

    return (
        <Box>
            <LeaveTab
                tabValue={[
                    {
                        text: 'Subscription',
                        url: `/account-management/manage-subscription`,
                    },
                    {
                        text: 'Billing Information',
                        url: `/account-management/billing-information`,
                    },
                ]}
            />
            <Flex justify="space-between" mt="1rem" w="90%">
                <Box>
                    <Text fontSize=".875rem" color="#696969" mb="1em">
                        Current Subscription Plan
                    </Text>
                    <HStack>
                        <Text
                            fontSize=".875rem"
                            color="#2d3748"
                            fontWeight="500"
                            textTransform="capitalize"
                        >
                            {subType} Package{' '}
                            {curSub?.subscription?.hasFreeTrial &&
                                '(free trial)'}
                        </Text>
                    </HStack>
                    <HStack mt="1rem">
                        <ManageBtn
                            bg="#e45771"
                            btn="Cancel"
                            onClick={() =>
                                router.push(
                                    `/${role}/account-management/cancel-subscription`,
                                )
                            }
                        />
                        {/* <ManageBtn bg="#707683" btn="Pause" disabled /> */}
                        <ManageBtn
                            bg="#1b487d"
                            btn="Upgrade"
                            onClick={onOpen}
                        />
                        <ManageBtn bg="brand.400" btn="Renew" />
                    </HStack>
                </Box>
                <VStack spacing="2rem" align="flex-start">
                    <TextWithBottom
                        title="Subscription Date"
                        text={formatDate(
                            userInfo?.subscriptiobDetails?.data?.startDate,
                        )}
                    />
                    <TextWithBottom
                        title="Subscription Renewal Date"
                        text={`${formatDate(
                            userInfo?.subscriptiobDetails?.data?.endDate,
                        )}
                        (${daysLeft <= 0 ? 0 : daysLeft}
                        days)`}
                    />
                </VStack>
            </Flex>

            <Box mt="3rem">
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
                        {data?.value?.map((x: any) => (
                            <Tr key={x.id}>
                                <TableData name={x.subscription?.name} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData name={`${x.duration} Months`} />
                                <TableData name={CAD(x.totalAmount)} />
                                <TableStatus
                                    name={x.status == 'ACTIVE' ? true : false}
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
                {/* <RenewSubscription
                            isOpen={isOpen}
                            onClose={onClose}
                            data={subData}
                        /> */}
                {isOpen && (
                    <UpgradeSubModal isOpen={isOpen} onClose={onClose} />
                )}
            </Box>
        </Box>
    );
};
