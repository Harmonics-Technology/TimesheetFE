import { Box, HStack, VStack, Text, Divider, Image } from "@chakra-ui/react";
import { UserContext } from "@components/context/UserContext";
import MenuItem from "@components/menu-item";
import Link from "next/link";
import { useContext } from "react";
import {
    FaCalendar,
    FaCogs,
    FaFile,
    FaHome,
    FaUser,
    FaUsers,
} from "react-icons/fa";
import { RiLineChartFill } from "react-icons/ri";
interface sidenavProps {
    openSidenav: boolean;
}

function SideNav({ openSidenav }: sidenavProps) {
    const { user } = useContext(UserContext);
    console.log({ user });
    const role = user?.role?.replace(" ", "");
    return (
        <Box
            bgColor="#FFFFFF"
            borderRadius="30px"
            h="95vh"
            w={["50%", "17%"]}
            pos="fixed"
            left={[openSidenav ? "2%" : "-50%", "unset"]}
            pl="2rem"
            transition="left .3s ease-out"
            pt="2rem"
            zIndex="999"
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
            {role == "SuperAdmin" ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
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
                        role={role}
                        dropDown={["approval", "history"]}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        dropDown={[
                            "expenses",
                            "invoices",
                            "payrolls",
                            "payslips",
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        linkName="settings"
                        menuTitle="Settings"
                        icon={<FaCogs opacity=".8" />}
                        option={true}
                        dropDown={["expense type"]}
                        role={role}
                    />
                </VStack>
            ) : role == "TeamMember" ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                    />

                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        dropDown={["my timesheet", "timesheet history"]}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        dropDown={[
                            "my expenses",
                            "my invoices",
                            "my payrolls",
                            "my payslips",
                        ]}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                    />
                </VStack>
            ) : null}
        </Box>
    );
}

export default SideNav;
