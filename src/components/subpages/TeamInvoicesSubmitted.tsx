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
    InvoiceView,
    InvoiceViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';
import { formatDate } from '@components/generics/functions/formatDate';

interface invoiceProps {
    invoiceList: InvoiceViewPagedCollectionStandardResponse;
}

function TeamInvoicesSubmitted({ invoiceList }: invoiceProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState();

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
                        'Name',
                        'Created On',
                        'Start Date',
                        'End Date',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {invoiceList?.data?.value?.map((x: InvoiceView) => (
                            <Tr key={x.id}>
                                <TableData name={'Inv001'} />
                                <TableData name={'Adeleke john'} />
                                <TableData name={formatDate(x.dateCreated)} />
                                <TableData name={formatDate(x.startDate)} />
                                <TableData name={formatDate(x.endDate)} />
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

export default TeamInvoicesSubmitted;
