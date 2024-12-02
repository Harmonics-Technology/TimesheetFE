import {
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Text,
    Textarea,
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
    h?: any;
    suffix?: JSX.Element;
    prefix?: JSX.Element;
    variant?: any;
    isTextArea?: boolean;
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
    h = '2.6rem',
    suffix,
    prefix,
    variant = 'filled',
    isTextArea,
}: InputProps) {
    return (
        <FormControl w={w}>
            {label && (
                <FormLabel
                    textTransform="capitalize"
                    width="fit-content"
                    fontSize={fontSize}
                >
                    {label}
                </FormLabel>
            )}
            <InputGroup>
                {prefix && prefix}
                {isTextArea ? (
                    <Textarea
                        placeholder={placeholder}
                        variant={variant}
                        onChange={onChange}
                        defaultValue={defaultValue}
                        value={value}
                        borderRadius="0"
                        h={h}
                        readOnly={readonly}
                        userSelect={readonly ? 'none' : 'all'}
                        fontSize={fontSize}
                    ></Textarea>
                ) : (
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
                        h={h}
                        readOnly={readonly}
                        userSelect={readonly ? 'none' : 'all'}
                        fontSize={fontSize}
                    />
                )}
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
