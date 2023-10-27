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
import BeatLoader from 'react-spinners/BeatLoader';
import { formatDate } from '@components/generics/functions/formatDate';
import { CUR } from '@components/generics/functions/Naira';

interface expenseProps {
    listExpenses: ExpenseViewPagedCollectionStandardResponse;
}

function PayPartnerExpense({ listExpenses }: expenseProps) {
    const expensesList = listExpenses?.data?.value;
    const router = useRouter();
    const toast = useToast();
    //

    const [loading, setLoading] = useState(false);

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
                router.replace(router.asPath);
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
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Generate Invoice
                            </Button>
                        )}
                    </Box>
                    {/* <Checkbox
                        checked={
                            expensesList?.length !== 0 &&
                            expensesList?.length == selectedId?.length
                        }
                        onChange={() => toggleSelected('', true)}
                        label="Select All"
                    /> */}
                </Flex>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Description',
                        'Expense Type',
                        'Expense Date',
                        'Created on',
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
                                <TableData name={formatDate(x.expenseDate)} />
                                <TableData name={formatDate(x.dateCreated)} />
                                <TableData
                                    name={`${x.currency}${CUR(
                                        x.amount as unknown as string,
                                    )}`}
                                />
                                <TableState name={x.status as string} />
                                <ExpenseActions id={x} />
                                {/* <td>
                                    {x.status == 'APPROVED' && <Checkbox />}
                                </td> */}
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
