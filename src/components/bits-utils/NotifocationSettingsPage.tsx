import {
    Flex,
    VStack,
    Box,
    Text,
    useToast,
    HStack,
    Circle,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { SelectrixBox } from './Selectrix';
import { PrimaryInput } from './PrimaryInput';
import { ShiftBtn } from './ShiftBtn';
import * as yup from 'yup';
import { UserContext } from '@components/context/UserContext';
import { yupResolver } from '@hookform/resolvers/yup';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import {
    ControlSettingModel,
    ControlSettingView,
    UserService,
} from 'src/services';
import { NotText } from './NotText';
import Checkbox from './Checkbox';

const schema = yup.object().shape({
    timesheetFillingReminderDay: yup.string().required(),
    timesheetOverdueReminderDay: yup.string().required(),
});
export const NotifocationSettingsPage = ({
    controls,
}: {
    controls: ControlSettingView;
}) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<ControlSettingModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const toast = useToast();
    const router = useRouter();
    const { user } = useContext(UserContext);

    const options = [
        { id: 1, label: 'Monday' },
        { id: 2, label: 'Tuesday' },
        { id: 3, label: 'Wednesday' },
        { id: 4, label: 'Thursday' },
        { id: 5, label: 'Friday' },
        { id: 6, label: 'Saturday' },
        { id: 0, label: 'Sunday' },
    ];
    const [dueDate] = useState(
        watch('timesheetFillingReminderDay') ||
            controls?.timesheetFillingReminderDay,
    );
    const selectedDueDate = options.find((x) => x.id == dueDate)?.label;
    const [overdueDate] = useState(
        watch('timesheetOverdueReminderDay') ||
            controls.timesheetOverdueReminderDay,
    );

    const [loading, setLoading] = useState({ id: '' });
    const [access, setAccess] = useState<ControlSettingModel>({
        allowBirthdayNotification: controls?.allowBirthdayNotification,
        allowWorkAnniversaryNotification:
            controls?.allowWorkAnniversaryNotification,
        notifyCelebrant: controls?.notifyCelebrant,
        notifyEveryoneAboutCelebrant: controls?.notifyEveryoneAboutCelebrant,
    });

    const updateControl = async (data: ControlSettingModel, id: string) => {
        data.superAdminId = user?.superAdminId;
        setLoading({ id });
        try {
            const result = await UserService.updateControlSettings(data);
            if (result.status) {
                setLoading({ id: '' });
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
            setLoading({ id: '' });
        } catch (error: any) {
            setLoading({ id: '' });
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const onSubmit = async (data: ControlSettingModel) => {
        data.superAdminId = user?.superAdminId;
        try {
            const result = await UserService.updateControlSettings(data);
            if (result.status) {
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
        } catch (error: any) {
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
            <Box mb="3rem">
                <NotText
                    title="Timesheet Reminder Notification"
                    sub="Set notification reminder frequency"
                />
                <Flex my="2rem" gap="2rem">
                    <HStack>
                        <Circle size="1rem" bgColor="brand.400" />
                        <Text
                            color="#696969"
                            fontSize="0.87rem"
                            fontWeight="700"
                            mb="0"
                        >
                            Due and Over due day reminder:
                        </Text>
                    </HStack>
                    <HStack>
                        <Text
                            color="#F85900"
                            fontSize="0.87rem"
                            fontWeight="600"
                            mb="0"
                        >
                            Due day -
                        </Text>
                        <Text
                            color="#696969"
                            fontSize="0.87rem"
                            fontWeight="400"
                            mb="0"
                        >
                            {selectedDueDate}
                        </Text>
                    </HStack>
                    <HStack>
                        <Text
                            color="#FF5B79"
                            fontSize="0.87rem"
                            fontWeight="600"
                            mb="0"
                        >
                            Overdue day -
                        </Text>
                        <Text
                            color="#696969"
                            fontSize="0.87rem"
                            fontWeight="400"
                            mb="0"
                        >
                            {overdueDate} days after due date
                        </Text>
                    </HStack>
                </Flex>
                <form>
                    <VStack align="flex-start" gap="2rem" w="30%">
                        <SelectrixBox<ControlSettingModel>
                            control={control}
                            name="timesheetFillingReminderDay"
                            label="Due Day"
                            error={errors.timesheetFillingReminderDay}
                            options={options}
                            keys="id"
                            keyLabel="label"
                        />
                        <PrimaryInput<ControlSettingModel>
                            label="Overdue Day"
                            name="timesheetOverdueReminderDay"
                            error={errors.timesheetOverdueReminderDay}
                            defaultValue=""
                            register={register}
                        />

                        <Box my="0rem">
                            <ShiftBtn
                                text="Confirm"
                                bg="brand.400"
                                onClick={handleSubmit(onSubmit)}
                                loading={isSubmitting}
                            />
                        </Box>
                    </VStack>
                </form>
            </Box>
            <VStack
                borderTop="1px solid #C2CFE0"
                pt="1rem"
                align="flex-start"
                gap="2.5rem"
            >
                <Box>
                    <NotText
                        title="Social Feature Notification"
                        sub="Enable social feature notification for birthdays and work anniversary shoutouts and celebrations"
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Birthday celebration"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    allowBirthdayNotification:
                                        !access.allowBirthdayNotification,
                                })
                            }
                            checked={access.allowBirthdayNotification}
                        />
                        <Checkbox
                            label="Work Anniversary"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    allowWorkAnniversaryNotification:
                                        !access.allowWorkAnniversaryNotification,
                                })
                            }
                            checked={access.allowWorkAnniversaryNotification}
                        />
                    </HStack>
                </Box>
                <Box>
                    <NotText sub="Please select who will view this notification" />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Celebrant"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    notifyCelebrant: !access.notifyCelebrant,
                                })
                            }
                            checked={access.notifyCelebrant}
                        />
                        <Checkbox
                            label="Everyone in the organization"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    notifyEveryoneAboutCelebrant:
                                        !access.notifyEveryoneAboutCelebrant,
                                })
                            }
                            checked={access.notifyEveryoneAboutCelebrant}
                        />
                    </HStack>
                </Box>
                <ShiftBtn
                    text="Confirm"
                    bg="brand.400"
                    onClick={() => updateControl(access, 'update_notification')}
                    loading={loading.id == 'update_notification'}
                    h="28px"
                    px="1.5rem"
                />
            </VStack>
        </Box>
    );
};
