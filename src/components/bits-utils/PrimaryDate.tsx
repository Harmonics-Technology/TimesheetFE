import { FormControl, FormLabel, GridItem, Text } from "@chakra-ui/react";
import { Controller, Path, FieldError, Control } from "react-hook-form";
import DatePicker from "react-multi-date-picker";

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    required?: boolean;
    label?: string;
    error: FieldError | undefined;
    control: Control<TFormValues>;
    fontSize?: string;
    placeholder?: string;
}

export const PrimaryDate = <TFormValues extends Record<string, any>>({
    name,
    label = "",
    error,
    control,
    fontSize = ".8rem",
    placeholder,
}: FormInputProps<TFormValues>) => {
    return (
        <GridItem>
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
                    control={control}
                    name={name}
                    rules={{ required: true }} //optional
                    render={({
                        field: { onChange, name, value },
                        formState: { errors }, //optional, but necessary if you want to show an error message
                    }) => (
                        <>
                            <DatePicker
                                value={value || ""}
                                onChange={(date) => {
                                    onChange(date ? date : "");
                                }}
                                format={"DD/MM/YYYY"}
                                inputClass={"date"}
                                containerClassName="dateWrapper"
                                hideOnScroll
                                placeholder={placeholder}
                            />
                        </>
                    )}
                />
            </FormControl>
            <Text fontSize=".7rem" color="red">
                {(error?.type === "required" && `${label} is required`) ||
                    error?.message}
            </Text>
        </GridItem>
    );
};
