import React from 'react';
import { TopBar } from './TopBar';
import { Box, Grid } from '@chakra-ui/react';
import { TeamMemberCard } from './TeamMemberCard';
import { ProjectView } from 'src/services';

export const TeamMembersView = ({
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
            <TopBar
                currencies={currencies}
                id={id}
                data={teams}
                users={users}
            />
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
