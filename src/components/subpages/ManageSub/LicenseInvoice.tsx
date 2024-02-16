import { Box, Flex, HStack, Link, Text, Tr } from '@chakra-ui/react';
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
import { ClientSubscriptionInvoiceViewValue } from 'src/services';
import { AiOutlineDownload } from 'react-icons/ai';

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
                        {data?.value?.map(
                            (x: ClientSubscriptionInvoiceViewValue) => (
                                <Tr key={x.id}>
                                    <TableData name={x.invoiceReference} />
                                    <TableData
                                        name={moment(x.startDate).format(
                                            'DD/MM/YYYY',
                                        )}
                                    />

                                    <TableData
                                        name={CAD(
                                            (x.amountInCent as number) / 100,
                                        )}
                                    />
                                    <TableStatus
                                        name={
                                            x.status == 'active' ? true : false
                                        }
                                    />
                                    <TableData name={`${x.billingAccount} `} />
                                    <td>
                                        <Link
                                            href={x.invoicePDFURL as string}
                                            fontSize=".8rem"
                                            color="brand.400"
                                            fontWeight={700}
                                            target="_blank"
                                        >
                                            <HStack>
                                                <Text>Download Invoice</Text>
                                                <AiOutlineDownload />
                                            </HStack>
                                        </Link>
                                    </td>
                                </Tr>
                            ),
                        )}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
