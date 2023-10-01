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
import {
    DashboardProjectManagementView,
    ProjectModel,
    ProjectView,
} from 'src/services';
import LineChart from '@components/bits-utils/Charts/LineChart';
import BurnOutChart from '@components/bits-utils/Charts/BurnOutChart';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';

export const Dashboard = ({
    metrics,
}: {
    metrics: DashboardProjectManagementView;
}) => {
    console.log({ metrics });
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
                    value={metrics.noOfProject}
                    title="Total No of Projects"
                    icon={RiBriefcase2Line}
                    color="#2eafa3"
                />
                <MiniCards
                    value={metrics.noOfTask}
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
                    value={metrics.totalBudgetSpent}
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
                >
                    <DoughnutChart chart={metrics.budgetBurnOutRates} />
                </ChartMiniCard>
                <TableBox title="Project summary" tableHead={projectSummary}>
                    {metrics.projectSummary?.map((x: ProjectView) => {
                        const status = x.status?.toLowerCase();
                        return (
                            <TableRow key={x.id}>
                                <TableData name={x.name} />
                                <TableData
                                    name={moment(x.startDate).format(
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
                                                : status == 'due'
                                                ? '#f7e277'
                                                : 'red'
                                        }
                                    />
                                </td>
                            </TableRow>
                        );
                    })}
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
                >
                    <LineChart chart={metrics.oprationalAndProjectTasksStats} />
                </ChartLargeCard>
                <ChartMiniCard
                    title="Project Status"
                    sub="Last 30 days Jul 6 - Aug 5"
                >
                    <DoughnutChart chart={metrics.budgetBurnOutRates} />
                </ChartMiniCard>
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <TableBox title="Overdue Projects" tableHead={overdue}>
                    {metrics?.overdueProjects?.map((x) => {
                        const date =
                            moment().diff(moment(x.endDate), 'day') + 1;
                        return (
                            <TableRow>
                                <TableData name={x.name} />
                                <TableData
                                    name={moment(x.startDate).format(
                                        'DD/MM/YYYY',
                                    )}
                                />
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
                        );
                    })}
                </TableBox>
                <ChartLargeCard title="Statistics" sub="Budget Burn out rate">
                    <BurnOutChart chart={metrics.budgetBurnOutRates} />
                </ChartLargeCard>
            </Grid>
        </Box>
    );
};
