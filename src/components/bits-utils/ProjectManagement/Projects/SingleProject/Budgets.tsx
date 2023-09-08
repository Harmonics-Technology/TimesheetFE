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

export const Budgets = ({id}) => {
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
    return (
        <Box>
            <TopBar id={id} />
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
