import { Box, Flex, Grid, HStack, Square, Stack, Text } from "@chakra-ui/react";
import DashboardCard from "@components/bits-utils/DashboardCard";
function Dashboard() {
    return (
        <Box>
            <Grid templateColumns="repeat(3, 1fr)">
                <DashboardCard url="/" title="client" value="15" />
            </Grid>
        </Box>
    );
}

export default Dashboard;
