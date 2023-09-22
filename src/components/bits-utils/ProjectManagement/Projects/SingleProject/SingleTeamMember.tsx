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
import { ProjectTaskAsigneeView } from 'src/services';

export const SingleTeamMember = ({ id, teams }: { id: string; teams: any }) => {
    const tableHead = [
        'Task Assigned',
        'Hours spent',
        'Start Date',
        'End Date',
        'Progress Status',
    ];

    const userDetails = teams?.value[0];
    return (
        <Box>
            <TopBar noTitle={true} id={id} />
            <HStack
                justify="space-between"
                pb="1rem"
                borderBottom="1px solid #e5e5e5"
            >
                <TitleText
                    title={userDetails?.user?.fullName}
                    text={userDetails?.user?.email}
                    fontSize="1rem"
                    gap=".1rem"
                />
                <TitleText
                    title={`${userDetails?.hoursLogged} Hrs`}
                    text={'Total Logged Hours'}
                    fontSize="1rem"
                    gap=".1rem"
                />
                <TitleText
                    title={userDetails?.user?.employeeInformation?.jobTitle}
                    text={'IT Department'}
                    fontSize="1rem"
                    gap=".1rem"
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
                    {teams?.value?.map((team: ProjectTaskAsigneeView) => (
                        <TableRow key={team.id}>
                            <TableData
                                name={team?.projectTask?.name}
                                fontWeight="500"
                            />

                            <TableData
                                name={`${
                                    team?.projectTask?.hoursSpent || 0
                                } Hrs`}
                                fontWeight="500"
                            />
                            <TableData
                                name={moment(
                                    team?.projectTask?.startDate,
                                ).format('DD/MM/YYYY')}
                                fontWeight="500"
                            />
                            <TableData
                                name={moment(team?.projectTask?.endDate).format(
                                    'DD/MM/YYYY',
                                )}
                                fontWeight="500"
                            />
                            <td>
                                <ProgressBar
                                    barWidth={team?.projectTask?.progress}
                                    showProgress={true}
                                    barColor={'brand.400'}
                                    leftText={team?.projectTask?.status}
                                    rightText={`${
                                        team?.projectTask?.progress || 0
                                    }%`}
                                />
                            </td>
                        </TableRow>
                    ))}
                </TableCard>
            </Box>
        </Box>
    );
};
