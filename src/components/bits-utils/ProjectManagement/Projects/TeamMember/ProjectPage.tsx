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
    const allCounts =
        (counts.notStarted as number) +
        (counts.inProgress as number) +
        (counts.completed as number);
    return (
        <Box bgColor="white" p="1rem" borderRadius=".6rem">
            <TeamTaskMenu
                name={[
                    { name: 'all', id: '', count: allCounts, active: true },
                    { name: 'not started', id: 1, count: counts.notStarted },
                    { name: 'ongoing', id: 2, count: counts.inProgress },
                    { name: 'completed', id: 3, count: counts.completed },
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
