import {
    Box,
    Checkbox,
    FormLabel,
    HStack,
    VStack,
    Text,
} from '@chakra-ui/react';

export const LicenseEditBox = ({
    data,
    extraField,
    items,
    id,
    removeFn,
    checkbox,
    updateFunction,
    customKeys,
}) => {
    const checkBoxFn = (x) => {
        const exist = items?.[customKeys.key] == x.id;
        if (exist) {
            removeFn(x.id);
            return;
        }
    };
    const newFormattedData = data?.map((x: any) => {
        return {
            label: eval(`x.${customKeys.label}`),
            key: x[customKeys.key],
            used: x[customKeys?.used],
            total: x[customKeys.total],
        };
    });

    const selectData = (x: any) => {
        if (checkbox == true) {
            checkBoxFn(x);
        }
        // setSelected(x);
        updateFunction({ [customKeys.key]: x.id, [customKeys.label]: x.label });
        // setIsOpen(false);
    };

    return (
        <Box>
            {newFormattedData?.map((x, i) => (
                <HStack
                    p="11px 0px"
                    key={i}
                    w="full"
                    cursor="pointer"
                    // _hover={{
                    //     bgColor: '#faf7f7',
                    // }}
                    onClick={() =>
                        extraField && x.used == x.total
                            ? void 0
                            : selectData({
                                  id: x.key,
                                  label: x.label,
                              })
                    }
                    align="center"
                >
                    {checkbox && (
                        <Checkbox
                            id={id}
                            isChecked={items?.[customKeys.key] == x.key}
                            colorScheme="brand"
                            pointerEvents="none"
                        />
                    )}
                    <VStack align="flex-start" gap="0rem">
                        <FormLabel
                            noOfLines={1}
                            color="#6a7f9d"
                            fontSize={'14px'}
                            cursor="pointer"
                            htmlFor={id || 'label'}
                            mb="0"
                            pointerEvents="none"
                        >
                            {x.label}
                        </FormLabel>
                        {extraField && (
                            <Text
                                color="#696969"
                                fontSize="13px"
                            >{`${x.used} of ${x.total} ${extraField}`}</Text>
                        )}
                    </VStack>
                </HStack>
            ))}
        </Box>
    );
};

// import React from 'react';

// export const LicenseEditBox = () => {
//     return <div>LicenseEditBox</div>;
// };
