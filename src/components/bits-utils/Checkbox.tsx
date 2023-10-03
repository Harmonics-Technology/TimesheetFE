import { Flex, FormControl, FormLabel, Input } from '@chakra-ui/react';
import React from 'react';

interface ICheckbox {
    checked: any;
    onChange: any;
    label?: string;
    mb?: string;
    disabled?: boolean;
    dir?: any;
    color?: any;
    className?: any;
}

function Checkbox({
    checked,
    onChange,
    label,
    mb,
    disabled,
    dir = 'ltr',
    color,
    className = 'formcheck',
}: ICheckbox) {
    return (
        <FormControl w="auto">
            <Flex gap=".9rem" fontWeight="500" mb={mb} color={color}>
                {dir == 'ltr' && (
                    <FormLabel fontSize=".9rem" m="0" htmlFor={label}>
                        {label}
                    </FormLabel>
                )}
                <input
                    type="checkbox"
                    className={className}
                    checked={checked}
                    onChange={onChange}
                    disabled={disabled}
                    value={checked}
                    id={label}
                />
                {dir == 'rtl' && (
                    <FormLabel fontSize=".9rem" m="0" htmlFor={label}>
                        {label}
                    </FormLabel>
                )}
            </Flex>
        </FormControl>
    );
}

export default Checkbox;
