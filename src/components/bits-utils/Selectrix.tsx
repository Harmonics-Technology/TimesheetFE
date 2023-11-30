import {
    FormControl,
    FormErrorMessage,
    FormLabel,
} from '@chakra-ui/react';
import { Control, Controller, FieldError, Path } from 'react-hook-form';
interface select {
    options: [];
    customKeys: { key: string | number | boolean; label: string };
    onChange: (value: any) => void;
    placeholder?: string;
    disabled?: boolean;
    searchable?: boolean;
    onRenderSelection?: any;
    onRenderOption?: any;
}
import dynamic from 'next/dynamic';
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
    keys: any;
    keyLabel: any;
    control: Control<TFormValues>;
    disabled?: boolean;
    renderSelection?: any;
    customOnchange?: any;
    searchable?: boolean;
    renderOption?: any;
    withIcon?: any;
}
export const SelectrixBox = <TFormValues extends Record<string, any>>({
    name,
    placeholder,
    error,
    label = '',
    fontSize = '.8rem',
    options,
    keys,
    keyLabel,
    control,
    disabled,
    renderSelection,
    customOnchange,
    searchable = false,
    renderOption,
}: FormInputProps<TFormValues>) => {
    //
    return (
        <FormControl isInvalid={error?.type === 'required'} minW="0">
            {label && (
                <FormLabel
                    htmlFor={label}
                    textTransform="capitalize"
                    fontSize={fontSize}
                >
                    {label}
                </FormLabel>
            )}

            <Controller
                render={({ field: { onChange } }) => (
                    <Selectrix
                        options={options}
                        placeholder={placeholder}
                        disabled={disabled}
                        customKeys={{
                            key: keys,
                            label: keyLabel,
                        }}
                        onChange={
                            customOnchange
                                ? customOnchange
                                : (value) => onChange(value.key)
                        }
                        searchable={searchable}
                        onRenderSelection={
                            renderSelection ? renderSelection : false
                        }
                        onRenderOption={renderOption}
                    />
                )}
                name={name}
                control={control}
                // rules={{ required: true }}
            />
            {/* <Controller
                control={control}
                defaultValue={options.map((c) => c.value)}
                name={name}
                render={({ field: { onChange, value, ref } }) => (
                    <Select
                        ref={ref}
                        onChange={(val) => onChange(val)}
                        options={options}
                        getOptionLabel={keyLabel}
                        getOptionValue={keys}
                    />
                )}
            /> */}
            <FormErrorMessage fontSize=".7rem">
                {(error?.type === 'required' && `${label || 'This field'} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
