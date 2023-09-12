import {
    Box,
    Flex,
    HStack,
    Icon,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Stack,
    Text,
    Tr,
    useDisclosure,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import { UserView } from 'src/services';
import Tables from './Tables';
import { CustomDatePick } from './CustomDatePick';
import { useRouter } from 'next/router';
import { DateObject } from 'react-multi-date-picker';
import { BsDownload, BsFilter } from 'react-icons/bs';
import { ExportReportModal } from './ExportReportModal';

interface TableCardsProps {
    title: string;
    url: string;
    data: any[] | null | undefined;
    thead: any[];
    link: string;
    hasFilter?: boolean;
}
function TableCards({
    title,
    url,
    data,
    thead,
    link,
    hasFilter,
}: TableCardsProps) {
    // console.log({ data });
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [fromDate, setFromDate] = useState<any>(
        new DateObject().subtract(1, 'month'),
    );
    const [toDate, setToDate] = useState<any>(new DateObject());
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
            <Flex
                justify={'space-between'}
                mb="1rem"
                flexWrap="wrap"
                gap="1rem"
            >
                <Text
                    fontWeight="600"
                    fontSize="1rem"
                    opacity=".8"
                    mb="1rem"
                    textTransform="capitalize"
                    color="brand.200"
                >
                    {title}
                </Text>
                {hasFilter && (
                    <Flex gap=".5rem">
                        <HStack>
                            <Text
                                mb="0"
                                fontSize=".8rem"
                                fontWeight="600"
                                display={['none', 'block']}
                            >
                                From
                            </Text>

                            <CustomDatePick
                                date={fromDate}
                                setDate={setFromDate}
                                format="YYYY-MM-DD"
                            />
                        </HStack>
                        <HStack>
                            <Text
                                mb="0"
                                fontSize=".8rem"
                                fontWeight="600"
                                display={['none', 'block']}
                            >
                                TO
                            </Text>

                            <CustomDatePick
                                date={toDate}
                                setDate={setToDate}
                                format="YYYY-MM-DD"
                            />
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
                )}
            </Flex>
            <Tables tableHead={thead}>
                <>{data}</>
            </Tables>
            <Stack direction="column" align="flex-end" mt="1rem">
                {link !== '' && (
                    <Link passHref href={url}>
                        <HStack
                            align="center"
                            color="brand.600"
                            fontSize=".7rem"
                            fontWeight="bold"
                            cursor="pointer"
                        >
                            <Text mb="0">View more</Text>
                            <FaArrowRight />
                        </HStack>
                    </Link>
                )}
                {hasFilter && (
                    <HStack
                        align="center"
                        color="brand.600"
                        fontSize=".7rem"
                        fontWeight="bold"
                        cursor="pointer"
                        onClick={onOpen}
                    >
                        <Text mb="0">Export Report</Text>
                        <Icon as={BsDownload} />
                    </HStack>
                )}
            </Stack>
            {isOpen && (
                <ExportReportModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={thead}
                    record={1}
                    fileName={'Summary Report from Timba'}
                    model="timesheet"
                />
            )}
        </Box>
    );
}

export default TableCards;
