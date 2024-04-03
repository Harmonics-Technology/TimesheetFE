import { useRadioGroup } from '@chakra-ui/react';

export const StaticRadio = ({ radios, setClientType }) => {
    const updateClientField = (value: any) => {
        if (value == 'For me') {
            setClientType(false);
        } else {
            setClientType(true);
        }
    };
    const { getRootProps, getRadioProps } = useRadioGroup({
        name: 'selection',
        defaultValue: radios[0],
        onChange: (value) => updateClientField(value),
    });

    const group = getRootProps();
    return { group, getRadioProps };
};
