/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Tr,
    useDisclosure,
    useToast,
    Td,
} from '@chakra-ui/react';
import {
    ExpenseActions,
    PayrollActions,
    TableContractAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    PayrollView,
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Checkbox from '@components/bits-utils/Checkbox';
import BeatLoader from 'react-spinners/BeatLoader';
import { formatDate } from '@components/generics/functions/formatDate';

interface expenseProps {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}

function AdminPayroll({ payrolls }: expenseProps) {
    const payrollsList = payrolls?.data?.value;
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);

    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (selectedId?.length === payrollsList?.length) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            payrollsList?.forEach((x) =>
                response.push(x.payrollId as string),
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

    const approvePayrollItems = async () => {
        selectedId.forEach(async (x) => {
            try {
                setLoading(true);
                const result = await FinancialService.approvePayroll(x);
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
            } catch (error: any) {
                setLoading(false);
                toast({
                    title: error?.body?.message || error?.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        });
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
                    {selectedId.length > 0 && (
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            onClick={() => approvePayrollItems()}
                            isLoading={loading}
                            spinner={<BeatLoader color="white" size={10} />}
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        >
                            Approve Payroll Item(s)
                        </Button>
                    )}

                    <Box w="fit-content" ml="auto">
                        <Checkbox
                            checked={
                                payrollsList?.length !== 0 &&
                                payrollsList?.length == selectedId?.length
                            }
                            onChange={() => toggleSelected('', true)}
                            label="Select All"
                        />
                    </Box>
                </Flex>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        'Rate',
                        'Total Amount',
                        'Actions',
                        '',
                    ]}
                >
                    <>
                        {payrollsList?.map((x: PayrollView) => (
                            <Tr key={x.payrollId}>
                                <TableData name={x.name} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableData
                                    name={
                                        moment(x.paymentDate).format(
                                            'DD-MM-YY',
                                        ) == '01-01-01'
                                            ? '------'
                                            : formatDate(x.paymentDate)
                                    }
                                />
                                <TableData name={`${x.totalHours} HRS`} />
                                <TableData name={x.rate} />
                                <TableData name={x.totalAmount} />
                                <PayrollActions
                                    id={x.payrollId}
                                    userId={x.employeeInformationId}
                                />
                                <td>
                                    <Checkbox
                                        checked={
                                            selectedId.find(
                                                (e) => e === x.payrollId,
                                            ) || ''
                                        }
                                        onChange={() =>
                                            toggleSelected(
                                                x.payrollId as string,
                                            )
                                        }
                                    />
                                </td>
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={payrolls} />
            </Box>
        </>
    );
}

export default AdminPayroll;
