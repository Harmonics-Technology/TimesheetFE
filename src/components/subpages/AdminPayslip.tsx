/* eslint-disable no-sparse-arrays */
import { Box, Button, Flex, Icon, Tr, useDisclosure } from '@chakra-ui/react';
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
import { BsDownload } from 'react-icons/bs';
import { ExportReportModal } from '@components/bits-utils/ExportReportModal';

interface expenseProps {
    payrolls: PayslipUserViewPagedCollectionStandardResponse;
    paymentSchedule: AdminPaymentScheduleViewListStandardResponse;
    record?: number;
    fileName?: string;
}

function AdminPayslip({
    payrolls,
    paymentSchedule,
    record,
    fileName,
}: expenseProps) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [clicked, setClicked] = useState<PaySlipView>();

    // ({ payrolls });
    const payrollsList = payrolls?.data?.value;
    const {
        isOpen: isOpened,
        onOpen: onOpened,
        onClose: onClosed,
    } = useDisclosure();

    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const thead = [
        'Name',
        'Start Date',
        'End Date',
        'Payment Date',
        'Total Hours',
        'Total Amount',
        'Action',
        // '',
    ];

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <Flex justify="space-between">
                    <Button
                        bgColor="brand.600"
                        color="white"
                        display={
                            paymentSchedule == undefined ? 'none' : 'block'
                        }
                        fontSize=".8rem"
                        h="2.5rem"
                        borderRadius="0"
                        border="2px solid"
                        onClick={onOpened}
                        w={['auto', 'inherit']}
                        mb="1rem"
                    >
                        View Payment Schedule
                    </Button>
                    {record !== undefined && (
                        <Button
                            bgColor="brand.600"
                            color="white"
                            p=".5rem 1.5rem"
                            height="fit-content"
                            onClick={onOpens}
                            borderRadius="25px"
                        >
                            Download <Icon as={BsDownload} ml=".5rem" />
                        </Button>
                    )}
                </Flex>
                <FilterSearch hides={true} />
                <Tables tableHead={thead}>
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
                                        x.payslipView?.invoice?.dateCreated,
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
            <ExportReportModal
                isOpen={open}
                onClose={close}
                data={thead}
                record={record}
                fileName={fileName}
                model="payslip"
            />
        </>
    );
}

export default AdminPayslip;
