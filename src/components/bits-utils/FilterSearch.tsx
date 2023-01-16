import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Input,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Select,
    Text,
    Tooltip,
} from '@chakra-ui/react';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { useCallback, useRef, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import MonthYearPicker from 'react-month-year-picker';
import { RxTriangleDown } from 'react-icons/rx';
import { BsFilter } from 'react-icons/bs';
import useClickOutside from '@components/generics/useClickOutside';

function FilterSearch() {
    const [search, setSearch] = useState('');
    const router = useRouter();
    const currentYear = moment(new Date()).format('YYYY');
    const currentMonth = moment(new Date()).format('M');

    const [date, setDate] = useState({
        year: currentYear,
        month: currentMonth,
    });
    const [openDateFilter, setOpenDateFilter] = useState(false);
    const selectedDate = date.month + '-' + date.year;
    const close = useCallback(() => setOpenDateFilter(false), []);
    const popover = useRef(null);
    useClickOutside(popover, close);

    function setFilter(filter: string) {
        router.push({
            query: {
                limit: filter,
            },
        });
    }
    const debounced = useDebouncedCallback(
        // function
        (search) => {
            setSearch(search);
            router.push({
                query: {
                    ...router.query,
                    search: search,
                },
            });
        },
        // delay in ms
        800,
    );

    function filterByDate() {
        router.push({
            query: {
                date: selectedDate,
            },
        });
    }
    function clearfilter() {
        router.push({ query: { date: '' } });
    }
    // console.log({ selectedDate });
    const hideDateFilter =
        router.asPath.includes('timesheets/approval') ||
        router.asPath.includes('timesheets/unapproved');

    return (
        <>
            <Flex
                justify="space-between"
                align={['unset', 'center']}
                my="2.5rem"
                flexDirection={['column', 'row']}
            >
                <HStack fontSize=".8rem" w="fit-content" mb={['1rem', '0']}>
                    <Select
                        w="fit-content"
                        onChange={(e) => setFilter(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="30">30</option>
                    </Select>

                    <Text noOfLines={1}>entries per page</Text>
                </HStack>
                <HStack
                    gap="1rem"
                    align={['unset', 'center']}
                    flexDirection={['column', 'row']}
                >
                    {!hideDateFilter && (
                        <Flex align="center">
                            <Box pos="relative" ref={popover}>
                                <Flex
                                    minW="150px"
                                    px="1rem"
                                    h="2.5rem"
                                    justifyContent="center"
                                    alignItems="center"
                                    border="1px solid"
                                    borderColor="gray.300"
                                    color="gray.500"
                                    boxShadow="sm"
                                    borderRadius="base"
                                    cursor="pointer"
                                    zIndex="2"
                                    onClick={() =>
                                        setOpenDateFilter(!openDateFilter)
                                    }
                                >
                                    {selectedDate}
                                    <Icon
                                        as={RxTriangleDown}
                                        ml="1rem"
                                        pos="relative"
                                    />
                                </Flex>
                                {openDateFilter && (
                                    <Box
                                        pos="absolute"
                                        bgColor="white"
                                        p="1rem"
                                    >
                                        <MonthYearPicker
                                            selectedMonth={date.month}
                                            selectedYear={date.year}
                                            minYear={2022}
                                            maxYear={currentYear}
                                            onChangeYear={(year) =>
                                                setDate({ ...date, year: year })
                                            }
                                            onChangeMonth={(month) =>
                                                setDate({
                                                    ...date,
                                                    month: month,
                                                })
                                            }
                                        />
                                    </Box>
                                )}
                            </Box>
                            {/* <Tooltip hasArrow label="Click to apply filter"> */}
                            <Menu>
                                <MenuButton
                                    ml=".5rem"
                                    // bgColor="red"
                                >
                                    <Icon as={BsFilter} />
                                </MenuButton>
                                <MenuList fontSize=".8rem">
                                    <MenuItem>
                                        <Text
                                            fontWeight="500"
                                            color="brand.200"
                                            mb="0"
                                            onClick={filterByDate}
                                        >
                                            Apply filter
                                        </Text>
                                    </MenuItem>
                                    <MenuItem>
                                        <Text
                                            fontWeight="500"
                                            color="brand.200"
                                            mb="0"
                                            onClick={clearfilter}
                                        >
                                            Clear filter
                                        </Text>
                                    </MenuItem>
                                </MenuList>
                            </Menu>
                            {/* </Tooltip> */}
                        </Flex>
                    )}

                    <Input
                        type="search"
                        placeholder="search"
                        onChange={(e) => debounced(e.target.value)}
                    />
                </HStack>
            </Flex>
        </>
    );
}

export default FilterSearch;
