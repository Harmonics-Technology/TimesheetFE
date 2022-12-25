import { Flex } from '@chakra-ui/react';
import React from 'react';

interface ICheckbox {
    checked: any;
    onChange: any;
    label?: string;
}

function Checkbox({ checked, onChange, label }: ICheckbox) {
    return (
        <Flex fontSize=".9rem" gap=".9rem" fontWeight="500">
            <label>{label}</label>
            <input
                type="checkbox"
                className="formcheck"
                checked={checked}
                onChange={onChange}
                value={checked}
            />
        </Flex>
    );
}

export default Checkbox;
