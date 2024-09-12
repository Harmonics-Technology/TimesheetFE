import React from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { ProjectView } from 'src/services';
import { TeamTopBar } from '../SingleProject/TeamTopBar';
import { TeamMemberCard } from '../SingleProject/TeamMemberCard';

export const TeamMemberAllView = ({
    id,
    teams,
    users,
    currencies,
}: {
    teams: ProjectView;
    id: string;
    users: any;
    currencies: any;
}) => {
    return (
        <Box>
            <TeamTopBar data={teams} id={id} />
            <Box w="full">
                <Grid
                    my="1.25rem"
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    gap="1.06rem"
                    w="full"
                >
                    {teams?.assignees
                        ?.filter((x) => x.projectTaskId == null)
                        ?.map((item, index) => (
                            <TeamMemberCard data={item} id={id} key={index} />
                        ))}
                </Grid>
            </Box>
        </Box>
    );
};
