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

export const AddOpTaskDrawer = ({
    onClose,
    isOpen,
    superAdminId,
    users,
    id,
    departments,
}) => {
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
            superAdminId,
            isOperationalTask: true,
        },
    });

    const toast = useToast();
    const router = useRouter();
    const [selectedUser, setSelecedUser] = useState<any>([]);
    const addUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelecedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelecedUser(filtered);
    };
    // const priority = [
    //     { id: 1, name: 'High' },
    //     { id: 2, name: 'Medium' },
    //     { id: 3, name: 'Low' },
    // ];
    const [taskType, setTaskType] = useState('');
    const [department, setDepartment] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const isAssignedToMe = String(taskType) === 'Private' ? true : false;
    const [deptUser, setDeptUser] = useState<any>([]);

    const fetchUsersInDept = async (value: any) => {
        // router.push({
        //     query: {
        //         clientId: value,
        //     },
        // });
        setDepartment(value);
        try {
            setIsLoading(true);
            const data = await UserService.listUsers(
                'Team Member',
                superAdminId,
                0,
                100,
                '',
                undefined,
                undefined,
                undefined,
                undefined,
                value,
            );
            if (data.status) {
                setIsLoading(false);
                setDeptUser(data.data?.value);
            }
        } catch (error) {
            setIsLoading(false);
            console.log({ error });
        }
    };

    const onSubmit = async (data: ProjectTaskModel) => {
        data.isAssignedToMe = isAssignedToMe;
        data.department = department;

        data.assignedUsers = isAssignedToMe
            ? [id || superAdminId]
            : data.assignedUsers;
        try {
            const result = await ProjectManagementService.createTask(data);
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
    // useEffect(() => {
    //     setValue('category', selectedCategory?.id);
    // }, [selectedCategory]);

    //
    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Add Operation Task'}
        >
            {isLoading && <Loading loading={isLoading} />}
            <form onSubmit={handleSubmit(onSubmit)}>
                <VStack align="flex-start" spacing="1.5rem" w="full">
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
                        onChange={(e) => setTaskType(e.target.value)}
                        placeholder="Select one"
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
                            onChange={(e) => fetchUsersInDept(e.target.value)}
                            options={departments.map((x) => (
                                <option value={x?.name}>{x.name}</option>
                            ))}
                        />
                    )}
                    {department && (
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
                                data={users?.value}
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
                        />
                        <PrimaryDate<ProjectTaskModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            // min={new DateObject().add(1, 'days')}
                        />
                    </Grid>

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
