import { Box, Grid, Image, Tr, VStack } from "@chakra-ui/react";
import DashboardCard from "@components/bits-utils/DashboardCard";
import TableCards from "@components/bits-utils/TableCards";
import { TableData, TableStatus } from "@components/bits-utils/TableData";
import {
    DashboardView,
    DashboardViewStandardResponse,
    UserView,
} from "src/services";

interface DashboardProps {
    metrics: DashboardViewStandardResponse;
}

function PaymentPartnerDashboard({ metrics }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardView;
    return (
        <VStack gap="1rem">
            <Grid templateColumns={["1fr", "1fr"]} gap="1.2rem" w="full">
                <TableCards
                    title={"Recent Payroll"}
                    url={"profile-management/clients"}
                    data={adminMetrics?.recentCLients
                        ?.slice(0, 4)
                        .map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.role} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                            </Tr>
                        ))}
                    thead={[
                        "Client",
                        "Start date",
                        "End date",
                        "Rate",
                        "Total Amount",
                        "Status",
                        "Action",
                    ]}
                    link={"/"}
                />
            </Grid>
            <Grid templateColumns={["1fr", "1fr"]} gap="1.2rem" w="full">
                <TableCards
                    title={"Recent Invoice"}
                    url={"profile-management/clients"}
                    data={adminMetrics?.recentCLients
                        ?.slice(0, 4)
                        .map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.role} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                            </Tr>
                        ))}
                    thead={[
                        "Client",
                        "Invoice no.",
                        "Amount",
                        "Generated on",
                        "Status",
                        "Action",
                    ]}
                    link={"/"}
                />
            </Grid>
        </VStack>
    );
}

export default PaymentPartnerDashboard;
