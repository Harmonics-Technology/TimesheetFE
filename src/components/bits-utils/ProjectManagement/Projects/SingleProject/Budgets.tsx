import { Box, Grid, HStack } from '@chakra-ui/react';
import React from 'react';
import { BiTask } from 'react-icons/bi';
import { PiMoneyBold } from 'react-icons/pi';
import { RiBriefcase2Line, RiTimeLine } from 'react-icons/ri';
import { MiniCards } from '../../Dashboard/MiniCards';
import { TopBar } from './TopBar';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TableRow, TableData } from '@components/bits-utils/TableData';
import { CAD } from '@components/generics/functions/Naira';
import moment from 'moment';
import { TableCard } from '../../Generics/TableCard';
import { ProjectMetrics } from 'src/services';
import { Round } from '@components/generics/functions/Round';

export const Budgets = ({
    id,
    project,
    budgets,
    users,
}: {
    id: string;
    project: any;
    budgets: any;
    users: any;
}) => {
    const tableHead = [
        'Team Members',
        'Assigned Task',
        'Start Date',
        'End Date',
        // 'Expected Hours',
        // 'Budget',
        'Total Hours',
        'Budget Spent',
    ];

    const projectMetrics: ProjectMetrics = project.projectMetrics;

    return (
        <Box>
            <TopBar id={id} data={project} users={users} />
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <MiniCards
                    value={projectMetrics.totalBudget}
                    title="Total Budget"
                    icon={PiMoneyBold}
                    color="#2eafa3"
                    isPrice
                />
                <MiniCards
                    value={projectMetrics.totalBudgetSpent}
                    title="Total Budget Spent"
                    icon={PiMoneyBold}
                    color="#FF5B79"
                    isPrice
                />
                <MiniCards
                    value={projectMetrics.currentBalance}
                    title="Current Balance"
                    icon={PiMoneyBold}
                    color="#2383BD"
                    isPrice
                />
                <MiniCards
                    value={projectMetrics.totalHourSpent}
                    title="Total Hours pent"
                    icon={PiMoneyBold}
                    color="#F8C200"
                />
            </Grid>
            <HStack justify="flex-end" my="2rem">
                <SubSearchComponent />
            </HStack>
            <TableCard tableHead={tableHead}>
                {budgets.value
                    ?.filter((x) => x.projectTask !== null)
                    .map((x) => (
                        <TableRow key={x.id}>
                            <TableData
                                name={x?.user?.fullName}
                                fontWeight="500"
                            />

                            <TableData
                                name={x.projectTask?.name}
                                fontWeight="500"
                            />
                            <TableData
                                name={moment(x.projectTask?.startDate).format(
                                    'DD/MM/YYYY',
                                )}
                                fontWeight="500"
                            />
                            <TableData
                                name={moment(x.projectTask?.endDate).format(
                                    'DD/MM/YYYY',
                                )}
                                fontWeight="500"
                            />
                            {/* <TableData
                                name={`${
                                    ((moment(x.projectTask?.endDate).diff(
                                        x.projectTask?.startDate,
                                        'day',
                                    ) as number) +
                                        1) *
                                    x.projectTask.durationInHours
                                } hrs`}
                                fontWeight="500"
                            /> */}
                            {/* <TableData name={CAD(x?.budget)} fontWeight="500" /> */}
                            <TableData
                                name={`${x.hoursLogged} hrs`}
                                fontWeight="500"
                            />
                            <TableData
                                name={CAD(Round(x?.budgetSpent))}
                                fontWeight="500"
                            />
                        </TableRow>
                    ))}
            </TableCard>
        </Box>
    );
};
