import React from 'react';
import { TopBar } from './TopBar';
import { Box, Grid } from '@chakra-ui/react';
import { TeamMemberCard } from './TeamMemberCard';
import { ProjectView } from 'src/services';

export const TeamMembersView = ({
    id,
    teams,
}: {
    teams: ProjectView;
    id: string;
}) => {
    console.log({ teams });
    return (
        <Box>
            <TopBar id={id} data={teams} />
            <Grid
                my="1.25rem"
                templateColumns={['repeat(1,1fr)', 'repeat(4,1fr)']}
                gap="1.06rem"
            >
                {teams?.assignees
                    ?.filter((x) => x.projectTaskId == null)
                    ?.map((item, index) => (
                        <TeamMemberCard data={item} id={id} key={index} />
                    ))}
            </Grid>
        </Box>
    );
};
