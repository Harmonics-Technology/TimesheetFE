import { Box, Text, HStack, Grid } from '@chakra-ui/react';
import React from 'react';
import { ColoredTag } from '../../Generics/ColoredTag';
import moment from 'moment';
import { CAD } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import {
    TableRow,
    TableData,
    NewTableState,
} from '@components/bits-utils/TableData';
import colorSwatch from '@components/generics/colorSwatch';
import { BiTask } from 'react-icons/bi';
import { PiMoneyBold } from 'react-icons/pi';
import { RiBriefcase2Line, RiTimeLine } from 'react-icons/ri';
import { ChartMiniCard } from '../../Dashboard/ChartMiniCard';
import { MiniCards } from '../../Dashboard/MiniCards';
import { ProgressBar } from '../../Generics/ProgressBar';
import { TableBox } from '../../Generics/TableBox';
import { ChartLargeCard } from '../../Dashboard/ChartLargeCard';
import { TopBar } from './TopBar';

export const SingleProjectPage = ({ id, projects }) => {
    const projectSummary = ['Task Name', 'Deadline', 'Team member', 'Workload'];
    const status = 'completed'
    return (
        <Box>
            <TopBar id={id} data={projects} />

            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <MiniCards
                    value={125}
                    title="Total No of Projects"
                    icon={RiBriefcase2Line}
                    color="#2eafa3"
                />
                <MiniCards
                    value={5125}
                    title="Total No of Task"
                    icon={BiTask}
                    color="#FF5B79"
                />
                <MiniCards
                    value={5125}
                    title="Total No of Hours"
                    icon={RiTimeLine}
                    color="#2383BD"
                />
                <MiniCards
                    value={12550}
                    title="Total Budget Spent"
                    icon={PiMoneyBold}
                    color="#F8C200"
                    isPrice
                />
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '2fr 1fr']}
                gap="1.06rem"
            >
                <TableBox title="Upcoming Deadlines" tableHead={projectSummary}>
                    <TableRow>
                        <TableData name="Time Tracking System" />
                        <TableData name={moment().format('DD/MM/YYYY')} />
                        <NewTableState
                            name="Completed"
                            color={colorSwatch('completed')}
                        />
                        <td>
                            <ProgressBar
                                barWidth={80}
                                barColor={
                                    status == 'completed'
                                        ? 'brand.400'
                                        : status == 'due'
                                        ? '#f7e277'
                                        : 'red'
                                }
                            />
                        </td>
                    </TableRow>
                </TableBox>
                <ChartMiniCard
                    title="Project Budget"
                    sub="Last 30 days Jul 6 - Aug 5"
                />
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <ChartMiniCard
                    title="Task Status"
                    sub="Last 30 days Jul 6 - Aug 5"
                />
                <ChartLargeCard
                    title="Number of Task completed"
                    sub="Operational Vs Project Task activity Rate"
                />
            </Grid>
        </Box>
    );
};
