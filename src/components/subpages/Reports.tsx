import { Grid, Tr } from '@chakra-ui/react';
import { ReportCards } from '@components/bits-utils/ReportCards';
import {
    TableData,
    TableState,
    TableInvoiceActions,
} from '@components/bits-utils/TableData';
import { CUR } from '@components/generics/functions/Naira';
import { Round } from '@components/generics/functions/Round';
import { formatDate } from '@components/generics/functions/formatDate';
import React from 'react';
import { InvoiceView } from 'src/services';

export const Reports = ({ metrics }) => {
    return (
        <Grid
            templateColumns={[
                'repeat(1, minmax(0, 1fr))',
                'repeat(2, minmax(0, 1fr))',
            ]}
            gap="1rem"
        >
            <ReportCards
                title="Payroll Report"
                url="financials/payrolls"
                data={metrics?.data?.recentPayrolls
                    ?.slice(0, 4)
                    .map((x: InvoiceView, i) => (
                        <Tr key={i}>
                            <TableData
                                name={
                                    x.payrollGroupName ||
                                    x.paymentPartnerName ||
                                    x.name
                                }
                            />
                            <TableData name={formatDate(x.startDate)} />
                            <TableData name={formatDate(x.endDate)} />
                            <TableData name={CUR(Round(x.totalAmount))} />
                        </Tr>
                    ))}
                thead={['Name', 'Start Date', 'End Date', 'Total']}
                link="/"
            />
            <ReportCards
                title="Payroll Report"
                url="financials/payrolls"
                data={metrics?.data?.recentPayrolls
                    ?.slice(0, 4)
                    .map((x: InvoiceView, i) => (
                        <Tr key={i}>
                            <TableData
                                name={
                                    x.payrollGroupName ||
                                    x.paymentPartnerName ||
                                    x.name
                                }
                            />
                            <TableData name={formatDate(x.startDate)} />
                            <TableData name={formatDate(x.endDate)} />
                            <TableData name={CUR(Round(x.totalAmount))} />
                        </Tr>
                    ))}
                thead={['Name', 'Start Date', 'End Date', 'Total']}
                link="/"
            />
        </Grid>
    );
};
