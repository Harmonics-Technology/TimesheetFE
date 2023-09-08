import { Box, Grid } from '@chakra-ui/react';
import React from 'react';
import { MiniCards } from './MiniCards';
import { ProjectTabs } from './ProjectTabs';
import { RiBriefcase2Line, RiTimeLine } from 'react-icons/ri';
import { BiTask } from 'react-icons/bi';
import { PiMoneyBold } from 'react-icons/pi';
import { ChartMiniCard } from './ChartMiniCard';
import { TableBox } from '../Generics/TableBox';
import {
    NewTableState,
    TableData,
    TableRow,
} from '@components/bits-utils/TableData';
import moment from 'moment';
import colorSwatch from '@components/generics/colorSwatch';
import { ProgressBar } from '../Generics/ProgressBar';
import { ChartLargeCard } from './ChartLargeCard';
import { ProjectModel } from 'src/services';

export const Dashboard = () => {
    const status = 'completed';
    const date = 7;
    const projectSummary = ['Project Name', 'Due Date', 'Status', 'Progress'];
    const overdue = ['Project Name', 'Deadline', 'Overdue'];
    return (
        <Box>
            <Box mb="2.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
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
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <ChartMiniCard
                    title="Project Status"
                    sub="Last 30 days Jul 6 - Aug 5"
                />
                <TableBox title="Project summary" tableHead={projectSummary}>
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
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '2fr 1fr']}
                gap="1.06rem"
            >
                <ChartLargeCard
                    title="Statistics"
                    sub="Operational Vs Project Task activity Rate"
                />
                <ChartMiniCard
                    title="Project Status"
                    sub="Last 30 days Jul 6 - Aug 5"
                />
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <TableBox title="Overdue Projects" tableHead={overdue}>
                    <TableRow>
                        <TableData name="Time Tracking System" />
                        <TableData name={moment().format('DD/MM/YYYY')} />
                        <TableData
                            name={`${date} days`}
                            fontWeight="600"
                            customColor={
                                date > 7
                                    ? '#ff5b79'
                                    : date <= 7
                                    ? '#f8c200'
                                    : '#afb6e5'
                            }
                        />
                    </TableRow>
                </TableBox>
                <ChartLargeCard title="Statistics" sub="Budget Burn out rate" />
            </Grid>
        </Box>
    );
};
