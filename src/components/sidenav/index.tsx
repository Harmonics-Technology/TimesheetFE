import { Box, HStack, VStack, Text, Divider, Image } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import MenuItem from '@components/menu-item';
import Link from 'next/link';
import { useContext, useEffect } from 'react';
import {
    FaCalendar,
    FaCogs,
    FaCreditCard,
    FaFile,
    FaHome,
    FaMoneyBill,
    FaUser,
    FaUsers,
} from 'react-icons/fa';
import { RiLineChartFill } from 'react-icons/ri';
import { MdOutlineSupervisorAccount } from 'react-icons/md';
interface sidenavProps {
    openSidenav: boolean;
    setOpenSidenav: any;
}

function SideNav({ openSidenav, setOpenSidenav }: sidenavProps) {
    const { user } = useContext(UserContext);
    // console.log({ user });
    const role = user?.role?.replace(' ', '');
    const closeToggle = () => {
        setOpenSidenav(false);
    };

    return (
        <Box
            bgColor="#FFFFFF"
            borderRadius="30px"
            h="95vh"
            w={['50%', '17%']}
            pos="fixed"
            left={[openSidenav ? '2%' : '-50%', 'unset']}
            pl="2rem"
            transition="left .3s ease-out"
            pt="2rem"
            zIndex="985"
            overflowY="auto"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            // ref={ref}
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
            {role == 'SuperAdmin' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'admin',
                            'clients',
                            'supervisors',
                            'team members',
                            'payment partners',
                        ]}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                    <MenuItem
                        linkName="settings"
                        menuTitle="Settings"
                        icon={<FaCogs opacity=".8" />}
                        option={true}
                        dropDown={['expense type']}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                </VStack>
            ) : role == 'TeamMember' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />

                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'my expenses',
                            'my payslips',
                            `${
                                user?.payrollType === 'OFFSHORE'
                                    ? 'invoices'
                                    : 'my invoices'
                            }`,
                            'my contracts',
                        ]}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                </VStack>
            ) : role == 'Supervisor' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                    <MenuItem
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['unapproved', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['expenses']}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                </VStack>
            ) : role == 'InternalSupervisor' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                    <MenuItem
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="my-timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['unapproved', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'my payslips',
                            `${
                                user?.payrollType === 'OFFSHORE'
                                    ? 'invoices'
                                    : 'my invoices'
                            }`,
                            'my contracts',
                        ]}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                </VStack>
            ) : role == 'PaymentPartner' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />

                    <MenuItem
                        linkName="expenses"
                        menuTitle="Expenses"
                        icon={<FaCreditCard opacity=".8" />}
                        option={false}
                        role={role}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="viewpayroll"
                        menuTitle="View Payroll"
                        icon={<FaMoneyBill opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="invoices"
                        menuTitle="Invoice"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        role={role}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile"
                        menuTitle="Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : role == 'PayrollManager' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'clients',
                            'supervisors',
                            'team members',
                            'payment partners',
                        ]}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : role == 'InternalPayrollManager' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'clients',
                            'supervisors',
                            'team members',
                            'payment partners',
                        ]}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="my-timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        linkName="my-financials"
                        menuTitle="My Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'my payslips',
                            `${
                                user?.payrollType === 'OFFSHORE'
                                    ? 'invoices'
                                    : 'my invoices'
                            }`,
                            'my contracts',
                        ]}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : role == 'Admin' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'clients',
                            'supervisors',
                            'team members',
                            'payment partners',
                        ]}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : role == 'InternalAdmin' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'clients',
                            'supervisors',
                            'team members',
                            'payment partners',
                        ]}
                    />
                    <MenuItem
                        linkName="my timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : role == 'client' ? (
                <VStack align="left" gap="1.5rem" pr="1rem">
                    <MenuItem
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="supervisors"
                        menuTitle="My Supervisors"
                        icon={<MdOutlineSupervisorAccount opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            'payrolls',
                            'payslips',
                            'invoices',
                        ]}
                    />
                </VStack>
            ) : null}
        </Box>
    );
}

export default SideNav;
