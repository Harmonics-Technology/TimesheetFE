import { Box, Flex, useToast } from '@chakra-ui/react';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import TitleText from '@components/bits-utils/TitleText';
import ToggleSwitch from '@components/bits-utils/ToggleSwitch';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import {
    ControlSettingModel,
    ControlSettingView,
    UserService,
} from 'src/services';

export const AccessControlSettings = ({
    controls,
}: {
    controls: ControlSettingView;
}) => {
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const toast = useToast();
    const router = useRouter();
    const [access, setAccess] = useState<ControlSettingModel>({
        adminOBoarding: controls?.adminOBoarding,
        adminContractManagement: controls?.adminContractManagement,
        adminLeaveManagement: controls?.adminLeaveManagement,
        adminShiftManagement: controls?.adminShiftManagement,
        adminReport: controls?.adminReport,
        adminExpenseTypeAndHST: controls?.adminExpenseTypeAndHST,
        superAdminId: user?.superAdminId,
    });

    const updateControl = async (data: ControlSettingModel) => {
        data.superAdminId = user?.superAdminId;
        setLoading(true);
        try {
            const result = await UserService.updateControlSettings(data);
            if (result.status) {
                setLoading(false);
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
            setLoading(false);
        } catch (error: any) {
            setLoading(false);

            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Onboarding"
                        text="Give access to Admin to onboard team members and staff for their company"
                    />
                    <ToggleSwitch
                        label="onboarding"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminOBoarding: !access.adminOBoarding,
                            })
                        }
                        checked={access.adminOBoarding}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Contract Management"
                        text="Give access to Admin to Terminate, Renew or Extend a team members contract"
                    />
                    <ToggleSwitch
                        label="contract"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminContractManagement:
                                    !access.adminContractManagement,
                            })
                        }
                        checked={access.adminContractManagement}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Leave Management"
                        text="Give Admin access to set the leave management preference for their staffs and team members"
                    />
                    <ToggleSwitch
                        label="leave"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminLeaveManagement:
                                    !access.adminLeaveManagement,
                            })
                        }
                        checked={access.adminLeaveManagement}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Shift Management"
                        text="Give Admin access to set the shift management preference for their staffs and team members"
                    />
                    <ToggleSwitch
                        label="shift"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminShiftManagement:
                                    !access.adminShiftManagement,
                            })
                        }
                        checked={access.adminShiftManagement}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Report"
                        text="Give Admin access to view financial and every other report on the application"
                    />
                    <ToggleSwitch
                        label="report"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminReport: !access.adminReport,
                            })
                        }
                        checked={access.adminReport}
                    />
                </Flex>
            </Box>
            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Expense Type and HST"
                        text="Give Admin access to set expense type and HST on the application"
                    />
                    <ToggleSwitch
                        label="expense"
                        onChange={() =>
                            setAccess({
                                ...access,
                                adminExpenseTypeAndHST:
                                    !access.adminExpenseTypeAndHST,
                            })
                        }
                        checked={access.adminExpenseTypeAndHST}
                    />
                </Flex>
            </Box>

            <Box my="2rem">
                <ShiftBtn
                    text="Save"
                    bg="brand.400"
                    onClick={() => updateControl(access)}
                    loading={loading}
                />
            </Box>
        </Box>
    );
};
