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
import { DashboardProjectView } from 'src/services';
import BudgetChart from '@components/bits-utils/Charts/BudgetChart';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';
import { BarChart } from '@components/bits-utils/Charts/BarChart';
import { Round } from '@components/generics/functions/Round';

export const SingleProjectPage = ({
    id,
    projects,
    metrics,
}: {
    id: string;
    projects: any;
    metrics: DashboardProjectView;
}) => {
    const projectSummary = ['Task Name', 'Deadline', 'Team member', 'Workload'];
    return (
        <Box>
            <TopBar id={id} data={projects} />

            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <MiniCards
                    value={metrics.resources}
                    title="Resources"
                    icon={RiBriefcase2Line}
                    color="#2eafa3"
                />
                <MiniCards
                    value={metrics.totalTasks}
                    title="Total No of Task"
                    icon={BiTask}
                    color="#FF5B79"
                />
                <MiniCards
                    value={metrics.totalHours}
                    title="Total No of Hours"
                    icon={RiTimeLine}
                    color="#2383BD"
                />
                <MiniCards
                    value={metrics.budgetSpentAndRemain?.budgetSpent}
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
                    {metrics?.upcomingDeadlines?.map((x) => {
                        const status = x.status?.toLowerCase();
                        return (
                            <TableRow key={x.id}>
                                <TableData name={x.name} />
                                <TableData
                                    name={moment(x.endDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
                                <NewTableState
                                    name={status}
                                    color={colorSwatch(status)}
                                />
                                <td>
                                    <ProgressBar
                                        barWidth={x.progress}
                                        barColor={
                                            status == 'completed'
                                                ? 'brand.400'
                                                : status == 'ongoing'
                                                ? '#f7e277'
                                                : 'red'
                                        }
                                        showProgress
                                        rightText={`${Round(x.progress)}%`}
                                    />
                                </td>
                            </TableRow>
                        );
                    })}
                </TableBox>
                <ChartMiniCard
                    title="Project Budget"
                    sub="Last 30 days Jul 6 - Aug 5"
                >
                    <BudgetChart
                        chart={[
                            {
                                name: 'Budget spent',
                                count: metrics.budgetSpentAndRemain
                                    ?.budgetSpent,
                            },
                            {
                                name: 'Remaining Budget',
                                count: metrics.budgetSpentAndRemain
                                    ?.budgetRemain,
                            },
                        ]}
                        total={metrics.budgetSpentAndRemain?.budget}
                    />
                </ChartMiniCard>
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <ChartMiniCard
                    title="Task Status"
                    sub="Last 30 days Jul 6 - Aug 5"
                >
                    <DoughnutChart
                        chart={[
                            {
                                name: 'Not started',
                                count: metrics.projectTaskStatus?.notStarted,
                            },
                            {
                                name: 'Completed',
                                count: metrics.projectTaskStatus?.completed,
                            },
                            {
                                name: 'Ongoing',
                                count: metrics.projectTaskStatus?.ongoing,
                            },
                        ]}
                    />
                </ChartMiniCard>
                <ChartLargeCard
                    title="Number of Task completed"
                    sub="Operational Vs Project Task activity Rate"
                >
                    <BarChart chart={metrics.monthlyCompletedTasks} />
                </ChartLargeCard>
            </Grid>
        </Box>
    );
};
