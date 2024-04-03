import {
    FormControl,
    FormErrorMessage,
    FormLabel,
    GridItem,
    Text,
} from '@chakra-ui/react';
import useOnClickOutside from '@components/generics/useClickOutside';
import useWindowSize from '@components/generics/useWindowSize';
import moment from 'moment';
import { useRef, useCallback } from 'react';
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
    defaultValue?: any;
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
    required,
}: FormInputProps<TFormValues>) => {
    //
    const size: Size = useWindowSize();
    const isMobile = size.width != null && size.width <= 750;
    const dateRef = useRef<any>();
    const handleDatePickerClose = useCallback(
        () => dateRef.current.closeCalendar(),
        [dateRef],
    );
    useOnClickOutside(dateRef, handleDatePickerClose);

    const format = 'YYYY/MM/DD';

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
                rules={{ required: required }} //optional
                render={({ field: { onChange, value } }) => (
                    <>
                        <DatePicker
                            value={defaultValue || value}
                            ref={dateRef}
                            onChange={(date: any) => {
                                onChange(date.format(format));
                            }}
                            format={format}
                            inputClass={
                                error?.type === 'required'
                                    ? 'dateError'
                                    : 'date'
                            }
                            containerClassName="dateWrapper"
                            hideOnScroll={isMobile ? false : true}
                            placeholder={placeholder || 'Please select'}
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
                {(error?.type === 'required' &&
                    `${label || 'This field'} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
