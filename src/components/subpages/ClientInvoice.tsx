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
import BeatLoader from 'react-spinners/BeatLoader';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
}

function ClientInvoice({ invoiceData }: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();
    console.log({ invoiceData });
    // const invoice = invoiceData?.data?.value;
    // const [loading, setLoading] = useState(false);
    // const toast = useToast();
    // const router = useRouter();
    // console.log({ clicked });
    // const [selectedId, setSelectedId] = useState<string[]>([]);
    // const toggleSelected = (id: string, all?: boolean) => {
    //     if (all) {
    //         if (
    //             selectedId?.length ===
    //             invoice?.filter((x) => x.status !== 'INVOICED').length
    //         ) {
    //             setSelectedId([]);
    //             return;
    //         }
    //         const response: string[] = [];
    //         invoice
    //             ?.filter((x) => x.status !== 'INVOICED')
    //             .forEach((x) =>
    //                 response.push(x.id as string),
    //             ) as unknown as string[];
    //         console.log({ response });
    //         setSelectedId([...response]);
    //         return;
    //     }
    //     const existingValue = selectedId.find((e) => e === id);
    //     if (existingValue) {
    //         const newArray = selectedId.filter((x) => x !== id);
    //         setSelectedId(newArray);
    //         return;
    //     }
    //     setSelectedId([...selectedId, id]);
    // };
    // const approveInvoiceItems = async () => {
    //     selectedId.forEach(async (x) => {
    //         try {
    //             setLoading(true);
    //             const result = await FinancialService.treatSubmittedInvoice(x);
    //             if (result.status) {
    //                 console.log({ result });
    //                 toast({
    //                     title: result.message,
    //                     status: 'success',
    //                     isClosable: true,
    //                     position: 'top-right',
    //                 });
    //                 setLoading(false);
    //                 router.reload();
    //                 return;
    //             }
    //             setLoading(false);
    //             toast({
    //                 title: result.message,
    //                 status: 'error',
    //                 isClosable: true,
    //                 position: 'top-right',
    //             });
    //         } catch (error: any) {
    //             console.log({ error });
    //             setLoading(false);
    //             toast({
    //                 title: error?.body?.message || error?.message,
    //                 status: 'error',
    //                 isClosable: true,
    //                 position: 'top-right',
    //             });
    //         }
    //     });
    // };
    // const { user } = useContext(UserContext);
    // const role = user?.role.replaceAll(' ', '');
    // const hideCheckbox = router.asPath.startsWith(
    //     `/${role}/financials/offshore`,
    // );
    // console.log({ hideCheckbox });

    return (
        <>
            <Box
                bgColor="white"
                // borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                {/* {selectedId.length > 0 && (
                    <Flex justify="space-between" mb="1rem">
                        <HStack gap="1rem">
                            <Button
                                bgColor="brand.600"
                                color="white"
                                p=".5rem 1.5rem"
                                height="fit-content"
                                onClick={() => approveInvoiceItems()}
                                isLoading={loading}
                                spinner={<BeatLoader color="white" size={10} />}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                Approve
                            </Button>
                        </HStack>
                        {!hideCheckbox && (
                            <Checkbox
                                checked={
                                    invoice?.length !== 0 &&
                                    invoice?.filter(
                                        (x) => x.status !== 'INVOICED',
                                    ).length == selectedId?.length
                                }
                                onChange={() => toggleSelected('', true)}
                                label="Select All"
                            />
                        )}
                    </Flex>
                )} */}
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Invoice No',
                        'Name',
                        'Created on',
                        'Start Date',
                        'End Date',
                        'Status',
                        // 'Action',
                    ]}
                >
                    <>
                        {invoiceData?.data?.value?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={x.invoiceReference} />
                                <TableData
                                    name={
                                        x.payrollGroupName ||
                                        x.paymentPartnerName ||
                                        x.name
                                    }
                                />
                                <TableData name={formatDate(x.dateCreated)} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
                                <TableState name={x.status as string} />
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />
                                {/* {!hideCheckbox && (
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
                                            disabled={x.status === 'INVOICED'}
                                        />
                                    </td>
                                )} */}
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={invoiceData} />
            </Box>
            <InvoiceTemplate
                isOpen={isOpen}
                onClose={onClose}
                clicked={clicked}
            />
        </>
    );
}

export default ClientInvoice;
