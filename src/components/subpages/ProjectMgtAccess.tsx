import { Box, HStack, VStack, useToast } from '@chakra-ui/react';
import Checkbox from '@components/bits-utils/Checkbox';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { NotText } from '@components/bits-utils/NotText';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { ProjectManagementSettingModel, UserService } from 'src/services';

export const ProjectMgtAccess = ({
    controls,
}: {
    controls: ProjectManagementSettingModel;
}) => {
    const [loading, setLoading] = useState({ id: '' });
    const toast = useToast();
    const router = useRouter();
    const [access, setAccess] = useState<ProjectManagementSettingModel>({
        adminProjectCreation: controls?.adminProjectCreation,
        adminTaskCreation: controls?.adminTaskCreation,
        adminTaskViewing: controls?.adminTaskViewing,
        allProjectCreation: controls?.allProjectCreation,
        assignedPMTaskCreation: controls?.assignedPMTaskCreation,
        assignedPMTaskViewing: controls?.assignedPMTaskViewing,
        superAdminId: controls?.superAdminId,
        pmProjectCreation: controls?.pmProjectCreation,
        pmTaskEditing: controls?.pmTaskEditing,
        projectMembersTaskCreation: controls?.projectMembersTaskCreation,
        projectMembersTaskEditing: controls?.projectMembersTaskEditing,
        projectMembersTaskViewing: controls?.projectMembersTaskViewing,
        projectMembersTimesheetVisibility:
            controls?.projectMembersTimesheetVisibility,
        taskMembersTaskEditing: controls?.taskMembersTaskEditing,
        taskMembersTimesheetVisibility:
            controls?.taskMembersTimesheetVisibility,
    });
    const updateControl = async (
        data: ProjectManagementSettingModel,
        id: string,
    ) => {
        data.superAdminId = access?.superAdminId;
        setLoading({ id });
        try {
            const result = await UserService.updateProjectManagementSettings(
                data,
            );
            if (result.status) {
                setLoading({ id: '' });
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
        } catch (error: any) {
            setLoading({ id: '' });
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box
            pt="1.5rem"
            pb="5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            <LeaveTab
                tabValue={[
                    {
                        text: 'Organization Project Manager',
                        url: `/account-management/project-managers`,
                    },
                    {
                        text: 'Project Management Settings',
                        url: `/account-management/project-management-settings`,
                    },
                ]}
            />
            <Box py="1.5rem" w="full" borderBottom="1px solid #C2CFE0">
                <VStack align="flex-start" w="70%" gap="1rem">
                    <NotText
                        title="Project Creation Control"
                        sub="Users can specify who can create projects within the organization, including options like admins, designated project managers, or all members."
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Adminstrators"
                            dir="rtl"
                            color="#696969"
                            disabled
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    adminProjectCreation:
                                        !access.adminProjectCreation,
                                })
                            }
                            checked={access.adminProjectCreation}
                        />
                        <Checkbox
                            label="Organization Project Managers"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    pmProjectCreation:
                                        !access.pmProjectCreation,
                                })
                            }
                            checked={access.pmProjectCreation}
                        />
                        <Checkbox
                            label="All members"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    allProjectCreation:
                                        !access.allProjectCreation,
                                })
                            }
                            checked={access.allProjectCreation}
                        />
                    </HStack>
                    <ShiftBtn
                        text="Confirm"
                        bg="brand.400"
                        onClick={() => updateControl(access, 'pj_creation')}
                        loading={loading.id == 'pj_creation'}
                        h="28px"
                        px="1.5rem"
                    />
                </VStack>
            </Box>
            <Box py="1.5rem" w="full" borderBottom="1px solid #C2CFE0">
                <VStack align="flex-start" w="70%" gap="1rem">
                    <NotText
                        title="Task Creation Control"
                        sub="Users can specify who can create tasks in a project, such as all project members or only the assigned project manager"
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Adminstrators"
                            dir="rtl"
                            color="#696969"
                            disabled
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    adminTaskCreation:
                                        !access.adminTaskCreation,
                                })
                            }
                            checked={access.adminTaskCreation}
                        />
                        <Checkbox
                            label="Assigned Project Manager"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    assignedPMTaskCreation:
                                        !access.assignedPMTaskCreation,
                                })
                            }
                            checked={access.assignedPMTaskCreation}
                        />
                        <Checkbox
                            label="Anyone assigned to project"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    projectMembersTaskCreation:
                                        !access.projectMembersTaskCreation,
                                })
                            }
                            checked={access.projectMembersTaskCreation}
                        />
                    </HStack>
                    <ShiftBtn
                        text="Confirm"
                        bg="brand.400"
                        onClick={() => updateControl(access, 'task_creation')}
                        loading={loading.id == 'task_creation'}
                        h="28px"
                        px="1.5rem"
                    />
                </VStack>
            </Box>
            <Box py="1.5rem" w="full" borderBottom="1px solid #C2CFE0">
                <VStack align="flex-start" w="70%" gap="1rem">
                    <NotText
                        title="Task Viewing Control"
                        sub="Users can specify who can view tasks in a project, with options including all project members, only the assigned project manager, or only members assigned to the task"
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Adminstrators"
                            dir="rtl"
                            color="#696969"
                            disabled
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    adminTaskViewing: !access.adminTaskViewing,
                                })
                            }
                            checked={access.adminTaskViewing}
                        />
                        <Checkbox
                            label="Assigned Project Manager"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    assignedPMTaskViewing:
                                        !access.assignedPMTaskViewing,
                                })
                            }
                            checked={access.assignedPMTaskViewing}
                        />
                        <Checkbox
                            label="Anyone assigned to project"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    projectMembersTaskViewing:
                                        !access.projectMembersTaskViewing,
                                })
                            }
                            checked={access.projectMembersTaskViewing}
                        />
                    </HStack>
                    <ShiftBtn
                        text="Confirm"
                        bg="brand.400"
                        onClick={() => updateControl(access, 'task_viewing')}
                        loading={loading.id == 'task_viewing'}
                        h="28px"
                        px="1.5rem"
                    />
                </VStack>
            </Box>
            <Box py="1.5rem" w="full" borderBottom="1px solid #C2CFE0">
                <VStack align="flex-start" w="70%" gap="1rem">
                    <NotText
                        title="Task Editing Control"
                        sub="Users can specify who can edit tasks in a project, with options including all project members, only members assigned to the task, or only the assigned project manager"
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Project Manager"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    pmTaskEditing: !access.pmTaskEditing,
                                })
                            }
                            checked={access.pmTaskEditing}
                        />
                        <Checkbox
                            label="Members assigned to the task only"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    taskMembersTaskEditing:
                                        !access.taskMembersTaskEditing,
                                })
                            }
                            checked={access.taskMembersTaskEditing}
                        />
                        <Checkbox
                            label="All project members"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    projectMembersTaskEditing:
                                        !access.projectMembersTaskEditing,
                                })
                            }
                            checked={access.projectMembersTaskEditing}
                        />
                    </HStack>
                    <ShiftBtn
                        text="Confirm"
                        bg="brand.400"
                        onClick={() => updateControl(access, 'task_editing')}
                        loading={loading.id == 'task_editing'}
                        h="28px"
                        px="1.5rem"
                    />
                </VStack>
            </Box>
            <Box py="1.5rem" w="full" borderBottom="1px solid #C2CFE0">
                <VStack align="flex-start" w="70%" gap="1rem">
                    <NotText
                        title="Timesheet Visibility Control"
                        sub="System can provide user the ability to specify who can see project task in their timesheet e.g everyone assigned to the project, everyone assigned to the task"
                    />
                    <HStack gap="1rem">
                        <Checkbox
                            label="Everyone assigned to the project"
                            dir="rtl"
                            color="#696969"
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    projectMembersTimesheetVisibility:
                                        !access.projectMembersTimesheetVisibility,
                                })
                            }
                            checked={access.projectMembersTimesheetVisibility}
                        />
                        <Checkbox
                            label="Everyone assigned to the task"
                            dir="rtl"
                            color="#696969"
                            disabled
                            onChange={() =>
                                setAccess({
                                    ...access,
                                    taskMembersTimesheetVisibility:
                                        !access.taskMembersTimesheetVisibility,
                                })
                            }
                            checked={access.taskMembersTimesheetVisibility}
                        />
                    </HStack>
                    <ShiftBtn
                        text="Confirm"
                        bg="brand.400"
                        onClick={() => updateControl(access, 'task_visible')}
                        loading={loading.id == 'task_visible'}
                        h="28px"
                        px="1.5rem"
                    />
                </VStack>
            </Box>
        </Box>
    );
};
