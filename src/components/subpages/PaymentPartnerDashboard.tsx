import {
    Box,
    Grid,
    Image,
    Tr,
    VStack,
    Text,
    Flex,
    HStack,
    Icon,
    Button,
    useToast,
} from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    TableData,
    TableState,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { formatDate } from '@components/generics/functions/formatDate';
import axios from 'axios';
import moment from 'moment';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import { RiExchangeLine } from 'react-icons/ri';
import {
    DashboardPaymentPartnerView,
    DashboardPaymentPartnerViewStandardResponse,
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardPaymentPartnerViewStandardResponse;
    pendingPayrolls: InvoiceViewPagedCollectionStandardResponse;
    result: any;
}

function PaymentPartnerDashboard({
    metrics,
    pendingPayrolls,
    result,
}: DashboardProps) {
    // const adminMetrics = metrics?.data as DashboardPaymentPartnerView;
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    const router = useRouter();
    // console.log({ metrics });
    const toast = useToast();
    const [exchange, setExchange] = useState<any>();

    const getExchangeRate = async () => {
        try {
            const res = await axios.get(
                'https://v6.exchangerate-api.com/v6/5689bf93bd619c9c94efc749/latest/CAD',
            );
            console.log({ res });
            if (res.status) {
                setExchange(res.data.conversion_rates.NGN);
                localStorage.setItem('rate', res.data.conversion_rates.NGN);
                return;
            }
            toast({
                status: 'error',
                title: res.data.error_type,
                position: 'top-right',
            });
        } catch (error: any) {
            toast({
                status: 'error',
                title: error.message,
                position: 'top-right',
            });
        }
    };

    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Payroll'}
                        url={'viewpayroll'}
                        data={metrics.data?.recentPayroll
                            ?.slice(0, 5)
                            .map((x: any, i) => (
                                <Tr key={i}>
                                    <TableData
                                        name={
                                            x.payrollGroupName ||
                                            x.paymentPartnerName ||
                                            x.name
                                        }
                                    />
                                    <TableData
                                        name={formatDate(x.dateCreated)}
                                    />
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableState name={x.status as string} />
                                </Tr>
                            ))}
                        thead={[
                            'Name',
                            'Created on',
                            'Start Date',
                            'End Date',
                            'Status',
                        ]}
                        link={'/'}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Invoice'}
                        url={'invoices'}
                        data={metrics?.data?.recentInvoicedInvoice
                            ?.slice(0, 5)
                            .map((x: InvoiceView, i: any) => (
                                <Tr key={i}>
                                    <TableData
                                        name={
                                            x.payrollGroupName ||
                                            x.paymentPartnerName ||
                                            x.name
                                        }
                                    />
                                    <TableData name={x.invoiceReference} />
                                    <TableData
                                        name={formatDate(x.dateCreated)}
                                    />
                                    <TableData
                                        name={CAD(Round(x.totalAmount))}
                                    />
                                    <TableData
                                        name={Naira(
                                            Round(
                                                (x.totalAmount as number) *
                                                    (x.rate as unknown as number),
                                            ),
                                        )}
                                    />
                                    <TableState name={x.status as string} />
                                </Tr>
                            ))}
                        thead={[
                            'Name on Invoice',
                            'Invoice No',
                            'Created on',
                            'Amount ($)',
                            'Amount (₦)',
                            'Status',
                        ]}
                        link={'/'}
                    />
                </Grid>
            </VStack>
            <VStack gap="1rem">
                <NotificationBox
                    data={messages}
                    markAsRead={markAsRead}
                    loading={loading}
                />
                <Flex
                    minH="5rem"
                    w="full"
                    bgColor="brand.400"
                    boxShadow="md"
                    borderRadius="md"
                    p="2rem 2rem"
                    align="center"
                    justify="center"
                    flexDirection="column"
                >
                    <Text
                        fontSize=".8rem"
                        color="white"
                        fontWeight="bold"
                        mb="0"
                    >
                        Current Exchange rate
                    </Text>
                    <HStack
                        alignItems="center"
                        h="fit-content"
                        fontSize=".8rem"
                        color="white"
                        my="1rem"
                    >
                        <Text mb="0">1 CAD</Text>
                        <Icon as={RiExchangeLine} />{' '}
                        <Text mb="0">{result.data.rate - 12} NGN</Text>
                    </HStack>
                    <Button
                        fontSize=".8rem"
                        color="white"
                        w="full"
                        bgColor="black"
                        onClick={() => router.reload()}
                        // h="2rem"
                        // borderRadius="0"
                    >
                        Check Rate
                    </Button>
                </Flex>
            </VStack>
        </Grid>
    );
}

export default PaymentPartnerDashboard;
