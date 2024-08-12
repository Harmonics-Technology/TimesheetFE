import {
    Box,
    VStack,
    Text,
    HStack,
    Avatar,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Spinner,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { CUR } from '@components/generics/functions/Naira';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import { ProgressBar } from '../Generics/ProgressBar';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import {
    ProjectManagementService,
    ProjectTaskAsigneeView,
    ProjectView,
    StrippedProjectAssignee,
} from 'src/services';
import { getCurrencySymbol } from '@components/generics/functions/getCurrencyName';
import { FaEllipsisH } from 'react-icons/fa';
import { ShowPrompt } from '../Modals/ShowPrompt';

export const ProjectCard = ({ data }: { data: ProjectView }) => {
    const dateDiff = moment(data?.endDate).diff(data?.startDate, 'day');
    const dateUsed = moment().diff(moment(data?.startDate), 'day');
    const dateLeft = dateDiff - dateUsed + 1;
    // const datePercent = Math.round((dateUsed / dateDiff) * 100);
    //
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const status = data?.status?.toLowerCase();
    const pastDate = moment().diff(moment(data.endDate), 'days') > 0;
    const assignees: ProjectTaskAsigneeView[] = data?.assignees?.filter(
        (x) => x.projectTaskId == null,
    ) as any;
    //

    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const deleteTask = async () => {
        setLoading(true);
        try {
            const res = await ProjectManagementService.deleteProject(data.id);
            if (res.status) {
                setLoading(false);
                toast({
                    title: res.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                onClose();
                return;
            }
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box
            borderRadius=".6rem"
            bgColor="white"
            padding="1.5rem 1.5rem"
            border="1px solid #C2CFE0"
            cursor="pointer"
            w="full"
            // onClick={() =>
            //     router.push(`/${role}/project-management/projects/${data?.id}`)
            // }
        >
            <VStack justify="space-between" align="flex-start" w="full">
                <Box w="full">
                    <HStack justify={'space-between'} w="full">
                        <Text
                            fontWeight={500}
                            color="black"
                            mb="0"
                            fontFamily="Roboto"
                        >
                            {data?.name}
                        </Text>
                        <Menu>
                            <MenuButton>
                                <Box
                                    fontSize="1rem"
                                    pl="1rem"
                                    fontWeight="bold"
                                    cursor="pointer"
                                    color="brand.300"
                                >
                                    {loading ? (
                                        <Spinner size="sm" />
                                    ) : (
                                        <FaEllipsisH />
                                    )}
                                </Box>
                            </MenuButton>
                            <MenuList w="full" fontSize=".7rem">
                                <MenuItem
                                    onClick={() =>
                                        router.push(
                                            `/${role}/project-management/projects/${data?.id}`,
                                        )
                                    }
                                    w="full"
                                >
                                    View
                                </MenuItem>
                                <MenuItem onClick={() => onOpen()} w="full">
                                    Delete
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </HStack>
                    <Text
                        fontWeight={400}
                        color="#b6b6b6"
                        mb="0"
                        fontSize=".8rem"
                        noOfLines={1}
                    >
                        {data?.note}
                    </Text>
                </Box>
                <Box
                    bgColor="#bff1df"
                    color="#2eb67d"
                    p="0.44rem 0.75rem"
                    borderRadius="0.25rem"
                    fontSize="0.75rem"
                    my="0.5rem"
                >
                    Due Date: {moment(data?.endDate).format('Do MMM YYYY')}
                </Box>
                <HStack justify="space-between" align="flex-start" w="full">
                    <Text
                        mb="0"
                        fontSize="0.75rem"
                        color="#455A64"
                        fontWeight={600}
                    >
                        Budget:{' '}
                        {`${getCurrencySymbol(data?.currency)}${CUR(
                            data?.budget,
                        )}`}
                    </Text>
                    <HStack gap="0">
                        {assignees
                            ?.slice(0, 3)
                            .map((x: StrippedProjectAssignee, i: any) => (
                                <Avatar
                                    key={x.id}
                                    size={'sm'}
                                    name={x?.fullName as string}
                                    border="1px solid white"
                                    transform={`translateX(${-i * 10}px)`}
                                />
                            ))}
                        {assignees?.length > 3 && (
                            <Text fontSize="0.75rem" color="#455A64">
                                + {assignees?.length - 3}
                            </Text>
                        )}
                    </HStack>
                </HStack>
                <Box w="full" mt="0.5rem">
                    <ProgressBar
                        barWidth={data.progress}
                        showProgress={true}
                        barColor={
                            status == 'completed'
                                ? 'brand.400'
                                : status == 'ongoing' && pastDate
                                ? 'red'
                                : status == 'ongoing'
                                ? '#f7e277'
                                : status == 'not started'
                                ? 'gray.100'
                                : 'red'
                        }
                        leftText="Progress"
                        rightText={`${dateLeft < 0 ? 0 : dateLeft} days left`}
                    />
                </Box>
            </VStack>
            {isOpen && (
                <ShowPrompt
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={deleteTask}
                    loading={loading}
                    text={`Are you sure you want to delete this project?`}
                />
            )}
        </Box>
    );
};
