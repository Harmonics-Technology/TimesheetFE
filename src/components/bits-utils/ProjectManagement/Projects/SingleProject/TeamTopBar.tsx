import {
    HStack,
    Box,
    Text,
    Button,
    Flex,
    Icon,
    useDisclosure,
} from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';
import React, { useContext } from 'react';
import { ColoredTag } from '../../Generics/ColoredTag';
import { TaskMenu } from '../../Generics/TaskMenu';
import { UserContext } from '@components/context/UserContext';
import { SubTabMenu, TeamTabMenu } from '../../Generics/TabMenu';
import { ManageBtn } from '@components/bits-utils/ManageBtn';
import router from 'next/router';
import { MdOutlineArrowBackIosNew } from 'react-icons/md';
import { EditProjectDrawer } from '../../Modals/EditProjectDrawer';

export const TeamTopBar = ({
    data,
    id,
    users,
    currencies,
}: {
    data: any;
    id: any;
    users?: any;
    currencies?: any;
}) => {
    const { user, subType } = useContext(UserContext);
    const { onOpen, isOpen, onClose } = useDisclosure();
    const isPm = user?.isOrganizationProjectManager;
    const isProjectPm = data?.projectManagers?.find(
        (x) => x.user?.id == user?.id,
    );

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
            <TaskMenu name={TeamTabMenu(subType, isPm, isProjectPm)} id={id} />
            {isProjectPm && (
                <>
                    <Flex justify="space-between" align="center">
                        <HStack
                            fontSize=".875rem"
                            cursor="pointer"
                            onClick={() => router.back()}
                        >
                            <Button
                                bgColor="#f0f0f0"
                                h="1.5rem"
                                w="1.5rem"
                                minW="0"
                            >
                                <Icon
                                    as={MdOutlineArrowBackIosNew}
                                    fontSize=".8rem"
                                />
                            </Button>
                            <Text color="brand.400" fontWeight={500}>
                                Back
                            </Text>
                        </HStack>

                        <HStack gap="1rem">
                            {/* <ManageBtn
                            onClick={onOpened}
                            isLoading={loading.id == data?.id}
                            btn="Mark Project as Complete"
                            bg="brand.400"
                            w="fit-content"
                            disabled={status == 'completed'}
                            h="2rem"
                        /> */}
                            <ManageBtn
                                onClick={() => onOpen()}
                                btn="Edit Project"
                                bg="brand.400"
                                w="fit-content"
                                h="2rem"
                            />
                        </HStack>
                    </Flex>
                </>
            )}
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
        </Box>
    );
};
