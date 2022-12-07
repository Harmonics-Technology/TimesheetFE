import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    Select,
} from "@chakra-ui/react";
import { FieldError, Path, UseFormRegister } from "react-hook-form";

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    placeholder: string;
    register: UseFormRegister<TFormValues>;
    required?: boolean;
    validate?: any;
    error: FieldError | undefined;
    label?: string;
    fontSize?: string;
    options: any;
    defaultValue?: any;
    id?: any;
}
export const PrimarySelect = <TFormValues extends Record<string, any>>({
    name,
    placeholder,
    register,
    required = false,
    validate = {},
    error,
    label = "",
    fontSize = ".8rem",
    options,
    defaultValue,
    id,
}: FormInputProps<TFormValues>) => {
    return (
        <FormControl isInvalid={error?.type === "required"}>
            <FormLabel
                htmlFor={label}
                textTransform="capitalize"
                fontSize={fontSize}
            >
                {label}
            </FormLabel>
            <Select
                {...register(name, { required, ...validate })}
                w="full"
                border="1px solid grey"
                borderRadius="5px"
                height="3rem"
                fontSize=".9rem"
                textTransform="capitalize"
                placeholder={placeholder}
                defaultValue={defaultValue}
                id={id}
                // isReadOnly
            >
                {/* <option disabled>{placeholder}</option> */}
                {options}
            </Select>
            <FormErrorMessage fontSize=".7rem">
                {(error?.type === "required" && `${label} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
