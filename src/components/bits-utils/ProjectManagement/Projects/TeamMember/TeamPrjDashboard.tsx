import { Box, Text, HStack, Grid } from '@chakra-ui/react';
import React, { useContext } from 'react';
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
import { DashboardProjectView } from 'src/services';
import BudgetChart from '@components/bits-utils/Charts/BudgetChart';
import DoughnutChart from '@components/bits-utils/Charts/DoughnutChart';
import { BarChart } from '@components/bits-utils/Charts/BarChart';
import { Round } from '@components/generics/functions/Round';
import { TeamTopBar } from '../SingleProject/TeamTopBar';
import { UserContext } from '@components/context/UserContext';

export const TeamPrjDashboard = ({
    id,
    projects,
    metrics,
    users,
    currencies,
}: {
    id: string;
    projects: any;
    metrics: DashboardProjectView;
    users: any;
    currencies: any;
}) => {
    const projectSummary = ['Task Name', 'Deadline', 'Team member', 'Workload'];
    const { user } = useContext(UserContext);
    const isProjectPm = projects?.projectManagerId == user?.id;

    const isPm = user?.isOrganizationProjectManager;

    return (
        <Box>
            <TeamTopBar data={projects} id={id} />

            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <MiniCards
                    value={metrics?.resources}
                    title="Resources"
                    icon={RiBriefcase2Line}
                    color="#2eafa3"
                />
                <MiniCards
                    value={metrics?.totalTasks}
                    title="Total No of Task"
                    icon={BiTask}
                    color="#FF5B79"
                />
                <MiniCards
                    value={metrics?.totalHours}
                    title="Total No of Hours"
                    icon={RiTimeLine}
                    color="#2383BD"
                />
                <MiniCards
                    value={
                        !isProjectPm && !isPm
                            ? 'N/A'
                            : metrics?.budgetSpentAndRemain?.budgetSpent
                    }
                    title="Total Budget Spent"
                    icon={PiMoneyBold}
                    color="#F8C200"
                    isPrice={!isProjectPm && !isPm ? false : true}
                    allBudget={
                        !isProjectPm && !isPm
                            ? []
                            : [{ currency: projects.currency }]
                    }
                    budget={{ currency: projects.currency }}
                />
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '2fr 1fr']}
                gap="1.06rem"
            >
                <TableBox title="Upcoming Deadlines" tableHead={projectSummary}>
                    {metrics?.upcomingDeadlines?.slice(0, 3)?.map((x) => {
                        const status = x.status?.toLowerCase();
                        const pastDate =
                            moment().diff(moment(x.endDate), 'days') > 0;
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
                                        barWidth={x.percentageOfCompletion}
                                        barColor={
                                            status == 'completed'
                                                ? 'brand.400'
                                                : status == 'ongoing' &&
                                                  pastDate
                                                ? 'red'
                                                : status == 'ongoing'
                                                ? '#f7e277'
                                                : status == 'not started'
                                                ? 'gray.100'
                                                : 'red'
                                        }
                                        showProgress
                                        rightText={`${Round(
                                            x.percentageOfCompletion,
                                        )}%`}
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
                                count:
                                    !isProjectPm && !isPm
                                        ? 0
                                        : metrics?.budgetSpentAndRemain
                                              ?.budgetSpent,
                            },
                            {
                                name: 'Remaining Budget',
                                count:
                                    !isProjectPm && !isPm
                                        ? 0
                                        : metrics?.budgetSpentAndRemain
                                              ?.budgetRemain,
                            },
                        ]}
                        total={
                            !isProjectPm && !isPm
                                ? 'N/A'
                                : metrics?.budgetSpentAndRemain?.budget
                        }
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
                                count: metrics?.projectTaskStatus?.notStarted,
                            },
                            {
                                name: 'Completed',
                                count: metrics?.projectTaskStatus?.completed,
                            },
                            {
                                name: 'Ongoing',
                                count: metrics?.projectTaskStatus?.ongoing,
                            },
                        ]}
                    />
                </ChartMiniCard>
                <ChartLargeCard
                    title="Number of Task completed"
                    sub="Operational Vs Project Task activity Rate"
                >
                    <BarChart chart={metrics?.monthlyCompletedTasks} />
                </ChartLargeCard>
            </Grid>
        </Box>
    );
};