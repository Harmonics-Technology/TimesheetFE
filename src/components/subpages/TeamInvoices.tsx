import { Box, Tr, useDisclosure, Button, useToast } from '@chakra-ui/react';
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
import { useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import Checkbox from '@components/bits-utils/Checkbox';
import { useRouter } from 'next/router';
import BeatLoader from 'react-spinners/BeatLoader';

interface invoiceProps {
    invoiceList: InvoiceViewPagedCollectionStandardResponse;
}

function TeamInvoices({ invoiceList }: invoiceProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState();
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const router = useRouter();
    const [selectedId, setSelectedId] = useState<string>();
    console.log({ selectedId });

    const submitInvoiceItem = async () => {
        try {
            setLoading(true);
            const result = await FinancialService.submitInvoice(selectedId);
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
    };

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Button
                    bgColor="brand.400"
                    color="white"
                    p=".5rem 1.5rem"
                    height="fit-content"
                    boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    isLoading={loading}
                    spinner={<BeatLoader size={10} />}
                    onClick={() => submitInvoiceItem()}
                >
                    Submit Invoice
                </Button>
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Invoice No',
                        'Created on',
                        'Start Date',
                        'End Date',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {invoiceList?.data?.value?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={'Adeleke john'} />
                                <TableData
                                    name={moment(x.dateCreated).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableState name={x.status as string} />
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />
                                <td>
                                    <Checkbox
                                        checked={selectedId || ''}
                                        onChange={(e) =>
                                            setSelectedId(x.id as string)
                                        }
                                    />
                                </td>
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
