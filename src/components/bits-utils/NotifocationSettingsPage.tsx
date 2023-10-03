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
import { ControlSettingModel, UserService } from 'src/services';

const schema = yup.object().shape({
    timesheetFillingReminderDay: yup.string().required(),
    timesheetOverdueReminderDay: yup.string().required(),
});
export const NotifocationSettingsPage = ({ data }: { data: any }) => {
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
            data.timesheetFillingReminderDay,
    );
    const selectedDueDate = options.find((x) => x.id == dueDate)?.label;
    const [overdueDate] = useState(
        watch('timesheetOverdueReminderDay') ||
            data.timesheetFillingReminderDay,
    );

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
                router.reload();
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
            <VStack align="flex-start" mb="1.5rem">
                <Text
                    color="#002861"
                    fontSize="0.93rem"
                    fontWeight="500"
                    mb="0"
                >
                    Timesheet Reminder Notification
                </Text>
                <Text color="#002861" fontSize="0.93rem" mb="0">
                    Set notification reminder frequency
                </Text>
            </VStack>
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
                        {overdueDate} days after
                    </Text>
                </HStack>
            </Flex>
            <form>
                <VStack align="flex-start" gap="2rem" w="30%">
                    <SelectrixBox<ControlSettingModel>
                        control={control}
                        name="timesheetFillingReminderDay"
                        label="Beginning Period or  Start Date"
                        error={errors.timesheetFillingReminderDay}
                        options={options}
                        keys="id"
                        keyLabel="label"
                    />
                    <PrimaryInput<ControlSettingModel>
                        label="Payment period"
                        name="timesheetOverdueReminderDay"
                        error={errors.timesheetOverdueReminderDay}
                        defaultValue=""
                        register={register}
                    />

                    <Box my="2rem">
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
    );
};
