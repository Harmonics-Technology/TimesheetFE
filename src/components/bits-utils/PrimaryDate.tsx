import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Text,
} from '@chakra-ui/react';
import useWindowSize from '@components/generics/useWindowSize';
import { Controller, Path, FieldError, Control } from 'react-hook-form';
import DatePicker, { DateObject } from 'react-multi-date-picker';

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
    defaultValue?: string;
    disableWeekend?: boolean;
}

interface Size {
    width: number | undefined;
    height: number | undefined;
}

export const PrimaryDate = <TFormValues extends Record<string, any>>({
    name,
    label = '',
    error,
    control,
    fontSize = '.8rem',
    placeholder,
    min,
    max,
    disabled,
    defaultValue,
    disableWeekend,
}: FormInputProps<TFormValues>) => {
    // console.log({ defaultValue });
    const size: Size = useWindowSize();
    const isMobile = size.width != null && size.width <= 750;
    return (
        <FormControl
            isInvalid={
                error?.type === 'required' || error?.message !== undefined
            }
        >
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
                            value={defaultValue || value || new DateObject()}
                            onChange={(date: any) => {
                                onChange(
                                    JSON.stringify(
                                        date?.toDate?.(),
                                    )?.replaceAll('"', ''),
                                );
                            }}
                            format={'DD/MM/YYYY'}
                            inputClass={'date'}
                            containerClassName="dateWrapper"
                            hideOnScroll={isMobile ? false : true}
                            placeholder={placeholder}
                            minDate={min}
                            maxDate={max}
                            disabled={disabled}
                            mapDays={({ date }) => {
                                const isWeekend = [0, 6].includes(
                                    date.weekDay.index,
                                );

                                if (disableWeekend && isWeekend)
                                    return {
                                        disabled: true,
                                        style: { color: '#ccc' },
                                    };
                            }}
                        />
                    </>
                )}
            />
            <FormErrorMessage fontSize=".7rem" color="red">
                {(error?.type === 'required' && `${label} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
