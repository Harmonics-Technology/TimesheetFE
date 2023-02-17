import { Box, Flex, FormLabel, Spinner, Text } from '@chakra-ui/react';
import { Widget } from '@uploadcare/react-widget';
import React from 'react';

function UploadCareWidget({ refs, filename, loading, uploadFunction, label }) {
    return (
        <Box minW='0'>
            <FormLabel
                textTransform="capitalize"
                width="fit-content"
                fontSize=".8rem"
            >
                {label}
            </FormLabel>

            <Flex
                outline="1px solid"
                outlineColor="gray.300"
                h="2.6rem"
                align="center"
                pr="1rem"
                w="full"
                // justifyContent="space-between"
            >
                <Flex
                    bgColor="#f5f5f5"
                    fontSize=".8rem"
                    px="1rem"
                    h="full"
                    align="center"
                    cursor="pointer"
                    my="auto"
                    fontWeight="600"
                    onClick={() => refs.current.openDialog()}
                >
                    <Text noOfLines={1} mb="0">
                        Choose File
                    </Text>
                </Flex>

                {loading ? (
                    <Flex align="center">
                        <Text mb="0" fontStyle="italic" mr="1rem">
                            ...loading data info
                        </Text>
                        <Spinner />
                    </Flex>
                ) : (
                    <Text noOfLines={1} my="auto" px=".5rem">
                        {filename || 'No File Chosen'}
                    </Text>
                )}
            </Flex>
            <Box display="none">
                <Widget
                    publicKey="fda3a71102659f95625f"
                    clearable
                    onFileSelect={uploadFunction}
                    ref={refs}
                    systemDialog={true}
                    inputAcceptTypes={'.docx,.pdf, .doc'}
                />
            </Box>
        </Box>
    );
}

export default UploadCareWidget;
