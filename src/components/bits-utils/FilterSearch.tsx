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
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { FaRegCalendarAlt } from 'react-icons/fa';

function FilterSearch({
    hide = false,
    hides = false,
}: {
    hide?: boolean;
    hides?: boolean;
}) {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const [date, setDate] = useState<any>([
        new DateObject().subtract(4, 'days'),
        new DateObject().add(4, 'days'),
    ]);
    const [openDateFilter, setOpenDateFilter] = useState(false);
    const selectedDate = date.map((x) => x.year + '-' + x.month + '-' + x.day);

    // console.log({ selectedDate, date });
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
                from: selectedDate[0],
                to: selectedDate[1],
            },
        });
    }
    function clearfilter() {
        router.push({ query: { date: '' } });
    }

    return (
        <>
            <Flex
                justify="space-between"
                align={['unset', 'center']}
                mb="1.5rem"
                flexDirection={['column', 'row']}
            >
                <HStack align="flex-end">
                    <Box
                        fontSize=".8rem"
                        w="fit-content"
                        mb={['1rem', '0']}
                        display={hides ? 'box' : 'none'}
                    >
                        <Text noOfLines={1} mb="0">
                            Filter By
                        </Text>
                        <Select
                            w="fit-content"
                            onChange={(e) => debounced(e.target.value)}
                            borderRadius="0"
                            fontSize=".8rem"
                        >
                            <option value="onshore">Onshore</option>
                            <option value="offshore">Offshore</option>
                        </Select>
                    </Box>
                    <HStack fontSize=".8rem" w="fit-content" mb={['1rem', '0']}>
                        <Select
                            w="fit-content"
                            onChange={(e) => setFilter(e.target.value)}
                            borderRadius="0"
                            fontSize=".8rem"
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </Select>

                        <Text noOfLines={1}>entries per page</Text>
                    </HStack>
                </HStack>
                <HStack
                    gap="1rem"
                    align={['unset', 'center']}
                    flexDirection={['column', 'row']}
                >
                    <Flex align="center" display={hide ? 'none' : 'flex'}>
                        <DatePicker
                            value={date}
                            onChange={setDate}
                            range
                            format="MMM DD, YYYY"
                            render={(stringDates, openCalendar) => {
                                const from = stringDates[0] || '';
                                const to = stringDates[1] || '';
                                const value =
                                    from && to ? from + ' - ' + to : from;
                                return (
                                    <HStack
                                        w="fit-content"
                                        px="1rem"
                                        h="2.5rem"
                                        justifyContent="center"
                                        alignItems="center"
                                        border="1px solid"
                                        borderColor="gray.300"
                                        color="gray.500"
                                        boxShadow="sm"
                                        borderRadius="0"
                                        cursor="pointer"
                                        fontSize=".9rem"
                                        onClick={openCalendar}
                                    >
                                        <Text mb="0" whiteSpace="nowrap">
                                            {value}
                                        </Text>
                                        <Icon as={FaRegCalendarAlt} />
                                    </HStack>
                                );
                            }}
                        />

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

                    <Input
                        type="search"
                        placeholder="search"
                        onChange={(e) => debounced(e.target.value)}
                        borderRadius="0"
                    />
                </HStack>
            </Flex>
        </>
    );
}

export default FilterSearch;
