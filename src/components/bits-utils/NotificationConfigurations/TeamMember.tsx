import { Box, Flex, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    TeamMemberSettingModel,
    TeamMemberSettingView,
    UserSettingService,
} from 'src/services';
import { useRouter } from 'next/router';
import { NotText } from '../NotText';
import { ShiftBtn } from '../ShiftBtn';
import { TitleLabel, TitleDesc } from '../TitleText';
import ToggleSwitch from '../ToggleSwitch';

export const TeamNotificationConfiguration = ({
    controls,
}: {
    controls: TeamMemberSettingView;
}) => {
    const [access, setAccess] = useState<TeamMemberSettingModel>({
        awaitingInvoiceNotification: controls?.awaitingInvoiceNotification,
        expenseNotification: controls?.expenseNotification,
        operationalTaskAssignmentNotification:
            controls?.operationalTaskAssignmentNotification,
        timeSheetApprovalNotification: controls?.timeSheetApprovalNotification,
        timesheetRejectionNotification:
            controls?.timesheetRejectionNotification,
        timesheetSubmissionNotification:
            controls?.timesheetSubmissionNotification,
        leaveRequestNotification: controls?.leaveRequestNotification,
        leaveApprovalAndRejectionNotification:
            controls?.leaveApprovalAndRejectionNotification,
        trainingAssignmentNotification:
            controls?.trainingAssignmentNotification,
        userId: controls?.userId,
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const updateControl = async (data: TeamMemberSettingModel) => {
        setLoading(true);
        try {
            const result = await UserSettingService.updateTeamMemberSettings(
                data,
            );
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
                            active={access.timesheetSubmissionNotification}
                        />
                        <ToggleSwitch
                            label="tsn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    timesheetSubmissionNotification:
                                        !access.timesheetSubmissionNotification,
                                })
                            }
                            checked={access.timesheetSubmissionNotification}
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Timesheet Approval"
                            active={access.timeSheetApprovalNotification}
                        />
                        <ToggleSwitch
                            label="tan"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    timeSheetApprovalNotification:
                                        !access.timeSheetApprovalNotification,
                                })
                            }
                            checked={access.timeSheetApprovalNotification}
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Timesheet Rejection"
                            active={access.timesheetRejectionNotification}
                        />
                        <ToggleSwitch
                            label="trn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    timesheetRejectionNotification:
                                        !access.timesheetRejectionNotification,
                                })
                            }
                            checked={access.timesheetRejectionNotification}
                        />
                    </Flex>
                </VStack>
            </Box>
            <Box w="full" p="1rem 0 2rem" borderBottom="1px solid #C2CFE0">
                <TitleLabel label="Financials" />
                <VStack gap="13px" align="flex-start">
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
                <TitleLabel label="Leave" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
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
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Leave Approval & Rejection"
                            active={
                                access.leaveApprovalAndRejectionNotification
                            }
                        />
                        <ToggleSwitch
                            label="lva"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    leaveApprovalAndRejectionNotification:
                                        !access.leaveApprovalAndRejectionNotification,
                                })
                            }
                            checked={
                                access.leaveApprovalAndRejectionNotification
                            }
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
                            active={
                                access.operationalTaskAssignmentNotification
                            }
                        />
                        <ToggleSwitch
                            label="otn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    operationalTaskAssignmentNotification:
                                        !access.operationalTaskAssignmentNotification,
                                })
                            }
                            checked={
                                access.operationalTaskAssignmentNotification
                            }
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
                            active={access.trainingAssignmentNotification}
                        />
                        <ToggleSwitch
                            label="tsn"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    trainingAssignmentNotification:
                                        !access.trainingAssignmentNotification,
                                })
                            }
                            checked={access.trainingAssignmentNotification}
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
