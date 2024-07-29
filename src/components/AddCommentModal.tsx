import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    Text,
    Box,
    HStack,
    useToast,
    Flex,
} from '@chakra-ui/react';
import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { IoCloseOutline } from 'react-icons/io5';
import { ProjectManagementService, TaskComment } from 'src/services';
import { ShiftBtn } from './bits-utils/ShiftBtn';
import { PrimaryTextarea } from './bits-utils/PrimaryTextArea';
import { yupResolver } from '@hookform/resolvers/yup';

type Props = {
    isOpen?: any;
    onClose?: any;
    taskId: any;
    setTrigger: any;
};

const schema = yup.object().shape({
    comment: yup.string().required(),
});

const AddCommentModal = ({ isOpen, onClose, taskId, setTrigger }: Props) => {
    const toast = useToast();

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm<TaskComment>({
        resolver: yupResolver(schema),
        mode: 'all',
        defaultValues: {
            projectTaskId: taskId,
        },
    });

    const postAComment = async (data: TaskComment) => {
        try {
            const result = await ProjectManagementService.addComment(data);
            if (result.status) {
                toast({
                    title: 'Contract Terminated',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setTrigger((prev: boolean) => !prev);
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            toast({
                title: err?.message || err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
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
                <ModalHeader textAlign="center" pb="0">
                    <Flex
                        justify="space-between"
                        color="#2D3748"
                        fontSize="20px"
                    >
                        <Text
                            // px={['1.5rem', '3.3rem']}
                            fontWeight="500"
                        >
                            Add New Comment
                        </Text>
                        <IoCloseOutline onClick={onClose} />
                    </Flex>
                </ModalHeader>

                <ModalBody pt="0">
                    <Box maxH="77vh" overflowY="auto">
                        <form onSubmit={handleSubmit(postAComment)}>
                            <PrimaryTextarea<TaskComment>
                                register={register}
                                error={errors?.comment}
                                name="comment"
                                defaultValue=""
                                // label="Comment"
                            />
                            <HStack gap="1rem" w="full" mt="1rem">
                                <ShiftBtn
                                    text="Save"
                                    bg="brand.400"
                                    color="white"
                                    h="34px"
                                    px="1rem"
                                    type="submit"
                                    loading={isSubmitting}
                                />
                                <ShiftBtn
                                    text="Cancel"
                                    bg="#8C8C8C"
                                    color="white"
                                    h="34px"
                                    px="1rem"
                                    onClick={onClose}
                                />
                            </HStack>
                        </form>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddCommentModal;
