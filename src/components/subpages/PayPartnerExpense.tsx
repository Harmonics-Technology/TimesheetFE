/* eslint-disable no-sparse-arrays */
import { Box, Button, Flex, Tr, useToast } from '@chakra-ui/react';
import {
    ExpenseActions,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import React, { useState } from 'react';
import {
    ExpenseView,
    ExpenseViewPagedCollectionStandardResponse,
    FinancialService,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import FilterSearch from '@components/bits-utils/FilterSearch';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';

interface expenseProps {
    listExpenses: ExpenseViewPagedCollectionStandardResponse;
}

function PayPartnerExpense({ listExpenses }: expenseProps) {
    const expensesList = listExpenses?.data?.value;
    const router = useRouter();
    const toast = useToast();
    // console.log({ listExpenses });

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

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex gap="1rem" justify="space-between">
                    <Box>
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
                    </Box>
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
                        '...',
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
                                <td>
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
                                </td>
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={listExpenses} />
            </Box>
        </>
    );
}

export default PayPartnerExpense;
