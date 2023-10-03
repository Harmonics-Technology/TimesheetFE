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
    flexDir?: any;
    gap?: any;
    bg?: any;
}

export const PrimaryRadio = <TFormValues extends Record<string, any>>({
    name,
    label = '',
    error,
    control,
    defaultValue = undefined,
    radios,
    value,
    flexDir = 'row',
    gap = '1rem',
    bg,
}: FormInputProps<TFormValues>) => {
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'framework',
        defaultValue: defaultValue,
        onChange: void 0,
    });

    const group = getRootProps();
    return (
        <>
            <FormControl
                isInvalid={
                    error?.type === 'required' || error?.message !== undefined
                }
            >
                <Text fontSize="1rem" fontWeight="500" mb=".7rem">
                    {label}
                </Text>
                <Controller
                    render={({ field }) => (
                        // <HStack justify="space-between" spacing={6}>
                        <HStack
                            aria-label={label}
                            {...field}
                            defaultValue={defaultValue}
                            w="full"
                            {...group}
                            spacing="0"
                            gap={gap}
                            flexDir={flexDir}
                            align="flex-start"
                        >
                            {radios.map((value, index) => {
                                const radio = getRadioProps({ value });
                                return (
                                    <RadioBtn {...radio} key={index} bg={bg}>
                                        {value}
                                    </RadioBtn>
                                );
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
