/* eslint-disable no-sparse-arrays */
import { Box, Button, Tr, useDisclosure } from '@chakra-ui/react';
import { InvoiceAction, TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import {
    ExpenseView,
    PaySlipView,
    PaySlipViewPagedCollectionStandardResponse,
    PaymentScheduleListStandardResponse,
    PayslipUserView,
    PayslipUserViewPagedCollectionStandardResponse,
} from 'src/services';
import Pagination from '@components/bits-utils/Pagination';
import FilterSearch from '@components/bits-utils/FilterSearch';
import moment from 'moment';
import { useState } from 'react';
import { PayslipModal } from '@components/bits-utils/PayslipModal';
import Naira, { CAD } from '@components/generics/functions/Naira';
import { formatDate } from '@components/generics/functions/formatDate';
import PaymentScheduleModal from '@components/bits-utils/PaymentScheduleModal';

interface expenseProps {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
    paymentSchedule: PaymentScheduleListStandardResponse;
}

function TeamPayslips({ payrolls, paymentSchedule }: expenseProps) {
    console.log({ payrolls });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<PaySlipView>();
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
                <FilterSearch hide={false} />
                <Tables
                    tableHead={[
                        'Name',
                        'Start Date',
                        'End Date',
                        'Payment Date',
                        'Total Hrs',
                        'Total Amount',
                        // '...',
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
            <PaymentScheduleModal
                isOpen={isOpened}
                onClose={onClosed}
                paymentSchedule={
                    paymentSchedule as PaymentScheduleListStandardResponse
                }
            />
        </>
    );
}

export default TeamPayslips;
