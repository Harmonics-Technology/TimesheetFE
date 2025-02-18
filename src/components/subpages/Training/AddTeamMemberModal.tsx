import {
    Box,
    Button,
    Flex,
    FormLabel,
    HStack,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Text,
    useToast,
} from '@chakra-ui/react';
import { CustomSelectBox } from '@components/bits-utils/ProjectManagement/Generics/CustomSelectBox';
import { SelectBlank } from '@components/bits-utils/SelectBlank';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { TrainingService, UserView } from 'src/services';

export const AddTeamMemberModal = ({
    isOpen,
    onClose,
    trainingId,
    users,
    training,
}) => {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>([]);
    const selectUser = (user) => {
        const filtered = selectedUser?.find((x) => x.id === user.id);
        if (filtered) return;
        setSelectedUser([...selectedUser, user]);
    };
    const removeUser = (id) => {
        const filtered = selectedUser?.filter((x) => x.id !== id);
        setSelectedUser(filtered);
    };
    const addUser = async () => {
        setLoading(true);
        try {
            const result = await TrainingService.assignNewUser({
                userIds: selectedUser?.map((x) => x?.id),
                trainingId,
            });
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading(false);
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

    const filteredUsers = users?.value
        ?.filter((x) => x?.isActive)
        ?.filter(
            (user) =>
                !training?.assignees?.some(
                    (assignee) => assignee.userId === user.id,
                ),
        );
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
            closeOnOverlayClick={false}
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py={5}
                borderRadius="0px"
                w={['88%', '30%']}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <Flex justify="space-between" mb="1rem">
                        <Text
                            fontWeight="500"
                            userSelect="none"
                            fontSize=".9rem"
                        >
                            Assign Team Members
                        </Text>
                        <FaTimes onClick={onClose} />
                    </Flex>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        <Box w="full">
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Team Members
                            </FormLabel>
                            <CustomSelectBox
                                data={filteredUsers}
                                updateFunction={selectUser}
                                items={selectedUser}
                                customKeys={{ key: 'id', label: 'fullName' }}
                                id="team members"
                                removeFn={removeUser}
                                searchable
                                checkbox
                            />
                        </Box>

                        <HStack spacing={4} w="full" my="42px">
                            <Button
                                variant="solid"
                                width="fit-content"
                                bgColor="brand.400"
                                color="white"
                                borderRadius="8px"
                                fontSize=".9rem"
                                px="1rem"
                                isLoading={loading}
                                onClick={() => addUser()}
                            >
                                Assign
                            </Button>
                        </HStack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
