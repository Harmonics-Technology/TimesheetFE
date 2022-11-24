import { Box, Grid, Image, VStack } from "@chakra-ui/react";
import DashboardCard from "@components/bits-utils/DashboardCard";
import TableCards from "@components/bits-utils/TableCards";
function Dashboard() {
    return (
        <VStack gap="1rem">
            <Grid templateColumns="repeat(3, 1fr)" gap="1.2rem" w="full">
                <DashboardCard url="/" title="client" value="15" />
                <DashboardCard url="/" title="client" value="15" />
                <DashboardCard url="/" title="client" value="15" />
            </Grid>
            <Grid templateColumns="2fr 1fr" gap="1.2rem" w="full">
                <TableCards title={"Recent Clients"} url={"/"} />
                <Box
                    bgColor="white"
                    borderRadius="15px"
                    padding="1.5rem"
                    boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
                >
                    <Image src="/assets/dash.png" h="full" />
                </Box>
            </Grid>
        </VStack>
    );
}

export default Dashboard;
