import { Box, Grid } from '@chakra-ui/react';
import React from 'react';
import { MiniCards } from './MiniCards';
import { ProjectTabs } from './ProjectTabs';
import { RiBriefcase2Line, RiTimeLine } from 'react-icons/ri';
import { BiTask } from 'react-icons/bi';
import { PiMoneyBold } from 'react-icons/pi';

export const Dashboard = () => {
    return (
        <Box>
            <Box mb="2.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <Grid
                mb="1.25rem"
                templateColumns={['repeat(4,1fr)']}
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
        </Box>
    );
};
