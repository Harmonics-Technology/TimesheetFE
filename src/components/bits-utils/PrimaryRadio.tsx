import {
    FormControl,
    Text,
    RadioGroup,
    Stack,
    HStack,
    useRadioGroup,
    FormErrorMessage,
} from '@chakra-ui/react';
import { Controller, Path, FieldError, Control } from 'react-hook-form';
import RadioBtn from './RadioBtn';

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    required?: boolean;
    disableLabel?: boolean;
    defaultValue?: any;
    validate?: any;
    label?: string;
    error: FieldError | undefined;
    control: Control<TFormValues>;
    radios?: any;
    value?: string;
}

export const PrimaryRadio = <TFormValues extends Record<string, any>>({
    name,
    label = '',
    error,
    control,
    defaultValue = undefined,
    radios,
    value,
}: FormInputProps<TFormValues>) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'framework',
        defaultValue: defaultValue,
        onChange: console.log,
    });

    const group = getRootProps();
    return (
        <>
            <FormControl
                isInvalid={
                    error?.type === 'required' || error?.message !== undefined
                }
            >
                <Text fontSize="1rem" fontWeight="500">
                    {label}
                </Text>
                <Controller
                    render={({ field }) => (
                        // <HStack justify="space-between" spacing={6}>
                        <HStack
                            aria-label={label}
                            {...field}
                            defaultValue={value}
                            w="full"
                            {...group}
                        >
                            {radios.map((value) => {
                                const radio = getRadioProps({
                                    value: value.text,
                                });
                                return <RadioBtn {...radio}>{value}</RadioBtn>;
                            })}
                        </HStack>
                        // </HStack>
                    )}
                    name={name}
                    control={control}
                />
                <FormErrorMessage fontSize=".7rem" color="red">
                    {(error?.type === 'required' && `${label} is required`) ||
                        error?.message}
                </FormErrorMessage>
            </FormControl>
        </>
    );
};
