import { LicenseInvoices } from '@components/subpages/ManageSub/LicenseInvoice';
import React from 'react';

const invoices = ({ data }: { data }) => {
    return <LicenseInvoices data={data} />;
};

export default invoices;
