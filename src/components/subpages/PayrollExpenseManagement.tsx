/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
    Td,
    Icon,
    Spinner,
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import { PrimaryDate } from '@components/bits-utils/PrimaryDate';
import {
    ExpenseActions,
    TableActionComponent,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useContext, useMemo, useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import {
    ControlSettingView,
    ExpenseModel,
    ExpenseTypeView,
    ExpenseView,
    ExpenseViewPagedCollectionStandardResponse,
    FinancialService,
    UserView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import { SelectrixBox } from '@components/bits-utils/Selectrix';
import { PrimaryTextarea } from '@components/bits-utils/PrimaryTextArea';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Checkbox from '@components/bits-utils/Checkbox';
import BeatLoader from 'react-spinners/BeatLoader';
import moment from 'moment';
import { formatDate } from '@components/generics/functions/formatDate';
import { CUR } from '@components/generics/functions/Naira';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { UserContext } from '@components/context/UserContext';
import asyncForEach from '@components/generics/functions/AsyncForEach';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';

const schema = yup.object().shape({
    description: yup.string().required(),
    teamMemberId: yup.string().required(),
    expenseTypeId: yup.string().required(),
    currency: yup.string().required(),
    amount: yup.number().required(),
});
interface expenseProps {
    expenses: ExpenseViewPagedCollectionStandardResponse;
    team: UserView[];
    expenseType: ExpenseTypeView[];
    isSuperAdmin?: boolean;
}

function PayrollExpenseManagement({
    expenses,
    team,
    expenseType,
    isSuperAdmin,
}: expenseProps) {
    const expensesList = expenses?.data?.value;
    const [loading, setLoading] = useState('');
    const { accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;

    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (selectedId?.length === expensesList?.length) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            expensesList?.forEach((x) =>
                response.push(x.id as string),
            ) as unknown as string[];

            setSelectedId([...response]);
            return;
        }
        const existingValue = selectedId.find((e) => e === id);
        if (existingValue) {
            const newArray = selectedId.filter((x) => x !== id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, id]);
    };

    const treatSingleExpense = async (
        item: string,
        type: 'approve' | 'reject',
        single?: boolean,
    ) => {
        try {
            setLoading(item);
            const result =
                type == 'approve'
                    ? await FinancialService.approveExpense(item)
                    : await FinancialService.rejectExpense(item);
            if (result.status) {
                toast({
                    title: `${result.message}`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                single && router.replace(router.asPath);
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
        } finally {
            setLoading('');
        }
    };
    const treatExpenseItems = async (type: 'approve' | 'reject') => {
        try {
            await asyncForEach(selectedId, async (select: string) => {
                setLoading(type);
                await treatSingleExpense(select, type);
            });
            setSelectedId([]);

            router.replace(router.asPath);
            return;
        } catch (error: any) {
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoading('');
        }
    };

    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ExpenseModel>({
        resolver: yupResolver(schema),
        mode: 'all',
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    const onSubmit = async (data: ExpenseModel) => {
        try {
            const result = await FinancialService.addExpense(data);
            if (result.status) {
                toast({
                    title: `Successfully created`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
                reset();
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err) {
            toast({
                title: 'An error occurred',
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Name',
        'Description',
        'Expense Type',
        'Expense Date',
        'Created On',
        'Amount',
        'Status',
        'Action',
    ];

    const ActionItems = ({ id }: { id: string }) => {
        const actionItems = useMemo(() => {
            return [
                {
                    label: 'Approve',
                    action: () => id && treatSingleExpense(id, 'approve', true),
                },
                {
                    label: 'Reject',
                    action: () => id && treatSingleExpense(id, 'reject', true),
                },
            ];
        }, [id]);

        return <TableActionComponent items={actionItems} />;
    };

    const selectedUser = watch('teamMemberId');

    const departmentOptions =
        team
            ?.find((x) => x?.id === selectedUser)
            ?.userDepartments?.map((dept) => ({
                id: dept.id,
                label: dept.department?.name || 'Unknown',
            })) || [];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="0 0 15px 15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Awaiting Approval',
                            url: `/financials/expenses`,
                        },
                        {
                            text: 'Approved',
                            url: `/financials/expenses-approved`,
                        },
                        {
                            text: 'Rejected',
                            url: `/financials/expenses-rejected`,
                        },
                    ]}
                />
                <Flex
                    justify="space-between"
                    my="1rem"
                    align="center"
                    flexWrap="wrap"
                    gap=".5rem"
                >
                    <HStack gap="1rem">
                        <ShiftBtn
                            text="Add Expense"
                            onClick={onOpen}
                            px="1rem"
                        />
                        {selectedId.length > 0 && (
                            <ShiftBtn
                                text="Approve Expenses"
                                onClick={() => treatExpenseItems('approve')}
                                loading={loading == 'approve'}
                                px="1rem"
                            />
                        )}
                        {selectedId.length > 0 && (
                            <ShiftBtn
                                text="Reject Expenses"
                                onClick={() => treatExpenseItems('reject')}
                                loading={loading == 'reject'}
                                px="1rem"
                                bg="red.600"
                            />
                        )}
                    </HStack>
                    <HStack ml="auto">
                        <Checkbox
                            checked={
                                expensesList?.length !== 0 &&
                                expensesList?.length == selectedId?.length
                            }
                            onChange={() => toggleSelected('', true)}
                            label="Select All"
                        />
                        <ShiftBtn
                            text="Export"
                            onClick={onOpens}
                            px="1rem"
                            suffix={<Icon as={BsDownload} ml=".5rem" />}
                            outline
                            border="1px solid"
                        />
                    </HStack>
                </Flex>
                <FilterSearch data={expenses} />
                <Tables tableHead={thead}>
                    <>
                        {expensesList?.map((x: ExpenseView) => {
                            return (
                                <Tr key={x.id}>
                                    <TableData>
                                        <HStack>
                                            {loading == x?.id ? (
                                                <Spinner size="sm" />
                                            ) : (
                                                <Checkbox
                                                    checked={
                                                        selectedId.find(
                                                            (e) => e === x.id,
                                                        ) || ''
                                                    }
                                                    onChange={(e) =>
                                                        toggleSelected(
                                                            x.id as string,
                                                        )
                                                    }
                                                    disabled={
                                                        !isSuperAdmin &&
                                                        !userAccess?.adminCanApproveExpense
                                                    }
                                                />
                                            )}
                                            <Text>
                                                {x.teamMember?.fullName}
                                            </Text>
                                        </HStack>
                                    </TableData>
                                    <TableData name={x.description} />
                                    <TableData name={x.expenseType} />
                                    <TableData
                                        name={formatDate(x?.expenseDate)}
                                    />
                                    <TableData
                                        name={formatDate(x?.dateCreated)}
                                    />
                                    <TableData
                                        name={`${x.currency}${CUR(
                                            x.amount as unknown as string,
                                        )}`}
                                    />
                                    <TableState name={x.status as string} />

                                    <ActionItems id={x.id as string} />
                                </Tr>
                            );
                        })}
                    </>
                </Tables>
                <Pagination data={expenses} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={'Add New Expense'}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid
                        templateColumns={['1fr', 'repeat(2, 1fr)']}
                        gap="1rem 2rem"
                    >
                        <SelectrixBox<ExpenseModel>
                            control={control}
                            name="teamMemberId"
                            error={errors.teamMemberId}
                            keys="id"
                            keyLabel="fullName"
                            label="Team Member"
                            options={team}
                        />

                        <SelectrixBox<ExpenseModel>
                            control={control}
                            name="teamMemberId"
                            error={errors.teamMemberId}
                            keys="id"
                            keyLabel="label"
                            label="Department"
                            options={departmentOptions}
                        />
                    </Grid>
                    <Box my="1rem" w="full">
                        <PrimaryTextarea<ExpenseModel>
                            label="Description"
                            name="description"
                            error={errors.description}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                    </Box>
                    <Grid
                        templateColumns={['1fr', 'repeat(2, 1fr)']}
                        gap="1rem 2rem"
                    >
                        <SelectrixBox<ExpenseModel>
                            control={control}
                            name="expenseTypeId"
                            error={errors.expenseTypeId}
                            keys="id"
                            keyLabel="name"
                            label="Expense Type"
                            options={expenseType?.filter(
                                (x) => x.status == 'ACTIVE',
                            )}
                        />
                        <PrimaryInput<ExpenseModel>
                            label="Amount"
                            name="amount"
                            type="number"
                            error={errors.amount}
                            placeholder=""
                            defaultValue=""
                            register={register}
                            schema={schema}
                        />
                        <SelectrixBox<ExpenseModel>
                            control={control}
                            name="currency"
                            error={errors.currency}
                            keys="id"
                            keyLabel="label"
                            label="Currency"
                            options={[
                                { id: 'CAD', label: 'CAD' },
                                { id: 'NGN', label: 'NGN' },
                            ]}
                        />
                        <PrimaryDate<ExpenseModel>
                            control={control}
                            name="expenseDate"
                            label="Date of Expense"
                            error={errors.expenseDate}
                        />
                    </Grid>

                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
                            <ShiftBtn
                                text="Close"
                                onClick={onClose}
                                px="1rem"
                                bg="gray.500"
                                w="full"
                                h="2.8rem"
                            />
                            <ShiftBtn
                                text="Add Expense"
                                px="1rem"
                                w="full"
                                type="submit"
                                loading={isSubmitting}
                                h="2.8rem"
                                prefix={<Icon as={RiMailSendFill} mr=".5rem" />}
                            />
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={1}
                fileName={'Pending Expenses'}
                model="expense"
            />
        </>
    );
}

export default PayrollExpenseManagement;
