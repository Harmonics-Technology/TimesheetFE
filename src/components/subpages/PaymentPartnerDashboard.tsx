import { Box, Grid, Image, Tr, VStack } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    TableData,
    TableState,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import moment from 'moment';
import { useContext } from 'react';
import {
    DashboardPaymentPartnerView,
    DashboardPaymentPartnerViewStandardResponse,
    RecentPayrollView,
} from 'src/services';

interface DashboardProps {
    metrics: DashboardPaymentPartnerViewStandardResponse;
}

function PaymentPartnerDashboard({ metrics }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardPaymentPartnerView;
    const { messages, markAsRead, loading } = useContext(NotificationContext);

    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Payroll'}
                        url={'viewpayroll'}
                        data={adminMetrics?.recentPayroll
                            ?.slice(0, 5)
                            .map((x: RecentPayrollView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.client} />
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
                                    <TableData name={x.rate} />
                                    <TableData name={x.totalAmount} />
                                    <TableState name={x.status} />
                                </Tr>
                            ))}
                        thead={[
                            'Client',
                            'Start date',
                            'End date',
                            'Rate',
                            'Total Amount',
                            'Status',
                        ]}
                        link={''}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Invoice'}
                        url={'invoice'}
                        data={adminMetrics?.recentPayroll
                            ?.slice(0, 5)
                            .map((x: RecentPayrollView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.client} />
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
                                    <TableData name={x.rate} />
                                    <TableData name={x.totalAmount} />
                                    <TableState name={x.status} />
                                </Tr>
                            ))}
                        thead={[
                            'Client',
                            'Start date',
                            'End date',
                            'Rate',
                            'Total Amount',
                            'Status',
                        ]}
                        link={''}
                    />
                </Grid>
            </VStack>
            <NotificationBox
                data={messages}
                markAsRead={markAsRead}
                loading={loading}
            />
        </Grid>
    );
}

export default PaymentPartnerDashboard;
