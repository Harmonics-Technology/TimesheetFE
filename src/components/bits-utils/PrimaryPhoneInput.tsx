import { FormLabel, FormControl, Text } from '@chakra-ui/react';
import { Control, Controller, FieldError, Path } from 'react-hook-form';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    required?: boolean;
    validate?: any;
    error: FieldError | undefined;
    label?: string;
    control: Control<TFormValues>;
    fontSize?: string;
    placeholder?: string;
    defaultCountry?: any;
}
export const PrimaryPhoneInput = <TFormValues extends Record<string, any>>({
    name,
    error,
    label = '',
    control,
    fontSize = '.8rem',
    placeholder,
    defaultCountry = 'ca',
}: FormInputProps<TFormValues>) => {
    // const value = control._formValues[name];
    //
    return (
        <>
            <FormControl>
                <FormLabel
                    htmlFor={label}
                    textTransform="capitalize"
                    width="fit-content"
                    fontSize={fontSize}
                >
                    {label}
                </FormLabel>
                <Controller
                    render={({ field: { onChange, value } }) => (
                        <>
                            {/* <PhoneInput
                                international
                                countryCallingCodeEditable={false}
                                defaultCountry={defaultCountry}
                                value={value}
                                placeholder={placeholder}
                                onChange={onChange}
                                className={"phone-input"}
                            /> */}
                            <PhoneInput
                                // country={defaultCountry}
                                // disableCountryCode
                                // enableAreaCodes
                                placeholder={placeholder}
                                value={value}
                                onChange={(phone) => onChange(phone)}
                                enableSearch
                                disableSearchIcon
                                containerClass={'phone-input'}
                                inputClass={'PhoneInputInput'}
                                searchClass={'searchInput'}
                            />
                        </>
                    )}
                    name={name}
                    control={control}
                />
                <Text fontSize=".7rem" color="red">
                    {(error?.type === 'required' && `${label} is required`) ||
                        error?.message}
                    {/* {value
                        ? isValidPhoneNumber(value)
                            ? undefined
                            : "Invalid phone number"
                        : "Phone number required"} */}
                </Text>
            </FormControl>
        </>
    );
};
