import {
    Box,
    Button,
    DrawerFooter,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import BeatLoader from 'react-spinners/BeatLoader';
import {
    ProjectTaskView,
    ProjectSubTaskModel,
    ProjectManagementService,
    ProjectSubTaskView,
} from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import moment from 'moment';
import { useRouter } from 'next/router';
import getBusinessDateCount from '@components/bits-utils/GetBusinessDays';
import { log } from 'console';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    duration: yup.number().required(),
    // trackedByHours: yup.boolean().required(),
    // projectTaskAssigneeId: yup.string().required(),
    // note: yup.string().required(),
    // taskPriority: yup.number().required(),
    // durationInHours: yup
    //     .number()
    //     .when('trackedByHours', { is: true, then: yup.string().required() }),
});

export const EditSubTaskDrawer = ({
    onClose,
    isOpen,
    data,
    subTask,
}: {
    onClose: any;
    isOpen: boolean;
    data: ProjectTaskView;
    subTask: ProjectSubTaskView | any;
}) => {
    const formattedPriority =
        subTask.taskPriority == 'High'
            ? 1
            : data.taskPriority == 'Medium'
            ? 2
            : 3;
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectSubTaskModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            projectTaskId: data?.id,
            name: subTask.name,
            duration: subTask.duration,
            startDate: subTask.startDate,
            endDate: subTask.endDate,
            id: subTask.id,
            note: subTask.note,
            projectTaskAsigneeId: subTask.projectTaskAsigneeId,
            taskPriority: formattedPriority as any,
            // trackedByHours: false,
        },
    });

    console.log({ subTask });
    

    const toast = useToast();
    const router = useRouter();

    const isHours =
        (watch('trackedByHours') as unknown as string) == 'Track by hours'
            ? true
            : false;
    const [selectedUser, setSelecedUser] = useState<any>(
        {
            id: subTask?.projectTaskAsigneeId,
            'user.fullName': subTask?.projectTaskAsignee?.user?.fullName,
        } || '',
    );
    const addUser = (user) => {
        setSelecedUser(user);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };
    const priority = [
        { id: 1, name: 'High' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' },
    ];
    const [selectedPriority, setSelectedPriority] = useState<any>(
        { id: formattedPriority, name: subTask?.taskPriority } || '',
    );
    const selectPriority = (user) => {
        setSelectedPriority(user);
    };
    const onSubmit = async (data: ProjectSubTaskModel) => {
        //
        data.trackedByHours = isHours;
        try {
            const result = await ProjectManagementService.updateSubTask(data)
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                reset();
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        setValue('projectTaskAsigneeId', selectedUser?.id);
    }, [selectedUser]);
    // const dateDiff = moment(watch('endDate')).diff(watch('startDate'), 'day');
    const businessDays = getBusinessDateCount(
        new Date(watch('startDate') as any),
        new Date(watch('endDate') as any),
    );
    useEffect(() => {
        setValue('duration', businessDays || 0);
    }, [watch('startDate'), watch('endDate')]);
    useEffect(() => {
        setValue('taskPriority', selectedPriority?.id);
    }, [selectedPriority]);

    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={
                // isEdit ? 'Edit Sub-Task':
                'Edit Sub-Task'
            }
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1.5rem">
                    <PrimaryInput<ProjectSubTaskModel>
                        label="Sub-Task Name"
                        name="name"
                        error={errors.name}
                        placeholder=""
                        defaultValue=""
                        register={register}
                        readonly={true}
                    />
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Assign this Sub-task to
                        </FormLabel>

                        <CustomSelectBox
                            data={data?.assignees}
                            updateFunction={addUser}
                            items={selectedUser}
                            customKeys={{ key: 'id', label: 'user.fullName' }}
                            checkbox={false}
                            id="users"
                            error={errors?.projectTaskAsigneeId}
                            removeFn={removeUser}
                            single
                        />
                        {/* <Box
                            mt="1rem"
                            borderY="1px solid #e5e5e5"
                            w="full"
                            py="1rem"
                        >
                            {selectedUser?.length > 0 && (
                                <HStack mb=".5rem">
                                    {selectedUser?.map((x: any, i: any) => (
                                        <HStack
                                            borderRadius="25px"
                                            border="1px solid #e5e5e5"
                                            fontSize=".6rem"
                                            color="#707683"
                                            key={i}
                                            p=".1rem .4rem"
                                        >
                                            <Text
                                                fontSize=".6rem"
                                                color="#707683"
                                                mb="0"
                                            >
                                                {x?.fullName}
                                            </Text>
                                            <Icon
                                                as={MdCancel}
                                                onClick={() =>
                                                    removeUser(x?.id)
                                                }
                                            />
                                        </HStack>
                                    ))}
                                </HStack>
                            )}
                            <Text fontSize=".6rem" color="#707683" mb="0">
                                These team members were added to this project
                            </Text>
                        </Box> */}
                    </Box>
                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                        gap="1rem 1rem"
                        w="full"
                    >
                        <PrimaryDate<ProjectSubTaskModel>
                            control={control}
                            name="startDate"
                            label="Start Date"
                            error={errors.startDate}
                            // min={data?.startDate}
                            // max={data?.endDate}
                            defaultValue={new Date(subTask?.startDate)}
                            // placeholder={moment(subTask?.startDate).format(
                            //     'DD/MM/YYYY',
                            // )}
                        />
                        <PrimaryDate<ProjectSubTaskModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            // min={data?.startDate}
                            // max={data?.endDate}
                            defaultValue={new Date(subTask?.endDate)}
                            // placeholder={moment(subTask?.endDate).format(
                            //     'DD/MM/YYYY',
                            // )}
                        />

                        <PrimaryInput<ProjectSubTaskModel>
                            label="Duration"
                            name="duration"
                            error={errors.duration}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            readonly={true}
                        />
                    </Grid>
                    <PrimaryRadio
                        control={control}
                        error={errors.trackedByHours}
                        radios={['Track by days', 'Track by hours']}
                        name="trackedByHours"
                        flexDir="column"
                        // defaultValue={
                        //     subTask.trackedByHours == true
                        //         ? 'Track by hours'
                        //         : 'Track by days'
                        // }
                    />
                    {isHours && (
                        <PrimaryInput<ProjectSubTaskModel>
                            label="Duration"
                            name="durationInHours"
                            error={errors.durationInHours}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            // readonly={readonly}
                        />
                    )}

                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Sub-Task priority
                        </FormLabel>
                        <CustomSelectBox
                            data={priority}
                            updateFunction={selectPriority}
                            items={selectedPriority}
                            customKeys={{ key: 'id', label: 'name' }}
                            id="priority"
                            error={errors?.taskPriority}
                            single
                        />
                    </Box>

                    <PrimaryTextarea<ProjectSubTaskModel>
                        label="Notes"
                        color="#707683"
                        name="note"
                        error={errors.note}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />

                    <DrawerFooter my="2rem" p="0" w="full">
                        <Flex justify="space-between" w="full">
                            <Button
                                bgColor="#FF5B79"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Cancel
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Save
                            </Button>
                        </Flex>
                    </DrawerFooter>
                </VStack>
            </form>
        </DrawerWrapper>
    );
};
