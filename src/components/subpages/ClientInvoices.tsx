/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
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
    ControlSettingView,
    FinancialService,
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useContext, useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import BeatLoader from 'react-spinners/BeatLoader';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';
import { formatDate } from '@components/generics/functions/formatDate';
import ClientInvoicedInvoice from './ClientInvoicedInvoice';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { UserContext } from '@components/context/UserContext';
import NoAccess from '@components/bits-utils/NoAccess';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    fileName?: string;
    record?: number;
    isSuperAdmin?: boolean;
}

function ClientInvoices({
    invoiceData,
    fileName,
    record,
    isSuperAdmin,
}: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();
    const { accessControls } = useContext(UserContext);
    const userAccess: ControlSettingView = accessControls;

    const invoice = invoiceData?.data?.value;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const offshore = router.pathname.includes('financials/payrolls-approved');
    const payment = router.pathname.includes('financials/invoices-payment');
    //
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                invoice?.filter((x) => x.status !== 'INVOICED').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            invoice
                ?.filter((x) => x.status !== 'INVOICED')
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
        selectedId.forEach(async (x) => {
            try {
                setLoading(true);
                const result = await FinancialService.treatSubmittedInvoice(x);
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
                    title: error.body.message || error.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        });
    };

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Invoice No',
        'Name',
        'Created on',
        'Start Date',
        'End Date',
        'Status',
        'Action',
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Team Members',
                            url: `/financials/invoices-team`,
                        },
                        {
                            text: 'Payment Partners',
                            url: `/financials/invoices-payment`,
                        },
                        {
                            text: 'Clients',
                            url: `/financials/invoices-client`,
                        },
                    ]}
                />

                {userAccess?.adminCanViewClientInvoice || isSuperAdmin ? (
                    <>
                        <Flex justify="space-between" my="1rem">
                            <HStack gap="1rem">
                                {selectedId.length > 0 && (
                                    <Button
                                        bgColor="brand.600"
                                        color="white"
                                        p=".5rem 1.5rem"
                                        height="fit-content"
                                        onClick={() => approveInvoiceItems()}
                                        isLoading={loading}
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size={10}
                                            />
                                        }
                                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                    >
                                        {offshore || payment
                                            ? 'Approve'
                                            : 'Mark as Paid'}
                                    </Button>
                                )}
                            </HStack>
                            {/* <Checkbox
            checked={
                invoice?.length !== 0 &&
                invoice?.filter((x) => x.status !== 'INVOICED')
                    .length == selectedId?.length
            }
            onChange={() => toggleSelected('', true)}
            label="Select All"
        /> */}
                            <HStack>
                                {record !== undefined && (
                                    <Button
                                        bgColor="brand.600"
                                        color="white"
                                        p=".5rem 1.5rem"
                                        height="fit-content"
                                        onClick={onOpens}
                                        borderRadius="25px"
                                    >
                                        Download{' '}
                                        <Icon as={BsDownload} ml=".5rem" />
                                    </Button>
                                )}
                            </HStack>
                        </Flex>
                        <FilterSearch />
                        <Tables tableHead={thead}>
                            <>
                                {invoiceData?.data?.value?.map(
                                    (x: InvoiceView) => (
                                        <Tr key={x.id}>
                                            <TableData
                                                name={x.invoiceReference}
                                            />
                                            <TableData
                                                name={
                                                    x?.createdByUser
                                                        ?.organizationName || ''
                                                }
                                            />
                                            <TableData
                                                name={formatDate(x.dateCreated)}
                                            />
                                            <TableData
                                                name={formatDate(x.startDate)}
                                            />
                                            <TableData
                                                name={formatDate(x.endDate)}
                                            />
                                            <TableState
                                                name={x.status as string}
                                            />
                                            <InvoiceAction
                                                data={x}
                                                onOpen={onOpen}
                                                clicked={setClicked}
                                            />

                                            {/* <td>
                        <Checkbox
                            checked={
                                selectedId.find(
                                    (e) => e === x.id,
                                ) || ''
                            }
                            onChange={(e) =>
                                toggleSelected(x.id as string)
                            }
                            disabled={x.status === 'INVOICED'}
                        />
                    </td> */}
                                        </Tr>
                                    ),
                                )}
                            </>
                        </Tables>
                        <Pagination data={invoiceData} />
                    </>
                ) : (
                    <NoAccess />
                )}
            </Box>
            {isOpen && (
                <ClientInvoicedInvoice
                    isOpen={isOpen}
                    onClose={onClose}
                    clicked={clicked}
                />
            )}
            {open && (
                <ExportReportModal
                    isOpen={open}
                    onClose={close}
                    data={thead}
                    record={record}
                    fileName={fileName}
                    model="invoice"
                />
            )}
        </>
    );
}

export default ClientInvoices;
