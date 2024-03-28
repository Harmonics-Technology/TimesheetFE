import {
    Box,
    Button,
    Flex,
    HStack,
    Tr,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import {
    InvoiceAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import moment from 'moment';
import {
    FinancialService,
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
    TreatInvoiceModel,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useContext, useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import BeatLoader from 'react-spinners/BeatLoader';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';
import Paymentinvoices from './Paymentinvoices';
import Naira, { CAD } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import dynamic from 'next/dynamic';
import { Round } from '@components/generics/functions/Round';
import asyncForEach from '@components/generics/functions/AsyncForEach';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';
import { UserContext } from '@components/context/UserContext';
const Selectrix = dynamic<any>(() => import('react-selectrix'), {
    ssr: false,
});

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    clients: any;
    id: any;
    superAdminId: any;
}

function PaymentPartnerInvoice({
    invoiceData,
    clients,
    id,
    superAdminId,
}: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();

    const invoice = invoiceData?.data?.value;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const { user } = useContext(UserContext);

    // console.log({ invoice });
    //
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                invoice?.filter((x) => x.status === 'APPROVED').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            invoice
                ?.filter((x) => x.status === 'APPROVED')
                .forEach((x) =>
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

    const approveInvoiceItems = async () => {
        const item = selectedId.map((x) => ({
            invoiceId: x,
            rate: 0,
        }));
        try {
            const result = await FinancialService.treatSubmittedInvoice(item);
            if (result.status) {
                toast({
                    title: `${result.message}`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setSelectedId([]);
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
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    // const approveInvoiceItems = async () => {
    //     try {
    //         await asyncForEach(selectedId, async (select: string) => {
    //             setLoading(true);
    //             await approveSingleInvoice(select);
    //         });
    //         setSelectedId([]);
    //         setLoading(false);
    //         router.replace(router.asPath);
    //         return;
    //     } catch (error: any) {
    //         setLoading(false);
    //         toast({
    //             title: error?.body?.message || error?.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //     }
    // };

    const filterClientsInvoice = (filter: string) => {
        router.push({
            query: {
                clientId: filter,
            },
        });
    };
    const newClient = clients.map((obj) => {
        return { id: obj.id, title: obj.fullName };
    });
    const newData = [
        { id: superAdminId, title: 'Main Organization' },
        ...(newClient || []),
    ];

    // console.log({ invoiceData });
    return (
        <>
            <Box
                bgColor="white"
                // borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                {selectedId.length > 0 && (
                    <Flex justify="space-between" mb="1rem">
                        <HStack gap="1rem">
                            <Button
                                bgColor="brand.600"
                                color="white"
                                p=".5rem 1.5rem"
                                height="fit-content"
                                onClick={() => approveInvoiceItems()}
                                isLoading={loading}
                                border="0"
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Mark as Paid
                            </Button>
                        </HStack>
                        <Checkbox
                            checked={
                                invoice?.length !== 0 &&
                                invoice?.filter((x) => x.status === 'APPROVED')
                                    .length !== 0 &&
                                invoice?.filter((x) => x.status === 'APPROVED')
                                    .length == selectedId?.length
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
                        'Name on Invoice',
                        'Invoice No',
                        'Created On',
                        // 'Amount($)',
                        'Amount',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {invoiceData?.data?.value?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData
                                    name={
                                        x.payrollGroupName ||
                                        x.paymentPartnerName ||
                                        x.name
                                    }
                                />
                                <TableData name={x.invoiceReference} />
                                <TableData name={formatDate(x.dateCreated)} />
                                {/* <TableData
                                    name={CAD(
                                        Round(
                                            (x.totalAmount as number) /
                                                (x.rate as unknown as number),
                                        ),
                                    )}
                                /> */}
                                <TableData
                                    name={`${getCurrencySymbol(user?.currency)}
                                        ${Round(x.convertedAmount as number)}`}
                                    full
                                />
                                <TableState name={x.status as string} />
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />

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
                                        disabled={x.status !== 'APPROVED'}
                                    />
                                </td>
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={invoiceData} loadMore />
            </Box>
            <Paymentinvoices
                isOpen={isOpen}
                onClose={onClose}
                clicked={clicked}
            />
        </>
    );
}

export default PaymentPartnerInvoice;
