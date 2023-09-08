import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';

import { useRouter } from 'next/router';
import { ProjectProgressCountView } from 'src/services';
import { TabCounts } from '../../Generics/TabCounts';
import { CreateProjectDrawer } from '../../Modals/CreateProjectDrawer';
import { ProjectCard } from '../ProjectCard';
import { TeamTaskMenu } from '../../Generics/TeamTaskMenu';

export const ProjectPage = ({
    projects,
    users,
    superAdminId,
    counts,
}: {
    projects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    // console.log({ projects });
    return (
        <Box>
            <TeamTaskMenu
                name={[
                    { name: 'all', id: '', count: 5 },
                    { name: 'not started', id: 1, count: 5 },
                    { name: 'ongoing', id: 2, count: 5 },
                    { name: 'completed', id: 3, count: 5 },
                ]}
            />
            <Flex justify="flex-end" gap="1rem">
                <SubSearchComponent />
            </Flex>

            <Grid
                templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                my="2rem"
                w="full"
                gap="1.5rem"
            >
                {projects?.value?.map((x, i) => (
                    <ProjectCard data={x} key={i} />
                ))}
            </Grid>
        </Box>
    );
};
