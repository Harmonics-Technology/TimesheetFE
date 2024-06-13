import { Box, FormLabel, Select } from '@chakra-ui/react';
import React from 'react';

export const SelectBlank = ({
    label,
    fontSize = '.8rem',
    placeholder,
    defaultValue,
    id,
    options,
    onChange,
    value,
    w = 'full',
}: {
    label?: any;
    fontSize?: any;
    placeholder?: any;
    defaultValue?: any;
    id?: any;
    options: any;
    onChange?: any;
    value?: any;
    w?: any;
}) => {
    return (
        <Box w={w}>
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={fontSize}
            >
                {label}
            </FormLabel>
            <Select
                w="full"
                border="1px solid"
                borderColor="gray.400"
                borderRadius="0px"
                height="2.6rem"
                fontSize=".9rem"
                textTransform="capitalize"
                placeholder={placeholder}
                defaultValue={defaultValue}
                onChange={onChange}
                value={value}
                id={id}
                color="gray.500"
                // isReadOnly
            >
                {/* <option disabled>{placeholder}</option> */}
                {options}
            </Select>
        </Box>
    );
};
