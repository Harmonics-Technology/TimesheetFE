import { Box, HStack, Icon, Text } from '@chakra-ui/react';
import React, { useContext, useRef, useState } from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker, { DateObject } from 'react-multi-date-picker';
import { TableCard } from '../Generics/TableCard';
import { useRouter } from 'next/router';
import { ResourceCapacityView } from 'src/services';
import { TableData, TableRow } from '@components/bits-utils/TableData';
// import Link from 'next/link';
import Pagination from '@components/bits-utils/Pagination';
import { UserContext } from '@components/context/UserContext';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import Cookies from 'js-cookie';

export const ResourceView = ({ resources }) => {
    const [date, setDate] = useState<any>([
        new DateObject().subtract(4, 'days'),
        new DateObject().add(4, 'days'),
    ]);

    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const tableHead = [
        'Team Member',
        'Job Title',
        'Total No Of Projects',
        'Total No of Task',
        'No of Task Completed',
        'Actions',
    ];

    const dateRef = useRef<any>();
    const filterByDate = (value) => {
        router.push({
            query: {
                ...router.query,
                from: value[0].format('YYYY-MM-DD'),
                to: value[1].format('YYYY-MM-DD'),
            },
        });
        dateRef.current.closeCalendar();
    };

    return (
        <Box>
            <Box mb="2rem">
                <ProjectTabs
                    name={[
                        'dashboard',
                        'projects',
                        'operational-task',
                        'resource-capacity',
                    ]}
                />
            </Box>
            <HStack pb="1rem" justify="space-between">
                <Text fontSize="1rem" color="#263238" fontWeight={500}>
                    Resource Capacity Overview
                </Text>
                <DatePicker
                    value={date}
                    onChange={setDate}
                    range
                    ref={dateRef}
                    onPropsChange={(e) =>
                        // @ts-ignore
                        e?.value?.length > 1 && filterByDate(e?.value)
                    }
                    format="MMM DD, YYYY"
                    render={(stringDates, openCalendar) => {
                        const from = stringDates[0] || '';
                        const to = stringDates[1] || '';
                        const value =
                            from && to
                                ? from + ' - ' + to
                                : from + ' - ' + from;
                        return (
                            <HStack
                                w="fit-content"
                                px="1rem"
                                h="2.5rem"
                                justifyContent="center"
                                alignItems="center"
                                border="1px solid"
                                borderColor="#a6a6a6"
                                color="gray.500"
                                boxShadow="sm"
                                borderRadius="7px"
                                cursor="pointer"
                                fontSize=".9rem"
                                bgColor="white"
                                onClick={openCalendar}
                            >
                                <Icon as={FaRegCalendarAlt} />
                                <Text mb="0" whiteSpace="nowrap">
                                    {value}
                                </Text>
                            </HStack>
                        );
                    }}
                />
            </HStack>
            <Box>
                <TableCard tableHead={tableHead}>
                    {resources?.value?.map((x: ResourceCapacityView) => {
                        const viewResource = () => {
                            Cookies.set('userName', x.name as string);
                            router.push(
                                `/${role}/project-management/resource-capacity/${x.userId}`,
                            );
                        };

                        return (
                            <TableRow key={x.userId}>
                                {/* <Link
                                    passHref
                                    href={`/${role}/project-management/resources/${x.userId}`}
                                > */}
                                <TableData
                                    name={x?.name}
                                    fontWeight="500"
                                    full
                                    breakWord
                                    // onClick={viewResource}
                                />

                                <TableData
                                    name={x?.jobTitle}
                                    fontWeight="500"
                                    full
                                    breakWord
                                    // onClick={viewResource}
                                />
                                <TableData
                                    name={x?.totalNumberOfProject}
                                    fontWeight="500"
                                    // onClick={viewResource}
                                />
                                <TableData
                                    name={x?.totalNumberOfTask}
                                    fontWeight="500"
                                    // onClick={viewResource}
                                />
                                <TableData
                                    name={x?.noOfTaskCompleted}
                                    fontWeight="500"
                                    // onClick={viewResource}
                                />

                                <td>
                                    {/* <Link
                                            passHref
                                            href={`/${role}/project-management/resource-capacity/${x.userId}`}
                                        > */}
                                    <ShiftBtn
                                        text="View More"
                                        h="31px"
                                        fontSize="12px"
                                        px="1rem"
                                        onClick={viewResource}
                                    />
                                    {/* </Link> */}
                                </td>
                                {/* </Link> */}
                            </TableRow>
                        );
                    })}
                </TableCard>
                <Pagination data={resources} loadMore />
            </Box>
        </Box>
    );
};
