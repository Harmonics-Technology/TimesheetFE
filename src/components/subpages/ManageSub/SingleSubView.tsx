import { Box, Flex, Link, Text, Tr } from '@chakra-ui/react';
import React from 'react';
import { LicenseProgressUsage } from './LicenseProgressUsage';
import { TableData } from '@components/bits-utils/TableData';
import Tables from '@components/bits-utils/Tables';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';

export const SingleSubView = ({ setShowDetails, data, percentUsed, users }) => {
    const available =
        Number(data?.noOfLicensePurchased) - Number(data?.noOfLicenceUsed);
    return (
        <Box borderRadius="8px" bgColor="white" p="1rem">
            <Text
                color="brand.400"
                fontWeight={500}
                fontSize="14px"
                cursor="pointer"
                onClick={() => setShowDetails(undefined)}
            >
                Back
            </Text>

            <Box pb="1rem" mb="1rem" borderBottom="1px solid #c2cfe0">
                <Text
                    fontSize="16px"
                    fontWeight={500}
                    color="#252f40"
                    my="14px"
                >
                    {data?.subscriptionType}
                </Text>
                <Box
                    borderRadius="8px"
                    border="1px solid #C2CFE0"
                    p=".8rem 1.2rem"
                    w="30%"
                >
                    <LicenseProgressUsage
                        progress={percentUsed}
                        title={available}
                        cont="available"
                        fontSize="32px"
                        fontSizeb="14px"
                        sub={`${data?.noOfLicenceUsed} of ${data?.noOfLicensePurchased} users in total assigned to this license`}
                    />
                </Box>
                <Text
                    fontSize="10px"
                    fontWeight={400}
                    color="#252f40"
                    my="14px"
                >
                    You own at least {available} subscription for this product.{' '}
                    <Link
                        color="brand.400"
                        fontWeight={600}
                        onClick={() => setShowDetails(undefined)}
                    >
                        Manage subscription
                    </Link>
                </Text>
            </Box>

            <Box>
                <Flex justify="space-between" mb="1rem">
                    <Text fontWeight="500" color="#2d3748">
                        Users
                    </Text>
                    <SubSearchComponent />
                </Flex>

                <Tables
                    tableHead={['Name', 'Email']}
                    bg="brand.400"
                    color="white"
                >
                    <>
                        {users?.value?.map((x: any) => (
                            <Tr key={x.id}>
                                <TableData name={x?.fullName} />
                                <TableData name={x?.email} />
                            </Tr>
                        ))}
                    </>
                </Tables>
            </Box>
        </Box>
    );
};
