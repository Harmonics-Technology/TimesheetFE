import { Box, Circle, HStack, useRadio, Text, Icon } from '@chakra-ui/react';

export default function RadioBtn(props) {
    // console.log({ props });
    const { getInputProps, getCheckboxProps } = useRadio(props);

    const input = getInputProps();
    const checkbox = getCheckboxProps();

    return (
        <Box as="label">
            <input {...input} />
            <HStack>
                <Circle
                    {...checkbox}
                    cursor="pointer"
                    size="1rem"
                    bgColor="#D9D9D9"
                    _checked={{
                        bg: 'brand.400',
                    }}
                    _focus={{
                        boxShadow: 'outline',
                    }}
                />
                <Text fontSize=".8rem" color="#263238" fontWeight="500" mb="0">
                    {props?.children}
                </Text>
            </HStack>
        </Box>
    );
}
