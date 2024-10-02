import { Box, Button, Flex, Grid, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react';
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
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import { UserContext } from '@components/context/UserContext';

export const TeamProjectPage = ({
    projects,
    users,
    superAdminId,
    counts,
    access,
    projectMangers,
    currencies,
}: {
    projects: any;
    users: any;
    superAdminId: string;
    counts: ProjectProgressCountView;
    access: ProjectManagementSettingView;
    projectMangers: any;
    currencies: any;
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: opens, onClose: close } = useDisclosure();
    const { user, subType } = useContext(UserContext);
    const router = useRouter();

    //
    const allCounts =
        (counts.notStarted as number) +
        (counts.inProgress as number) +
        (counts.completed as number);

    const hasAccess = access?.allProjectCreation;
    const projectSize = projects?.size;

    // console.log({ projects });
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
                        // onClick={onOpen}
                        // bgColor="brand.400"
                        color="white"
                        h="2.5rem"
                        borderRadius=".3rem"
                        onClick={() =>
                            subType == 'basic' && projectSize >= 2
                                ? opens()
                                : onOpen()
                        }
                        bgColor={
                            subType == 'basic' && projectSize >= 2
                                ? 'gray.300'
                                : 'brand.400'
                        }
                        cursor={
                            subType == 'basic' && projectSize >= 2
                                ? 'not-allowed'
                                : 'pointer'
                        }
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
                {projects?.value
                    ?.filter((x) =>
                        x?.assignees?.find((x) => x?.userId == user?.id),
                    )
                    .map((x, i) => (
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
                    currencies={currencies}
                />
            )}
            <UpgradePromptModal
                isOpen={open}
                onClose={close}
                text="You’ve reached the maximum of 2 projects allowed in the Basic package. To create more projects, please consider upgrading to a different package."
            />
        </Box>
    );
};
