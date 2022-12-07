import { Box, Grid, Image, VStack } from "@chakra-ui/react";
import DashboardCard from "@components/bits-utils/DashboardCard";
import TableCards from "@components/bits-utils/TableCards";
import { DashboardView } from "src/services";

interface DashboardProps {
    metrics: DashboardView;
}

function SadminDashboard({ metrics }: DashboardProps) {
    console.log({ metrics });
    return (
        <VStack gap="1rem">
            <Grid
                templateColumns={["repeat(1, 1fr)", "repeat(3, 1fr)"]}
                gap="1.2rem"
                w="full"
            >
                <DashboardCard
                    url="/"
                    title="client"
                    value={metrics?.totalClients}
                />
                <DashboardCard
                    url="/"
                    title="team members"
                    value={metrics?.totalTeamMembers}
                />
                <DashboardCard
                    url="/"
                    title="downline"
                    value={metrics?.totalDownLines}
                />
            </Grid>
            <Grid templateColumns={["1fr", "2fr 1fr"]} gap="1.2rem" w="full">
                <TableCards title={"Recent Clients"} url={"/"} />
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    w="full"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Image src="/assets/dash.png" h="full" mx="auto" />
                </Box>
            </Grid>
        </VStack>
    );
}

export default SadminDashboard;
