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
import { formatDate } from '@components/generics/functions/formatDate';

export const ScheduleTable = ({
    paymentSchedule,
    exportPDF,
}: {
    paymentSchedule: AdminPaymentScheduleView | undefined;
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
                    <Tbody>
                        {paymentSchedule?.schedules?.map(
                            (x: PaymentSchedule, i) => (
                                <Tr key={i}>
                                    <TableData name={++i} />
                                    <TableData name={formatDate(x.weekDate)} />
                                    <TableData
                                        name={formatDate(x.lastWorkDayOfCycle)}
                                    />
                                    <TableData
                                        name={formatDate(x.approvalDate)}
                                    />
                                    <TableData
                                        name={formatDate(x.paymentDate)}
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
