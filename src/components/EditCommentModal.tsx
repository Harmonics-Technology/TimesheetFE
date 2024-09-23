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
import { IoCloseOutline } from 'react-icons/io5';
import { ProjectManagementService, TaskComment, UserView } from 'src/services';
import { ShiftBtn } from './bits-utils/ShiftBtn';
import { EditorState, convertToRaw, Modifier, ContentState, convertFromHTML } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import dynamic from 'next/dynamic';
import { useContext, useEffect, useState } from 'react';
import { fetchAllUserRoles } from './generics/functions/FetchAllUsers';
import { UserContext } from './context/UserContext';


const Editor = dynamic(
    () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
    {
        ssr: false,
    },
);

type Props = {
    isOpen?: any;
    onClose?: any;
    taskId: any;
    setTrigger: any;
    defaultComment: any
};

const CustomButton = ({ addAtSymbol }) => (
    <div className="rdw-option-wrapper" onClick={addAtSymbol}>
        @
    </div>
);
const EditCommentModal = ({ isOpen, onClose, taskId, setTrigger, defaultComment }: Props) => {
    const toast = useToast();
    const [isLoading, setIsLoading] = useState({ id: '' });
    const [users, setUsers] = useState([]);
    const { user } = useContext(UserContext);

    const [editorState, setEditorState] = useState(
        EditorState.createWithContent(
            ContentState.createFromBlockArray(
                convertFromHTML(defaultComment?.comment || ''),
            ),
        ),
    );
    // const [editorState, setEditorState] = useState(defaultComment);

    const handleEditorChange = (newEditorState: EditorState) => {
        setEditorState(newEditorState);
    };

    const addAtSymbol = () => {
        const contentState = Modifier.replaceText(
            editorState.getCurrentContent(),
            editorState.getSelection(),
            '@',
            editorState.getCurrentInlineStyle(),
        );
        const newEditorState = EditorState.push(
            editorState,
            contentState,
            'insert-characters',
        );
        setEditorState(newEditorState);
    };

    const getHtmlContent = () => {
        const rawContentState = convertToRaw(editorState.getCurrentContent());
        const htmlContent = draftToHtml(rawContentState);
        return htmlContent;
    };

    const postAComment = async () => {
        const data: TaskComment = {
            id: defaultComment?.id,
            projectTaskId: taskId,
            comment: getHtmlContent() as string,
        };
        setIsLoading({ id: 'posting' });
        try {
        const result = await ProjectManagementService.updateComment(false, data);
        
            if (result.status) {
                toast({
                    title: 'Comment Edited Successfully',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setTrigger((prev: boolean) => !prev);
                onClose();
                setIsLoading({ id: '' });
                return;
            }
            toast({
                title: result?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setIsLoading({ id: '' });
            toast({
                title: err?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    useEffect(() => {
        fetchAllUserRoles({
            role: 'team member,super admin,admin,supervisor,payroll manager',
            setLoading: setIsLoading,
            superAdminId: user?.superAdminId,
            setUsers,
        });
    }, []);
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
                w={['88%', '35%']}
                overflow="hidden"
                maxH="100vh"
                maxW="unset"
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
                            Edit Comment
                        </Text>
                        <IoCloseOutline onClick={onClose} />
                    </Flex>
                </ModalHeader>

                <ModalBody pt=".5rem">
                    <Box maxH="77vh" overflowY="auto">
                        <form>
                            {/* <PrimaryTextarea<TaskComment>
                                register={register}
                                error={errors?.comment}
                                name="comment"
                                defaultValue=""
                                // label="Comment"
                            /> */}
                            <Box w="full">
                                <Editor
                                    //@ts-ignore
                                    editorState={editorState}
                                    onEditorStateChange={handleEditorChange}
                                    editorClassName="editor-class"
                                    wrapperClassName="wrapper-class"
                                    toolbarClassName="toolbar-class"
                                    toolbarCustomButtons={[
                                        <CustomButton
                                            addAtSymbol={addAtSymbol}
                                        />,
                                    ]}
                                    mention={{
                                        separator: ' ',
                                        trigger: '@',
                                        suggestions: users?.map(
                                            (x: UserView) => ({
                                                text: x.fullName,
                                                value: x.fullName,
                                                url: x.fullName,
                                            }),
                                        ),
                                    }}
                                    toolbar={{
                                        options: [
                                            'inline',
                                            // 'blockType',
                                            // 'fontSize',
                                            // 'fontFamily',
                                            'list',
                                            'textAlign',
                                            'emoji',
                                            'image',
                                            'colorPicker',
                                            'link',
                                            'embedded',
                                            'remove',
                                            'history',
                                        ],
                                        inline: {
                                            options: [
                                                'bold',
                                                'italic',
                                                'underline',
                                                'strikethrough',
                                                'monospace',
                                            ],
                                            inDropdown: false,
                                        },
                                        list: { inDropdown: true },
                                        textAlign: { inDropdown: true },
                                        link: { inDropdown: false },
                                        history: { inDropdown: false },
                                    }}
                                />
                            </Box>
                            <HStack gap="1rem" w="full" mt="1rem">
                                <ShiftBtn
                                    text="Save"
                                    bg="brand.400"
                                    color="white"
                                    h="34px"
                                    px="1rem"
                                    type="submit"
                                    onClick={postAComment}
                                    loading={isLoading?.id == 'posting'}
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

export default EditCommentModal;
