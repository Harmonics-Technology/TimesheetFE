import {
    FormControl,
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
    type?: string;
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
    fontsize?: string;
}

export const PrimaryTextarea = <TFormValues extends Record<string, any>>({
    name,
    required = false,
    type = 'text',
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
    fontsize = '.8rem',
    padding,
}: FormInputProps<TFormValues>) => {
    return (
        <>
            <FormControl isInvalid={!!error}>
                <FormLabel color={color || '#33333'} fontSize=".8rem" mt="1rem">
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
                    fontSize={fontsize}
                    focusBorderColor="none"
                    _focusVisible={{
                        borderColor: 'gray.300',
                        boxShadow: 'none',
                    }}
                    w={w}
                    // bgColor="rgba(25,25,25,.03)"
                    // borderColor="transparent"
                    borderRadius="5px"
                    // boxShadow="0px 0px 9px rgba(0, 127, 130, 0.37)"
                />
                <Text fontSize=".7rem" color="red">
                    {(error?.type === 'required' && `${label} is required`) ||
                        error?.message}
                </Text>
            </FormControl>
        </>
    );
};
