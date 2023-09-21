import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    Box,
    Tabs,
    TabList,
    Tab,
    TabPanel,
    TabPanels,
    Thead,
    Tr,
    Table,
} from '@chakra-ui/react';
import {
    AdminPaymentScheduleView,
    AdminPaymentScheduleViewListStandardResponse,
    PaymentSchedule,
} from 'src/services';
import moment from 'moment';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ScheduleTable } from './ScheduleTable';
import { TableHead, TableData } from './TableData';

type Props = {
    isOpen?: any;
    onClose?: any;
    paymentSchedule: AdminPaymentScheduleViewListStandardResponse;
};

const AdminPaymentScheduleModal = ({
    isOpen,
    onClose,
    paymentSchedule,
}: Props) => {
    const monthlySchedule = paymentSchedule?.data?.filter(
        (x) => x.scheduleType == 'Monthly',
    )[0];
    const biWeeklySchedule = paymentSchedule?.data?.filter(
        (x) => x.scheduleType == 'Bi-Weekly',
    )[0];
    const weeklySchedule = paymentSchedule?.data?.filter(
        (x) => x.scheduleType == 'Weekly',
    )[0];
    const exportPDF = (type: AdminPaymentScheduleView | undefined) => {
        const unit = 'pt';
        const size = 'A4'; // Use A1, A2, A3 or A4
        const orientation = 'portrait'; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = `${type?.scheduleType} Schedule`;
        const headers = [
            [
                'S/N',
                'FIRST WORK DAY',
                'LAST WORK DAY',
                'APPROVAL DATE',
                'PAYMENT DATE',
            ],
        ];

        const data = type?.schedules?.map((x: PaymentSchedule, i) => [
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
        doc.save(`${type?.scheduleType} schedule.pdf`);
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
                            mb="1rem"
                            px={['1.5rem', '3.3rem']}
                            fontWeight="700"
                        >
                            Payment Schedule
                        </Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Tabs isFitted variant="enclosed">
                        <TabList mb="1em">
                            <Tab>Monthly</Tab>
                            <Tab>Bi-Weekly</Tab>
                            <Tab>Weekly</Tab>
                        </TabList>
                        <Table w="92%" mx="auto">
                            <Thead>
                                <Tr
                                    h="3rem"
                                    fontWeight="600"
                                    bgColor="brand.400"
                                    color="white"
                                >
                                    <TableHead name="S/N" />
                                    <TableHead name="First Work Day" />
                                    <TableHead name="Last Work Day" />
                                    <TableHead name="Approval Date" />
                                    <TableHead name="Payment Date" />
                                </Tr>
                            </Thead>
                        </Table>
                        <Box maxH="70vh" overflowY="auto" px={5}>
                            <TabPanels>
                                <TabPanel>
                                    <ScheduleTable
                                        paymentSchedule={monthlySchedule}
                                        exportPDF={() =>
                                            exportPDF(monthlySchedule)
                                        }
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ScheduleTable
                                        paymentSchedule={biWeeklySchedule}
                                        exportPDF={() =>
                                            exportPDF(biWeeklySchedule)
                                        }
                                    />
                                </TabPanel>
                                <TabPanel>
                                    <ScheduleTable
                                        paymentSchedule={weeklySchedule}
                                        exportPDF={() =>
                                            exportPDF(weeklySchedule)
                                        }
                                    />
                                </TabPanel>
                            </TabPanels>
                        </Box>
                    </Tabs>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AdminPaymentScheduleModal;
