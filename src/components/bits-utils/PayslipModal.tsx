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
import { PaySlipView } from 'src/services';
import { TableData, TableHead } from './TableData';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { PayslipInfoTag } from './PayslipInfoTag';
import numWords from 'num-words';

type Props = {
    isOpen?: any;
    onClose?: any;
    paySlip?: PaySlipView;
};

export const PayslipModal = ({ isOpen, onClose, paySlip }: Props) => {
    // const exportPDF = () => {
    //     const unit = 'pt';
    //     const size = 'A4'; // Use A1, A2, A3 or A4
    //     const orientation = 'portrait'; // portrait or landscape

    //     const marginLeft = 40;
    //     const doc = new jsPDF(orientation, unit, size);

    //     doc.setFontSize(15);

    //     const title = 'Payment Schedule';
    //     const headers = [
    //         [
    //             'S/N',
    //             'FIRST WORK DAY',
    //             'LAST WORK DAY',
    //             'APPROVAL DATE',
    //             'PAYMENT DATE',
    //         ],
    //     ];

    //     const data = paySlip?.data?.map((x: any, i) => [
    //         ++i,
    //         moment(x.weekDate).format('DD/MM/YYYY'),
    //         moment(x.lastWorkDayOfCycle).format('DD/MM/YYYY'),
    //         moment(x.approvalDate).format('DD/MM/YYYY'),
    //         moment(x.paymentDate).format('DD/MM/YYYY'),
    //     ]);

    //     const content = {
    //         headStyles: {
    //             fillColor: [46, 175, 163],
    //             minCellHeight: 30,
    //             valign: 'middle',
    //             cellPadding: [0, 10, 0, 10],
    //         },
    //         bodyStyles: {
    //             minCellHeight: 30,
    //             valign: 'middle',
    //             cellPadding: [0, 10, 0, 10],
    //         },
    //         theme: 'striped',
    //         startY: 50,
    //         head: headers,
    //         body: data,
    //     };

    //     doc.text(title, marginLeft, 40);
    //     //@ts-ignore
    //     doc.autoTable(content);
    //     doc.save('schedule.pdf');
    // };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
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
                        <Box>
                            <Text fontWeight="600" mb=".5rem">
                                Payslip
                            </Text>
                            <Text fontSize=".9rem">
                                Payslip for the month of July 2022
                            </Text>
                            <Flex justify="flex-end" my="1rem">
                                <Button
                                    w={['100%', '20%']}
                                    // h="3.5rem"
                                    variant="outline"
                                    borderColor="brand.400"
                                    color="brand.400"
                                    // onClick={exportPDF}
                                    _hover={{
                                        bgColor: 'brand.400',
                                        color: 'white',
                                    }}
                                >
                                    Download
                                </Button>
                            </Flex>
                            <Flex flexWrap="wrap" mb="2rem" gap="4rem">
                                <VStack align="flex-start" spacing="1rem">
                                    <PayslipInfoTag
                                        title={'Company Name'}
                                        value={paySlip?.companyName}
                                    />
                                    <PayslipInfoTag
                                        title={'Name'}
                                        value={paySlip?.name}
                                    />{' '}
                                    <PayslipInfoTag
                                        title={'Employee id'}
                                        value={
                                            paySlip?.employeeInformation?.id?.split(
                                                '-',
                                            )[0]
                                        }
                                    />{' '}
                                    <PayslipInfoTag
                                        title={'Designation'}
                                        value={
                                            paySlip?.employeeInformation
                                                ?.jobTitle
                                        }
                                    />{' '}
                                    <PayslipInfoTag
                                        title={'Address'}
                                        value={paySlip?.address}
                                    />
                                </VStack>
                                <VStack align="flex-start" spacing="1rem">
                                    <PayslipInfoTag
                                        title={'Join Date'}
                                        value={moment(
                                            paySlip?.employeeInformation
                                                ?.dateCreated,
                                        ).format('YYYY-MM-DD')}
                                    />
                                    <PayslipInfoTag
                                        title={'Pay Period'}
                                        value={moment(
                                            paySlip?.paymentDate,
                                        ).format('YYYY-MM-DD')}
                                    />
                                    <PayslipInfoTag
                                        title={'Pay Date'}
                                        value={moment(
                                            paySlip?.paymentDate,
                                        ).format('Do-MMM-YYYY')}
                                    />
                                    <PayslipInfoTag
                                        title={'Pay Frequency'}
                                        value={
                                            paySlip?.employeeInformation
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
                                            name={paySlip?.totalAmount}
                                        />
                                    </Tr>
                                    <Tr color="brand.400" fontWeight="600">
                                        <TableData
                                            name={'Total Earning for the month'}
                                            border
                                            value="1px solid"
                                            borderColor="gray.200"
                                        />
                                        <TableData name={'3,250.00'} />
                                    </Tr>
                                    <Tr fontWeight="600">
                                        <TableData
                                            name={
                                                'Total Earning for the year till Date'
                                            }
                                            border
                                            value="1px solid"
                                            borderColor="gray.200"
                                        />
                                        <TableData name={'30,250.00'} />
                                    </Tr>
                                </Tbody>
                            </Table>
                        </TableContainer>
                        <Flex align="center" justify="space-between" mt="2rem">
                            <Text mb="0">Net Pay: {paySlip?.totalAmount}</Text>
                            <Box
                                border="1px solid"
                                borderColor="gray.200"
                                p="1rem"
                                w="60%"
                            >
                                <Text mb=".5rem">In Words</Text>
                                <Text mb="0" textTransform="capitalize">
                                    {numWords(paySlip?.totalAmount)}
                                </Text>
                            </Box>
                        </Flex>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
