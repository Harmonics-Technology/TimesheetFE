import {
    Box,
    Tr,
    useDisclosure,
    Button,
    useToast,
    Flex,
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
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useContext, useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';
import { formatDate } from '@components/generics/functions/formatDate';
import { UserContext } from '@components/context/UserContext';

interface invoiceProps {
    invoiceList: InvoiceViewPagedCollectionStandardResponse;
}

function TeamInvoices({ invoiceList }: invoiceProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const invoice = invoiceList?.data?.value;
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (selectedId?.length === invoice?.length) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            invoice?.forEach((x) =>
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
    console.log({ selectedId });
    const submitted = router.asPath.includes('/financials/invoices');

    const submitInvoiceItem = async () => {
        selectedId.forEach(async (x) => {
            try {
                setLoading(true);
                const result = await FinancialService.submitInvoice(x);
                if (result.status) {
                    console.log({ result });
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
            } catch (error: any) {
                console.log({ error });
                setLoading(false);
                toast({
                    title: error.body.message || error.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        });
    };
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const sub = router.asPath == `/${role}/financials/invoices`;

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                {selectedId?.length > 0 && (
                    <Flex align="center" justify="space-between" mb="1rem">
                        <Button
                            bgColor="brand.400"
                            color="white"
                            p=".5rem 1.5rem"
                            display={submitted ? 'none' : 'flex'}
                            height="fit-content"
                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            isLoading={loading}
                            spinner={<BeatLoader size={10} />}
                            onClick={() => submitInvoiceItem()}
                        >
                            Submit Invoice
                        </Button>
                        {!submitted && (
                            <Checkbox
                                checked={
                                    invoice?.length !== 0 &&
                                    invoice?.length == selectedId?.length
                                }
                                onChange={() => toggleSelected('', true)}
                                label="Select All"
                            />
                        )}
                    </Flex>
                )}
                <FilterSearch />
                <Tables
                    tableHead={
                        sub
                            ? [
                                  'Invoice No',
                                  'Name',
                                  'Created On',
                                  'Start Date',
                                  'End Date',
                                  'Status',
                                  'Action',
                                  // '',
                              ]
                            : [
                                  'Invoice No',
                                  'Name',
                                  'Created On',
                                  'Start Date',
                                  'End Date',
                                  'Action',
                              ]
                    }
                >
                    <>
                        {invoice?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={x.invoiceReference} />
                                <TableData
                                    name={
                                        x.payrollGroupName ||
                                        x.name ||
                                        x.paymentPartnerName
                                    }
                                />
                                <TableData name={formatDate(x.dateCreated)} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                {sub && (
                                    <TableState name={x.status as string} />
                                )}
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />

                                {x.status === 'PENDING' && (
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
                                )}
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={invoiceList} />
            </Box>
            <InvoiceTemplate
                isOpen={isOpen}
                onClose={onClose}
                clicked={clicked}
            />
        </>
    );
}

export default TeamInvoices;
