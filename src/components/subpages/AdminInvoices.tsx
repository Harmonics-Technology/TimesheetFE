/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-sparse-arrays */
import { Box, Tr, useDisclosure } from '@chakra-ui/react';
import {
    InvoiceAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import Pagination from '@components/bits-utils/Pagination';
import moment from 'moment';
import {
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';

interface adminProps {
    invoiceData: InvoiceViewPagedCollectionStandardResponse;
}

function AdminInvoices({ invoiceData }: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<InvoiceView>();
    console.log({ invoiceData });
    const invoice = invoiceData?.data?.value;
    console.log({ clicked });

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <FilterSearch />
                <Tables
                    tableHead={[
                        'Invoice No',
                        'Created on',
                        'Invoice Type',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {invoice?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={`INV - ${x.id?.slice(0, 8)}`} />
                                <TableData
                                    name={moment(x.dateCreated).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableData name={x.invoiceType} />
                                {/* <TableData
                                    name={moment(x.endDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                /> */}
                                <TableState name={x.status as string} />
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />
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

export default AdminInvoices;
