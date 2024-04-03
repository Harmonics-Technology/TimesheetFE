import { Box, Grid, HStack, Image, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
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
import { Round } from '@components/generics/functions/Round';
import { getCurrencyName } from '@components/generics/functions/getCurrencyName';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { getUniqueListBy } from '@components/generics/functions/getUniqueList';

export const Dashboard = ({
    metrics,
}: {
    metrics: DashboardProjectManagementView;
}) => {
    console.log({ metrics });
    const [budget, setBudget] = useState<any>(
        metrics?.totalBudgetSpent?.filter((x) => x.currency !== null).at(0),
    );
    const projectSummary = ['Project Name', 'Due Date', 'Status', 'Progress'];
    const overdue = ['Project Name', 'Deadline', 'Overdue'];
    const uniqueItems = getUniqueListBy(
        (metrics?.totalBudgetSpent as any)?.filter((x) => x.currency !== null),
        'currency',
    );
    return (
        <Box>
            <Box mb="2.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <HStack
                ml="auto"
                bgColor="white"
                my="1rem"
                p=".5rem 1rem"
                w="fit-content"
                borderRadius="5px"
            >
                <HStack>
                    <HStack w="fit-content">
                        <Image
                            src="/assets/filter.png"
                            alt="filter"
                            w="1.1rem"
                            h="1.1rem"
                        />
                        <Text fontSize=".8rem" color="#2d3748" fontWeight={500}>
                            Filter Budget By
                        </Text>
                    </HStack>
                    <SelectBlank
                        label=""
                        placeholder="Select Currency"
                        value={budget?.currency}
                        options={
                            <>
                                {uniqueItems?.map((x) => (
                                    <option value={x.currency as string}>
                                        {x.currency} (
                                        {getCurrencyName(x.currency) || ''})
                                    </option>
                                ))}
                            </>
                        }
                        onChange={(e) =>
                            setBudget(
                                metrics?.totalBudgetSpent?.find(
                                    (x) => x.currency === e.target.value,
                                ),
                            )
                        }
                    />
                </HStack>
            </HStack>
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
                    value={budget?.budgetSpent}
                    title="Total Budget Spent"
                    icon={PiMoneyBold}
                    color="#F8C200"
                    isPrice
                    setBudget={setBudget}
                    budget={budget}
                    allBudget={metrics?.totalBudgetSpent}
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
                    <DoughnutChart
                        chart={[
                            {
                                name: 'Not started',
                                count: metrics.projectStatusesCount?.notStarted,
                            },
                            {
                                name: 'Completed',
                                count: metrics.projectStatusesCount?.completed,
                            },
                            {
                                name: 'Ongoing',
                                count: metrics.projectStatusesCount?.ongoing,
                            },
                        ]}
                    />
                </ChartMiniCard>
                <TableBox
                    title="Project summary"
                    tableHead={projectSummary}
                    url="/SuperAdmin/project-management/projects"
                >
                    {metrics.projectSummary
                        ?.slice(0, 3)
                        ?.map((x: ProjectView) => {
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
                                            barWidth={x.progress}
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
                                            rightText={`${Round(x.progress)}%`}
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
                    legend={[
                        { text: 'Project', color: '#5C59E8' },
                        { text: 'Operation', color: '#E46A11' },
                    ]}
                >
                    <LineChart chart={metrics.oprationalAndProjectTasksStats} />
                </ChartLargeCard>
                <ChartMiniCard
                    title="Billable & Non-billable Hours"
                    sub="Last 30 days Jul 6 - Aug 5"
                >
                    <DoughnutChart
                        chart={[
                            {
                                name: 'Non-billable Hours',
                                count: metrics.billableAndNonBillable
                                    ?.nonBillable,
                            },
                            {
                                name: 'Billable Hours',
                                count: metrics.billableAndNonBillable?.billable,
                            },
                        ]}
                    />
                </ChartMiniCard>
            </Grid>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', '1fr 2fr']}
                gap="1.06rem"
            >
                <TableBox
                    title="Overdue Projects"
                    tableHead={overdue}
                    url="/SuperAdmin/project-management/projects"
                >
                    {metrics?.overdueProjects?.slice(0, 3)?.map((x) => {
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
                                            : date <= 3
                                            ? '#afb6e5'
                                            : '#f8c200'
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
