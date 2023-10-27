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
} from '@chakra-ui/react';
import {
    PaymentSchedule,
    PaymentScheduleListStandardResponse,
} from 'src/services';
import { TableData, TableHead } from './TableData';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatDate } from '@components/generics/functions/formatDate';

type Props = {
    isOpen?: any;
    onClose?: any;
    paymentSchedule: PaymentScheduleListStandardResponse;
};

const PaymentScheduleModal = ({ isOpen, onClose, paymentSchedule }: Props) => {
    const exportPDF = () => {
        const unit = 'pt';
        const size = 'A4'; // Use A1, A2, A3 or A4
        const orientation = 'portrait'; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = 'Payment Schedule';
        const headers = [
            [
                'S/N',
                'FIRST WORK DAY',
                'LAST WORK DAY',
                'APPROVAL DATE',
                'PAYMENT DATE',
            ],
        ];

        const data = paymentSchedule?.data?.map((x: PaymentSchedule, i) => [
            ++i,
            moment(x.weekDate),
            moment(x.lastWorkDayOfCycle),
            moment(x.approvalDate),
            moment(x.paymentDate),
        ]);

        const content = {
            headStyles: {
                fillColor: [46, 175, 163],
                minCellHeight: 30,
                valign: 'middle',
                cellPadding: [0, 10, 0, 10],
            },
            bodyStyles: {
                minCellHeight: 30,
                valign: 'middle',
                cellPadding: [0, 10, 0, 10],
            },
            theme: 'striped',
            startY: 50,
            head: headers,
            body: data,
        };

        doc.text(title, marginLeft, 40);
        //@ts-ignore
        doc.autoTable(content);
        doc.save('schedule.pdf');
    };
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
                w={['88%', '60%']}
                overflow="hidden"
                maxH="100vh"
                maxW="unset"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Text
                            fontSize="1.1rem"
                            mt="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="700"
                        >
                            Payment Schedule
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody w="95%" mx="auto">
                    <Table>
                        <Thead>
                            <Tr
                                h="3rem"
                                fontWeight="600"
                                bgColor="brand.400"
                                color="white"
                            >
                                <TableHead name="S/N" />
                                <TableHead name="First Work Day" p="0" />
                                <TableHead name="Last Work Day" p="0" />
                                <TableHead name="Approval Date" p="0" />
                                <TableHead name="Payment Date" p="0" />
                            </Tr>
                        </Thead>
                    </Table>
                    <Box maxH="65vh" overflowY="auto">
                        <TableContainer>
                            <Table
                                variant="striped"
                                borderX="2px solid"
                                borderY="2px solid"
                                borderColor="gray.200"
                            >
                                <Tbody>
                                    {paymentSchedule?.data?.map(
                                        (x: PaymentSchedule, i) => (
                                            <Tr key={i}>
                                                <TableData name={++i} />
                                                <TableData
                                                    name={formatDate(
                                                        x.weekDate,
                                                    )}
                                                />
                                                <TableData
                                                    name={formatDate(
                                                        x.lastWorkDayOfCycle,
                                                    )}
                                                />
                                                <TableData
                                                    name={formatDate(
                                                        x.approvalDate,
                                                    )}
                                                />
                                                <TableData
                                                    name={formatDate(
                                                        x.paymentDate,
                                                    )}
                                                />
                                            </Tr>
                                        ),
                                    )}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Flex justify="flex-end" my="2rem">
                        <Button
                            w="40%"
                            h="3.5rem"
                            bgColor="brand.400"
                            color="white"
                            onClick={exportPDF}
                        >
                            Download
                        </Button>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default PaymentScheduleModal;
