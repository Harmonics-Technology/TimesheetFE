import {
    Box,
    Button,
    Flex,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    Tr,
} from '@chakra-ui/react';
import InvoiceTotalText from '@components/bits-utils/InvoiceTotalText';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import moment from 'moment';
import { useContext, useRef } from 'react';
import { ExpenseView, InvoiceView, PayrollView } from 'src/services';
import Naira, { CAD, CUR } from '@components/generics/functions/Naira';
import { PDFExport } from '@progress/kendo-react-pdf';
import { formatDate } from '@components/generics/functions/formatDate';
import calculatePercentage from '@components/generics/functions/calculatePercentage';
import { Round } from '@components/generics/functions/Round';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';

function InvoiceTemplate({
    isOpen,
    onClose,
    clicked,
}: {
    isOpen: boolean;
    onClose: any;
    clicked: InvoiceView | undefined;
}) {
    const ref = useRef<any>(null);
    function downloadInvoice() {
        if (ref.current) {
            ref.current.save();
        }
    }
    const allExpenseTotal = clicked?.expenses?.reduce(
        (a, b) => a + (b?.amount as number),
        0,
    );
    const exchangeRate = clicked?.rate as unknown as number;

    const amountMinusExpense =
        (clicked?.totalAmount as number) - (allExpenseTotal as number);

    const taxCalculated = clicked?.employeeInformation?.tax;
    const convertedTax = Round(
        calculatePercentage(amountMinusExpense, taxCalculated),
    );

    const finalTotal =
        Number(clicked?.totalAmount as number) + Number(convertedTax);

    return (
        <>
            <Modal
                motionPreset="slideInBottom"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalContent
                    py={5}
                    borderRadius="0"
                    w={['88%', '55%']}
                    maxW="unset"
                    overflow="hidden"
                    // maxH="100vh"
                    mt="0"
                    mb="0"
                >
                    <ModalHeader>
                        <Text
                            color="black"
                            fontSize="1.1rem"
                            textAlign="left"
                            fontWeight="semibold"
                            px={5}
                        >
                            Viewing Invoice
                        </Text>
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box overflowY="auto" px={5} maxH="80vh">
                            <PDFExport
                                ref={ref}
                                paperSize="A4"
                                scale={0.7}
                                margin={40}
                                fileName={`INV - ${clicked?.id?.slice(
                                    0,
                                    8,
                                )}.pdf`}
                                author="KendoReact Team"
                            >
                                {/* <Text>Pro Insight Technology</Text> */}
                                <Flex
                                    bgColor="brand.400"
                                    color="white"
                                    borderRadius="20px"
                                    justify="space-between"
                                    p="2rem 2rem"
                                >
                                    <Box>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Invoice Number:{' '}
                                            {clicked?.invoiceReference}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Issued Date:{' '}
                                            {formatDate(clicked?.dateCreated)}
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            Due Date:{' '}
                                            {formatDate(clicked?.paymentDate)}
                                        </Text>
                                    </Box>
                                    <Box maxW="35%" textAlign="right">
                                        <Text
                                            fontSize=".9rem"
                                            fontWeight="600"
                                            mb=".4rem"
                                        >
                                            Billed To
                                        </Text>
                                        <Text fontSize=".9rem" fontWeight="600">
                                            {
                                                clicked?.employeeInformation
                                                    ?.client?.organizationName
                                            }{' '}
                                            <br />
                                            {
                                                clicked?.employeeInformation
                                                    ?.client
                                                    ?.organizationAddress
                                            }
                                        </Text>
                                        {/* <Text fontSize=".9rem" fontWeight="600">
                                    Address
                                </Text> */}
                                    </Box>
                                </Flex>
                                <Box
                                    my="2rem"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    borderX="none"
                                >
                                    {/* <Text
                                        fontSize=".7rem"
                                        fontWeight="600"
                                        mt="1rem"
                                    >
                                        Payroll
                                    </Text> */}
                                    <Tables
                                        tableHead={
                                            // clicked?.employeeInformation
                                            //     ?.payrollType == 'ONSHORE'
                                            //     ? [
                                            //           'Name',
                                            //           'Pay Period',
                                            //           'Type',
                                            //           'Hours',
                                            //           'Rate/Hr',
                                            //           `Pay (${clicked?.employeeInformation?.currency})`,
                                            //       ]
                                            //     :
                                            [
                                                'Name',
                                                'Pay Period',
                                                'Type',
                                                'Hours',
                                                `Pay (${clicked?.employeeInformation?.currency})`,
                                                `Tax(%)`,
                                                // 'Fee',
                                                // 'Total',
                                            ]
                                        }
                                    >
                                        <Tr key={clicked?.id}>
                                            <TableData
                                                name={
                                                    clicked?.payrollGroupName ||
                                                    clicked?.paymentPartnerName ||
                                                    clicked?.name
                                                }
                                            />
                                            <TableData
                                                name={`${moment(
                                                    clicked?.startDate,
                                                ).format(
                                                    'MMM DD',
                                                )} - ${formatDate(
                                                    clicked?.endDate,
                                                )}`}
                                                full
                                            />
                                            <TableData
                                                name={clicked?.invoiceType}
                                            />
                                            <TableData
                                                name={clicked?.totalHours}
                                            />
                                            {clicked?.employeeInformation
                                                ?.payrollType == 'ONSHORE' && (
                                                <TableData
                                                    name={
                                                        clicked
                                                            ?.employeeInformation
                                                            ?.ratePerHour
                                                    }
                                                />
                                            )}
                                            <TableData
                                                name={`${
                                                    clicked?.employeeInformation
                                                        ?.currency
                                                } ${CUR(
                                                    Round(amountMinusExpense),
                                                )}`}
                                            />
                                            <TableData
                                                name={`${taxCalculated}%
                                                `}
                                            />
                                            {/* (${CUR(
                                                    Round(
                                                        calculatePercentage(
                                                            amountMinusExpense,
                                                            taxCalculated,
                                                        ),
                                                    ),
                                                )}) */}
                                            {/* <TableData
                                                    name={CAD(
                                                        clicked
                                                            ?.employeeInformation
                                                            ?.fixedAmount ==
                                                            false
                                                            ? calculatePercentage(
                                                                  (clicked?.totalAmount as number) /
                                                                      exchangeRate,
                                                                  clicked
                                                                      ?.employeeInformation
                                                                      ?.onBoradingFee,
                                                              )
                                                            : clicked
                                                                  ?.employeeInformation
                                                                  ?.onBoradingFee,
                                                    )}
                                                />
                                                <TableData
                                                    name={clicked?.totalPay}
                                                /> */}
                                        </Tr>
                                    </Tables>

                                    <>
                                        {clicked?.expenses?.length !== 0 && (
                                            <>
                                                <Text
                                                    fontSize=".7rem"
                                                    fontWeight="600"
                                                    mt="1rem"
                                                    pl="1rem"
                                                >
                                                    Expenses
                                                </Text>
                                                <Tables
                                                    tableHead={[
                                                        'Full Name',
                                                        'Expense Date',
                                                        'Created on',
                                                        'Description',
                                                        `Amount`,
                                                    ]}
                                                >
                                                    {clicked?.expenses?.map(
                                                        (x) => (
                                                            <Tr key={x?.id}>
                                                                <TableData
                                                                    name={
                                                                        x
                                                                            .teamMember
                                                                            ?.fullName
                                                                    }
                                                                />
                                                                <TableData
                                                                    name={formatDate(
                                                                        x.expenseDate,
                                                                    )}
                                                                />
                                                                <TableData
                                                                    name={formatDate(
                                                                        x.dateCreated,
                                                                    )}
                                                                />
                                                                <TableData
                                                                    name={
                                                                        x.description
                                                                    }
                                                                />
                                                                <TableData
                                                                    name={`${
                                                                        x?.currency
                                                                    } ${CUR(
                                                                        Round(
                                                                            x?.amount,
                                                                        ),
                                                                    )}`}
                                                                />
                                                            </Tr>
                                                        ),
                                                    )}
                                                </Tables>
                                            </>
                                        )}
                                    </>
                                </Box>
                                <Box w="fit-content" ml="auto">
                                    <Flex
                                        flexDirection="column"
                                        w="fit-content"
                                    >
                                        <InvoiceTotalText
                                            label="Subtotal"
                                            cur={
                                                clicked?.employeeInformation
                                                    ?.currency
                                            }
                                            value={CUR(
                                                Round(
                                                    clicked?.totalAmount as number,
                                                ),
                                            )}
                                        />
                                        <InvoiceTotalText
                                            label="Tax"
                                            value={CUR(Round(convertedTax))}
                                            cur={
                                                clicked?.employeeInformation
                                                    ?.currency
                                            }
                                        />
                                        <Box
                                            border="2px solid"
                                            borderColor="gray.300"
                                            borderX="none"
                                            py=".5em"
                                            mt="1rem"
                                        >
                                            <InvoiceTotalText
                                                label="Total"
                                                cur={
                                                    clicked?.employeeInformation
                                                        ?.currency
                                                }
                                                value={CUR(Round(finalTotal))}
                                            />
                                        </Box>
                                    </Flex>
                                </Box>
                                {/* <Text
                                    textAlign="center"
                                    fontSize=".7rem"
                                    my="2rem"
                                >
                                    Generated on{' '}
                                    {formatDate(new Date()).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )}
                                </Text> */}
                            </PDFExport>
                        </Box>
                        <Button
                            bgColor="brand.400"
                            color="white"
                            fontSize=".8rem"
                            onClick={downloadInvoice}
                        >
                            Download Invoice
                        </Button>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
}
export default InvoiceTemplate;
