import { Box, Grid, Image, Tr, VStack, useDisclosure } from '@chakra-ui/react';
import DashboardCard from '@components/bits-utils/DashboardCard';
import { NotificationBox } from '@components/bits-utils/NotificationBox';
import TableCards from '@components/bits-utils/TableCards';
import {
    InvoiceAction,
    TableActions,
    TableContractAction,
    TableData,
    TableStatus,
} from '@components/bits-utils/TableData';
import { NotificationContext } from '@components/context/NotificationContext';
import { CUR } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import { useContext, useState } from 'react';
import {
    DashboardTeamMemberView,
    DashboardView,
    DashboardViewStandardResponse,
    ExpenseView,
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
    PaySlipView,
    PaySlipViewPagedCollectionStandardResponse,
    RecentTimeSheetView,
    TimeSheetView,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from 'src/services';
import PayrollInvoice from './PayrollInvoice';
import ClientInvoicedInvoice from './ClientInvoicedInvoice';

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
    supervisor: UserViewPagedCollectionStandardResponse;
    team: UserViewPagedCollectionStandardResponse;
    invoice: InvoiceViewPagedCollectionStandardResponse;
}
interface DashboardClientView {
    recentInvoice: [] | undefined | null;
}

function ClientDashboard({
    metrics,
    supervisor,
    team,
    invoice,
}: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardTeamMemberView;
    const clientMetrics = metrics?.data as DashboardClientView;
    const { messages, markAsRead, loading } = useContext(NotificationContext);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();

    return (
        <Grid templateColumns={['1fr', '3fr 1fr']} gap="1.2rem" w="full">
            <VStack gap="1rem">
                <Grid
                    templateColumns={['repeat(1, 1fr)', 'repeat(3, 1fr)']}
                    gap="1.2rem"
                    w="full"
                >
                    <DashboardCard
                        url="team-members"
                        title="Team Members"
                        value={team?.data?.size}
                    />
                    <DashboardCard
                        url="supervisors"
                        title="Supervisors"
                        value={supervisor?.data?.size}
                    />
                    <DashboardCard
                        url="financials/invoices"
                        title="Invoices"
                        value={invoice?.data?.size}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Team Members'}
                        url={'team-members'}
                        data={team?.data?.value
                            ?.slice(0, 4)
                            .map((x: UserView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.firstName} />
                                    <TableData name={x.lastName} />
                                    <TableData name={x.email} />
                                    <TableData
                                        name={
                                            x.employeeInformation?.payrollGroup
                                        }
                                    />
                                    <TableActions
                                        id={x.id}
                                        email={x.email}
                                        route={''}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'First Name',
                            'Last Name',
                            'Email',
                            'Affilated with',
                            'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
                <Grid templateColumns={['1fr', '1fr']} gap="1.2rem" w="full">
                    <TableCards
                        title={'Recent Invoices'}
                        url={'financials/invoices'}
                        data={invoice?.data?.value
                            ?.slice(0, 4)
                            .map((x: InvoiceView, i: any) => (
                                <Tr key={i}>
                                    <TableData name={x.invoiceReference} />
                                    <TableData name={formatDate(x.startDate)} />
                                    <TableData name={formatDate(x.endDate)} />
                                    <TableData
                                        name={formatDate(x.dateCreated)}
                                    />
                                    <InvoiceAction
                                        data={x}
                                        onOpen={onOpen}
                                        clicked={setClicked}
                                    />
                                </Tr>
                            ))}
                        thead={[
                            'Invoice No',
                            'Begining Period',
                            'Ending Period',
                            'Date Created',
                            'Action',
                        ]}
                        link={'/'}
                    />
                </Grid>
            </VStack>
            <NotificationBox
                data={messages}
                markAsRead={markAsRead}
                loading={loading}
            />
            <ClientInvoicedInvoice
                isOpen={isOpen}
                onClose={onClose}
                clicked={clicked}
            />
        </Grid>
    );
}

export default ClientDashboard;
