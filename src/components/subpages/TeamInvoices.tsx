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
    ContractView,
    ContractViewPagedCollectionStandardResponse,
} from 'src/services';
import FilterSearch from '@components/bits-utils/FilterSearch';
import { useState } from 'react';
import InvoiceTemplate from './InvoiceTemplate';

interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
}

function TeamInvoices({ adminList }: adminProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState();
    console.log({ adminList });
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
                        'Created By',
                        'Created on',
                        'Status',
                        'Action',
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: ContractView) => (
                            <Tr key={x.id}>
                                <TableData name={x.name} />
                                <TableData name={x.title} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <TableState name={x.status as string} />
                                <InvoiceAction
                                    data={'y'}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />
                            </Tr>
                        ))}
                        <Tr>
                            <TableData name={'INV-001'} />
                            <TableData name={'John Ofilo'} />
                            <TableData name={'22-01-2022'} />
                            <TableState name={'Invoiced'} />
                            <InvoiceAction
                                data={{ num: 345678 }}
                                onOpen={onOpen}
                                clicked={setClicked}
                            />
                        </Tr>
                    </>
                </Tables>
                <Pagination data={adminList} />
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
