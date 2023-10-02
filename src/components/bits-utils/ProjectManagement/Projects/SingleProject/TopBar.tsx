import {
    HStack,
    Button,
    Box,
    Icon,
    Text,
    Flex,
    useToast,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { ProjectTabs } from '../../Dashboard/ProjectTabs';
import { TaskMenu } from '../../Generics/TaskMenu';
import { ColoredTag } from '../../Generics/ColoredTag';
import { CAD } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';
import { useRouter } from 'next/router';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import markAsCompleted from '@components/generics/functions/markAsCompleted';
import { ProjectView } from 'src/services';

export const TopBar = ({
    noTitle = false,
    id,
    data,
}: {
    noTitle?: boolean;
    id?: any;
    data?: ProjectView;
}) => {
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState();
    const [status, setStatus] = useState(data?.status);
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

                <ManageBtn
                    onClick={() =>
                        markAsCompleted(
                            { type: 1, taskId: data?.id },
                            setLoading,
                            toast,
                            setStatus,
                        )
                    }
                    isLoading={loading}
                    btn="Mark Project as Complete"
                    bg="brand.400"
                    w="fit-content"
                    disabled={status == 'Completed'}
                    h="2rem"
                />
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
                                text={CAD(data?.budget)}
                                h={1.5}
                            />
                        </HStack>
                    </Box>
                </HStack>
            )}
        </Box>
    );
};
