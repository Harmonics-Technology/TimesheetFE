import { Box, Flex, useToast, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import {
    PayrollManagerSettingModel,
    PayrollManagerSettingView,
    UserSettingService,
} from 'src/services';
import { useRouter } from 'next/router';
import { NotText } from '../NotText';
import { ShiftBtn } from '../ShiftBtn';
import { TitleLabel, TitleDesc } from '../TitleText';
import ToggleSwitch from '../ToggleSwitch';

export const PayrollNotificationConfiguration = ({
    controls,
}: {
    controls: PayrollManagerSettingView;
}) => {
    const [access, setAccess] = useState<PayrollManagerSettingModel>({
        awaitingPayrollNotification: controls?.awaitingPayrollNotification,
        awaitingTeamMemberInvoiceNotification:
            controls?.awaitingTeamMemberInvoiceNotification,
        awaitingClientInvoiceNotification:
            controls?.awaitingClientInvoiceNotification,
        awaitingPaymentPartnerInvoiceNotification:
            controls?.awaitingPaymentPartnerInvoiceNotification,
        awaitingExpenseNotification: controls?.awaitingExpenseNotification,
        operationTaskAssignment: controls?.operationTaskAssignment,
        trainingAssignment: controls?.trainingAssignment,
        userId: controls?.userId,
    });

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();

    const updateControl = async (data: PayrollManagerSettingModel) => {
        setLoading(true);
        try {
            const result =
                await UserSettingService.updatePayrollManagerSettings(data);
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
                <TitleLabel label="Financials" />
                <VStack gap="13px" align="flex-start">
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Awaiting Payroll"
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
                            title="Awaiting Team Member Invoice"
                            active={
                                access.awaitingTeamMemberInvoiceNotification
                            }
                        />
                        <ToggleSwitch
                            label="ain"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingTeamMemberInvoiceNotification:
                                        !access.awaitingTeamMemberInvoiceNotification,
                                })
                            }
                            checked={
                                access.awaitingTeamMemberInvoiceNotification
                            }
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Awaiting Client Invoice"
                            active={access.awaitingClientInvoiceNotification}
                        />
                        <ToggleSwitch
                            label="aci"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingClientInvoiceNotification:
                                        !access.awaitingClientInvoiceNotification,
                                })
                            }
                            checked={access.awaitingClientInvoiceNotification}
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Awaiting Payment Partner Invoice"
                            active={
                                access.awaitingPaymentPartnerInvoiceNotification
                            }
                        />
                        <ToggleSwitch
                            label="ppi"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingPaymentPartnerInvoiceNotification:
                                        !access.awaitingPaymentPartnerInvoiceNotification,
                                })
                            }
                            checked={
                                access.awaitingPaymentPartnerInvoiceNotification
                            }
                        />
                    </Flex>
                    <Flex justify="space-between" w={['100%', '40%']}>
                        <TitleDesc
                            title="Expense"
                            active={access.awaitingExpenseNotification}
                        />
                        <ToggleSwitch
                            label="en"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    awaitingExpenseNotification:
                                        !access.awaitingExpenseNotification,
                                })
                            }
                            checked={access.awaitingExpenseNotification}
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
                            label="trsn"
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
