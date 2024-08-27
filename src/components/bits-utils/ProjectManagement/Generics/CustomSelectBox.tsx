import {
    Box,
    Checkbox,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Icon,
    Input,
    Text,
    VStack,
} from '@chakra-ui/react';
import useComponentVisible from '@components/generics/useComponentVisible';
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
    error,
    single,
    searchable,
    extraField,
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
    error?: any;
    single?: boolean;
    searchable?: boolean;
    extraField?: any;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState<any>();
    const {
        ref: selectRef,
        isComponentVisible,
        setIsComponentVisible,
    } = useComponentVisible(false);
    const dataAsFiltered = single
        ? data
        : data?.filter((x) => !items?.some((user) => user.id === x.id));
    const newFormattedData = dataAsFiltered?.map((x: any) => {
        return {
            label: eval(`x.${customKeys.label}`),
            key: x[customKeys.key],
            used: x[customKeys?.used],
            total: x[customKeys.total],
        };
    });

    let newData = newFormattedData;

    // const [newData, setNewData] = useState(newFormattedData);
    console.log({ data, dataAsFiltered, newData });
    const checkBoxFn = (x) => {
        const exist = single
            ? items?.[customKeys.key] == x.id
            : items?.some((e) => e?.[customKeys.key] == x.id);
        if (exist) {
            removeFn(x.id);
            return;
        }
    };
    const selectData = (x: any) => {
        if (single) {
            setIsComponentVisible(!isComponentVisible);
        }
        if (checkbox == true) {
            checkBoxFn(x);
        }
        setSelected(x);
        updateFunction({ [customKeys.key]: x.id, [customKeys.label]: x.label });
        // setIsOpen(false);
    };

    const selectedItems = single
        ? items?.[customKeys.label]
        : items.map((x) => x[customKeys.label]).join(', ');

    const search = (e: any) => {
        const filteredData = newFormattedData.filter((x: any) => {
            return x.label.toLowerCase().includes(e.target.value.toLowerCase());
        });
        newData = filteredData;
    };

    useEffect(() => {
        if (!checkbox) {
            newData = newFormattedData;
        }
    }, [selected]);

    return (
        <FormControl
            isInvalid={
                error?.type === 'required' || error?.message !== undefined
            }
        >
            <Box w="full" pos="relative" ref={selectRef}>
                <Flex
                    justify="space-between"
                    w="full"
                    border={
                        error?.type === 'required' ||
                        error?.message !== undefined
                            ? '1px solid red'
                            : '1px solid #e5e5e5'
                    }
                    h={h || '2.6rem'}
                    align="center"
                    px=".5rem"
                    onClick={() => setIsComponentVisible(!isComponentVisible)}
                >
                    <Text noOfLines={1} mb="0" color="#8c8c8c" fontSize=".8rem">
                        {selectedItems || placeholder}
                    </Text>
                    <Icon
                        as={MdOutlineArrowDropDown}
                        onClick={() => setIsOpen(!isOpen)}
                        fontSize="1.5rem"
                        color="#6a7f9d"
                    />
                </Flex>
                {isComponentVisible && (
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
                                {searchable && (
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
                                )}
                                {newData?.map((x, i) => (
                                    <HStack
                                        p="11px 20px"
                                        key={i}
                                        w="full"
                                        _hover={{
                                            bgColor: '#faf7f7',
                                        }}
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
                                                isChecked={
                                                    single
                                                        ? items?.[
                                                              customKeys.key
                                                          ] == x.key
                                                        : items?.some(
                                                              (e) =>
                                                                  e?.[
                                                                      customKeys
                                                                          .key
                                                                  ] == x.key,
                                                          )
                                                }
                                                colorScheme="brand"
                                                pointerEvents="none"
                                            />
                                        )}
                                        <VStack align="flex-start" gap="0rem">
                                            <FormLabel
                                                noOfLines={1}
                                                color="#6a7f9d"
                                                fontSize={fontSize || '14px'}
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
            <FormErrorMessage fontSize=".7rem" color="red">
                {(error?.type === 'required' && `${id} is required`) ||
                    error?.message}
            </FormErrorMessage>
        </FormControl>
    );
};
