import {
    Avatar,
    Box,
    HStack,
    Icon,
    ListItem,
    Text,
    UnorderedList,
    useDisclosure,
    useToast,
    VStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Flex,
} from '@chakra-ui/react';
import AddCommentModal from '@components/AddCommentModal';
import shadeColor from '@components/generics/functions/shadeColor';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FiMessageSquare } from 'react-icons/fi';
import Skeleton from 'react-loading-skeleton';
import { AuditrailView, ProjectManagementService } from 'src/services';
import parse from 'react-html-parser';
import { BsPenFill } from 'react-icons/bs';
import { BsTrash3 } from 'react-icons/bs';
import { FaEllipsisH } from 'react-icons/fa';
import EditCommentModal from '@components/EditCommentModal';
import { TaskComment } from 'src/services';
import { da } from 'date-fns/locale';


moment.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: '%d second',
        ss: '%d seconds',
        m: '%d minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: '%d day',
        dd: '%d days',
        M: '%d month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years',
    },
});

export const AuditTrailSection = ({ taskId }: { taskId: string }) => {
    const [activities, setActivities] = useState<AuditrailView[]>([]);
    const [limit, setLimit] = useState(5);
    const [trigger, setTrigger] = useState(false);
    const [loading, setLoading] = useState({ id: '' });
    const toast = useToast();
    const [selectedComment, setSelectedComment] = useState<string>();

    const fetchAuditData = async () => {
        setLoading({ id: 'fetching' });
        try {
            const res = await ProjectManagementService.listActivities(
                0,
                limit,
                taskId,
            );
            if (res?.status) {
                setLoading({ id: '' });
                setActivities(res?.data?.value as AuditrailView[]);
                return;
            }
            setLoading({ id: '' });
            toast({
                title: res?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        if (taskId) {
            fetchAuditData();
        }
    }, [limit, trigger]);

    // console.log({ activities });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [openEditCommentModal, setOpenEditCommentModal] =
        useState<boolean>(false);

    const OpenEditModal = (comment: any) => {
        setSelectedComment(comment);
        setOpenEditCommentModal(true);
    };

    const DeleteComment = async (comment: any) => {
         const data: TaskComment = {
             id: comment?.id,
             projectTaskId: taskId,
             comment: comment?.comment as string,
         };
        try {
            const res = await ProjectManagementService.updateComment(true, data);
            if (res?.status) {
                toast({
                    title: 'Comment deleted successfully',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setTrigger((prev) => !prev);
                return;
            }
            toast({
                title: res?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    }

    return (
        <HStack
            py="1rem"
            justify="space-between"
            align="flex-start"
            pos="relative"
        >
            <>
                {loading?.id == 'fetching' ? (
                    <Box w="80%">
                        <Skeleton height="4rem" count={5} />
                    </Box>
                ) : (
                    <>
                        {activities?.length > 0 ? (
                            <Box>
                                <UnorderedList
                                    display="flex"
                                    flexDir="column"
                                    listStyleType="none"
                                >
                                    {activities?.map((x) => (
                                        <Flex
                                            justifyContent="space-between"
                                            alignItems="flex-start"
                                        >
                                            <ListItem
                                                key={x?.id}
                                                borderLeft="3px solid #E9ECEF"
                                                minH="8rem"
                                                pl="29px"
                                                pos="relative"
                                                pb="1rem"
                                                _last={{
                                                    borderLeft: '0',
                                                }}
                                                _before={{
                                                    content: "''",
                                                    w: '15px',
                                                    h: '15px',
                                                    backgroundColor: '#fff',
                                                    display: 'inline-block',
                                                    borderRadius: '50%',
                                                    position: 'absolute',
                                                    top: '0px',
                                                    marginLeft: '-42px',
                                                    marginRight: ' 10px',
                                                    border: '5px solid #4FD1C5',
                                                }}
                                            >
                                                <VStack
                                                    align="flex-start"
                                                    gap=".3rem"
                                                >
                                                    <HStack gap=".2rem">
                                                        <Text
                                                            color="#04040B"
                                                            fontSize="14px"
                                                            fontWeight={500}
                                                        >
                                                            {x?.isComment
                                                                ? 'Comment'
                                                                : !x?.isComment &&
                                                                  !x?.assignee
                                                                ? 'Task Created'
                                                                : 'Task Assigned'}
                                                        </Text>
                                                        <HStack gap="1rem">
                                                            <Text
                                                                color="#8C8C8C"
                                                                fontSize="13px"
                                                                fontWeight={400}
                                                            >
                                                                {x?.isComment
                                                                    ? 'Comment by'
                                                                    : !x?.isComment &&
                                                                      !x?.assignee
                                                                    ? 'Created by'
                                                                    : ' Assigned by'}
                                                            </Text>
                                                            <Avatar
                                                                size={'sm'}
                                                                name={
                                                                    x
                                                                        ?.createdByUser
                                                                        ?.fullName as string
                                                                }
                                                                src={
                                                                    x
                                                                        ?.createdByUser
                                                                        ?.profilePicture as string
                                                                }
                                                                bgColor="gray.300"
                                                                color="white"
                                                            />
                                                            <Text
                                                                color="#2D3748"
                                                                fontSize="13px"
                                                                fontWeight={400}
                                                            >
                                                                {
                                                                    x
                                                                        ?.createdByUser
                                                                        ?.fullName
                                                                }
                                                            </Text>
                                                        </HStack>
                                                    </HStack>
                                                    <Text
                                                        color="#8C8C8C"
                                                        fontSize="13px"
                                                        fontWeight={400}
                                                        textTransform="capitalize"
                                                    >
                                                        {moment(x?.dateCreated)
                                                            .add(1, 'hours')
                                                            ?.fromNow()}
                                                    </Text>
                                                    {x?.isComment ||
                                                    !x?.assignee ? (
                                                        <Text
                                                            color="#2D3748"
                                                            fontSize="14px"
                                                            fontWeight={400}
                                                            className="rdw-link-decorator-wrapper"
                                                        >
                                                            {parse(x?.comment)}
                                                        </Text>
                                                    ) : (
                                                        <HStack gap="1rem">
                                                            <Text
                                                                color="#2D3748"
                                                                fontSize="13px"
                                                                fontWeight={400}
                                                            >
                                                                This task was
                                                                assigned to
                                                            </Text>
                                                            <Avatar
                                                                size={'sm'}
                                                                name={
                                                                    x?.assignee
                                                                        ?.fullName as string
                                                                }
                                                                src={
                                                                    x?.assignee
                                                                        ?.profilePicture as string
                                                                }
                                                                bgColor="gray.300"
                                                                color="white"
                                                            />
                                                            <Text
                                                                color="#2D3748"
                                                                fontSize="13px"
                                                                fontWeight={400}
                                                            >
                                                                {
                                                                    x?.assignee
                                                                        ?.fullName
                                                                }
                                                            </Text>
                                                        </HStack>
                                                    )}
                                                </VStack>
                                            </ListItem>
                                            <Menu>
                                                <MenuButton mt="2">
                                                    <Box
                                                        fontSize="1.2rem"
                                                        pl="1rem"
                                                        fontWeight="bold"
                                                        cursor="pointer"
                                                        color="brand.300"
                                                    >
                                                        <FaEllipsisH />
                                                    </Box>
                                                </MenuButton>
                                                <MenuList>
                                                    <MenuItem
                                                        onClick={() =>
                                                            OpenEditModal(x)
                                                        }
                                                        w="full"
                                                        fontSize={13}
                                                    >
                                                        <Icon
                                                            as={BsPenFill}
                                                            mr=".5rem"
                                                            color="brand.400"
                                                        />
                                                        Edit comment
                                                    </MenuItem>
                                                    <MenuItem
                                                        onClick={() => DeleteComment(x)}
                                                        w="full"
                                                        fontSize={13}
                                                    >
                                                        <Icon
                                                            as={BsTrash3}
                                                            mr=".5rem"
                                                            color="brand.400"
                                                        />
                                                        Delete comment
                                                    </MenuItem>
                                                </MenuList>
                                            </Menu>
                                        </Flex>
                                    ))}
                                </UnorderedList>
                                <HStack justify="flex-start" mt="2rem">
                                    <Text
                                        mb="0"
                                        mt="1rem"
                                        fontSize=".8rem"
                                        fontWeight="500"
                                        cursor="pointer"
                                        bgColor={shadeColor('#2EAFA3', 0.1)}
                                        onClick={() =>
                                            setLimit((prev) => prev + 10)
                                        }
                                        p=".5rem 1.5rem"
                                        _hover={{
                                            bgColor: shadeColor('#2EAFA3', 0.1),
                                        }}
                                    >
                                        Load More
                                    </Text>
                                </HStack>
                            </Box>
                        ) : (
                            <HStack justify="center">
                                <Text textAlign="center" fontSize="13px">
                                    Add a new comment to see activity data
                                </Text>
                            </HStack>
                        )}
                    </>
                )}
            </>
            <VStack>
                <HStack
                    flexDirection="column"
                    alignItems="flex-end"
                    cursor="pointer"
                    pos="absolute"
                    right={0}
                    spacing={7}
                >
                    <HStack
                        bgColor="#E7E7E7"
                        borderRadius="5px"
                        color="#2D3748"
                        h="35px"
                        px="10px"
                        gap="6px"
                        onClick={onOpen}
                        fontSize="13px"
                        fontWeight={500}
                        cursor="pointer"
                    >
                        <Icon as={FiMessageSquare} />
                        <Text>Add Comment</Text>
                    </HStack>
                </HStack>
            </VStack>
            {isOpen && (
                <AddCommentModal
                    isOpen={isOpen}
                    onClose={onClose}
                    taskId={taskId}
                    setTrigger={setTrigger}
                />
            )}
            {openEditCommentModal && (
                <EditCommentModal
                    isOpen={openEditCommentModal}
                    onClose={() => setOpenEditCommentModal(false)}
                    taskId={taskId}
                    setTrigger={setTrigger}
                    defaultComment={selectedComment}
                />
            )}
        </HStack>
    );
};
