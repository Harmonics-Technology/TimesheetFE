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
} from '@chakra-ui/react';
import DrawerWrapper from '@components/bits-utils/Drawer';
import {
    ExpenseActions,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useState } from 'react';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { RiMailSendFill } from 'react-icons/ri';
import { PrimaryInput } from '@components/bits-utils/PrimaryInput';
import {
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
}

function PayrollExpenseManagement({
    expenses,
    team,
    expenseType,
}: expenseProps) {
    console.log({ expenseType, team, expenses });
    const expensesList = expenses?.data?.value;
    const [loading, setLoading] = useState(false);

    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                expensesList?.filter((x) => x.status == 'APPROVED').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            expensesList
                ?.filter((x) => x.status == 'APPROVED')
                .forEach((x) =>
                    response.push(x.id as string),
                ) as unknown as string[];
            console.log({ response });
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

    const generateInvoice = async () => {
        try {
            setLoading(true);
            const result = await FinancialService.generateInvoiceExpense(
                selectedId,
            );
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.reload();
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const {
        register,
        handleSubmit,
        control,
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
                router.reload();
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
    return (
        <>
            <Box
                bgColor="white"
                borderRadius="0 0 15px 15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between">
                    <HStack gap="1rem">
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            onClick={onOpen}
                        >
                            +Expense
                        </Button>
                        {selectedId.length > 0 && (
                            <Button
                                bgColor="brand.600"
                                color="white"
                                p=".5rem 1.5rem"
                                height="fit-content"
                                onClick={() => generateInvoice()}
                                isLoading={loading}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Generate Invoice
                            </Button>
                        )}
                    </HStack>
                    <Checkbox
                        checked={
                            expensesList?.filter((x) => x.status == 'APPROVED')
                                .length !== 0 &&
                            expensesList?.filter((x) => x.status == 'APPROVED')
                                .length == selectedId?.length
                        }
                        onChange={() => toggleSelected('', true)}
                        label="Select All"
                    />
                </Flex>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Description',
                        'Expense Type',
                        'Currency',
                        'Amount',
                        'Status',
                        'Action',
                        // '...',
                    ]}
                >
                    <>
                        {expensesList?.map((x: ExpenseView) => (
                            <Tr key={x.id}>
                                <TableData name={x.teamMember?.fullName} />
                                <TableData name={x.description} />
                                <TableData name={x.expenseType} />
                                <TableData name={x.currency} />
                                <TableData
                                    name={x.amount as unknown as string}
                                />
                                <TableState name={x.status as string} />
                                <ExpenseActions id={x.id} manager={true} />
                                <td>
                                    {x.status == 'APPROVED' && (
                                        <Checkbox
                                            checked={
                                                selectedId.find(
                                                    (e) => e === x.id,
                                                ) || ''
                                            }
                                            onChange={(e) =>
                                                toggleSelected(x.id as string)
                                            }
                                        />
                                    )}
                                </td>
                            </Tr>
                        ))}
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
                            name="expenseTypeId"
                            error={errors.expenseTypeId}
                            keys="id"
                            keyLabel="name"
                            label="Expense Type"
                            options={expenseType?.filter(
                                (x) => x.status == 'ACTIVE',
                            )}
                        />
                        <PrimaryTextarea<ExpenseModel>
                            label="Description"
                            name="description"
                            error={errors.description}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryInput<ExpenseModel>
                            label="Amount"
                            name="amount"
                            type="number"
                            error={errors.amount}
                            placeholder=""
                            defaultValue=""
                            register={register}
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
                    </Grid>

                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
                            <Button
                                bgColor="gray.500"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                <Box pr=".5rem">
                                    <RiMailSendFill />
                                </Box>
                                <Box>Save</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
        </>
    );
}

export default PayrollExpenseManagement;
