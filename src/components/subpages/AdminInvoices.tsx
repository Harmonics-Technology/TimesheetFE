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
    Text,
} from '@chakra-ui/react';
import {
    InvoiceAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
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
import { formatDate } from '@components/generics/functions/formatDate';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';
import { BsDownload } from 'react-icons/bs';
import { Round } from '@components/generics/functions/Round';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import NoAccess from '@components/bits-utils/NoAccess';
import { PaymentPrompt } from '@components/bits-utils/ProjectManagement/Modals/PaymentPrompt';
import asyncForEach from '@components/generics/functions/AsyncForEach';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';
import { CurrencyConversionModal } from '@components/bits-utils/NewUpdates/CurrencyConversionModal';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';
import { CurrencyTag } from '@components/bits-utils/NewUpdates/CurrencyTag';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
    fileName?: string;
    record?: number;
    isSuperAdmin?: boolean;
    organizationCurrency?: any;
    converted?: any;
}

function AdminInvoices({
    invoiceData,
    fileName,
    record,
    isSuperAdmin,
    organizationCurrency,
    converted,
}: adminProps) {
    // console.log({ invoiceData });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();

    const invoice = invoiceData?.data?.value;
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
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
                            data.employeeInformation.payrollProcessingType,
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
                setLoading(false);
                setSelectedId([]);
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
    };

    // const approveInvoiceItems = async (arrays: any) => {
    //     try {
    //         await asyncForEach(arrays, async (select: any) => {
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
    const { user, accessControls } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const userAccess: ControlSettingView = accessControls;
    const hideCheckbox = router.asPath.startsWith(
        `/${role}/financials/submitted-payrolls`,
    );

    const pays = router.asPath.startsWith(`/${role}/financials/payrolls`);

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const {
        isOpen: isCurrencyOpened,
        onOpen: onCurrencyOpen,
        onClose: onCurrencyClosed,
    } = useDisclosure();
    const thead = converted
        ? [
              //   'Organization Name',
              'Name',
              'Created On',
              'Start Date',
              'End Date',
              'Converted Amount',
              'Exchange Rate',
              '',
          ]
        : hideCheckbox || pays
        ? [
              'Organization Name',
              'Name',
              'Created On',
              'Start Date',
              'End Date',
              'Amount',
              'Status',
              // 'Action',
          ]
        : [
              'Invoice No',
              'Name',
              'Created On',
              'Start Date',
              'End Date',
              'Amount',
              'Status',
              // 'Action',
          ];

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
    // console.log({ differentItems, updateCurrency, items });

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
                            text: 'Pending Payrolls',
                            url: `/financials/payrolls`,
                        },
                        {
                            text: 'Processed Payrolls',
                            url: `/financials/submitted-payrolls`,
                        },
                    ]}
                />
                {userAccess?.adminCanViewPayrolls || isSuperAdmin ? (
                    <>
                        <Box mt="1rem">
                            <CurrencyTag
                                label="Your Primary currency for your organization is"
                                currency={organizationCurrency}
                            />
                        </Box>
                        <Flex
                            justify="space-between"
                            my="1rem"
                            flexWrap="wrap"
                            gap=".5rem"
                        >
                            {!hideCheckbox ? (
                                <HStack gap="1rem">
                                    {(userAccess?.adminCanApprovePayrolls ||
                                        isSuperAdmin) && (
                                        <Button
                                            bgColor="brand.400"
                                            color="white"
                                            p=".5rem 1.5rem"
                                            height="fit-content"
                                            borderRadius="6px"
                                            fontSize=".8rem"
                                            onClick={() =>
                                                //    selectedId?.employeeInformation
                                                //         ?.payrollType == 'ONSHORE'
                                                //         ? onOpened()
                                                //         :
                                                checkInvoicesBeforeProcess()
                                            }
                                            isLoading={loading}
                                            spinner={
                                                <BeatLoader
                                                    color="white"
                                                    size={10}
                                                />
                                            }
                                            boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                            isDisabled={selectedId.length < 1}
                                        >
                                            Process
                                        </Button>
                                    )}
                                </HStack>
                            ) : (
                                <Text
                                    color="brand.600"
                                    fontSize=".8rem"
                                    cursor="pointer"
                                    onClick={toggleConverted}
                                    userSelect="none"
                                >
                                    {converted
                                        ? 'View processed payroll'
                                        : 'View converted payroll in your primary currency'}
                                </Text>
                            )}

                            <HStack ml="auto">
                                {!hideCheckbox && (
                                    <Checkbox
                                        checked={
                                            invoice?.length !== 0 &&
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
                                {record !== undefined && (
                                    <Button
                                        bgColor="brand.600"
                                        color="white"
                                        p=".5rem 1.5rem"
                                        height="fit-content"
                                        onClick={onOpens}
                                        borderRadius="6px"
                                        fontSize=".8rem"
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
                                            {!converted && (
                                                <TableData
                                                    name={
                                                        hideCheckbox || pays
                                                            ? x
                                                                  .employeeInformation
                                                                  ?.client
                                                                  ?.organizationName
                                                            : x.invoiceReference
                                                    }
                                                />
                                            )}
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
                                            {converted ? (
                                                <>
                                                    <TableData
                                                        name={`${getCurrencySymbol(
                                                            organizationCurrency,
                                                        )}${Round(
                                                            x.convertedAmount,
                                                        )}`}
                                                    />
                                                    <TableData
                                                        name={`${getCurrencySymbol(
                                                            organizationCurrency,
                                                        )}${Round(
                                                            x.rateForConvertedIvoice,
                                                        )}`}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <TableData
                                                        name={`${getCurrencySymbol(
                                                            x
                                                                ?.employeeInformation
                                                                ?.currency,
                                                        )}${Round(
                                                            x.totalAmount,
                                                        )}`}
                                                    />
                                                    <TableState
                                                        name={
                                                            x.status ==
                                                                'REVIEWING' ||
                                                            x.status ==
                                                                'REVIEWED'
                                                                ? 'APPROVED'
                                                                : (x.status as string)
                                                        }
                                                    />
                                                </>
                                            )}

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
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={record}
                fileName={fileName}
                model="invoice"
            />
            {isOpened && (
                <PaymentPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={approveInvoiceItems}
                    loading={loading}
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

export default AdminInvoices;
