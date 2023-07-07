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
import { UserContext } from '@components/context/UserContext';
import { CAD } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { BaseSubscription, UserService, UserView } from 'src/services';

export const SubscriptionDetails = ({ data }) => {
    const { user, subType, addons } = useContext(UserContext);
    const userInfo: UserView = user;
    const role = user?.role.replaceAll(' ', '');
    const { onOpen, isOpen, onClose } = useDisclosure();
    const toast = useToast();
    const router = useRouter();
    const [subData, setSubData] = useState();
    const [loading, setLoading] = useState(false);
    const currentSub: BaseSubscription =
        user?.subscriptiobDetails?.data?.baseSubscription;

    const cancelSub = async () => {
        try {
            setLoading(true);
            const result = await UserService.cancelSubscription(
                currentSub.id as string,
            );
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
    return (
        <Box>
            <LeaveTab
                tabValue={[
                    {
                        text: 'Subscription',
                        url: `/${role}/account-management/manage-subscription`,
                    },
                    {
                        text: 'Billing Information',
                        url: `/${role}/account-management/billing-information`,
                    },
                ]}
            />
            <Flex justify="space-between" mt="1rem">
                <Box>
                    <Text fontSize=".875rem" color="#696969">
                        Current Subscription Plan
                    </Text>
                    <Text fontSize=".875rem" color="#2d3748" fontWeight="500">
                        {subType} +{addons?.map((x) => x).join('+')}
                    </Text>
                    <HStack>
                        <ManageBtn
                            bg="#e45771"
                            btn="Cancel"
                            onClick={cancelSub}
                            isLoading={loading}
                        />
                        <ManageBtn bg="#707683" btn="Pause" disabled />
                        <ManageBtn bg="#1b487d" btn="Upgrade" disabled />
                        <ManageBtn bg="brand.400" btn="Renew" />
                    </HStack>
                </Box>
                <VStack spacing="2rem" align="flex-start">
                    <Box>
                        <Text fontSize=".875rem" color="#696969">
                            Subscription Date
                        </Text>
                        <Text
                            fontSize=".875rem"
                            color="#2d3748"
                            fontWeight="500"
                        >
                            {formatDate(
                                userInfo?.subscriptiobDetails?.data?.startDate,
                            )}
                        </Text>
                    </Box>
                    <Box>
                        <Text fontSize=".875rem" color="#696969">
                            Subscription Renewal Date
                        </Text>
                        <Text
                            fontSize=".875rem"
                            color="#2d3748"
                            fontWeight="500"
                        >
                            {formatDate(
                                userInfo?.subscriptiobDetails?.data?.endDate,
                            )}{' '}
                            (
                            {moment(
                                userInfo?.subscriptiobDetails?.data?.endDate,
                            ).diff(moment(), 'day')}{' '}
                            days)
                        </Text>
                    </Box>
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
                        'Actions',
                    ]}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {data?.value?.map((x: any) => (
                            <Tr key={x.id}>
                                <TableData
                                    name={`${
                                        x.baseSubscription?.name
                                    } + ${x.addOns
                                        ?.map((x) => x.addOnSubscription?.name)
                                        .join(',')}`}
                                />
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
                                <TableSubscriptionActions
                                    openRenew={onOpen}
                                    setData={setSubData}
                                    x={x}
                                />
                            </Tr>
                        ))}
                        {/* <RenewSubscription
                            isOpen={isOpen}
                            onClose={onClose}
                            data={subData}
                        /> */}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
