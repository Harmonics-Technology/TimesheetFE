import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
} from '@chakra-ui/react';
import React from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

interface InputProps {
    type?: string;
    icon?: boolean;
    label?: string;
    placeholder?: any;
    passwordVisible?: boolean;
    changeVisibility?: any;
    disableLabel?: boolean;
    onChange?: any;
    defaultValue?: string;
    fontSize?: string;
    value?: any;
    readonly?: any;
    w?: any;
    suffix?: JSX.Element;
    variant?: any;
}
function InputBlank({
    type,
    placeholder,
    icon,
    passwordVisible,
    label,
    changeVisibility,
    disableLabel,
    onChange,
    defaultValue,
    fontSize = '.8rem',
    value,
    readonly,
    w = 'full',
    suffix,
    variant = 'filled',
}: InputProps) {
    return (
        <FormControl w={w}>
            <FormLabel
                textTransform="capitalize"
                width="fit-content"
                fontSize={fontSize}
            >
                {label}
            </FormLabel>
            <InputGroup>
                <Input
                    type={type}
                    placeholder={placeholder}
                    variant={variant}
                    disabled={disableLabel}
                    onChange={onChange}
                    defaultValue={defaultValue}
                    value={value}
                    // borderColor="gray.400"
                    borderRadius="0"
                    h="2.6rem"
                    readOnly={readonly}
                    userSelect={readonly ? 'none' : 'all'}
                    fontSize={fontSize}
                />
                {icon && (
                    <InputRightElement
                        onClick={() => changeVisibility()}
                        cursor="pointer"
                        color="brand.200"
                    >
                        {passwordVisible ? <FaRegEye /> : <FaRegEyeSlash />}
                    </InputRightElement>
                )}
                {suffix && suffix}
            </InputGroup>
            <Text fontSize=".7rem" color="red" />
        </FormControl>
    );
}

export default InputBlank;
