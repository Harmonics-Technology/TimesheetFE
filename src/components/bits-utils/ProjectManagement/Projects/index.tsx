import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TabCounts } from '../Generics/TabCounts';
import { ProjectCard } from './ProjectCard';
import { CreateProjectDrawer } from '../Modals/CreateProjectDrawer';

export const ProjectPage = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const data = {
        title: 'Time Tracking System',
        desc: 'These project will need a new brand identity where they will get recognies.',
        budget: 600000,
        id: 2,  
        users: [
            {
                id: 0,
                url: 'https://bit.ly/sage-adebayo',
                name: 'Sage Adebayo',
            },
            {
                id: 1,
                url: 'https://bit.ly/sage-adebayo',
                name: 'Tade Ojo',
            },
            {
                id: 2,
                url: 'https://bit.ly/sage-adebayo',
                name: 'Ben Joe',
            },
        ],
    };
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
            <Grid templateColumns={['repeat(3,1fr)']} my="2rem" w="full">
                <TabCounts text="Not Started" count={3} />
                <TabCounts text="In Progress" count={3} />
                <TabCounts text="Completed" count={3} />
            </Grid>
            <Grid
                templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                my="2rem"
                w="full"
                gap="1.5rem"
            >
                {Array(9)
                    .fill(9)
                    .map((x, i) => (
                        <ProjectCard data={data} key={i} />
                    ))}
            </Grid>
            {isOpen && (
                <CreateProjectDrawer isOpen={isOpen} onClose={onClose} />
            )}
        </Box>
    );
};
