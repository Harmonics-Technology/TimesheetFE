import { Box, Flex, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    AdminSettingModel,
    AdminSettingView,
    UserSettingService,
} from 'src/services';
import { useRouter } from 'next/router';
import { LeaveTab } from '../LeaveTab';
import { NotText } from '../NotText';
import { ShiftBtn } from '../ShiftBtn';
import { TitleLabel, TitleDesc } from '../TitleText';
import ToggleSwitch from '../ToggleSwitch';

export const AdminNotificationConfiguration = ({
    controls,
    isAdmin,
}: {
    controls: AdminSettingView;
    isAdmin: boolean;
}) => {
    const [access, setAccess] = useState<AdminSettingModel>({
        timesheetAwaitingApprovalNotification:
            controls?.timesheetAwaitingApprovalNotification,
        awaitingPayrollNotification: controls?.awaitingPayrollNotification,
        awaitingInvoiceNotification: controls?.awaitingInvoiceNotification,
        expenseNotification: controls?.expenseNotification,
        leaveRequestNotification: controls?.leaveRequestNotification,
        leaveAwaitingReviewNotification:
            controls?.leaveAwaitingReviewNotification,
        operationTaskAssignment: controls?.operationTaskAssignment,
        trainingAssignment: controls?.trainingAssignment,
        contractExpiration: controls?.contractExpiration,
        subscriptionRenewalNotification:
            controls?.subscriptionRenewalNotification,
        userId: controls?.userId,
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const updateControl = async (data: AdminSettingModel) => {
        setLoading(true);
        try {
            const result = await UserSettingService.updateAdminSettings(data);
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
        <Box
            py="1.5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            {isAdmin && (
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Notification Settings',
                            url: `/account-management/notification-settings`,
                        },
                        {
                            text: 'Notification Configuration',
                            url: `/account-management/notification-configuration`,
                        },
                    ]}
                />
            )}
            <Box mb="1rem" mt="1rem" w={['100%', '70%']}>
                <NotText
                    title="Notification Control"
                    sub="Stay updated with the latest alerts, updates, and reminders. Choose what works best for you by turning notifications on or off at any time"
                />
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Timesheet" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Timesheet Submission reminder "
                            active={
                                access.timesheetAwaitingApprovalNotification
                            }
                        />
                        <ToggleSwitch
                            label="tsn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    timesheetAwaitingApprovalNotification:
                                        !access.timesheetAwaitingApprovalNotification,
                                })
                            }
                            checked={
                                access.timesheetAwaitingApprovalNotification
                            }
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Financials" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Awaiting Payroll for submission"
                            active={access.awaitingPayrollNotification}
                        />
                        <ToggleSwitch
                            label="aps"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingPayrollNotification:
                                        !access.awaitingPayrollNotification,
                                })
                            }
                            checked={access.awaitingPayrollNotification}
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Awaiting Invoice for submission"
                            active={access.awaitingInvoiceNotification}
                        />
                        <ToggleSwitch
                            label="ain"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingInvoiceNotification:
                                        !access.awaitingInvoiceNotification,
                                })
                            }
                            checked={access.awaitingInvoiceNotification}
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Expense"
                            active={access.expenseNotification}
                        />
                        <ToggleSwitch
                            label="en"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    expenseNotification:
                                        !access.expenseNotification,
                                })
                            }
                            checked={access.expenseNotification}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Leave Request" />
                <VStack gap="13px" align="flex-start">
                    {/* <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Leave Request"
                            active={access.leaveRequestNotification}
                        />
                        <ToggleSwitch
                            label="lvr"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    leaveRequestNotification:
                                        !access.leaveRequestNotification,
                                })
                            }
                            checked={access.leaveRequestNotification}
                        />
                    </Flex> */}
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Leave Awaiting Review"
                            active={access.leaveAwaitingReviewNotification}
                        />
                        <ToggleSwitch
                            label="lva"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    leaveAwaitingReviewNotification:
                                        !access.leaveAwaitingReviewNotification,
                                })
                            }
                            checked={access.leaveAwaitingReviewNotification}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Operational Task" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Operational Task Assignment"
                            active={access.operationTaskAssignment}
                        />
                        <ToggleSwitch
                            label="otn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    operationTaskAssignment:
                                        !access.operationTaskAssignment,
                                })
                            }
                            checked={access.operationTaskAssignment}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Training" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Training Assignment"
                            active={access.trainingAssignment}
                        />
                        <ToggleSwitch
                            label="tsn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    trainingAssignment:
                                        !access.trainingAssignment,
                                })
                            }
                            checked={access.trainingAssignment}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Contract" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Contract Expiration"
                            active={access.contractExpiration}
                        />
                        <ToggleSwitch
                            label="ctr"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    contractExpiration:
                                        !access.contractExpiration,
                                })
                            }
                            checked={access.contractExpiration}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Subscription" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Subscription Renewal Reminder"
                            active={access.subscriptionRenewalNotification}
                        />
                        <ToggleSwitch
                            label="ctr"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    subscriptionRenewalNotification:
                                        !access.subscriptionRenewalNotification,
                                })
                            }
                            checked={access.subscriptionRenewalNotification}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box my="2rem">
                <ShiftBtn
                    text="Confirm"
                    bg="brand.400"
                    onClick={() => updateControl(access)}
                    loading={loading}
                />
            </Box>
        </Box>
    );
};
