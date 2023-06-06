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
    const monthlySchedule = (
        paymentSchedule?.data as AdminPaymentScheduleView
    )[0];
    const biWeeklySchedule = (
        paymentSchedule?.data as AdminPaymentScheduleView
    )[1];
    const weeklySchedule = (
        paymentSchedule?.data as AdminPaymentScheduleView
    )[2];
    const exportPDF = (type: AdminPaymentScheduleView) => {
        const unit = 'pt';
        const size = 'A4'; // Use A1, A2, A3 or A4
        const orientation = 'portrait'; // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size);

        doc.setFontSize(15);

        const title = `${type.scheduleType} Schedule`;
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
        doc.save(`${type.scheduleType} schedule.pdf`);
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
