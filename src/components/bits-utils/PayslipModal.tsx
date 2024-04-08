import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Button,
    Text,
    Box,
    Flex,
    TableContainer,
    Table,
    Thead,
    Tr,
    Tbody,
    Grid,
    VStack,
} from '@chakra-ui/react';
import { TableData, TableHead } from './TableData';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PayslipInfoTag } from './PayslipInfoTag';
import Naira, { CUR } from '@components/generics/functions/Naira';
import {  useRef } from 'react';
import { PDFExport } from '@progress/kendo-react-pdf';
import { formatDate } from '@components/generics/functions/formatDate';
import { Round } from '@components/generics/functions/Round';
import calculatePercentage from '@components/generics/functions/calculatePercentage';
import { numberToWordsWithCurrency } from '@components/generics/functions/NumberToWords';
// import { PaySlipView } from 'src/services';

type Props = {
    isOpen?: any;
    onClose?: any;
    paySlip?: any;
};

export const PayslipModal = ({ isOpen, onClose, paySlip }: Props) => {

    const allExpenseTotal = paySlip?.invoice?.expenses?.reduce(
        (a, b) => a + (b?.amount as number),
        0,
    );
    const payTotal = Math.ceil(Number(paySlip?.invoice?.totalAmount));
    const netPay = (payTotal as number) - (allExpenseTotal as number);

    const hstCalculated = calculatePercentage(
        netPay,
        paySlip?.invoice?.employeeInformation?.tax,
    );

    const finalTotal = payTotal + hstCalculated;

    const ref = useRef<any>(null);
    function downloadInvoice() {
        if (ref.current) {
            ref.current.save();
        }
    }
    const currency = paySlip?.invoice?.employeeInformation?.currency;
    // const numWords = toWords?.convert(finalTotal || 0, { currency: true });

    const numWords = numberToWordsWithCurrency(finalTotal, currency);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                pb={5}
                borderRadius="0px"
                w={['88%', '80%']}
                overflow="hidden"
                maxH="100vh"
                maxW="unset"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <>
                        {/* <Text
                            fontSize="1.1rem"
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="700"
                        >
                            Payment Schedule
                        </Text> */}
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="90vh" overflowY="auto" px={5}>
                        <Flex justify="flex-end" mb="1rem">
                            <Button
                                w={['100%', '20%']}
                                // h="3.5rem"
                                variant="outline"
                                borderColor="brand.400"
                                color="brand.400"
                                onClick={downloadInvoice}
                                _hover={{
                                    bgColor: 'brand.400',
                                    color: 'white',
                                }}
                            >
                                Download
                            </Button>
                        </Flex>
                        <PDFExport
                            ref={ref}
                            paperSize="A4"
                            scale={0.7}
                            margin={40}
                            fileName={`Payslip for the month of
                            ${formatDate(paySlip?.invoice?.startDate)}.pdf`}
                        >
                            <Box>
                                <Box mb="2rem">
                                    <Text fontWeight="600" mb=".5rem">
                                        Payslip
                                    </Text>
                                    <Text fontSize=".9rem">
                                        Payslip for the month of{' '}
                                        {formatDate(
                                            paySlip?.invoice?.startDate,
                                        )}
                                    </Text>
                                </Box>

                                <Flex flexWrap="wrap" mb="2rem" gap="4rem">
                                    <VStack align="flex-start" spacing="1rem">
                                        <PayslipInfoTag
                                            title={'Company Name'}
                                            value={
                                                paySlip?.invoice
                                                    ?.employeeInformation
                                                    ?.client?.organizationName
                                            }
                                        />
                                        <PayslipInfoTag
                                            title={'Name'}
                                            value={paySlip?.invoice?.name}
                                        />{' '}
                                        {/* <PayslipInfoTag
                                            title={'Employee id'}
                                            value={
                                                paySlip?.invoice?.employeeInformation?.id?.split(
                                                    '-',
                                                )[0]
                                            }
                                        />{' '} */}
                                        {/* <PayslipInfoTag
                                            title={'Designation'}
                                            value={
                                                paySlip?.invoice
                                                    ?.employeeInformation
                                                    ?.jobTitle
                                            }
                                        />{' '} */}
                                        <PayslipInfoTag
                                            title={'Address'}
                                            value={
                                                paySlip?.invoice
                                                    ?.employeeInformation
                                                    ?.client
                                                    ?.organizationAddress
                                            }
                                        />
                                    </VStack>
                                    <VStack align="flex-start" spacing="1rem">
                                        {/* <PayslipInfoTag
                                            title={'Join Date'}
                                            value={formatDate(
                                                paySlip?.invoice
                                                    ?.employeeInformation
                                                    ?.dateCreated,
                                            )}
                                        /> */}
                                        <PayslipInfoTag
                                            title={'Pay Period'}
                                            value={`${formatDate(
                                                paySlip?.invoice?.startDate,
                                            )} - ${formatDate(
                                                paySlip?.invoice?.endDate,
                                            )} `}
                                        />
                                        <PayslipInfoTag
                                            title={'Processed Date'}
                                            value={formatDate(
                                                paySlip?.invoice?.dateCreated,
                                            )}
                                        />
                                        <PayslipInfoTag
                                            title={'Pay Frequency'}
                                            value={
                                                paySlip?.invoice
                                                    ?.employeeInformation
                                                    ?.paymentFrequency
                                            }
                                        />
                                    </VStack>
                                </Flex>
                            </Box>
                            <TableContainer>
                                <Table
                                    // variant="striped"
                                    border="1px solid"
                                    borderColor="gray.200"
                                >
                                    <Thead>
                                        <Tr
                                            h="3rem"
                                            fontWeight="600"
                                            bgColor="brand.400"
                                            color="white"
                                        >
                                            <TableHead
                                                name="Earnings"
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                            />
                                            <TableHead name="Amount" />
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        <Tr>
                                            <TableData
                                                name={'Pay'}
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                            />
                                            <TableData
                                                name={`${currency}
                                                    ${CUR(netPay)}`}
                                                full
                                            />
                                        </Tr>
                                        <Tr>
                                            <TableData
                                                name={'Expense'}
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                            />
                                            <TableData
                                                name={`${currency}
                                                    ${CUR(allExpenseTotal)}`}
                                                full
                                            />
                                        </Tr>
                                        <Tr>
                                            <TableData
                                                name={'HST'}
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                            />
                                            <TableData
                                                name={`${currency}
                                                    ${CUR(hstCalculated)}`}
                                                full
                                            />
                                        </Tr>
                                        <Tr color="brand.400" fontWeight="600">
                                            <TableData
                                                name={`Total Earning for ${
                                                    paySlip?.invoice
                                                        ?.employeeInformation
                                                        ?.paymentFrequency ==
                                                    'Monthly'
                                                        ? 'the month'
                                                        : paySlip?.invoice
                                                              ?.employeeInformation
                                                              ?.paymentFrequency ==
                                                          'Weekly'
                                                        ? 'the week'
                                                        : 'two weeks'
                                                }`}
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                                full
                                            />
                                            <TableData
                                                name={`${currency}
                                                    ${CUR(payTotal)}`}
                                                full
                                            />
                                        </Tr>
                                        <Tr fontWeight="600">
                                            <TableData
                                                name={
                                                    'Total Earning for the year till Date'
                                                }
                                                border
                                                value="1px solid"
                                                borderColor="gray.200"
                                                full
                                            />
                                            <TableData
                                                name={` ${currency}
                                                        ${CUR(
                                                            Round(
                                                                paySlip?.totalEarnings,
                                                            ),
                                                        )}`}
                                                full
                                            />
                                        </Tr>
                                    </Tbody>
                                </Table>
                            </TableContainer>
                            <Flex
                                align="center"
                                justify="space-between"
                                mt="2rem"
                            >
                                <Text mb="0">
                                    Net Pay: {`${currency} ${CUR(finalTotal)}`}
                                </Text>
                                <Box
                                    border="1px solid"
                                    borderColor="gray.200"
                                    p="1rem"
                                    w="60%"
                                >
                                    <Text mb=".5rem">In Words</Text>
                                    <Text mb="0" textTransform="capitalize">
                                        {numWords}
                                    </Text>
                                </Box>
                            </Flex>
                        </PDFExport>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
