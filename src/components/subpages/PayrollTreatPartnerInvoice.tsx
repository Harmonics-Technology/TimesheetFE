import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Select,
    Tr,
    Text,
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
import Paymentinvoices from './Paymentinvoices';
import Naira, { CAD } from '@components/generics/functions/Naira';
import PayrollInvoice from './PayrollInvoice';
import { formatDate } from '@components/generics/functions/formatDate';
import { MiniTabs } from '@components/bits-utils/MiniTabs';
import { UserContext } from '@components/context/UserContext';
import { Round } from '@components/generics/functions/Round';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import NoAccess from '@components/bits-utils/NoAccess';
import asyncForEach from '@components/generics/functions/AsyncForEach';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    fileName?: string;
    record?: number;
    paygroupId?: number;
    clients?: any;
    isSuperAdmin?: boolean;
}

function PayrollTreatPartnerInvoice({
    invoiceData,
    fileName,
    record,
    paygroupId,
    clients,
    isSuperAdmin,
}: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();

    const invoice = invoiceData?.data?.value;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    //
    const [selectedId, setSelectedId] = useState<string[]>([]);
    const toggleSelected = (id: string, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                invoice?.filter((x) => x.status === 'PENDING').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: string[] = [];
            invoice
                ?.filter((x) => x.status === 'PENDING')
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
    const approveSingleInvoice = async (item: string) => {
        try {
            const result = await FinancialService.treatSubmittedInvoice(item);
            if (result.status) {
                toast({
                    title: `${result.message}`,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
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
                title: error.body.message || error.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const approveInvoiceItems = async () => {
        try {
            await asyncForEach(selectedId, async (select: string) => {
                setLoading(true);
                await approveSingleInvoice(select);
            });
            setSelectedId([]);
            setLoading(false);
            router.replace(router.asPath);
            return;
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error.body.message || error.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const { user, subType, accessControls } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const userAccess: ControlSettingView = accessControls;
    const pending = `/${role}/financials/invoices-payment`;
    const approved = `/${role}/financials/invoices-payment-2`;

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Invoice No',
        'Name',
        'Created On',
        'Amount($)',
        'Amount(₦)',
        'Status',
        'Action',
    ];

    return (
        <>
            <Box
                bgColor="white"
                // borderRadius="15px"
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
                            upgrade: subType == 'basic',
                        },
                        {
                            text: 'Clients',
                            url: `/financials/invoices-client`,
                            upgrade: subType !== 'premium',
                        },
                    ]}
                />

                {/* <HStack
                    mb="1rem"
                    bgColor="gray.50"
                    w="fit-content"
                    p=".3rem 0rem"
                >
                    <MiniTabs url={pending} text={'Proinsight Technology'} />
                    <MiniTabs url={approved} text={'Olade Consulting'} />
                </HStack> */}
                {userAccess?.adminCanViewPaymentPartnerInvoice ||
                isSuperAdmin ? (
                    <>
                        {clients?.length > 0 && (
                            <Box
                                fontSize=".8rem"
                                w="fit-content"
                                mb={['0rem', '0']}
                            >
                                <Text noOfLines={1} mb="0">
                                    Filter By
                                </Text>
                                <Select
                                    w="fit-content"
                                    onChange={(e) =>
                                        router.push({
                                            query: {
                                                paySlipFilter: e.target.value,
                                            },
                                        })
                                    }
                                    borderRadius="0"
                                    fontSize=".8rem"
                                >
                                    {clients.value?.map((x) => (
                                        <option value={x.id} key={x.id}>
                                            {x.fullName}
                                        </option>
                                    ))}
                                </Select>
                            </Box>
                        )}
                        <Flex
                            justify={
                                selectedId.length > 0
                                    ? 'space-between'
                                    : 'flex-end'
                            }
                            my="1rem"
                        >
                            {selectedId.length > 0 && (
                                <HStack gap="1rem">
                                    <Button
                                        bgColor="brand.600"
                                        color="white"
                                        p=".5rem 1.5rem"
                                        height="fit-content"
                                        onClick={() => approveInvoiceItems()}
                                        isLoading={loading}
                                        borderRadius="0"
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size={10}
                                            />
                                        }
                                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                    >
                                        Approve
                                    </Button>
                                </HStack>
                            )}
                            <HStack>
                                <Checkbox
                                    checked={
                                        invoice?.length !== 0 &&
                                        invoice?.filter(
                                            (x) => x.status === 'PENDING',
                                        ).length !== 0 &&
                                        invoice?.filter(
                                            (x) => x.status === 'PENDING',
                                        ).length == selectedId?.length
                                    }
                                    onChange={() => toggleSelected('', true)}
                                    label="Select All"
                                />
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
                                                    x.payrollGroupName ||
                                                    x.paymentPartnerName ||
                                                    x.name
                                                }
                                            />
                                            <TableData
                                                name={formatDate(x.dateCreated)}
                                            />
                                            <TableData
                                                name={CAD(
                                                    Round(
                                                        (x.totalAmount as number) /
                                                            (x.rate as unknown as number),
                                                    ),
                                                )}
                                            />
                                            <TableData
                                                name={Naira(
                                                    Round(
                                                        x.totalAmount as number,
                                                        // *
                                                        //     (x.rate as unknown as number),
                                                    ),
                                                )}
                                            />
                                            <TableState
                                                name={x.status as string}
                                            />
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
                                                        toggleSelected(
                                                            x.id as string,
                                                        )
                                                    }
                                                    disabled={
                                                        x.status !== 'PENDING'
                                                    }
                                                />
                                            </td>
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
                <PayrollInvoice
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
                    payPartner={true}
                    paygroupId={paygroupId}
                />
            )}
        </>
    );
}

export default PayrollTreatPartnerInvoice;
