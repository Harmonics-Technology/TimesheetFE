import { Box, HStack, Image, Text, Select, Flex, Icon } from '@chakra-ui/react';
import React from 'react';
import { TopBar } from './TopBar';
import TitleText from '@components/bits-utils/TitleText';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import moment from 'moment';
import { BiSolidPencil } from 'react-icons/bi';
import { FaEye } from 'react-icons/fa';
import { TableCard } from '../../Generics/TableCard';
import { ProgressBar } from '../../Generics/ProgressBar';

export const SingleTeamMember = () => {
    const tableHead = [
        'Task Assigned',
        'Hours spent',
        'Start Date',
        'End Date',
        'Progress Status',
    ];
    return (
        <Box>
            <TopBar noTitle={true} />
            <HStack
                justify="space-between"
                pb="1rem"
                borderBottom="1px solid #e5e5e5"
            >
                <TitleText
                    title="Jamila Rufai"
                    text={'jamila.rufai@sample.com'}
                    fontSize="1rem"
                />
                <TitleText
                    title="40 Hours"
                    text={'Total Logged Hours'}
                    fontSize="1rem"
                />
                <TitleText
                    title="Business Analyst"
                    text={'IT Department'}
                    fontSize="1rem"
                />
            </HStack>
            <Box>
                <HStack py="1rem" justify="space-between">
                    <HStack>
                        <HStack w="full">
                            <Image
                                src="/assets/filter.png"
                                alt="filter"
                                w="1.1rem"
                                h="1.1rem"
                            />
                            <Text
                                fontSize=".8rem"
                                color="#2d3748"
                                fontWeight={500}
                            >
                                Filter By
                            </Text>
                        </HStack>
                        <Select fontSize=".8rem" w="full">
                            <option value="option1">Recent Task</option>
                        </Select>
                    </HStack>

                    <HStack>
                        <SubSearchComponent />
                    </HStack>
                </HStack>
                <TableCard tableHead={tableHead}>
                    <TableRow>
                        <TableData
                            name="Requirement Gathering"
                            fontWeight="500"
                        />

                        <TableData name={`${50} Hrs`} fontWeight="500" />
                        <TableData
                            name={moment().format('DD/MM/YYYY')}
                            fontWeight="500"
                        />
                        <TableData
                            name={moment().format('DD/MM/YYYY')}
                            fontWeight="500"
                        />
                        <td>
                            <ProgressBar
                                barWidth={100}
                                showProgress={true}
                                barColor={'brand.400'}
                                leftText="Completed"
                                rightText={`${100}%`}
                            />
                        </td>
                    </TableRow>
                </TableCard>
            </Box>
        </Box>
    );
};
