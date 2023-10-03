import { Box, HStack, VStack, Divider, Image } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import MenuItem from '@components/menu-item';
import Link from 'next/link';
import { useContext } from 'react';
import {
    FaCalendar,
    FaCreditCard,
    FaFile,
    FaHome,
    FaMoneyBill,
    FaUser,
    FaUsers,
} from 'react-icons/fa';
import { RiLineChartFill } from 'react-icons/ri';
import { MdOutlineSupervisorAccount, MdSettings } from 'react-icons/md';
import { BsGraphUp } from 'react-icons/bs';
import { AiFillSchedule } from 'react-icons/ai';
import { TbCalendarTime } from 'react-icons/tb';
interface sidenavProps {
    openSidenav: boolean;
    setOpenSidenav: any;
    change: any;
}

function SideNav({ openSidenav, setOpenSidenav, change }: sidenavProps) {
    const { user, subType, activeSub } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');

    const profile =
        subType == 'basic'
            ? [
                  'admin',
                  { show: true, name: 'clients' },
                  'supervisors',
                  'team members',
              ]
            : subType == 'standard'
            ? [
                  'admin',
                  { show: true, name: 'clients' },
                  'supervisors',
                  'team members',
                  'payment partners',
              ]
            : subType == 'premium'
            ? [
                  'admin',
                  { show: false, name: 'clients' },
                  'supervisors',
                  'team members',
                  'payment partners',
              ]
            : [{ show: true, name: 'admin' }];
    return (
        <Box
            bgColor={change ? 'brand.400' : 'white'}
            // borderRadius="30px"
            h="100vh"
            w={['60%', '17%']}
            pos="fixed"
            left={[openSidenav ? '0%' : '-70%', 'unset']}
            pl="1.5rem"
            transition="left .3s ease-out"
            pt="2rem"
            zIndex="985"
            overflowY="auto"
            boxShadow="sm"
        >
            <Link href={`/${role}/dashboard`} passHref>
                <HStack>
                    <Box h="2rem">
                        {change ? (
                            <Image src="/assets/newlogob.png" h="full" />
                        ) : (
                            <Image src="/assets/newlogo.png" h="full" />
                        )}
                    </Box>
                    {/* <Text
                        fontWeight="600"
                        fontSize=".875rem"
                        color={change ? 'white' : 'brand.200'}
                    >
                        Admin Timesheet
                    </Text> */}
                </HStack>
            </Link>
            <Divider my="2rem" />
            {role == 'SuperAdmin' ? (
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                    pb="5rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={profile}
                        display={activeSub}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                        display={activeSub}
                    />
                    <MenuItem
                        change={change}
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            { show: subType == 'basic', name: 'expenses' },
                            { show: subType == 'basic', name: 'payrolls' },
                            { show: subType == 'basic', name: 'payslips' },
                            { show: subType == 'basic', name: 'invoices' },
                        ]}
                        display={activeSub}
                    />
                    <MenuItem
                        change={change}
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                        display={activeSub}
                    />
                    {/* <MenuItem
                        change={change}
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    /> */}
                    {/* <MenuItem
                        change={change}
                        linkName="settings"
                        menuTitle="Settings"
                        icon={<FaCogs opacity=".8" />}
                        option={true}
                        dropDown={[
                            'expense type',
                            'onboarding fees',
                            'hst settings',
                            'leave type',
                        ]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    /> */}
                    <MenuItem
                        change={change}
                        linkName="report"
                        menuTitle="Reports"
                        icon={<BsGraphUp opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                        display={activeSub}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                        display={activeSub}
                    />
                    <MenuItem
                        change={change}
                        linkName="shift-management"
                        menuTitle="Shift Management"
                        icon={<AiFillSchedule opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                        display={
                            (subType == 'standard' && activeSub) ||
                            (subType == 'premium' && activeSub)
                                ? true
                                : false
                        }
                    />
                    <MenuItem
                        change={change}
                        linkName="project-management"
                        menuTitle="Project Management"
                        icon={<TbCalendarTime opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                        display={
                            (subType == 'standard' && activeSub) ||
                            (subType == 'premium' && activeSub)
                                ? true
                                : false
                        }
                    />
                    <MenuItem
                        change={change}
                        linkName="account-management"
                        menuTitle="Account settings"
                        icon={<MdSettings opacity=".8" />}
                        option={true}
                        dropDown={[
                            'manage subscription',
                            'expense type',
                            'onboarding fee',
                            'hst settings',
                            'leave management settings',
                            {
                                show: subType == 'basic',
                                name: 'shift management settings',
                            },
                            'access control settings',
                            'payment schedule settings',
                            'personal info',
                            'notification settings',
                        ]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                        display={activeSub}
                    />
                </VStack>
            ) : role == 'TeamMember' ? (
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />

                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Manage Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={
                            user?.invoiceType == 'payroll'
                                ? ['my expenses', 'my payslips']
                                : ['my expenses', 'my payslips', 'my invoices']
                        }
                    />
                    <MenuItem
                        change={change}
                        linkName="my-contracts"
                        menuTitle="My Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    {user?.employeeType?.toLowerCase() == 'shift' && (
                        <MenuItem
                            change={change}
                            linkName="shift-management"
                            menuTitle="Shift Management"
                            icon={<AiFillSchedule opacity=".8" />}
                            option={false}
                            dropDown={[]}
                            setOpenSidenav={setOpenSidenav}
                            role={role}
                        />
                    )}
                    <MenuItem
                        change={change}
                        linkName="project-management"
                        menuTitle="Project Management"
                        icon={<TbCalendarTime opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                        display={
                            (subType == 'standard' && activeSub) ||
                            (subType == 'premium' && activeSub)
                                ? true
                                : false
                        }
                    />
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                    <MenuItem
                        change={change}
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['expenses']}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                        display={true}
                    />
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                        role={role}
                    />
                    <MenuItem
                        change={change}
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="my-timesheets"
                        menuTitle="My Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['unapproved', 'history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={
                            user?.payrollType === 'OFFSHORE'
                                ? ['my expenses', 'my payslips']
                                : ['my expenses', 'my payslips', 'my invoices']
                        }
                    />
                    <MenuItem
                        change={change}
                        linkName="my-contracts"
                        menuTitle="My Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    {user?.employeeType?.toLowerCase() == 'shift' && (
                        <MenuItem
                            change={change}
                            linkName="shift-management"
                            menuTitle="Shift Management"
                            icon={<AiFillSchedule opacity=".8" />}
                            option={false}
                            dropDown={[]}
                            setOpenSidenav={setOpenSidenav}
                            role={role}
                        />
                    )}
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />

                    <MenuItem
                        change={change}
                        linkName="expenses"
                        menuTitle="Expenses"
                        icon={<FaCreditCard opacity=".8" />}
                        option={false}
                        role={role}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="viewpayroll"
                        menuTitle="View Payroll"
                        icon={<FaMoneyBill opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="invoices"
                        menuTitle="Invoice"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        role={role}
                        dropDown={[]}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    {/* <MenuItem change={change}
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
                    /> */}
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        change={change}
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
                        change={change}
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    {/* <MenuItem change={change}
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
                    /> */}
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="my-timesheets"
                        menuTitle="My Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        change={change}
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
                        change={change}
                        linkName="my-financials"
                        menuTitle="My Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={
                            user?.payrollType === 'OFFSHORE'
                                ? ['my expenses', 'my payslips']
                                : ['my expenses', 'my payslips', 'my invoices']
                        }
                    />

                    <MenuItem
                        change={change}
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={true}
                        dropDown={['all contracts', 'my contracts']}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    {user?.employeeType?.toLowerCase() == 'shift' && (
                        <MenuItem
                            change={change}
                            linkName="shift-management"
                            menuTitle="Shift Management"
                            icon={<AiFillSchedule opacity=".8" />}
                            option={false}
                            dropDown={[]}
                            setOpenSidenav={setOpenSidenav}
                            role={role}
                        />
                    )}
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={profile}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    {/* <MenuItem change={change}
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
                    /> */}
                    <MenuItem
                        change={change}
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="profile-management"
                        menuTitle="Profile Management"
                        icon={<FaUsers opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={profile}
                    />
                    <MenuItem
                        change={change}
                        linkName="my-timesheets"
                        menuTitle="My Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['my timesheet', 'timesheet history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    {/* <MenuItem change={change}
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
                    /> */}
                    <MenuItem
                        change={change}
                        linkName="my-financials"
                        menuTitle="My Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={
                            user?.payrollType === 'OFFSHORE'
                                ? ['my expenses', 'my payslips']
                                : ['my expenses', 'my payslips', 'my invoices']
                        }
                    />

                    <MenuItem
                        change={change}
                        linkName="contracts"
                        menuTitle="Contracts"
                        icon={<FaFile opacity=".8" />}
                        option={true}
                        dropDown={['all contracts', 'my contracts']}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="leave"
                        menuTitle="Leave Management"
                        icon={<FaFile opacity=".8" />}
                        option={false}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[]}
                        role={role}
                    />
                    {user?.employeeType?.toLowerCase() == 'shift' && (
                        <MenuItem
                            change={change}
                            linkName="shift-management"
                            menuTitle="Shift Management"
                            icon={<AiFillSchedule opacity=".8" />}
                            option={false}
                            dropDown={[]}
                            setOpenSidenav={setOpenSidenav}
                            role={role}
                        />
                    )}
                    <MenuItem
                        change={change}
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
                <VStack
                    align="left"
                    gap={change ? '.8rem' : '1.5rem'}
                    pr="1rem"
                >
                    <MenuItem
                        change={change}
                        linkName="dashboard"
                        menuTitle="Dashboard"
                        icon={<FaHome opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="team-members"
                        menuTitle="My Team"
                        icon={<FaUsers opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="supervisors"
                        menuTitle="My Supervisors"
                        icon={<MdOutlineSupervisorAccount opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <MenuItem
                        change={change}
                        linkName="timesheets"
                        menuTitle="Timesheets"
                        icon={<FaCalendar opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={['approval', 'history']}
                    />
                    <MenuItem
                        change={change}
                        linkName="financials"
                        menuTitle="Financials"
                        icon={<RiLineChartFill opacity=".8" />}
                        option={true}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                        dropDown={[
                            'expenses',
                            // 'payrolls',
                            // 'payslips',
                            'invoices',
                        ]}
                    />
                    <MenuItem
                        change={change}
                        linkName="my-profile"
                        menuTitle="My Profile"
                        icon={<FaUser opacity=".8" />}
                        option={false}
                        dropDown={[]}
                        role={role}
                        setOpenSidenav={setOpenSidenav}
                    />
                </VStack>
            ) : null}
        </Box>
    );
}

export default SideNav;

// import { Box, HStack, VStack, Text, Divider, Image } from '@chakra-ui/react';
// import { UserContext } from '@components/context/UserContext';
// import MenuItem from '@components/menu-item';
// import Link from 'next/link';
// import { useContext, useEffect } from 'react';
// import {
//     FaCalendar,
//     FaCogs,
//     FaCreditCard,
//     FaFile,
//     FaHome,
//     FaMoneyBill,
//     FaUser,
//     FaUsers,
// } from 'react-icons/fa';
// import { RiLineChartFill } from 'react-icons/ri';
// import { MdOutlineSupervisorAccount } from 'react-icons/md';
// interface sidenavProps {
//     openSidenav: boolean;
//     setOpenSidenav: any;
// }

// function SideNav({ openSidenav, setOpenSidenav }: sidenavProps) {
//     const { user } = useContext(UserContext);
//     //
//     const role = user?.role?.replaceAll(' ', '');
//     const closeToggle = () => {
//         setOpenSidenav(false);
//     };

//     return (
//         <Box
//             bgColor="#FFFFFF"
//             borderRadius="30px"
//             h="95vh"
//             w={['50%', '17%']}
//             pos="fixed"
//             left={[openSidenav ? '2%' : '-50%', 'unset']}
//             pl="2rem"
//             transition="left .3s ease-out"
//             pt="2rem"
//             zIndex="985"
//             overflowY="auto"
//             boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
//             // ref={ref}
//         >
//             <Link href="/" passHref>
//                 <HStack>
//                     <Box h="2rem">
//                         <Image src="/assets/newlogo.png" h="full" />
//                     </Box>
//                     <Text fontWeight="600" fontSize=".875rem" color="brand.300">
//                         Admin Timesheet
//                     </Text>
//                 </HStack>
//             </Link>
//             <Divider my="2rem" />
//             {role == 'SuperAdmin' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile-management"
//                         menuTitle="Profile Management"
//                         icon={<FaUsers opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'admin',
//                             'clients',
//                             'supervisors',
//                             'team members',
//                             'payment partners',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="contracts"
//                         menuTitle="Contracts"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[]}
//                         role={role}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                     <MenuItem change={change}
//                         linkName="settings"
//                         menuTitle="Settings"
//                         icon={<FaCogs opacity=".8" />}
//                         option={true}
//                         dropDown={['expense type']}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                 </VStack>
//             ) : role == 'TeamMember' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />

//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Manage Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['my timesheet', 'timesheet history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'my expenses',
//                             'my payslips',
//                             `${
//                                 user?.payrollType === 'OFFSHORE'
//                                     ? 'invoices'
//                                     : 'my invoices'
//                             }`,
//                             'my contracts',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                 </VStack>
//             ) : role == 'Supervisor' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                     <MenuItem change={change}
//                         linkName="team-members"
//                         menuTitle="My Team"
//                         icon={<FaUsers opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['unapproved', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['expenses']}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                 </VStack>
//             ) : role == 'InternalSupervisor' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                     <MenuItem change={change}
//                         linkName="team-members"
//                         menuTitle="My Team"
//                         icon={<FaUsers opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-timesheets"
//                         menuTitle="Manage Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['my timesheet', 'timesheet history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['unapproved', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'my payslips',
//                             `${
//                                 user?.payrollType === 'OFFSHORE'
//                                     ? 'invoices'
//                                     : 'my invoices'
//                             }`,
//                             'my contracts',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                         role={role}
//                     />
//                 </VStack>
//             ) : role == 'PaymentPartner' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="team-members"
//                         menuTitle="My Team"
//                         icon={<FaUsers opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />

//                     <MenuItem change={change}
//                         linkName="expenses"
//                         menuTitle="Expenses"
//                         icon={<FaCreditCard opacity=".8" />}
//                         option={false}
//                         role={role}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="viewpayroll"
//                         menuTitle="View Payroll"
//                         icon={<FaMoneyBill opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="invoices"
//                         menuTitle="Invoice"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         role={role}
//                         dropDown={[]}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile"
//                         menuTitle="Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                 </VStack>
//             ) : role == 'PayrollManager' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile-management"
//                         menuTitle="Profile Management"
//                         icon={<FaUsers opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'clients',
//                             'supervisors',
//                             'team members',
//                             'payment partners',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="contracts"
//                         menuTitle="Contracts"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                 </VStack>
//             ) : role == 'InternalPayrollManager' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile-management"
//                         menuTitle="Profile Management"
//                         icon={<FaUsers opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'clients',
//                             'supervisors',
//                             'team members',
//                             'payment partners',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-timesheets"
//                         menuTitle="Manage Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['my timesheet', 'timesheet history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-financials"
//                         menuTitle="My Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'my expenses',
//                             'my payslips',
//                             `${
//                                 user?.payrollType === 'OFFSHORE'
//                                     ? 'invoices'
//                                     : 'my invoices'
//                             }`,
//                             'my contracts',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="contracts"
//                         menuTitle="Contracts"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                 </VStack>
//             ) : role == 'Admin' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile-management"
//                         menuTitle="Profile Management"
//                         icon={<FaUsers opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'clients',
//                             'supervisors',
//                             'team members',
//                             'payment partners',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="contracts"
//                         menuTitle="Contracts"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                 </VStack>
//             ) : role == 'InternalAdmin' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="profile-management"
//                         menuTitle="Profile Management"
//                         icon={<FaUsers opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'clients',
//                             'supervisors',
//                             'team members',
//                             'payment partners',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-timesheets"
//                         menuTitle="Manage Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['my timesheet', 'timesheet history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-financials"
//                         menuTitle="My Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'my expenses',
//                             'my payslips',
//                             `${
//                                 user?.payrollType === 'OFFSHORE'
//                                     ? 'invoices'
//                                     : 'my invoices'
//                             }`,
//                             'my contracts',
//                         ]}
//                     />
//                     <MenuItem change={change}
//                         linkName="contracts"
//                         menuTitle="Contracts"
//                         icon={<FaFile opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="my-profile"
//                         menuTitle="My Profile"
//                         icon={<FaUser opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                 </VStack>
//             ) : role == 'client' ? (
//                 <VStack align="left" gap="1.5rem" pr="1rem">
//                     <MenuItem change={change}
//                         linkName="dashboard"
//                         menuTitle="Dashboard"
//                         icon={<FaHome opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="team-members"
//                         menuTitle="My Team"
//                         icon={<FaUsers opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="supervisors"
//                         menuTitle="My Supervisors"
//                         icon={<MdOutlineSupervisorAccount opacity=".8" />}
//                         option={false}
//                         dropDown={[]}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                     />
//                     <MenuItem change={change}
//                         linkName="timesheets"
//                         menuTitle="Timesheets"
//                         icon={<FaCalendar opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={['approval', 'history']}
//                     />
//                     <MenuItem change={change}
//                         linkName="financials"
//                         menuTitle="Financials"
//                         icon={<RiLineChartFill opacity=".8" />}
//                         option={true}
//                         role={role}
//                         setOpenSidenav={setOpenSidenav}
//                         dropDown={[
//                             'expenses',
//                             'payrolls',
//                             'payslips',
//                             'invoices',
//                         ]}
//                     />
//                 </VStack>
//             ) : null}
//         </Box>
//     );
// }

// export default SideNav;
