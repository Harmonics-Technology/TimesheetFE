import { HStack, Box, Text } from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';
import React, { useContext } from 'react';
import { ColoredTag } from '../../Generics/ColoredTag';
import { TaskMenu } from '../../Generics/TaskMenu';
import { UserContext } from '@components/context/UserContext';

export const TeamTopBar = ({ data, id }) => {
    const { user } = useContext(UserContext);
    const isPm = user?.isOrganizationProjectManager;
    const isProjectPm = data?.projectManagerId == user?.id;

    const menuItems =
        isPm && isProjectPm
            ? [
                  'dashboard',
                  'project-task',
                  'gantt-chart',
                  'team-members',
                  'budget',
              ]
            : ['dashboard', 'project-task', 'gantt-chart', 'team-members'];
    //   : isProjectPm
    //   ? ['dashboard', 'project-task', 'gantt-chart', 'team-members']
    return (
        <Box>
            <TaskMenu name={menuItems} id={id} />
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
                            text={moment(data?.endDate).format('DD MMM, YYYY')}
                        />
                    </HStack>
                </Box>
                {/* <Box>
                <Text color="#2d3748" fontWeight={600} textAlign="right">
                    Budget
                </Text>
                <HStack mt=".5rem">
                    <ColoredTag
                        bg={shadeColor('#2eafa3', 0.5)}
                        text={CAD(data?.budget)}
                        h={1.5}
                    />
                </HStack>
            </Box> */}
            </HStack>
        </Box>
    );
};
