/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Tr,
    useToast,
    Td,
    useDisclosure,
} from '@chakra-ui/react';
import {
    TableContractAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { useState } from 'react';
import Checkbox from '@components/bits-utils/Checkbox';
import BeatLoader from 'react-spinners/BeatLoader';
import { GenerateInvoiceModal } from '@components/bits-utils/GenerateInvoiceModal';

interface expenseProps {
    payrolls: InvoiceViewPagedCollectionStandardResponse;
    id: number;
}

function PaymentPayrollHistory({ payrolls, id }: expenseProps) {
    const payrollsList = payrolls?.data?.value;
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    console.log({ payrolls });

    const [selectedId, setSelectedId] = useState<any[]>([]);
    const toggleSelected = (x: any, all?: boolean) => {
        if (all) {
            if (selectedId?.length === payrollsList?.length) {
                setSelectedId([]);
                return;
            }
            const response: InvoiceView[] = [];
            payrollsList?.forEach((x) => response.push(x));
            console.log({ response });
            setSelectedId([...response]);
            return;
        }
        const existingValue = selectedId.find((e) => e.id === x.id);
        if (existingValue) {
            const newArray = selectedId.filter((e) => e.id !== x.id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([...selectedId, x]);
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
                        {selectedId.length !== 0 && (
                            <Button
                                bgColor="brand.600"
                                color="white"
                                p=".5rem 1.5rem"
                                height="fit-content"
                                onClick={onOpen}
                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Create Invoice
                            </Button>
                        )}
                    </Box>

                    {/* <Checkbox
                        checked={
                            payrollsList?.length !== 0 &&
                            payrollsList?.length == selectedId?.length
                        }
                        onChange={() => toggleSelected('', true)}
                        label="Select All"
                    /> */}
                </Flex>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        // 'Rate',
                        'Total Amount',
                        // '...',
                        'Status',
                    ]}
                >
                    <>
                        {payrollsList?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD-MM-YY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format('DD-MM-YY')}
                                />
                                <TableData
                                    name={
                                        moment(x.paymentDate).format(
                                            'DD-MM-YY',
                                        ) == '01-01-01'
                                            ? '------'
                                            : moment(x.paymentDate).format(
                                                  'DD-MM-YY',
                                              )
                                    }
                                />
                                <TableData name={`${x.totalHours} HRS`} />
                                <TableData name={x.totalAmount} />
                                <TableState name={x.status} />
                                {/* <TableContractAction
                                    id={x.employeeInformationId}
                                    timeSheets={true}
                                /> */}
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={payrolls} />
            </Box>
            <GenerateInvoiceModal
                isOpen={isOpen}
                onClose={onClose}
                clicked={selectedId}
                id={id}
            />
        </>
    );
}

export default PaymentPayrollHistory;
