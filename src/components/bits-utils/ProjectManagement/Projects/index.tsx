import {
    Box,
    Button,
    Flex,
    Grid,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import React from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TabCounts } from '../Generics/TabCounts';
import { ProjectCard } from './ProjectCard';
import { CreateProjectDrawer } from '../Modals/CreateProjectDrawer';
import { useRouter } from 'next/router';
import { ProjectProgressCountView } from 'src/services';

export const ProjectPage = ({
    iProjects,
    nProjects,
    cProjects,
    users,
    superAdminId,
    counts,
}: {
    iProjects: any;
    nProjects: any;
    cProjects: any;
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
                    h="2.5rem"
                    borderRadius=".3rem"
                >
                    Create New Project
                </Button>
            </Flex>
            <Box my="2rem">
                <Grid templateColumns={['repeat(3,1fr)']} w="full" gap=".5rem">
                    {/* <TabCounts
                        text="Not Started"
                        count={counts?.notStarted}
                        onClick={() => filterProjects(1)}
                        num="1"
                        active
                    /> */}
                    <VStack w="full" bgColor="gray.100" p=".5rem .5rem">
                        <TabCounts
                            text="Not Started"
                            count={counts?.notStarted}
                            onClick={void 0}
                            num="1"
                        />
                        {nProjects?.value?.map((x, i) => (
                            <ProjectCard data={x} key={i} />
                        ))}
                    </VStack>
                    <VStack bgColor="gray.100" p=".5rem .5rem">
                        <TabCounts
                            text="In Progress"
                            count={counts?.inProgress}
                            onClick={void 0}
                            num="2"
                        />
                        {iProjects?.value?.map((x, i) => (
                            <ProjectCard data={x} key={i} />
                        ))}
                    </VStack>
                    <VStack bgColor="gray.100" p=".5rem .5rem">
                        <TabCounts
                            text="Completed"
                            count={counts?.completed}
                            onClick={void 0}
                            num="3"
                        />
                        {cProjects?.value?.map((x, i) => (
                            <ProjectCard data={x} key={i} />
                        ))}
                    </VStack>
                </Grid>
                {/* <Grid
                    templateColumns={['repeat(1,1fr)', 'repeat(3,1fr)']}
                    my="2rem"
                    w="full"
                    gap="1.5rem"
                >
                    {projects?.value?.map((x, i) => (
                        <ProjectCard data={x} key={i} />
                    ))}
                </Grid> */}
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
