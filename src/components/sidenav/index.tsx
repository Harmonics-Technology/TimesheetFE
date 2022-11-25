import { Box, HStack, VStack, Text, Divider, Image } from "@chakra-ui/react";
import MenuItem from "@components/menu-item";
import Link from "next/link";
import {
    FaCalendar,
    FaCogs,
    FaFile,
    FaHome,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { RiLineChartFill } from "react-icons/ri";

function SideNav() {
    return (
        <Box
            bgColor="#FFFFFF"
            borderRadius="30px"
            h="95vh"
            w="17%"
            pos="fixed"
            pl="2rem"
            pt="2rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Link href="/" passHref>
                <HStack>
                    <Box h="2rem">
                        <Image src="/assets/logo.png" h="full" />
                    </Box>
                    <Text fontWeight="600" fontSize=".875rem" color="brand.300">
                        Admin Timesheet
                    </Text>
                </HStack>
            </Link>
            <Divider my="2rem" />
            <VStack align="left" gap="1.5rem" pr="1rem">
                <MenuItem
                    linkName="dashboard"
                    menuTitle="Dashboard"
                    icon={<FaHome opacity=".8" />}
                    option={false}
                    dropDown={[]}
                />
                <MenuItem
                    linkName="profile-management"
                    menuTitle="Profile Management"
                    icon={<FaUsers opacity=".8" />}
                    option={true}
                    dropDown={[
                        "admin",
                        "clients",
                        "team members",
                        "payment partners",
                    ]}
                />
                <MenuItem
                    linkName="timesheets"
                    menuTitle="Timesheets"
                    icon={<FaCalendar opacity=".8" />}
                    option={true}
                    dropDown={["approval", "history"]}
                />
                <MenuItem
                    linkName="financials"
                    menuTitle="Financials"
                    icon={<RiLineChartFill opacity=".8" />}
                    option={true}
                    dropDown={["expenses", "invoices", "payrolls", "payslips"]}
                />
                <MenuItem
                    linkName="contracts"
                    menuTitle="Contracts"
                    icon={<FaFile opacity=".8" />}
                    option={false}
                    dropDown={[]}
                />
                <MenuItem
                    linkName="my-profile"
                    menuTitle="My Profile"
                    icon={<FaUser opacity=".8" />}
                    option={false}
                    dropDown={[]}
                />
                <MenuItem
                    linkName="settings"
                    menuTitle="Settings"
                    icon={<FaCogs opacity=".8" />}
                    option={true}
                    dropDown={["expense type"]}
                />
            </VStack>
        </Box>
    );
}

export default SideNav;
