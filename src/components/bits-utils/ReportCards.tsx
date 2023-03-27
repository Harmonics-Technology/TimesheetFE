import {
    Box,
    Button,
    Flex,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import FilterSearch from './FilterSearch';
import Tables from './Tables';
import Link from 'next/link';
import { BsFilter } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';

export const ReportCards = ({ thead, link, data, title, url }) => {
    const router = useRouter();
    const [fromDate, setFromDate] = useState<any>(
        new DateObject().subtract(4, 'days'),
    );
    const [toDate, setToDate] = useState<any>(new DateObject().add(4, 'days'));
    function filterByDate() {
        router.push({
            query: {
                from: fromDate.format('YYYY-MM-DD'),
                to: toDate.format('YYYY-MM-DD'),
            },
        });
    }
    function clearfilter() {
        router.push({ query: { date: '' } });
    }
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            overflow="hidden"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Flex justify="space-between" mb="1rem">
                <Text fontSize="13px" fontWeight="700">
                    {title}
                </Text>
                <Button
                    bgColor="brand.400"
                    color="white"
                    p=".4rem 1rem"
                    fontSize="12px"
                    height="fit-content"
                    // boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                    onClick={() => router.push(url)}
                    // borderRadius="25px"
                >
                    Expand Reports
                </Button>
            </Flex>

            <Flex align="center" justify='flex-end' mb='1rem'>
                <HStack spacing={['0', '.5rem']}>
                    <HStack>
                        <Text
                            mb="0"
                            fontSize=".8rem"
                            fontWeight="600"
                            display={['none', 'block']}
                        >
                            From
                        </Text>

                        <Box
                            marginInlineStart={[
                                '0 !important',
                                '.5rem !important',
                            ]}
                        >
                            <DatePicker
                                value={fromDate}
                                onChange={setFromDate}
                                format="MMM DD, YYYY"
                                render={(value, openCalendar) => {
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
                                            onClick={(value) =>
                                                openCalendar(value)
                                            }
                                        >
                                            <Text mb="0" whiteSpace="nowrap">
                                                {value}
                                            </Text>
                                            <Icon as={FaRegCalendarAlt} />
                                        </HStack>
                                    );
                                }}
                            />
                        </Box>
                    </HStack>
                    <HStack>
                        <Text
                            mb="0"
                            fontSize=".8rem"
                            fontWeight="600"
                            display={['none', 'block']}
                        >
                            To
                        </Text>
                        <Text
                            mb="0"
                            fontSize=".8rem"
                            fontWeight="600"
                            display={['block', 'none']}
                        >
                            -
                        </Text>

                        <DatePicker
                            value={toDate}
                            onChange={setToDate}
                            format="MMM DD, YYYY"
                            render={(value, openCalendar) => {
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
                    </HStack>
                </HStack>
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
            </Flex>

            <Tables tableHead={thead}>
                <Link href={link} key={1}>
                    <>{data}</>
                </Link>
            </Tables>
        </Box>
    );
};
