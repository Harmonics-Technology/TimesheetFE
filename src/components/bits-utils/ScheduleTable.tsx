import {
    TableContainer,
    Thead,
    Tr,
    Tbody,
    Table,
    Box,
    Flex,
    Button,
} from '@chakra-ui/react';
import moment from 'moment';
import React from 'react';
import { AdminPaymentScheduleView, PaymentSchedule } from 'src/services';
import { TableHead, TableData } from './TableData';

export const ScheduleTable = ({
    paymentSchedule,
    exportPDF,
}: {
    paymentSchedule: AdminPaymentScheduleView;
    exportPDF: () => void;
}) => {
    return (
        <Box>
            <TableContainer>
                <Table
                    variant="striped"
                    borderX="2px solid"
                    borderY="2px solid"
                    borderColor="gray.200"
                >
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
                    <Tbody>
                        {paymentSchedule?.schedules?.map(
                            (x: PaymentSchedule, i) => (
                                <Tr key={i}>
                                    <TableData name={++i} />
                                    <TableData
                                        name={moment(x.weekDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(
                                            x.lastWorkDayOfCycle,
                                        ).format('DD/MM/YYYY')}
                                    />
                                    <TableData
                                        name={moment(x.approvalDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                    <TableData
                                        name={moment(x.paymentDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />
                                </Tr>
                            ),
                        )}
                    </Tbody>
                </Table>
            </TableContainer>
            <Flex justify="flex-end" mt="2rem">
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
        </Box>
    );
};