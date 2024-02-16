import {
    Box,
    Flex,
    HStack,
    Text,
    Tr,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState, useContext } from 'react';
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
import { LicenseNav } from './LicenseNav';
import { SingleSubView } from './SingleSubView';
import {
    ClientSubscriptionDetailView,
    ClientSubscriptionInvoiceViewValue,
} from 'src/services';
import { formatDate } from '@components/generics/functions/formatDate';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';

export const LicenseHome = ({
    data,
    subs,
    users,
}: {
    data: any;
    subs: ClientSubscriptionDetailView[];
    users: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const router = useRouter();
    const {
        isOpen: isOpens,
        onOpen: onOpens,
        onClose: onCloses,
    } = useDisclosure();
    const subId = router.query?.subId || subs[0].subscriptionId;
    const [showDetails, setShowDetails] = useState<any>();
    const selected: ClientSubscriptionDetailView = subs.find(
        (x) => x.subscriptionId == subId,
    ) as ClientSubscriptionDetailView;

    const percentUsed =
        ((selected?.noOfLicenceUsed as number) /
            (selected?.noOfLicensePurchased as number)) *
        100;
    const daysLeft = moment(selected?.endDate).diff(moment(), 'day');

    const otherSubs = subs.filter((x) => x?.subscriptionId !== subId);

    const triggerNewSub = (id: string) => {
        router.push({
            query: {
                ...router.query,
                subId: id,
            },
        });
    };

    return (
        <>
            <LicenseNav />
            {showDetails ? (
                <SingleSubView
                    setShowDetails={setShowDetails}
                    data={selected}
                    percentUsed={percentUsed}
                    users={users}
                />
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
                            <HStack gap="8px" w="full">
                                {otherSubs?.map((x) => (
                                    <Text
                                        fontSize="14px"
                                        color="#2383BD"
                                        cursor="pointer"
                                        key={x.subscriptionId}
                                        onClick={() =>
                                            triggerNewSub(
                                                x?.subscriptionId as string,
                                            )
                                        }
                                    >
                                        {x.subscriptionType}
                                    </Text>
                                ))}
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
                                    title={selected?.subscriptionType}
                                />
                                <LicenseProgressUsage
                                    progress={percentUsed}
                                    title={`${selected?.noOfLicenceUsed}/${selected?.noOfLicensePurchased} license assigned`}
                                    sub={`${selected?.noOfLicenceUsed} of ${selected?.noOfLicensePurchased} users in total assigned to this license`}
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
                                    title={`${selected?.brand} ***** ${selected?.paymentMethod}`}
                                    sub="Edit/manage payment method"
                                    url={`/${role}/account-management/billing-information`}
                                />
                                <LicenseTopBtmText
                                    top="Subscription status"
                                    title={
                                        selected?.subscriptionStatus
                                            ? 'Active'
                                            : 'Inactive'
                                    }
                                    sub="Cancel subscription"
                                    icon={MdCheckCircle}
                                    url={`/${role}/account-management/cancel-subscription`}
                                />
                            </VStack>
                            <VStack w="full" align="flex-start" gap="32px">
                                <LicenseTopBtmText
                                    top="Billing Frequency"
                                    title={`${
                                        selected?.annualBilling
                                            ? `Yearly `
                                            : 'Monthly'
                                    } ${CAD(selected?.totalAmount)}`}
                                    sub="Edit billing frequency"
                                    url={`/${role}/account-management/billing-information`}
                                />
                                <LicenseTopBtmText
                                    top="Subscription Renewal Date"
                                    title={`${formatDate(selected?.endDate)}
                                    (${daysLeft < 0 ? '0' : daysLeft + 1}
                                    days)`}
                                />
                            </VStack>
                            <VStack w="full" align="flex-start" gap="32px">
                                <LicenseTopBtmText
                                    top="Subscription Date"
                                    title={formatDate(selected?.startDate)}
                                />
                            </VStack>
                        </HStack>
                        <Box pos="absolute" bottom="10%" right="2%">
                            <ShiftBtn
                                color="white"
                                bg="brand.400"
                                h="28px"
                                text="View More"
                                onClick={() => setShowDetails({ selected })}
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
                                'Actions',
                            ]}
                            bg="brand.400"
                            color="white"
                        >
                            <>
                                {data?.value?.map(
                                    (x: ClientSubscriptionInvoiceViewValue) => (
                                        <Tr key={x.id}>
                                            <TableData name={x.licenceType} />
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
                                                name={`${moment(x.endDate).diff(
                                                    x.startDate,
                                                    'month',
                                                )} Months`}
                                            />
                                            <TableData
                                                name={CAD(
                                                    (x.amountInCent as number) *
                                                        100,
                                                )}
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
                                    ),
                                )}
                            </>
                        </Tables>

                        {isOpen && (
                            <RemoveSub
                                isOpen={isOpen}
                                onClose={onClose}
                                sub={selected}
                            />
                        )}
                        {isOpens && (
                            <AddSub
                                isOpen={isOpens}
                                onClose={onCloses}
                                sub={selected}
                            />
                        )}
                    </Box>
                </Box>
            )}
        </>
    );
};
