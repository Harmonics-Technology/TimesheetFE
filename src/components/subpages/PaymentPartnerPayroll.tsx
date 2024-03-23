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
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    FinancialService,
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
    PaymentPartnerInvoiceModel,
    UserView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { useState } from 'react';
import Checkbox from '@components/bits-utils/Checkbox';
import BeatLoader from 'react-spinners/BeatLoader';
import { GenerateInvoiceModal } from '@components/bits-utils/GenerateInvoiceModal';
import { formatDate } from '@components/generics/functions/formatDate';
import dynamic from 'next/dynamic';
import { Round } from '@components/generics/functions/Round';
import { CUR } from '@components/generics/functions/Naira';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface expenseProps {
    payrolls: InvoiceViewPagedCollectionStandardResponse;
    id: number;
    clients: UserView[];
    superAdminId: string;
}

function PaymentPartnerPayroll({
    payrolls,
    id,
    clients,
    superAdminId,
}: expenseProps) {
    const payrollsList = payrolls?.data?.value;
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [selectedId, setSelectedId] = useState<any[]>([]);
    const toggleSelected = (x: any, all?: boolean) => {
        if (all) {
            if (selectedId?.length === payrollsList?.length) {
                setSelectedId([]);
                return;
            }
            const response: InvoiceView[] = [];
            payrollsList?.forEach((x) => response.push(x));

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

    const filterClientsInvoice = (filter: string) => {
        router.push({
            query: {
                clientId: filter,
                // offset: 0,
            },
        });
    };

    const newClient = clients.map((obj) => {
        return { id: obj.id, title: obj.fullName };
    });
    const newData = [
        { id: '', title: 'All' },
        { id: superAdminId, title: 'Main Organization' },
        ...(newClient || []),
    ];

    const onSubmit = async (
        data: PaymentPartnerInvoiceModel,
        invoicesId: any,
        allInvoiceTotal: any,
    ) => {
        data.invoices = invoicesId;
        data.totalAmount = Number(allInvoiceTotal);

        try {
            const result = await FinancialService.createPaymentPartnerInvoice(
                data,
            );
            if (result.status) {
                toast({
                    title: `Successful`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
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
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
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
                <Box mb="1rem" w="20%">
                    {/* <Selectrix
                        options={clients}
                        searchable
                        customKeys={{
                            key: 'id',
                            label: 'fullName',
                        }}
                        onChange={(value: any) =>
                            filterClientsInvoice(value.key)
                        }
                    /> */}
                </Box>
                {selectedId.length !== 0 && (
                    <Flex gap="1rem" justify="space-between" mb="1rem">
                        <Box>
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
                        </Box>

                        <Checkbox
                            checked={
                                payrollsList?.length !== 0 &&
                                payrollsList?.length == selectedId?.length
                            }
                            onChange={() => toggleSelected('', true)}
                            label="Select All"
                        />
                    </Flex>
                )}
                <FilterSearch
                    hides
                    options={newData}
                    filter={
                        <Selectrix
                            options={newData}
                            searchable
                            customKeys={{
                                key: 'id',
                                label: 'title',
                            }}
                            onChange={(value: any) =>
                                filterClientsInvoice(value.key)
                            }
                        />
                    }
                />
                <Tables
                    tableHead={[
                        'Organization Name',
                        'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        // 'Rate',
                        'Total Amount',
                        // '...',
                        '',
                    ]}
                >
                    <>
                        {payrollsList?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData
                                    name={
                                        x.payrollGroupName ||
                                        x.createdByUser?.clientName
                                    }
                                />
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
                                {/* <TableData name={x.rate} /> */}
                                <TableData name={CUR(Round(x.totalAmount))} />
                                {/* <TableContractAction
                                    id={x.employeeInformationId}
                                    timeSheets={true}
                                /> */}
                                <td>
                                    <Checkbox
                                        checked={
                                            selectedId.find(
                                                (e) => e.id === x.id,
                                            ) || ''
                                        }
                                        onChange={() => toggleSelected(x)}
                                    />
                                </td>
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={payrolls} loadMore />
            </Box>
            <GenerateInvoiceModal
                isOpen={isOpen}
                onClose={onClose}
                clicked={selectedId}
                id={id}
                client={newData}
                onSubmit={onSubmit}
            />
        </>
    );
}

export default PaymentPartnerPayroll;
