import { Box, Tr, VStack, useToast } from '@chakra-ui/react';
import { NotText } from '@components/bits-utils/NotText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import React, { useState } from 'react';
import { DepartmentService, DepartmentView } from 'src/services';
import Tables from '@components/bits-utils/Tables';
import { TableData, TablePmActions } from '@components/bits-utils/TableData';
import moment from 'moment';
// import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';

const schema = yup.object().shape({
    name: yup.string().required(),
});

interface DepartmentModel {
    name: string | null | undefined;
}
export const DepartmentPage = ({
    data,
    superAdminId,
}: {
    data: any;
    superAdminId: any;
}) => {
    const {
        handleSubmit,
        register,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<DepartmentModel>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            name: '',
        },
    });
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState<any>({ id: '' });

    const onSubmit = async (data: DepartmentModel) => {
        try {
            const result = await DepartmentService.createDepartment(
                superAdminId,
                data.name as string,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
                reset({ name: '' });
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
    const deleteDepartment = async (data: any) => {
        try {
            const result = await DepartmentService.deleteDepartment(data.id);
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
            <Box mt="0rem" w="70%">
                <NotText title="Please Setup your department for your organization" />
            </Box>
            <form>
                <VStack align="flex-start" gap="2rem" w="30%">
                    <PrimaryInput<DepartmentModel>
                        register={register}
                        error={errors.name}
                        name="name"
                        label="Department"
                        placeholder="Enter Department"
                    />
                    <Box my=".5rem">
                        <ShiftBtn
                            text="Save"
                            bg="brand.400"
                            onClick={handleSubmit(onSubmit)}
                            loading={isSubmitting}
                        />
                    </Box>
                </VStack>
            </form>

            <Box borderTop="1px solid #c2cfe0" pt="30px" mt="1rem">
                <Tables
                    tableHead={['Department Name', 'Date Created', 'Actions']}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {data?.map((x: DepartmentView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData
                                    name={moment(x.dateCreated).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TablePmActions
                                    func={deleteDepartment}
                                    loading={loading}
                                    id={x.id}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
