import { Box, VStack, useToast } from '@chakra-ui/react';
import { NotText } from '@components/bits-utils/NotText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { CurrencySelector } from '@components/bits-utils/CurrencySelector';
import { ControlSettingModel, UserService } from 'src/services';
import { CurrencyTag } from '@components/bits-utils/NewUpdates/CurrencyTag';

export const OrganizationCurrency = ({
    data,
    superAdminId,
    countries,
}: {
    data: any;
    superAdminId: any;
    countries: any;
}) => {
    const toast = useToast();
    const router = useRouter();
    const foundCountry = countries?.find(
        (x) => x.currency === data?.organizationDefaultCurrency,
    );
    const [selectedCountry, setSelectedCountry] = useState<any>(foundCountry);
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: ControlSettingModel) => {
        data.superAdminId = superAdminId;
        data.organizationDefaultCurrency = selectedCountry.currency;
        setLoading(true);
        try {
            const result = await UserService.updateControlSettings(data);
            if (result.status) {
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setSelectedCountry(null);
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <Box
            py="1.5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            {/* <LeaveTab
                tabValue={[
                    {
                        text: 'Organization Project Manager',
                        url: `/account-management/project-managers`,
                    },
                    {
                        text: 'Project Management Settings',
                        url: `/account-management/project-management-settings`,
                    },
                ]}
            /> */}
            <Box mt="0rem" w="70%">
                <NotText title="Please choose your primary currency for your organization" />
            </Box>
            <form>
                <VStack align="flex-start" gap="2rem" w="40%">
                    <CurrencySelector
                        currency={countries}
                        selectedCountry={selectedCountry}
                        setSelectedCountry={setSelectedCountry}
                        searchable={true}
                    />
                    <Box my="1rem" w="full">
                        <ShiftBtn
                            text="Save Currency"
                            bg="brand.400"
                            onClick={() => onSubmit(data)}
                            loading={loading}
                            w="full"
                        />
                    </Box>
                </VStack>
            </form>

            {data?.organizationDefaultCurrency && foundCountry && (
                <Box mt="1rem">
                    <CurrencyTag
                        label="The Primary currency for your organization is"
                        currency={foundCountry?.currency}
                        flag={foundCountry?.flag}
                    />
                </Box>
            )}
        </Box>
    );
};
