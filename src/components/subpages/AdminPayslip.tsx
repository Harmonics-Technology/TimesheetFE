/* eslint-disable no-sparse-arrays */
import { Box, Button, Tr, useDisclosure } from '@chakra-ui/react';
import { InvoiceAction, TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    AdminPaymentScheduleViewListStandardResponse,
    ExpenseView,
    PaymentScheduleListStandardResponse,
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
import { formatDate } from '@components/generics/functions/formatDate';
import AdminPaymentScheduleModal from '@components/bits-utils/AdminPaymentScheduleModal';

interface expenseProps {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
    paymentSchedule: AdminPaymentScheduleViewListStandardResponse;
}

function AdminPayslip({ payrolls, paymentSchedule }: expenseProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<PaySlipView>();

    // console.log({ payrolls });
    const payrollsList = payrolls?.data?.value;
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Button
                    bgColor="brand.600"
                    color="white"
                    display={paymentSchedule == undefined ? 'none' : 'block'}
                    fontSize=".8rem"
                    h="2.5rem"
                    borderRadius="0"
                    border="2px solid"
                    onClick={onOpened}
                    w={['full', 'inherit']}
                    mb="1rem"
                >
                    View Payment Schedule
                </Button>
                <FilterSearch hides={true} />
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
                                    name={formatDate(
                                        x.payslipView?.invoice?.startDate,
                                    )}
                                />
                                <TableData
                                    name={formatDate(
                                        x.payslipView?.invoice?.endDate,
                                    )}
                                />
                                <TableData
                                    name={formatDate(
                                        x.payslipView?.invoice?.paymentDate,
                                    )}
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
            <AdminPaymentScheduleModal
                isOpen={isOpened}
                onClose={onClosed}
                paymentSchedule={
                    paymentSchedule as AdminPaymentScheduleViewListStandardResponse
                }
            />
        </>
    );
}

export default AdminPayslip;
