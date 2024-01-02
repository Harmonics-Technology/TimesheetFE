import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Text,
    Textarea,
} from '@chakra-ui/react';
import {
    FieldError,
    UseFormRegister,
    Path,
    FieldErrorsImpl,
    Merge,
} from 'react-hook-form';

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    placeholder?: string;
    label?: string;
    register: UseFormRegister<TFormValues>;
    error: FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined;
    border?: string;
    required?: boolean;
    disableLabel?: boolean;
    validate?: any;
    icon?: any;
    variant?: string;
    borderColor?: string;
    borderRadius?: string;
    placeholderColor?: string;
    defaultValue: string | number | undefined;
    format?: string;
    value?: string | number | undefined;
    color?: string;
    w?: string;
    h?: string;
    padding?: string;
    fontSize?: string;
}

export const PrimaryTextarea = <TFormValues extends Record<string, any>>({
    name,
    required = false,
    border ,
    label = '',
    register,
    validate = {},
    error,
    disableLabel = false,
    placeholder = '',
    variant = 'outline',
    borderColor = 'gray.300',
    borderRadius = 'md',
    placeholderColor = 'gray.300',
    defaultValue,
    format,
    value,
    icon,
    color,
    w = '100%',
    h,
    fontSize = '.8rem',
    padding,
}: FormInputProps<TFormValues>) => {
    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel color={color || '#33333'}  mt="1rem"  fontSize={fontSize}>
                    {label}
                </FormLabel>
                <Textarea
                    placeholder={placeholder}
                    {...register(name, { required, ...validate })}
                    defaultValue={defaultValue}
                    isDisabled={disableLabel}
                    padding={padding}
                    size="sm"
                    minH={h}
                    resize="none"
                    focusBorderColor="none"
                    _focusVisible={{
                        borderColor: 'gray.300',
                        boxShadow: 'none',
                    }}
                    w={w}
                    // bgColor="rgba(25,25,25,.03)"
                    // borderColor="transparent"
                    borderRadius="5px"
                    border={border}
                    fontSize={fontSize}
                    // boxShadow="0px 0px 9px rgba(0, 127, 130, 0.37)"
                />
                <FormErrorMessage fontSize=".7rem" color="red">
                    {(error?.type === 'required' &&
                        `${label || 'This field'} is required`) ||
                        error?.message}
                </FormErrorMessage>
            </FormControl>
        </>
    );
};
