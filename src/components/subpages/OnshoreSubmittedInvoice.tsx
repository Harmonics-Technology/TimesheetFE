/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    HStack,
    Tr,
    useDisclosure,
    useToast,
    Text,
    Icon,
} from '@chakra-ui/react';
import {
    InvoiceAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import moment from 'moment';
import {
    ControlSettingView,
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
import { UserContext } from '@components/context/UserContext';
import Link from 'next/link';
import { formatDate } from '@components/generics/functions/formatDate';
import { MiniTabs } from '@components/bits-utils/MiniTabs';
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { PaymentPrompt } from '@components/bits-utils/ProjectManagement/Modals/PaymentPrompt';
import NoAccess from '@components/bits-utils/NoAccess';
import asyncForEach from '@components/generics/functions/AsyncForEach';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';
import { CurrencyConversionModal } from '@components/bits-utils/NewUpdates/CurrencyConversionModal';
import { CurrencyTag } from '@components/bits-utils/NewUpdates/CurrencyTag';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    fileName?: string;
    record?: number;
    isSuperAdmin?: boolean;
    teamUrl?: string;
    organizationCurrency?: any;
    converted?: any;
}

function OnshoreSubmittedInvoice({
    invoiceData,
    fileName,
    record,
    isSuperAdmin,
    teamUrl,
    organizationCurrency,
    converted,
}: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();

    const invoice = invoiceData?.data?.value;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    // console.log({ invoice });
    //
    const [selectedId, setSelectedId] = useState<any[]>([]);
    const toggleSelected = (data: any, all?: boolean) => {
        if (all) {
            if (
                selectedId?.length ===
                invoice?.filter((x) => x.status !== 'INVOICED').length
            ) {
                setSelectedId([]);
                return;
            }
            const response: unknown[] = [];
            invoice
                ?.filter((x) => x.status !== 'INVOICED')
                .forEach((x) =>
                    response.push({
                        id: x.id,
                        currency: x.employeeInformation?.currency,
                        payrollProcessingType:
                            x?.employeeInformation?.payrollProcessingType,
                        rate: 0,
                    }),
                );

            setSelectedId([...response]);
            return;
        }
        const existingValue = selectedId.find((e) => e.id === data.id);
        if (existingValue) {
            const newArray = selectedId.filter((x) => x.id !== data.id);
            setSelectedId(newArray);
            return;
        }
        setSelectedId([
            ...selectedId,
            {
                id: data.id,
                currency: data.employeeInformation.currency,
                payrollProcessingType:
                    data.employeeInformation.payrollProcessingType,
                rate: 0,
            },
        ]);
    };

    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const approveInvoiceItems = async (item: any[]) => {
        setLoading(true);
        const newItem: TreatInvoiceModel[] = item.map((x) => ({
            invoiceId: x.id,
            rate: x.rate,
        }));
        try {
            const result = await FinancialService.treatSubmittedInvoice(
                newItem,
            );
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
    const { user, subType, accessControls } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const userAccess: ControlSettingView = accessControls;
    const hideCheckbox = router.asPath.startsWith(
        `/${role}/financials/invoices-team-treated-invoice`,
    );
    const pending = `/${role}/financials/invoices-team`;
    const approved = `/${role}/financials/invoices-team-treated-invoice`;

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Invoice No',
        'Name',
        'Created On',
        // 'Total Hours',
        // 'Rate/Hr',
        'Start Date',
        'End Date',
        'Amount',
        'Status',
        // 'Action',
    ];
    const {
        isOpen: isCurrencyOpened,
        onOpen: onCurrencyOpen,
        onClose: onCurrencyClosed,
    } = useDisclosure();

    const [updateCurrency, setUpdateCurrency] = useState();

    const differentItems = selectedId.filter(
        (x) =>
            x.payrollProcessingType == 'internal' &&
            x.currency !== organizationCurrency,
    );
    const items = getUniqueListBy(differentItems, 'currency');
    const checkInvoicesBeforeProcess = () => {
        if (differentItems.length > 0) {
            onCurrencyOpen();
            return;
        }
        approveInvoiceItems(selectedId);
    };

    const rebuildInvoiceProcess = async () => {
        const rebuildItems = selectedId.map((x) => {
            return {
                id: x.id,
                currency: x.currency,
                rate: Number(
                    (updateCurrency &&
                        x.payrollProcessingType == 'internal' &&
                        updateCurrency[x.currency]) ||
                        0,
                ),
            };
        });
        approveInvoiceItems(rebuildItems);
        onCurrencyClosed();
    };

    const toggleConverted = () => {
        router.push({
            query: {
                ...router.query,
                convert: !converted,
            },
        });
    };

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
                            url: teamUrl,
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

                {userAccess?.adminCanViewTeamMemberInvoice || isSuperAdmin ? (
                    <>
                        <Box mt="1rem">
                            <CurrencyTag
                                label="The Primary currency for your organization is"
                                currency={organizationCurrency}
                            />
                        </Box>
                        <HStack
                            my="1rem"
                            w="100%"
                            borderBottom="1px solid #c4c4c4"
                        >
                            <MiniTabs url={pending} text={'Pending Approval'} />
                            <MiniTabs url={approved} text={'All Processed'} />
                        </HStack>
                        <Flex
                            justify={
                                selectedId.length > 0
                                    ? 'space-between'
                                    : 'space-between'
                            }
                            mb="1rem"
                        >
                            {/* {selectedId.length > 0 && ( */}
                            <HStack gap="1rem">
                                <Button
                                    bgColor="brand.600"
                                    color="white"
                                    p=".5rem 1.5rem"
                                    height="fit-content"
                                    borderRadius="6px"
                                    onClick={checkInvoicesBeforeProcess}
                                    isLoading={loading}
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    isDisabled={selectedId.length <= 0}
                                    // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                >
                                    Process
                                </Button>
                            </HStack>
                            {/* )} */}
                            <HStack>
                                {!hideCheckbox && (
                                    <Checkbox
                                        checked={
                                            selectedId?.length !== 0 &&
                                            invoice?.filter(
                                                (x) => x.status !== 'PROCESSED',
                                            ).length == selectedId?.length
                                        }
                                        onChange={() =>
                                            toggleSelected('', true)
                                        }
                                        label="Select All"
                                    />
                                )}
                                <Button
                                    bgColor="brand.600"
                                    color="white"
                                    p=".5rem 1.5rem"
                                    height="fit-content"
                                    onClick={onOpens}
                                    borderRadius="6px"
                                >
                                    Download <Icon as={BsDownload} ml=".5rem" />
                                </Button>
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
                                                name={formatDate(x.startDate)}
                                            />
                                            <TableData
                                                name={formatDate(x.endDate)}
                                            />
                                            <TableData
                                                name={` ${getCurrencySymbol(
                                                    x?.employeeInformation
                                                        ?.currency,
                                                )}
                                                              ${CUR(
                                                                  Round(
                                                                      x.totalAmount,
                                                                  ),
                                                              )}`}
                                                full
                                            />
                                            <TableState
                                                name={x.status as string}
                                            />
                                            <InvoiceAction
                                                data={x}
                                                onOpen={onOpen}
                                                clicked={setClicked}
                                            />
                                            {!hideCheckbox && (
                                                <td>
                                                    <Checkbox
                                                        checked={
                                                            selectedId.find(
                                                                (e) =>
                                                                    e.id ===
                                                                    x.id,
                                                            ) || ''
                                                        }
                                                        onChange={(e) =>
                                                            toggleSelected(x)
                                                        }
                                                        disabled={
                                                            x.status ===
                                                            'PROCESSED'
                                                        }
                                                    />
                                                </td>
                                            )}
                                        </Tr>
                                    ),
                                )}
                            </>
                        </Tables>
                        <Pagination data={invoiceData} loadMore />
                    </>
                ) : (
                    <NoAccess />
                )}
            </Box>
            {isOpen && (
                <InvoiceTemplate
                    isOpen={isOpen}
                    onClose={onClose}
                    clicked={clicked}
                />
            )}
            {isOpened && (
                <PaymentPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={approveInvoiceItems}
                    loading={loading}
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
            {isCurrencyOpened && (
                <CurrencyConversionModal
                    isOpen={isCurrencyOpened}
                    onClose={onCurrencyClosed}
                    items={items}
                    setUpdateCurrency={setUpdateCurrency}
                    rebuildInvoiceProcess={rebuildInvoiceProcess}
                />
            )}
        </>
    );
}

export default OnshoreSubmittedInvoice;
