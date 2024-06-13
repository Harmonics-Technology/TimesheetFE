import {
    Alert,
    AlertDescription,
    AlertIcon,
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
    useDisclosure,
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
import { DateObject } from 'react-multi-date-picker';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import {
    ProjectManagementService,
    ProjectTaskModel,
    ProjectView,
} from 'src/services';
import { useRouter } from 'next/router';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import moment from 'moment';
import { ShowPrompt } from './ShowPrompt';
import getBusinessDateCount from '@components/bits-utils/GetBusinessDays';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    duration: yup.number().required(),
    // trackedByHours: yup.boolean().required(),
    assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    note: yup.string().required(),
    taskPriority: yup.number().required(),
    // durationInHours: yup
    //     .number()
    //     .when('trackedByHours', { is: true, then: yup.string().required() }),
});

export const AddNewTaskDrawer = ({
    onClose,
    isOpen,
    data,
    isEdit,
    project,
    setData,
}: {
    onClose: any;
    isOpen: boolean;
    data: any;
    isEdit?: boolean;
    project?: any;
    setData?: any;
}) => {
    const formattedPriority =
        data?.taskPriority == 'High'
            ? 1
            : data?.taskPriority == 'Medium'
            ? 2
            : 3;
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        trigger,
        reset,
        formState: { errors, isSubmitting, isValid },
    } = useForm<ProjectTaskModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId: project?.superAdminId,
            projectId: project?.id,
            name: isEdit ? data?.name : '',
            startDate: isEdit ? data?.startDate : '',
            endDate: isEdit ? data?.endDate : '',
            duration: isEdit ? data?.duration : '',
            note: isEdit ? data?.note : '',
            taskPriority: isEdit ? (formattedPriority as any) : '',
            durationInHours: data?.durationInHours,
            id: isEdit ? data?.id : '',

            // trackedByHours: false,
        },
    });

    const toast = useToast();
    const router = useRouter();
    const assignees = project?.assignees?.filter(
        (x) => x.projectTaskId == null,
    );
    //

    const [selectedUser, setSelecedUser] = useState<any>(
        data?.assignees?.map((obj) => ({
            userId: obj?.userId,
            'user.fullName': obj?.user?.fullName,
        })) || [],
    );
    //
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.userId === user.userId);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    //
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.userId !== id);
        setSelecedUser(filtered);
    };
    const priority = [
        { id: 1, name: 'High' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' },
    ];
    const [selectedPriority, setSelectedPriority] = useState<any>(
        { id: formattedPriority, name: data?.taskPriority } || '',
    );
    const selectPriority = (user) => {
        setSelectedPriority(user);
    };
    const isHours =
        (watch('trackedByHours') as unknown as string) == 'Track by hours'
            ? true
            : false;

    const {
        isOpen: isOpened,
        onClose: onClosed,
        onOpen: onOpened,
    } = useDisclosure();

    const projectEndDate = moment(project?.endDate).format('YYYY-MM-DD');
    const taskEndDate = watch('endDate');

    const extendDate =
        moment(taskEndDate).diff(projectEndDate, 'days', true) > 0;
    // console.log({ extendDate, projectEndDate, project, taskEndDate });

    const closeModal = () => {
        onClose();
        setData({ isEdit: false, raw: {} });
    };

    const onSubmit = async (data: ProjectTaskModel) => {
        //
        data.trackedByHours = isHours;

        try {
            const result = isEdit
                ? await ProjectManagementService.updateTask(data)
                : await ProjectManagementService.createTask(data);

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
    const submitForm = () => {
        if (!isValid) {
            trigger();
            return;
        }
        if (extendDate) {
            onOpened();
            return;
        }
        handleSubmit(onSubmit)();
    };

    useEffect(() => {
        setValue(
            'assignedUsers',
            selectedUser.map((x) => x.userId),
        );
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
            onClose={closeModal}
            isOpen={isOpen}
            title={isEdit ? 'Edit Task' : 'Add New Task'}
        >
            {/* <form> */}
            <VStack align="flex-start" spacing="1.5rem">
                <PrimaryInput<ProjectTaskModel>
                    label="Task Name"
                    name="name"
                    error={errors.name}
                    placeholder=""
                    defaultValue=""
                    register={register}
                />
                <Box w="full">
                    <FormLabel
                        textTransform="capitalize"
                        width="fit-content"
                        fontSize=".8rem"
                    >
                        Assign this Task to
                    </FormLabel>

                    <CustomSelectBox
                        data={assignees}
                        updateFunction={addUser}
                        items={selectedUser}
                        customKeys={{
                            key: 'userId',
                            label: 'user.fullName',
                        }}
                        checkbox={true}
                        id="users"
                        error={errors?.assignedUsers}
                        removeFn={removeUser}
                    />
                    <Box
                        mt="1rem"
                        borderY="1px solid #e5e5e5"
                        w="full"
                        py="1rem"
                    >
                        {selectedUser?.length > 0 && (
                            <HStack mb=".5rem" flexWrap="wrap" w="full">
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
                                            {x['user.fullName']}
                                        </Text>
                                        {/* <Icon
                                                as={MdCancel}
                                                onClick={() =>
                                                    removeUser(x?.id)
                                                }
                                            /> */}
                                    </HStack>
                                ))}
                            </HStack>
                        )}
                        <Text fontSize=".6rem" color="#707683" mb="0">
                            These team members were added to this project
                        </Text>
                    </Box>
                </Box>
                <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    gap="1rem 1rem"
                    w="full"
                >
                    <PrimaryDate<ProjectTaskModel>
                        control={control}
                        name="startDate"
                        label="Start Date"
                        error={errors.startDate}
                        min={project?.startDate}
                        // max={project?.endDate}
                        placeholder={moment(data?.startDate).format(
                            'DD/MM/YYYY',
                        )}
                    />
                    <PrimaryDate<ProjectTaskModel>
                        control={control}
                        name="endDate"
                        label="End Date"
                        error={errors.endDate}
                        min={project?.startDate}
                        // max={project?.endDate}
                        placeholder={moment(data?.endDate).format('DD/MM/YYYY')}
                    />

                    <PrimaryInput<ProjectTaskModel>
                        label="Duration"
                        name="duration"
                        error={errors.duration}
                        placeholder=""
                        defaultValue=""
                        register={register}
                        readonly={true}
                    />
                </Grid>
                {extendDate && (
                    <Alert status="error" fontSize=".8rem">
                        <AlertIcon />
                        <AlertDescription>
                            The end date you entered will extend the end date of
                            the project.
                        </AlertDescription>
                    </Alert>
                )}
                <PrimaryRadio
                    control={control}
                    error={errors.trackedByHours}
                    radios={['Track by days', 'Track by hours']}
                    name="trackedByHours"
                    flexDir="column"
                    defaultValue={
                        data?.trackedByHours == true
                            ? 'Track by hours'
                            : 'Track by days'
                    }
                />
                {isHours && (
                    <PrimaryInput<ProjectTaskModel>
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
                        Task priority
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

                <PrimaryTextarea<ProjectTaskModel>
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
                            onClick={() => {
                                closeModal();
                            }}
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
                            onClick={submitForm}
                        >
                            Save
                        </Button>
                    </Flex>
                </DrawerFooter>
            </VStack>
            {/* </form> */}
            {isOpened && (
                <ShowPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={handleSubmit(onSubmit)}
                    loading={isSubmitting}
                    text={`The end date you entered exceeds the end date of the
                    project and will extend the end date of the project
                    <br />
                    Do you want to continue?`}
                />
            )}
        </DrawerWrapper>
    );
};
