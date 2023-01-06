/* eslint-disable no-sparse-arrays */
import {
    Box,
    Button,
    Flex,
    Tr,
    useDisclosure,
    useToast,
    Td,
} from '@chakra-ui/react';
import {
    ExpenseActions,
    TableContractAction,
    TableData,
    TableState,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    PayrollView,
    FinancialService,
    PayrollViewPagedCollectionStandardResponse,
    PaySlipView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import { useRouter } from 'next/router';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { useEffect, useState } from 'react';
import Checkbox from '@components/bits-utils/Checkbox';

interface expenseProps {
    payrolls: PayrollViewPagedCollectionStandardResponse;
}

function AdminPayslip({ payrolls }: expenseProps) {
    // console.log({ payrolls });
    const payrollsList = payrolls?.data?.value;

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
                        // 'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        'Rate',
                        'Total Amount',
                        // '...',
                        // '',
                    ]}
                >
                    <>
                        {payrollsList?.map((x: PaySlipView) => (
                            <Tr key={x.id}>
                                {/* <TableData name={x.name} /> */}
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD-MM-YY',
                                    )}
                                />
                                <TableData
                                    name={moment(x.endDate).format('DD-MM-YY')}
                                />
                                <TableData
                                    name={moment(x.paymentDate).format(
                                        'DD-MM-YY',
                                    )}
                                />
                                <TableData name={`${x.totalHours} HRS`} />
                                <TableData name={x.paymentRate} />
                                <TableData name={x.totalAmount} />
                                {/* <TableContractAction
                                    id={x.payrollId}
                                    timeSheets={true}
                                /> */}
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={payrolls} />
            </Box>
        </>
    );
}

export default AdminPayslip;
