import {
    Box,
    Button,
    Flex,
    Grid,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { ProjectTabs } from '../Dashboard/ProjectTabs';
import { SubSearchComponent } from '@components/bits-utils/SubSearchComponent';
import { TabCounts } from '../Generics/TabCounts';
import { ProjectCard } from './ProjectCard';
import { CreateProjectDrawer } from '../Modals/CreateProjectDrawer';
import { useRouter } from 'next/router';
import {
    ProjectManagementSettingView,
    ProjectProgressCountView,
} from 'src/services';
import { UserContext } from '@components/context/UserContext';
import Pagination from '@components/bits-utils/Pagination';

export const ProjectPage = ({
    projects,
    users,
    superAdminId,
    counts,
    projectMangers,
    access,
    isPm,
    currencies,
}: {
    projects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
    projectMangers: any;
    access: ProjectManagementSettingView;
    isPm: boolean;
    currencies: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { user } = useContext(UserContext);
    const router = useRouter();
    function filterProjects(val: number) {
        router.push({
            query: {
                ...router.query,
                status: val,
            },
        });
    }

    const listProjectByStatus = (status) => {
        return projects?.value?.filter((x) => x.status === status);
    };

    // console.log({ projects });
    const hasAccess =
        (access?.adminProjectCreation && user?.role !== 'Team Member') ||
        (access?.pmProjectCreation && isPm);

    return (
        <Box>
            <Box mb="2.5rem">
                {!isPm && (
                    <ProjectTabs
                        name={[
                            'dashboard',
                            'projects',
                            // 'operational-task',
                            'resource-capacity',
                        ]}
                    />
                )}
            </Box>
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
                        {listProjectByStatus('Not Started')?.map((x) => (
                            <ProjectCard data={x} key={x?.id} />
                        ))}
                    </VStack>
                    <VStack bgColor="gray.100" p=".5rem .5rem">
                        <TabCounts
                            text="In Progress"
                            count={counts?.inProgress}
                            onClick={void 0}
                            num="2"
                        />
                        {listProjectByStatus('Ongoing')?.map((x) => (
                            <ProjectCard data={x} key={x?.id} />
                        ))}
                    </VStack>
                    <VStack bgColor="gray.100" p=".5rem .5rem">
                        <TabCounts
                            text="Completed"
                            count={counts?.completed}
                            onClick={void 0}
                            num="3"
                        />
                        {listProjectByStatus('Completed')?.map((x) => (
                            <ProjectCard data={x} key={x?.id} />
                        ))}
                    </VStack>
                </Grid>
                <Pagination data={projects} loadMore />
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
                    projectMangers={users}
                    currencies={currencies}
                />
            )}
        </Box>
    );
};
