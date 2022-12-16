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
    min?: any;
    max?: any;
    disabled?: boolean;
}

export const PrimaryDate = <TFormValues extends Record<string, any>>({
    name,
    label = "",
    error,
    control,
    fontSize = ".8rem",
    placeholder,
    min,
    max,
    disabled,
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
                    render={({ field: { onChange, value } }) => (
                        <>
                            <DatePicker
                                value={value || ""}
                                onChange={(date: any) => {
                                    onChange(
                                        JSON.stringify(
                                            date?.toDate?.(),
                                        )?.replaceAll('"', ""),
                                    );
                                }}
                                format={"DD/MM/YYYY"}
                                inputClass={"date"}
                                containerClassName="dateWrapper"
                                hideOnScroll
                                placeholder={placeholder}
                                minDate={min}
                                maxDate={max}
                                disabled={disabled}
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
