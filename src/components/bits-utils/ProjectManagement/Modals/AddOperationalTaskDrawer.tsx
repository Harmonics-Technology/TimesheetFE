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
import { ProjectManagementService, ProjectTaskModel } from 'src/services';
import { DateObject } from 'react-multi-date-picker';
import { CustomSelectBox } from '../Generics/CustomSelectBox';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import moment from 'moment';
import { useRouter } from 'next/router';

const schema = yup.object().shape({
    name: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
    duration: yup.number().required(),
    assignedUsers: yup.array().min(1, 'Select atleast one assignee').required(),
    category: yup.string().required(),
    department: yup.string().required(),
    taskPriority: yup.number().required(),
});

export const AddOperationalTaskDrawer = ({
    onClose,
    isOpen,
    superAdminId,
    users,
}) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<ProjectTaskModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId,
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
    const priority = [
        { id: 1, name: 'High' },
        { id: 2, name: 'Medium' },
        { id: 3, name: 'Low' },
    ];
    const [selectedPriority, setSelectedPriority] = useState<any>();
    const selectPriority = (user) => {
        setSelectedPriority(user);
    };
    const [selectedCategory, setSelectedCategory] = useState<any>();
    const selectCategory = (user) => {
        setSelectedCategory(user);
    };
    const [selectedDepartment, setSelectedDepartment] = useState<any>();
    const selectDepartment = (user) => {
        setSelectedDepartment(user);
    };
    const onSubmit = async (data: ProjectTaskModel) => {
        //
        try {
            const result = await ProjectManagementService.createTask(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.reload();
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
        setValue('taskPriority', selectedPriority?.id);
    }, [selectedPriority]);
    useEffect(() => {
        setValue('department', selectedDepartment?.title);
    }, [selectedDepartment]);
    useEffect(() => {
        setValue('category', selectedCategory?.id);
    }, [selectedCategory]);

    //
    return (
        <DrawerWrapper
            onClose={onClose}
            isOpen={isOpen}
            title={'Add Operation Task'}
        >
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
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Category
                        </FormLabel>

                        <CustomSelectBox
                            data={[{ id: 1, name: 'Planning and Schedulling' }]}
                            updateFunction={selectCategory}
                            items={selectedCategory}
                            customKeys={{ key: 'id', label: 'name' }}
                            checkbox={false}
                            id="users"
                            single
                            error={errors?.category}
                        />
                    </Box>
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
                        />
                    </Box>
                    <Box w="full">
                        <FormLabel
                            textTransform="capitalize"
                            width="fit-content"
                            fontSize=".8rem"
                        >
                            Department
                        </FormLabel>

                        <CustomSelectBox
                            data={[
                                { id: 2, title: 'HR' },
                                { id: 3, title: 'Admin' },
                            ]}
                            updateFunction={selectDepartment}
                            items={selectedDepartment}
                            customKeys={{ key: 'id', label: 'title' }}
                            checkbox={false}
                            id="dept"
                            single
                            error={errors?.department}
                        />
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
                            min={new DateObject()}
                        />
                        <PrimaryDate<ProjectTaskModel>
                            control={control}
                            name="endDate"
                            label="Start Date"
                            error={errors.endDate}
                            min={new DateObject().add(1, 'days')}
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

                    {/* <PrimaryTextarea<ProjectTaskModel>
                        label="Notes"
                        color="#707683"
                        name="firstName"
                        error={errors.firstName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    /> */}

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
