import { Box, Flex, useToast, Text, Grid } from '@chakra-ui/react';
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
        allowUsersTofillFutureTimesheet:
            controls?.allowUsersTofillFutureTimesheet,
        adminCanApproveExpense: controls?.adminCanApproveExpense,
        adminCanApprovePayrolls: controls?.adminCanApprovePayrolls,
        adminCanApproveTimesheet: controls?.adminCanApproveTimesheet,
        adminCanViewTeamMemberInvoice: controls?.adminCanViewTeamMemberInvoice,
        adminCanViewClientInvoice: controls?.adminCanViewClientInvoice,
        adminCanViewPaymentPartnerInvoice:
            controls?.adminCanViewPaymentPartnerInvoice,
        adminCanViewPayrolls: controls?.adminCanViewPayrolls,
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
                router.replace(router.asPath);
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

            <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                <Flex justify="space-between" w="90%">
                    <TitleText
                        title="Allow Future timesheet submission"
                        text="Give Users access to submit timesheet at a date later in the future."
                    />
                    <ToggleSwitch
                        label="timesheet"
                        onChange={() =>
                            setAccess({
                                ...access,
                                allowUsersTofillFutureTimesheet:
                                    !access.allowUsersTofillFutureTimesheet,
                            })
                        }
                        checked={access.allowUsersTofillFutureTimesheet}
                    />
                </Flex>
            </Box>
            <Box py="1.5rem">
                <Text
                    fontSize=".875rem"
                    color="#2d3748"
                    mb="0"
                    fontWeight="bold"
                >
                    Expenses and Timesheet settings
                </Text>
                <Grid templateColumns={['1fr', 'repeat(2, 1fr)']}>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="Approve Expenses"
                                text="Give Admin access to approve expenses on the application"
                            />
                            <ToggleSwitch
                                label="expenses"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanApproveExpense:
                                            !access.adminCanApproveExpense,
                                    })
                                }
                                checked={access.adminCanApproveExpense}
                            />
                        </Flex>
                    </Box>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="Approve Timesheet"
                                text="Give Admin access to approve Timesheet on the application"
                            />
                            <ToggleSwitch
                                label="timesheets"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanApproveTimesheet:
                                            !access.adminCanApproveTimesheet,
                                    })
                                }
                                checked={access.adminCanApproveTimesheet}
                            />
                        </Flex>
                    </Box>
                </Grid>
            </Box>
            <Box>
                <Text
                    fontSize=".875rem"
                    color="#2d3748"
                    mb="0"
                    fontWeight="bold"
                >
                    View and Approve Payroll settings
                </Text>
                <Grid templateColumns={['1fr', 'repeat(2, 1fr)']}>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="View Payrolls"
                                text="Give Admin access to view payrolls on the application"
                            />
                            <ToggleSwitch
                                label="payrolls"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanViewPayrolls:
                                            !access.adminCanViewPayrolls,
                                    })
                                }
                                checked={access.adminCanViewPayrolls}
                            />
                        </Flex>
                    </Box>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="Approve Payrolls"
                                text="Give Admin access to approve Payrolls on the application"
                            />
                            <ToggleSwitch
                                label="approve-payrolls"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanApprovePayrolls:
                                            !access.adminCanApprovePayrolls,
                                    })
                                }
                                checked={access.adminCanApprovePayrolls}
                            />
                        </Flex>
                    </Box>
                </Grid>
            </Box>
            <Box py="1.5rem">
                <Text
                    fontSize=".875rem"
                    color="#2d3748"
                    mb="0"
                    fontWeight="bold"
                >
                    Invoice Settings
                </Text>
                <Grid templateColumns={['1fr', 'repeat(3, 1fr)']}>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="View Team Members Invoice"
                                text="Give Admin access to view team member Invoices on the application"
                            />
                            <ToggleSwitch
                                label="team-invoice"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanViewTeamMemberInvoice:
                                            !access.adminCanViewTeamMemberInvoice,
                                    })
                                }
                                checked={access.adminCanViewTeamMemberInvoice}
                            />
                        </Flex>
                    </Box>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="View Payment Partner Invoice"
                                text="Give Admin access to view payment partner Invoices on the application"
                            />
                            <ToggleSwitch
                                label="payment-invoice"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanViewPaymentPartnerInvoice:
                                            !access.adminCanViewPaymentPartnerInvoice,
                                    })
                                }
                                checked={
                                    access.adminCanViewPaymentPartnerInvoice
                                }
                            />
                        </Flex>
                    </Box>
                    <Box w="full" py="1.5rem" borderBottom="1px solid #C2CFE0">
                        <Flex justify="space-between" w="90%">
                            <TitleText
                                title="View Clients Invoice"
                                text="Give Admin access to view clients Invoices on the application"
                            />
                            <ToggleSwitch
                                label="client-invoice"
                                onChange={() =>
                                    setAccess({
                                        ...access,
                                        adminCanViewClientInvoice:
                                            !access.adminCanViewClientInvoice,
                                    })
                                }
                                checked={access.adminCanViewClientInvoice}
                            />
                        </Flex>
                    </Box>
                </Grid>
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
