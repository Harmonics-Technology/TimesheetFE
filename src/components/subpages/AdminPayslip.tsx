/* eslint-disable no-sparse-arrays */
import { Box, Tr, useDisclosure } from '@chakra-ui/react';
import { InvoiceAction, TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    ExpenseView,
    PayslipUserView,
    PayslipUserViewPagedCollectionStandardResponse,
    PaySlipView,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { PayslipModal } from '@components/bits-utils/PayslipModal';
import { useState } from 'react';
import Naira, { CAD } from '@components/generics/functions/Naira';

interface expenseProps {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
}

function AdminPayslip({ payrolls }: expenseProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<PaySlipView>();
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
                <FilterSearch hide={true} />
                <Tables
                    tableHead={[
                        'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        'Total Amount',
                        'Action',
                        // '',
                    ]}
                >
                    <>
                        {payrollsList?.map((x: PayslipUserView, i) => (
                            <Tr key={i}>
                                <TableData
                                    name={x?.payslipView?.invoice?.name}
                                />
                                <TableData
                                    name={moment(
                                        x.payslipView?.invoice?.startDate,
                                    ).format('DD-MM-YY')}
                                />
                                <TableData
                                    name={moment(
                                        x.payslipView?.invoice?.endDate,
                                    ).format('DD-MM-YY')}
                                />
                                <TableData
                                    name={moment(
                                        x.payslipView?.invoice?.paymentDate,
                                    ).format('DD-MM-YY')}
                                />
                                <TableData
                                    name={`${x.payslipView?.invoice?.totalHours} HRS`}
                                />
                                <TableData
                                    name={
                                        x.payslipView?.invoice
                                            ?.employeeInformation?.currency ==
                                        'CAD'
                                            ? CAD(
                                                  x?.payslipView?.invoice
                                                      ?.totalAmount as number,
                                              )
                                            : Naira(
                                                  x?.payslipView?.invoice
                                                      ?.totalAmount as number,
                                              )
                                    }
                                />
                                <InvoiceAction
                                    data={x}
                                    onOpen={onOpen}
                                    clicked={setClicked}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={payrolls} />
            </Box>
            <PayslipModal isOpen={isOpen} onClose={onClose} paySlip={clicked} />
        </>
    );
}

export default AdminPayslip;
