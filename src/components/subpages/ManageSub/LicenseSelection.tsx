import { Box, FormLabel } from '@chakra-ui/react';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import React from 'react';

export const LicenseSelection = ({
    addLicense,
    selectedLicense,
    removeLicense,
    errors,
    subs,
    isRequired,
}: {
    addLicense: any;
    selectedLicense: any;
    removeLicense: any;
    errors: any;
    subs: any;
    isRequired?: any;
}) => {
    return (
        <Box
            w="full"
            // borderTop="1px solid"
            // borderColor="gray.300"
            // mt="1.5rem"
            // pt="1rem"
        >
            <FormLabel
                textTransform="capitalize"
                width="fit-content"
                fontSize=".8rem"
            >
                Assign License{' '}
                <span style={{ color: 'red' }}>{isRequired && '*'}</span>
            </FormLabel>
            <CustomSelectBox
                data={subs}
                updateFunction={addLicense}
                items={selectedLicense}
                customKeys={{
                    key: 'subscriptionId',
                    label: 'subscriptionType',
                    used: 'noOfLicenceUsed',
                    total: 'noOfLicensePurchased',
                }}
                removeFn={removeLicense}
                id="A License"
                extraField={'users in total assigned to this license'}
                checkbox
                single
                searchable={false}
                placeholder="Select the License you want to assign to this user"
                error={errors.clientSubscriptionId}
            />
        </Box>
    );
};
