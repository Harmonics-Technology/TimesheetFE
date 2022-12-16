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

function TeamDashboard({ metrics }: DashboardProps) {
    const adminMetrics = metrics?.data as DashboardView;
    return (
        <VStack gap="1rem">
            <Grid
                templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}
                gap="1.2rem"
                w="full"
            >
                <DashboardCard
                    url="/SuperAdmin/profile-management/client"
                    title="client"
                    value={adminMetrics?.totalClients}
                />
                <DashboardCard
                    url="/SuperAdmin/profile-management/team-members"
                    title="team members"
                    value={adminMetrics?.totalTeamMembers}
                />
                <DashboardCard
                    url="/SuperAdmin/profile-management/admin"
                    title="admins"
                    value={adminMetrics?.totalDownLines}
                />
            </Grid>
            <Grid templateColumns={["1fr", "2fr 1fr"]} gap="1.2rem" w="full">
                <TableCards
                    title={"Recent Payroll"}
                    url={"profile-management/clients"}
                    data={adminMetrics?.recentCLients
                        ?.slice(0, 4)
                        .map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} />
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
            <Grid templateColumns={["1fr", "2fr 1fr"]} gap="1.2rem" w="full">
                <TableCards
                    title={"Recent Payroll"}
                    url={"profile-management/clients"}
                    data={adminMetrics?.recentCLients
                        ?.slice(0, 4)
                        .map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableStatus name={x.isActive} />
                                <TableData name={x.firstName} />
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

export default TeamDashboard;
