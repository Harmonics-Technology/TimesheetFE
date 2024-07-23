import { Box, Tr, VStack, useToast } from '@chakra-ui/react';
import { NotText } from '@components/bits-utils/NotText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { UserService, UserView } from 'src/services';
import Tables from '@components/bits-utils/Tables';
import { TableData, TablePmActions } from '@components/bits-utils/TableData';
import moment from 'moment';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { PrimarySelect } from '@components/bits-utils/PrimarySelect';
import Pagination from '@components/bits-utils/Pagination';
import { removeItemsFromArray } from '@components/generics/functions/removeItemsFromArray';

const schema = yup.object().shape({
    id: yup.string().required(),
});

interface setAsPM {
    id: string | null | undefined;
}
export const ProjectManagementSettings = ({
    data,
    pm,
}: {
    data: any;
    pm: any;
}) => {
    const options = data?.value;
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<setAsPM>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<any>({ id: '' });
   
    const newOptions = removeItemsFromArray(options, pm?.data.value);

    const onSubmit = async (data: setAsPM) => {
        setLoading({ id: data.id });
        try {
            const result = await UserService.toggleOrganizationProjectManager(
                data.id as string,
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
    return (
        <Box
            py="1.5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            <LeaveTab
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
            />
            <Box mt="1rem" w="70%">
                <NotText
                    title="Organization Project Manager"
                    sub="Add organization project manager(s) with admin access to the project management module. They can create projects and assign team members to the projects."
                />
            </Box>
            <form>
                <VStack align="flex-start" gap="2rem" w="30%">
                    {/* <SelectrixBox<setAsPM>
                        control={control}
                        name="id"
                        label="Project Manager"
                        error={errors.id}
                        options={newOptions}
                        keys="id"
                        keyLabel="fullName"
                        placeholder="Select Team members"
                    /> */}
                    <PrimarySelect<setAsPM>
                        register={register}
                        error={errors.id}
                        name="id"
                        label="Project Manager"
                        placeholder="Select Team member"
                        options={
                            <>
                                {newOptions.map((x) => (
                                    <option value={x.id}>{x.fullName}</option>
                                ))}
                            </>
                        }
                    />
                    <Box my="1rem">
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
                        'Organization Project Manager',
                        'Date Created',
                        'Actions',
                    ]}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {pm?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.fullName} />
                                <TableData
                                    name={moment(
                                        x.employeeInformation?.dateCreated,
                                    ).format('DD/MM/YYYY')}
                                />
                                <TablePmActions
                                    func={onSubmit}
                                    loading={loading}
                                    id={x.id}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={pm} />
            </Box>
        </Box>
    );
};
