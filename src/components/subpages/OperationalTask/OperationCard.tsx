import {
    Avatar,
    Box,
    HStack,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from '@chakra-ui/react';
import { ShowPrompt } from '@components/bits-utils/ProjectManagement/Modals/ShowPrompt';
import shadeColor from '@components/generics/functions/shadeColor';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaEllipsisH } from 'react-icons/fa';
import { ProjectManagementService, StrippedUserView } from 'src/services';

interface IOperationProps {
    text: string;
    bg: string;
    title: any;
    sub: any;
    user?: StrippedUserView;
    subBtm: any;
    onClick: any;
    onDragStart: any;
    onDragEnd: any;
    assignees?: any;
    id: any;
}

export const OperationCard = ({
    text,
    bg,
    title,
    sub,
    user,
    subBtm,
    onClick,
    onDragStart,
    onDragEnd,
    assignees,
    id,
}: IOperationProps) => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();
    const { isOpen, onOpen, onClose } = useDisclosure();

    const deleteTask = async () => {
        setLoading(true);
        try {
            const data = await ProjectManagementService.deleteOperationalTask(
                id,
            );
            if (data.status) {
                setLoading(false);
                toast({
                    title: data.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                onClose();
                router.replace(router.asPath);
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
            borderRadius="16px"
            bgColor="white"
            p="10px 15px"
            // onClick={onClick}
            draggable
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            w="full"
            h="190px"
        >
            <HStack
                borderRadius="4px"
                bgColor={shadeColor(bg, '.2')}
                color={bg}
                fontSize="12px"
                fontWeight={500}
                justify="center"
                h="23px"
                px="1rem"
                w="fit-content"
                textTransform="capitalize"
                mb="7px"
            >
                <Text>{text}</Text>
            </HStack>
            <VStack
                align="flex-start"
                w="full"
                h="135px"
                justify="space-between"
            >
                <VStack gap="7px" align="flex-start" w="full">
                    <Text
                        fontWeight={600}
                        color="#0d062d"
                        fontSize="18px"
                        noOfLines={1}
                    >
                        {title}
                    </Text>
                    <Text
                        fontWeight={400}
                        color="#787486"
                        fontSize="12px"
                        noOfLines={2}
                    >
                        {sub}
                    </Text>
                </VStack>
                <HStack justify={'space-between'} w="full">
                    <Text
                        fontWeight={500}
                        color="#787486"
                        fontSize="12px"
                        noOfLines={2}
                    >
                        Created by <br /> {user?.fullName}
                    </Text>
                    <HStack gap="0">
                        {assignees?.slice(0, 3).map((x: any, i: any) => (
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
                <HStack justify={'space-between'} w="full">
                    {/* {isMine && ( */}

                    {/* )} */}
                    <Text fontWeight={400} color="#787486" fontSize="12px">
                        {subBtm}
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
                            <MenuItem onClick={() => onClick()} w="full">
                                View
                            </MenuItem>
                            <MenuItem onClick={() => onOpen()} w="full">
                                Delete
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </HStack>
            </VStack>
            {isOpen && (
                <ShowPrompt
                    isOpen={isOpen}
                    onClose={onClose}
                    onSubmit={deleteTask}
                    loading={loading}
                    text={`Are you sure you want to delete this task?`}
                />
            )}
        </Box>
    );
};
