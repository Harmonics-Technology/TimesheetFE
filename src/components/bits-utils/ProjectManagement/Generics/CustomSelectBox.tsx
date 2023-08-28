import {
    Box,
    Checkbox,
    Flex,
    FormLabel,
    HStack,
    Icon,
    Input,
    Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { MdOutlineArrowDropDown } from 'react-icons/md';

export const CustomSelectBox = ({
    h,
    fontSize,
    data,
    updateFunction,
    items,
    placeholder = 'Please select',
    customKeys = { label: 'label', key: 'key' },
    id,
    checkbox = false,
    removeFn,
}: {
    h?: string;
    fontSize?: string;
    data: any;
    updateFunction: any;
    items: any;
    placeholder?: any;
    customKeys?: any;
    id?: string;
    checkbox?: boolean;
    removeFn?: any;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any>();
    const dataAsFiltered = data.filter(
        (x) => !items?.some((user) => user.id === x.id),
    );
    const newFormattedData = dataAsFiltered.map((x: any) => {
        return { label: x[customKeys.label], key: x[customKeys.key] };
    });
    const [newData, setNewData] = useState(newFormattedData);
    const checkBoxFn = (x) => {
        const exist = items?.some((e) => e.id == x.id);
        if (exist) {
            removeFn(x.id);
            return;
        }
    };
    const selectData = (x: any) => {
        console.log({ x });
        if (checkbox == true) {
            checkBoxFn(x);
        }
        setSelected(x);
        updateFunction({ [customKeys.key]: x.id, [customKeys.label]: x.label });
        setIsOpen(false);
    };

    const selectedItems = items.map((x) => x[customKeys.label]).join(', ');

    const search = (e: any) => {
        const filteredData = newFormattedData.filter((x: any) => {
            return x.label.toLowerCase().includes(e.target.value.toLowerCase());
        });
        setNewData(filteredData);
    };

    useEffect(() => {
        if (!checkbox) {
            setNewData(newFormattedData);
        }
    }, [selected]);
    return (
        <Box w="full" pos="relative">
            <Flex
                justify="space-between"
                w="full"
                border="1px solid #e5e5e5"
                h={h || '2.6rem'}
                align="center"
                px=".5rem"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Text noOfLines={1} mb="0" color="#8c8c8c">
                    {selectedItems || selected?.label || placeholder}
                </Text>
                <Icon
                    as={MdOutlineArrowDropDown}
                    onClick={() => setIsOpen(!isOpen)}
                    fontSize="1.5rem"
                    color="#6a7f9d"
                />
            </Flex>
            {isOpen && (
                <Box
                    w="full"
                    boxShadow={'md'}
                    overflowY="auto"
                    maxH="200px"
                    pos="absolute"
                    bgColor="white"
                    zIndex="600"
                >
                    {newData?.length > 0 ? (
                        <>
                            <Input
                                placeholder="Search"
                                fontSize=".7rem"
                                border="1px solid #e5e5e5"
                                borderRadius="0"
                                pos="sticky"
                                top="0"
                                onChange={(e) => search(e)}
                                bgColor="white"
                                w="full"
                                zIndex="9"
                            />
                            {newData?.map((x, i) => (
                                <HStack
                                    p="11px 20px"
                                    key={i}
                                    w="full"
                                    _hover={{
                                        bgColor: '#faf7f7',
                                    }}
                                    onClick={() =>
                                        selectData({
                                            id: x.key,
                                            label: x.label,
                                        })
                                    }
                                    align="center"
                                >
                                    {checkbox && (
                                        <Checkbox
                                            id={id}
                                            isChecked={items?.some(
                                                (e) => e.id == x.key,
                                            )}
                                            colorScheme="brand"
                                        />
                                    )}
                                    <FormLabel
                                        noOfLines={1}
                                        color="#6a7f9d"
                                        fontSize={fontSize || '14px'}
                                        cursor="pointer"
                                        htmlFor={id || 'label'}
                                        mb="0"
                                    >
                                        {x.label}
                                    </FormLabel>
                                </HStack>
                            ))}
                        </>
                    ) : (
                        <Text
                            noOfLines={1}
                            p="11px 20px"
                            color="#6a7f9d"
                            fontSize={fontSize || '14px'}
                            _hover={{
                                bgColor: '#faf7f7',
                            }}
                        >
                            No data available
                        </Text>
                    )}
                </Box>
            )}
        </Box>
    );
};
