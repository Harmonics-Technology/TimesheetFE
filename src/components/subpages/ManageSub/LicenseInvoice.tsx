import { Box, Flex, Text, Tr } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableData,
    TableInvoiceSub,
    TableStatus,
} from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { CAD } from '@components/generics/functions/Naira';
import moment from 'moment';
import { LicenseNav } from './LicenseNav';

export const LicenseInvoices = ({ data }) => {
    return (
        <Box>
            <LicenseNav />
            <Box mt="1rem" bgColor="white" p="1rem" borderRadius="8px">
                <Flex justify="space-between" mb="1rem">
                    <Text fontWeight="500" color="#2d3748">
                        Invoice
                    </Text>
                    <SubSearchComponent />
                </Flex>

                <Tables
                    tableHead={[
                        'Invoice ID',
                        'Invoice Date',
                        'Total Amount',
                        'Status',
                        'Billing Account',
                        'Download PDF',
                        // 'Actions',
                    ]}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {data?.value?.map((x: any) => (
                            <Tr key={x.id}>
                                <TableData name={x.subscription?.name} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />

                                <TableData name={CAD(x.totalAmount)} />
                                <TableStatus
                                    name={x.status == 'ACTIVE' ? true : false}
                                />
                                <TableData name={`${x.duration} `} />
                                <TableInvoiceSub url={x} />
                            </Tr>
                        ))}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
