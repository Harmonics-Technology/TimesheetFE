import { HStack, Button, Box, Icon, Text } from '@chakra-ui/react';
import React from 'react';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { ProjectTabs } from '../../Dashboard/ProjectTabs';
import { TaskMenu } from '../../Generics/TaskMenu';
import { ColoredTag } from '../../Generics/ColoredTag';
import { CAD } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';

export const TopBar = ({ noTitle = false }: { noTitle?: boolean }) => {
    return (
        <Box borderBottom={noTitle ? 'none' : '1px solid #e5e5e5'} pb="0rem">
            <Box mb="1.5rem">
                <ProjectTabs
                    name={['dashboard', 'projects', 'operational-task']}
                />
            </Box>
            <HStack fontSize=".875rem" cursor="pointer">
                <Button bgColor="#f0f0f0" h="1.5rem" w="1.5rem" minW="0">
                    <Icon as={MdOutlineArrowBackIosNew} fontSize=".8rem" />
                </Button>
                <Text color="brand.400" fontWeight={500}>
                    Back
                </Text>
            </HStack>
            <TaskMenu
                name={[
                    'dashboard',
                    'project-task',
                    'gantt-chart',
                    'team-members',
                    'budget',
                ]}
                id={2}
            />
            {!noTitle && (
                <HStack justify="space-between" my="2rem" align="flex-start">
                    <Box>
                        <Text color="#2d3748" fontWeight={600}>
                            Time Tracking System Project
                        </Text>
                        <HStack mt=".5rem">
                            <ColoredTag
                                bg="#afb6e5"
                                text={moment().format('DD MMM, YYYY')}
                            />
                            <ColoredTag
                                bg="#FFA681"
                                text={moment().format('DD MMM, YYYY')}
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
                                text={CAD(60000)}
                                h={1.5}
                            />
                        </HStack>
                    </Box>
                </HStack>
            )}
        </Box>
    );
};
