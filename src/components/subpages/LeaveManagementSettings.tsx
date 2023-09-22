import {
    Box,
    Flex,
    Grid,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tr,
    useToast,
} from '@chakra-ui/react';
import { AddEditLeave } from '@components/bits-utils/AddEditLeave';
import { LeaveDaysDefaults } from '@components/bits-utils/LeaveDaysDefaults';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import TitleText from '@components/bits-utils/TitleText';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import {
    ControlSettingModel,
    ControlSettingView,
    LeaveConfigurationView,
    LeaveService,
    LeaveTypeView,
    LeaveTypeViewPagedCollectionStandardResponse,
    UserService,
} from 'src/services';

interface leaveProps {
    leaves: LeaveTypeViewPagedCollectionStandardResponse;
    leaveConfiguration: LeaveConfigurationView;
    controls: ControlSettingView;
}

export const LeaveManagementSettings = ({
    leaves,
    leaveConfiguration,
    controls,
}: leaveProps) => {
    const [data, setData] = useState<any>();
    const [loading, setLoading] = useState({ state: false, id: '' });
    const [leave, setLeave] = useState<any>(leaves?.data?.value);
    const toast = useToast();
    const router = useRouter();
    const { user } = useContext(UserContext);
    const [access, setAccess] = useState<ControlSettingModel>({
        allowIneligibleLeaveCode: controls?.allowIneligibleLeaveCode,
    });
    const deleteLeave = async (id: string) => {
        setLoading({ state: true, id });
        try {
            const result = await LeaveService.deleteLeaveType(id);
            if (result.status) {
                setLoading({ state: false, id: '' });
                toast({
                    title: `Leave type deleted`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLeave(leaves.data?.value?.filter((x) => x.id !== id));
                return;
            }
            setLoading({ state: false, id: '' });
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            setLoading({ state: false, id: '' });
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const updateControl = async (data: ControlSettingModel) => {
        data.superAdminId = user?.superAdminId;
        setLoading({ state: true, id: 'access' });

        try {
            const result = await UserService.updateControlSettings(access);
            if (result.status) {
                setLoading({ state: true, id: '' });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ state: true, id: '' });
        } catch (error: any) {
            setLoading({ state: true, id: '' });

            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    useNonInitialEffect(() => {
        updateControl(access);
    }, [access]);

    return (
        <Box>
            <Flex
                justify="space-between"
                pb="1rem"
                borderBottom="1px solid #C2CFE0"
                align="center"
            >
                <Text fontSize=".875rem" color="#2d3748" mb="0">
                    Leave Management Preference
                </Text>
            </Flex>
            <Grid
                templateColumns={{
                    base: 'repeat(1, 2fr)',
                    lg: '2fr 1fr',
                }}
                w="full"
                mt="1.5rem"
                mb="3rem"
                pb="1.5rem"
                borderBottom="1px solid #C2CFE0"
            >
                <Box w="full" pr={['0', '2rem']}>
                    <Tables
                        tableHead={['Leave Type', 'Date Created', 'Actions']}
                        bg="brand.400"
                        color="white"
                    >
                        <>
                            {leave?.map((x: LeaveTypeView) => (
                                <Tr key={x.id}>
                                    <TableData name={x.name} />
                                    <TableData name={formatDate(new Date())} />
                                    <td>
                                        <Menu>
                                            <MenuButton>
                                                <Box
                                                    fontSize="1rem"
                                                    pl="1rem"
                                                    fontWeight="bold"
                                                    cursor="pointer"
                                                    color="brand.300"
                                                >
                                                    {loading.state &&
                                                    loading.id == x.id ? (
                                                        <Spinner size="sm" />
                                                    ) : (
                                                        <FaEllipsisH />
                                                    )}
                                                </Box>
                                            </MenuButton>
                                            <MenuList w="full">
                                                <MenuItem
                                                    onClick={() => setData(x)}
                                                    w="full"
                                                >
                                                    Edit
                                                </MenuItem>
                                                <MenuItem
                                                    onClick={() =>
                                                        deleteLeave(
                                                            x?.id as string,
                                                        )
                                                    }
                                                    w="full"
                                                >
                                                    Delete
                                                </MenuItem>
                                            </MenuList>
                                        </Menu>
                                    </td>
                                </Tr>
                            ))}
                        </>
                    </Tables>
                </Box>
                <Box w="full" borderLeft="1px solid #C2CFE0" pl={['0', '2rem']}>
                    <AddEditLeave data={data} />
                </Box>
            </Grid>
            <Box borderBottom="1px solid #C2CFE0" pb="1.5rem">
                <LeaveDaysDefaults leaveConfiguration={leaveConfiguration} />
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="In-eligible Leave Color Code"
                        text="Make use of the red color code for an in-eligible leave by a staff in your company"
                    />
                    <ToggleSwitch
                        label="leaves"
                        onChange={() =>
                            setAccess({
                                ...access,
                                allowIneligibleLeaveCode:
                                    !access.allowIneligibleLeaveCode,
                            })
                        }
                        checked={access?.allowIneligibleLeaveCode}
                        loading={loading.state && loading.id == 'access'}
                    />
                </Flex>
            </Box>
        </Box>
    );
};
