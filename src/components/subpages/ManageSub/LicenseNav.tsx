import { Box } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import React from 'react';

export const LicenseNav = () => {
    return (
        <Box
            bgColor="white"
            borderRadius="4px 4px 0 0"
            p=".5rem .5rem 0"
            mb=".5rem"
        >
            <LeaveTab
                tabValue={[
                    {
                        text: 'Licenses',
                        url: `/account-management/manage-subscription`,
                    },
                    {
                        text: 'Billing Information',
                        url: `/account-management/billing-information`,
                    },
                    {
                        text: 'Invoices',
                        url: `/account-management/invoices`,
                    },
                    {
                        text: 'Purchase License Plan',
                        url: `/account-management/purchase-license-plan`,
                    },
                ]}
            />
        </Box>
    );
};
