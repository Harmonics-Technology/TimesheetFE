import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TabCounts } from '../Generics/TabCounts';
import { ProjectCard } from './ProjectCard';
import { CreateProjectDrawer } from '../Modals/CreateProjectDrawer';
import { useRouter } from 'next/router';
import { ProjectProgressCountView } from 'src/services';

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
    function filterProjects(val: number) {
        router.push({
            query: {
                ...router.query,
                status: val,
            },
        });
    }
    console.log({ projects });
    return (
        <Box>
            <Box mb="2.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <Flex justify="flex-end" gap="1rem">
                <SubSearchComponent />
                <Button
                    onClick={onOpen}
                    bgColor="brand.400"
                    color="white"
                    h="2.7rem"
                    borderRadius=".3rem"
                >
                    Create New Project
                </Button>
            </Flex>
            <Box my="2rem">
                <Grid templateColumns={['repeat(3,1fr)']} w="full" gap=".5rem">
                    <TabCounts
                        text="Not Started"
                        count={counts.notStarted}
                        onClick={() => filterProjects(1)}
                        num="1"
                        active
                    />
                    <TabCounts
                        text="In Progress"
                        count={counts.inProgress}
                        onClick={() => filterProjects(2)}
                        num="2"
                    />
                    <TabCounts
                        text="Completed"
                        count={counts.completed}
                        onClick={() => filterProjects(3)}
                        num="3"
                    />
                </Grid>
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
            {isOpen && (
                <CreateProjectDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    users={users}
                    superAdminId={superAdminId}
                />
            )}
        </Box>
    );
};
