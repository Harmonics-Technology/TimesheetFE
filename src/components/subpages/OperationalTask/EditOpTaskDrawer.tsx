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
import React, { useEffect, useState, Fragment, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import BeatLoader from 'react-spinners/BeatLoader';
import {
    ProjectManagementService,
    ProjectTaskModel,
    UserService,
} from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import moment from 'moment';
import { useRouter } from 'next/router';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import { MdCancel } from 'react-icons/md';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import Loading from '@components/bits-utils/Loading';
import { UserContext } from '@components/context/UserContext';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    // duration: yup.number().required(),
    // isAssignedToMe: yup.number().required(),
    // assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    // category: yup.string().required(),
    // department: yup.string().required(),
    // taskPriority: yup.number().required(),
});

export const EditOpTaskDrawer = ({
    onClose,
    isOpen,
    superAdminId,
    users,
    data,
    id,
    departments,
}) => {
    // console.log({data})
    const assignedPerson =
        data?.isAssignedToMe && data?.assignees?.at(0)?.id == id;
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ProjectTaskModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            operationalTaskHours: data?.operationalTaskHours,
            superAdminId,
            isOperationalTask: true,
            name: data.name,
            id: data?.id,
            startDate: data?.startDate,
            endDate: data?.endDate,
            note: data?.note,
            operationalTaskStatus: data?.operationalTaskStatus,
            isAssignedToMe: assignedPerson,
        },
    });

    const toast = useToast();
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role;
    // console.log({ data });
    const [selectedUser, setSelecedUser] = useState<any>(
        data?.assignees
            ?.filter((x) => !x?.disabled)
            .map((obj) => ({
                id: obj?.userId,
                fullName: obj?.fullName,
            })) || [],
    );
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };
    const statuses = [
        { id: 1, name: 'To Do' },
        { id: 2, name: 'In Progress' },
        { id: 3, name: 'Completed' },
    ];
    const [taskType, setTaskType] = useState(
        data?.isAssignedToMe && data.createdByUserId == id
            ? 'Private'
            : data.department
            ? 'Departmental'
            : 'Others',
    );

    const changeTaskType = (value: string) => {
        setSelecedUser([]);
        if (role == 'Team Member') {
            setTaskType(value);
            value == 'Departmental' && fetchUsersInDept(user.department);
            return;
        }
        setTaskType(value);
    };
    const isAssignedToMe =
        String(taskType) === 'Private' || data?.isAssignedToMe ? true : false;
    const [department, setDepartment] = useState<any>(data?.department);
    const [isLoading, setIsLoading] = useState(false);
    const [deptUser, setDeptUser] = useState<any>([]);

    const fetchUsersInDept = async (value: any, trigger?: boolean) => {
        // router.push({
        //     query: {
        //         clientId: value,
        //     },
        // });
        // setSelecedUser([]);
        setDepartment(value);
        try {
            setIsLoading(true);
            const data = await UserService.listUsersByDepartment(
                superAdminId,
                0,
                100,
                value,
            );
            if (data.status) {
                setIsLoading(false);
                trigger && setSelecedUser([]);
                setDeptUser(data.data?.value);
            }
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
        }
    };

    const onSubmit = async (value: ProjectTaskModel) => {
        value.isAssignedToMe = isAssignedToMe;
        value.department = department;
        if (taskType !== 'Private') {
            value.isAssignedToMe = false;
        }
        value.assignedUsers = value.isAssignedToMe
            ? [id || superAdminId]
            : value.assignedUsers;
        try {
            const result = await ProjectManagementService.updateTask(value);
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
        setValue(
            'assignedUsers',
            selectedUser.map((x) => x.id),
        );
    }, [selectedUser]);
    const dateDiff = moment(watch('endDate')).diff(watch('startDate'), 'day');
    useEffect(() => {
        setValue('duration', dateDiff + 1 || 0);
    }, [watch('startDate'), watch('endDate')]);

    useEffect(() => {
        fetchUsersInDept(data.department);
    }, []);

    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Edit Operation Task'}
        >
            {isLoading && <Loading loading={isLoading} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1.5rem">
                    <PrimaryInput<ProjectTaskModel>
                        label="Task Name"
                        name="name"
                        error={errors.name}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <SelectBlank
                        label="Task Type"
                        onChange={(e) => changeTaskType(e.target.value)}
                        placeholder="Select one"
                        defaultValue={taskType}
                        options={[
                            { id: true, name: 'Private' },
                            { id: false, name: 'Departmental' },
                            { id: false, name: 'Others' },
                        ].map((x) => (
                            <option value={x?.name}>{x.name}</option>
                        ))}
                    />
                    {taskType == 'Departmental' && (
                        <SelectBlank
                            label="Department"
                            placeholder="Select one"
                            defaultValue={data?.department}
                            onChange={(e) =>
                                fetchUsersInDept(e.target.value, true)
                            }
                            options={departments.map((x) => (
                                <option value={x?.name}>{x.name}</option>
                            ))}
                        />
                    )}
                    {taskType == 'Departmental' && department && (
                        <Box w="full">
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Assign this task to
                            </FormLabel>

                            <CustomSelectBox
                                data={deptUser}
                                updateFunction={addUser}
                                items={selectedUser}
                                customKeys={{ key: 'id', label: 'fullName' }}
                                checkbox={false}
                                id="tasks"
                                error={errors?.assignedUsers}
                                removeFn={removeUser}
                                searchable
                            />
                            <Box
                                mt="1rem"
                                borderY="1px solid #e5e5e5"
                                w="full"
                                py="1rem"
                            >
                                {selectedUser?.length > 0 && (
                                    <HStack mb=".5rem" flexWrap="wrap">
                                        {selectedUser?.map((x: any, i: any) => (
                                            <HStack
                                                borderRadius="25px"
                                                border="1px solid #e5e5e5"
                                                fontSize=".6rem"
                                                color="#707683"
                                                key={i}
                                                p=".1rem .4rem"
                                                flexWrap="wrap"
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
                            </Box>
                        </Box>
                    )}
                    {taskType == 'Others' && (
                        <Box w="full">
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Assign this task to
                            </FormLabel>

                            <CustomSelectBox
                                data={users}
                                updateFunction={addUser}
                                items={selectedUser}
                                customKeys={{ key: 'id', label: 'fullName' }}
                                checkbox={false}
                                id="tasks"
                                error={errors?.assignedUsers}
                                removeFn={removeUser}
                                searchable
                            />
                            <Box
                                mt="1rem"
                                borderY="1px solid #e5e5e5"
                                w="full"
                                py="1rem"
                            >
                                {selectedUser?.length > 0 && (
                                    <HStack mb=".5rem" flexWrap="wrap">
                                        {selectedUser?.map((x: any, i: any) => (
                                            <HStack
                                                borderRadius="25px"
                                                border="1px solid #e5e5e5"
                                                fontSize=".6rem"
                                                color="#707683"
                                                key={i}
                                                p=".1rem .4rem"
                                                flexWrap="wrap"
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
                            </Box>
                        </Box>
                    )}

                    <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 1rem"
                        w="full"
                    >
                        <PrimaryDate<ProjectTaskModel>
                            control={control}
                            name="startDate"
                            label="Start Date"
                            error={errors.startDate}
                            // min={new DateObject()}
                            defaultValue={moment(data?.startDate)?.format(
                                'YYYY-MM-DD',
                            )}
                        />
                        <PrimaryDate<ProjectTaskModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            // min={new DateObject().add(1, 'days')}
                            defaultValue={moment(data?.endDate)?.format(
                                'YYYY-MM-DD',
                            )}
                        />
                    </Grid>

                    <Fragment>
                        {data?.operationalTaskStatus === 'Completed' ? (
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <PrimarySelect<ProjectTaskModel>
                                    label="Status"
                                    error={errors.operationalTaskStatus}
                                    name="operationalTaskStatus"
                                    register={register}
                                    options={statuses.map((x) => (
                                        <option value={x?.name} key={x.id}>
                                            {x?.name}
                                        </option>
                                    ))}
                                />

                                <PrimaryInput<ProjectTaskModel>
                                    label="Hours"
                                    name="operationalTaskHours"
                                    error={errors.operationalTaskHours}
                                    placeholder=""
                                    defaultValue={data?.operationalTaskHours}
                                    register={register}
                                    // disableLabel={
                                    //     data.operationalTaskStatus ===
                                    //     'Completed'
                                    // }
                                />
                            </Grid>
                        ) : (
                            <PrimarySelect<ProjectTaskModel>
                                label="Status"
                                error={errors.operationalTaskStatus}
                                name="operationalTaskStatus"
                                register={register}
                                options={statuses.map((x) => (
                                    <option value={x?.name} key={x.id}>
                                        {x?.name}
                                    </option>
                                ))}
                            />
                        )}
                    </Fragment>

                    {/* <Grid
                        templateColumns={['repeat(1,1fr)', 'repeat(2,1fr)']}
                        gap="1rem 1rem"
                        w="full"
                    >
                        <PrimarySelect<ProjectTaskModel>
                            label="Status"
                            error={errors.operationalTaskStatus}
                            name="operationalTaskStatus"
                            register={register}
                            options={statuses.map((x) => (
                                <option value={x?.name} key={x.id}>
                                    {x?.name}
                                </option>
                            ))}
                        />

                        <PrimaryInput<ProjectTaskModel>
                            label="Hours"
                            name="name"
                            error={errors.name}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            disableLabel={
                                data.operationalTaskStatus === 'Completed'
                            }
                        />
                    </Grid> */}

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
