import {
    FormControl,
    Text,
    RadioGroup,
    Stack,
    HStack,
    Box,
    Radio,
} from "@chakra-ui/react";
import {
    Controller,
    UseFormRegister,
    Path,
    FieldError,
    Control,
} from "react-hook-form";

interface FormInputProps<TFormValues extends Record<string, unknown>> {
    name: Path<TFormValues>;
    required?: boolean;
    disableLabel?: boolean;
    validate?: any;
    label?: string;
    error: FieldError | undefined;
    control: Control<TFormValues>;
    radios?: any;
    value?: string;
}

export const PrimaryRadio = <TFormValues extends Record<string, any>>({
    name,
    required = false,
    label = "",
    validate = {},
    error,
    control,
    radios,
    value,
}: FormInputProps<TFormValues>) => {
    return (
        <>
            <FormControl>
                <Controller
                    render={({ field }) => (
                        <HStack justify="space-between" spacing={6}>
                            <RadioGroup
                                aria-label={label}
                                {...field}
                                defaultValue={value}
                                w="full"
                            >
                                <Stack
                                    direction={["row", "row"]}
                                    w="full"
                                    align="center"
                                    spacing={["1.25rem", "1rem"]}
                                >
                                    {radios.map(({ label, val }) => (
                                        <Radio
                                            value={val}
                                            key={val}
                                            className="radio"
                                            fontSize=".8rem"
                                        >
                                            {label}
                                        </Radio>
                                    ))}
                                </Stack>
                            </RadioGroup>
                        </HStack>
                    )}
                    name={name}
                    control={control}
                />
            </FormControl>
            <Text fontSize=".7rem" color="red">
                {(error?.type === "required" && `This Field is required`) ||
                    error?.message}
            </Text>
        </>
    );
};
