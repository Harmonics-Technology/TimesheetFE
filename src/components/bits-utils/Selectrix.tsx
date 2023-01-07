import { FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react';
import { Control, Controller, FieldError, Path } from 'react-hook-form';
import Select from 'react-select';
interface select {
    options: UserView[];
    customKeys: { key: string | number | boolean; label: string };
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    defaultValue?: string;
}
import dynamic from 'next/dynamic';
import { UserView } from 'src/services';
const Selectrix = dynamic<select>(() => import('react-selectrix'), {
    ssr: false,
});

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    placeholder?: string;
    error: FieldError | undefined;
    label?: string;
    fontSize?: string;
    options: any;
    keyValue: any;
    keyLabel: any;
    control: Control<TFormValues>;
    disabled?: boolean;
    defaultValue?: string;
}
export const SelectrixBox = <TFormValues extends Record<string, any>>({
    name,
    placeholder,
    error,
    label = '',
    fontSize = '.8rem',
    options,
    keyValue,
    keyLabel,
    control,
    disabled,
    defaultValue,
}: FormInputProps<TFormValues>) => {
    return (
        <FormControl isInvalid={error?.type === 'required'}>
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={fontSize}
            >
                {label}
            </FormLabel>

            {/* <Controller
                render={({ field: { onChange } }) => (
                    <Selectrix
                        options={options}
                        placeholder={placeholder}
                        disabled={disabled}
                        defaultValue={defaultValue}
                        customKeys={{
                            key: keys,
                            label: keyLabel,
                        }}
                        onChange={(value) => onChange(value.key)}
                    />
                )}
                name={name}
                control={control}
                rules={{ required: true }}
            /> */}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <Select
                        {...field}
                        options={options}
                        getOptionLabel={keyLabel}
                        getOptionValue={keyValue}
                    />
                )}
            />

            <FormErrorMessage fontSize=".7rem">
                {(error?.type === 'required' && `${label} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
