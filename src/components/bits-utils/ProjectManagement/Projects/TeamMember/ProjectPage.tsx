import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';

import { useRouter } from 'next/router';
import {
    ProjectManagementSettingView,
    ProjectProgressCountView,
} from 'src/services';
import { TabCounts } from '../../Generics/TabCounts';
import { CreateProjectDrawer } from '../../Modals/CreateProjectDrawer';
import { ProjectCard } from '../ProjectCard';
import { TeamTaskMenu } from '../../Generics/TeamTaskMenu';

export const TeamProjectPage = ({
    projects,
    users,
    superAdminId,
    counts,
    access,
    projectMangers,
}: {
    projects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
    access: ProjectManagementSettingView;
    projectMangers: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();

    //
    const allCounts =
        (counts.notStarted as number) +
        (counts.inProgress as number) +
        (counts.completed as number);

    const hasAccess = access?.allProjectCreation;
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
                {hasAccess && (
                    <Button
                        onClick={onOpen}
                        bgColor="brand.400"
                        color="white"
                        h="2.5rem"
                        borderRadius=".3rem"
                    >
                        Create New Project
                    </Button>
                )}
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

            {isOpen && (
                <CreateProjectDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    users={users}
                    superAdminId={superAdminId}
                    projectMangers={projectMangers}
                />
            )}
        </Box>
    );
};
