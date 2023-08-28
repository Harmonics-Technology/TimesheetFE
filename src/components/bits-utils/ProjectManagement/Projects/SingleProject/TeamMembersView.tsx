import React from 'react';
import { TopBar } from './TopBar';
import { Box, Grid } from '@chakra-ui/react';
import { TeamMemberCard } from './TeamMemberCard';

export const TeamMembersView = () => {
    return (
        <Box>
            <TopBar />
            <Grid
                my="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                <TeamMemberCard data={'any'} id={2} />
            </Grid>
        </Box>
    );
};
