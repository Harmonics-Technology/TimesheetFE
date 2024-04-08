import {
    HStack,
    Button,
    Box,
    Icon,
    Text,
    Flex,
    useToast,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { ProjectTabs } from '../../Dashboard/ProjectTabs';
import { TaskMenu } from '../../Generics/TaskMenu';
import { ColoredTag } from '../../Generics/ColoredTag';
import { CAD, CUR } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import markAsCompleted from '@components/generics/functions/markAsCompleted';
import { ProjectView } from 'src/services';
import { EditProjectDrawer } from '../../Modals/EditProjectDrawer';
import { ShowPrompt } from '../../Modals/ShowPrompt';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';

export const TopBar = ({
    noTitle = false,
    id,
    data,
    users,
    currencies,
}: {
    noTitle?: boolean;
    id?: any;
    data?: ProjectView;
    users: any;
    currencies: any;
}) => {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState({ id: '' });
    const [status, setStatus] = useState(data?.status?.toLowerCase());
    const { onOpen, isOpen, onClose } = useDisclosure();
    const {
        onOpen: onOpened,
        isOpen: isOpened,
        onClose: onClosed,
    } = useDisclosure();

    return (
        <Box borderBottom={noTitle ? 'none' : '1px solid #e5e5e5'} pb="0rem">
            <Box mb="1.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <Flex justify="space-between" align="center">
                <HStack
                    fontSize=".875rem"
                    cursor="pointer"
                    onClick={() => router.back()}
                >
                    <Button bgColor="#f0f0f0" h="1.5rem" w="1.5rem" minW="0">
                        <Icon as={MdOutlineArrowBackIosNew} fontSize=".8rem" />
                    </Button>
                    <Text color="brand.400" fontWeight={500}>
                        Back
                    </Text>
                </HStack>

                <HStack gap="1rem">
                    <ManageBtn
                        onClick={onOpened}
                        isLoading={loading.id == data?.id}
                        btn="Mark Project as Complete"
                        bg="brand.400"
                        w="fit-content"
                        disabled={status == 'completed'}
                        h="2rem"
                    />
                    <ManageBtn
                        onClick={() => onOpen()}
                        btn="Edit Project"
                        bg="brand.400"
                        w="fit-content"
                        h="2rem"
                    />
                </HStack>
            </Flex>
            <TaskMenu
                name={[
                    'dashboard',
                    'project-task',
                    // 'gantt-chart',
                    'team-members',
                    'budget',
                ]}
                id={id}
            />
            {!noTitle && (
                <HStack justify="space-between" my="2rem" align="flex-start">
                    <Box>
                        <Text color="#2d3748" fontWeight={600}>
                            {data?.name}
                        </Text>
                        <HStack mt=".5rem">
                            <ColoredTag
                                bg="#afb6e5"
                                text={moment(data?.startDate).format(
                                    'DD MMM, YYYY',
                                )}
                            />
                            <ColoredTag
                                bg="#FFA681"
                                text={moment(data?.endDate).format(
                                    'DD MMM, YYYY',
                                )}
                            />
                        </HStack>
                    </Box>
                    <Box>
                        <Text
                            color="#2d3748"
                            fontWeight={600}
                            textAlign="right"
                        >
                            Budget
                        </Text>
                        <HStack mt=".5rem">
                            <ColoredTag
                                bg={shadeColor('#2eafa3', 0.5)}
                                text={`${getCurrencySymbol(
                                    data?.currency,
                                )}${CUR(data?.budget)}`}
                                h={1.5}
                            />
                        </HStack>
                    </Box>
                </HStack>
            )}
            {isOpen && (
                <EditProjectDrawer
                    isOpen={isOpen}
                    onClose={onClose}
                    users={users}
                    data={data}
                    currencies={currencies}
                    projectMangers={users}
                />
            )}
            {isOpened && (
                <ShowPrompt
                    isOpen={isOpened}
                    onClose={onClosed}
                    onSubmit={() =>
                        markAsCompleted(
                            { type: 1, taskId: data?.id },
                            setLoading,
                            toast,
                            setStatus,
                            router,
                            onClosed,
                        )
                    }
                    loading={loading}
                    text={`Marking this project as complete will prevent any further timesheet submissions for this project.<br/> Are you sure you want to proceed?`}
                />
            )}
        </Box>
    );
};
