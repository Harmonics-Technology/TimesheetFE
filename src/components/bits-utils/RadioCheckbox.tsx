import {
    Box,
    Circle,
    HStack,
    useRadio,
    Text,
    Icon,
    useCheckbox,
} from '@chakra-ui/react';

export default function RadioCheckbox(props) {
    //
    const { getInputProps, getCheckboxProps, state, getLabelProps, htmlProps } =
        useCheckbox(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label">
            <input {...input} />
            <HStack {...htmlProps}>
                <Circle bgColor="#D9D9D9" size="1rem">
                    <Circle
                        {...checkbox}
                        cursor="pointer"
                        size=".6rem"
                        bg={
                            state.isChecked
                                ? props.bg || 'brand.400'
                                : 'transparent'
                        }
                        _focus={{
                            boxShadow: 'outline',
                        }}
                    />
                </Circle>
                <Text
                    {...getLabelProps()}
                    color="#263238"
                    fontSize=".9rem"
                    fontWeight={state.isChecked ? '800' : '500'}
                >
                    {props?.children}
                </Text>
            </HStack>
        </Box>
    );
}
