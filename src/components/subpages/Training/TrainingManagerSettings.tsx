import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import {
    TrainingManagerModel,
    TrainingService,
    UserView,
    UserViewPagedCollection,
} from 'src/services';
import { Box, Tr, useToast, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { NotText } from '@components/bits-utils/NotText';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { PrimaryRadio } from '@components/bits-utils/PrimaryRadio';
import Tables from '@components/bits-utils/Tables';
import {
    TableCustomActions,
    TableData,
} from '@components/bits-utils/TableData';
import moment from 'moment';
import { fetchAllUser } from '@components/generics/functions/FetchAllUsers';
import { removeItemsFromArray } from '@components/generics/functions/removeItemsFromArray';

const schema = yup.object().shape({
    userId: yup.string().required(),
    canManageAllTraining: yup.string().required(),
});

export const TrainingManagerSettings = ({
    data,
    superAdminId,
}: {
    data: UserView[];
    superAdminId: string;
}) => {
    const {
        handleSubmit,
        register,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TrainingManagerModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            superAdminId,
        },
    });
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<any>({ id: '' });
    const [users, setUsers] = useState<UserViewPagedCollection>();
    const [limit, setLimit] = useState(30);
    const [search, setSearch] = useState('');

    const onSubmit = async (data: TrainingManagerModel) => {
        data.canManageAllTraining =
            (data.canManageAllTraining as any) ==
            'Manage trainings they create themselves'
                ? false
                : true;
        try {
            const result = await TrainingService.addTainingManager(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
                reset({ userId: '', canManageAllTraining: '' as any });
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
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
        }
    };
    const updateManagerAccess = async (data: any) => {
        setLoading({ id: data.id });
        try {
            const result = await TrainingService.updateOrRemoveTainingManager(
                data.id,
                data?.canManageAllTraining,
                data?.remove,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
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
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
        }
    };

    const newOptions = removeItemsFromArray(users?.value, data);

    // console.log({ newOptions, user: users?.value, data });

    useEffect(() => {
        if (superAdminId) {
            fetchAllUser({
                role: 'Team Member',
                limit,
                search,
                setLoading,
                superAdminId,
                setUsers,
            });
        }
    }, [limit, search]);

    return (
        <Box
            py="1.5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            {/* <LeaveTab
        tabValue={[
            {
                text: 'Organization Project Manager',
                url: `/account-management/project-managers`,
            },
            {
                text: 'Project Management Settings',
                url: `/account-management/project-management-settings`,
            },
        ]}
    /> */}
            <Box mt="0rem" w="60%">
                <NotText
                    title="Add training manager(s) and specify if they are managing all trainings or only trainings they create themselves"
                    fontWeight="400"
                />
            </Box>
            <form>
                <VStack align="flex-start" gap="2rem" w="30%">
                    <VStack align="flex-start" gap="1.1rem" w="100%">
                        <PrimarySelect<TrainingManagerModel>
                            register={register}
                            error={errors.userId}
                            name="userId"
                            label="Training Manager"
                            placeholder="Select Team member"
                            options={newOptions?.map((x) => (
                                <option value={x?.id}>{x?.fullName}</option>
                            ))}
                        />
                        <PrimaryRadio<TrainingManagerModel>
                            label="Specify Role Of Training Manager"
                            radios={[
                                'Managing all trainings',
                                'Manage trainings they create themselves',
                            ]}
                            name="canManageAllTraining"
                            control={control}
                            gap="1rem"
                            error={errors.canManageAllTraining}
                            flexDir="column"
                            defaultValue={''}
                        />
                    </VStack>
                    <Box my=".5rem">
                        <ShiftBtn
                            text="Confirm"
                            bg="brand.400"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                        />
                    </Box>
                </VStack>
            </form>

            <Box borderTop="1px solid #c2cfe0" pt="30px" mt="1rem">
                <Tables
                    tableHead={[
                        'Training Manager',
                        'Role',
                        // 'Date Created',
                        'Actions',
                    ]}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {data?.map((x) => (
                            <Tr key={x.id}>
                                <TableData name={x?.fullName} full />
                                <TableData
                                    name={
                                        x?.employeeInformation
                                            ?.canManageAllTraining
                                            ? 'Manage all trainings'
                                            : 'Manage trainings they create'
                                    }
                                    full
                                />
                                {/* <TableData
                                    name={moment(x.dateCreated).format(
                                        'DD/MM/YYYY',
                                    )}
                                /> */}
                                <TableCustomActions
                                    loading={loading?.id == x?.id}
                                    data={[
                                        {
                                            name: 'Switch access',
                                            id: 'switch',
                                            onClick: () =>
                                                updateManagerAccess({
                                                    id: x?.id,
                                                    canManageAllTraining:
                                                        !x?.employeeInformation
                                                            ?.canManageAllTraining,
                                                    remove: false,
                                                }),
                                        },
                                        {
                                            name: 'Remove',
                                            id: 'remove',
                                            onClick: () =>
                                                updateManagerAccess({
                                                    id: x?.id,
                                                    canManageAllTraining: null,
                                                    remove: true,
                                                }),
                                        },
                                    ]}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
