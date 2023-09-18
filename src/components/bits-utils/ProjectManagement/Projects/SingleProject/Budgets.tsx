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

export const Budgets = ({ id, project }) => {
    const tableHead = [
        'Team Members',
        'Assigned Task',
        'Start Date',
        'End Date',
        'Expected Hours',
        'Budget',
        'Total Hours',
        'Budget Spent',
    ];

    const projectMetrics: ProjectMetrics = project.projectMetrics;
    return (
        <Box>
            <TopBar id={id} data={project} />
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <MiniCards
                    value={Math.ceil(projectMetrics.totalBudget as number)}
                    title="Total Budget"
                    icon={PiMoneyBold}
                    color="#2eafa3"
                    isPrice
                />
                <MiniCards
                    value={Math.ceil(projectMetrics.totalBudgetSpent as number)}
                    title="Total Budget Spent"
                    icon={PiMoneyBold}
                    color="#FF5B79"
                    isPrice
                />
                <MiniCards
                    value={Math.ceil(projectMetrics.currentBalance as number)}
                    title="Current Balance"
                    icon={PiMoneyBold}
                    color="#2383BD"
                    isPrice
                />
                <MiniCards
                    value={Math.ceil(projectMetrics.totalHourSpent as number)}
                    title="Total Hours pent"
                    icon={PiMoneyBold}
                    color="#F8C200"
                />
            </Grid>
            <HStack justify="flex-end" my="2rem">
                <SubSearchComponent />
            </HStack>
            <TableCard tableHead={tableHead}>
                <TableRow>
                    <TableData name="Ade Adeyemi" fontWeight="500" />

                    <TableData
                        name={`Requirement Gathering`}
                        fontWeight="500"
                    />
                    <TableData
                        name={moment().format('DD/MM/YYYY')}
                        fontWeight="500"
                    />
                    <TableData
                        name={moment().format('DD/MM/YYYY')}
                        fontWeight="500"
                    />
                    <TableData name={`${100} hrs`} fontWeight="500" />
                    <TableData name={CAD(100000)} fontWeight="500" />
                    <TableData name={`${50} hrs`} fontWeight="500" />
                    <TableData name={CAD(50000)} fontWeight="500" />
                </TableRow>
                <TableRow bg="#d9d9d9">
                    <TableData name="" fontWeight="500" />

                    <TableData name={``} fontWeight="500" />
                    <TableData name={''} fontWeight="500" />
                    <TableData name="Total" fontWeight="500" />
                    <TableData name={`${100} hrs`} fontWeight="500" />
                    <TableData name={CAD(100000)} fontWeight="500" />
                    <TableData name={`${50} hrs`} fontWeight="500" />
                    <TableData name={CAD(50000)} fontWeight="500" />
                </TableRow>
            </TableCard>
        </Box>
    );
};
