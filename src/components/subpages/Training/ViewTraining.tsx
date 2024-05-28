import {
    Box,
    Button,
    Circle,
    Flex,
    Grid,
    HStack,
    Icon,
    Spinner,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { NotText } from '@components/bits-utils/NotText';
import { BsEye } from 'react-icons/bs';
import { MdDelete } from 'react-icons/md';
import { AddTeamMemberModal } from './AddTeamMemberModal';
import { TrainingService, TrainingView } from 'src/services';
import { useRouter } from 'next/router';
import moment from 'moment';
import YouTubePreview from './YoutubePreview';
import { useState } from 'react';
import { AddTrainingMaterialModal } from './AddTrainingMaterialModal';
import { AiOutlinePlus } from 'react-icons/ai';
import { IoDocumentTextSharp } from 'react-icons/io5';

export const ViewTraining = ({ id, data, users }) => {
    const newData = data as TrainingView;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: onOpens, onClose: close } = useDisclosure();
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState({ id: '' });
    const deleteUserFromTraining = async (userId: any) => {
        setLoading({ id: userId });
        try {
            const result = await TrainingService.deleteAssignedUser(userId, id);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const deleteFile = async (fileId: any) => {
        setLoading({ id: fileId });
        try {
            const result = await TrainingService.deleteTrainingFile(fileId);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading({ id: '' });
                router.replace(router.asPath);
                return;
            }
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            setLoading({ id: '' });
        } catch (err: any) {
            setLoading({ id: '' });
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const viewDoc = (url: any) => {
        window.open(url, '_blank');
    };
    return (
        <Box
            py="1.5rem"
            mb="1rem"
            bgColor="white"
            px="1rem"
            borderRadius="10px"
        >
            <Box mt="0rem" w="70%">
                <Text
                    color="brand.400"
                    fontWeight={500}
                    fontSize=".8rem"
                    onClick={() => router.back()}
                    cursor="pointer"
                    mb=".5rem"
                >
                    Back
                </Text>
                <NotText title={newData?.name} />
            </Box>
            <Box mt="0rem" w="100%" pb="2rem" borderBottom="1px solid #d9d9d9">
                <Text
                    fontSize="13px"
                    fontWeight={500}
                    color="#1a202c"
                    mb="27px"
                >
                    Documents
                </Text>
                <HStack gap="68px" align="flex-start" flexWrap="wrap">
                    {newData?.files
                        ?.filter((x) => x.category === 'Document')
                        .map((x) => (
                            <Box w="170px">
                                <Flex
                                    border="0.55px solid"
                                    borderColor="#6A7F9D"
                                    borderRadius="15px"
                                    h="106px"
                                    w="94px"
                                    justify="center"
                                    align="center"
                                >
                                    <Icon
                                        fontSize="3rem"
                                        as={IoDocumentTextSharp}
                                        color="#6A7F9D"
                                    />
                                </Flex>
                                <VStack gap="0rem" align="flex-start" mt="15px">
                                    <Text
                                        fontSize="11px"
                                        fontWeight={500}
                                        color="#1a202c"
                                    >
                                        {x.title}
                                    </Text>
                                    <Text
                                        fontSize="10px"
                                        fontWeight={400}
                                        color="#c4c4c4"
                                    >
                                        {moment(x?.dateCreated).fromNow()}
                                    </Text>
                                    <HStack
                                        color="#a6acbe"
                                        fontSize="13px"
                                        cursor="pointer"
                                    >
                                        <Icon
                                            as={BsEye}
                                            onClick={() => viewDoc(x?.fileUrl)}
                                        />
                                        {loading?.id === x?.id ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            <Icon
                                                as={MdDelete}
                                                onClick={() =>
                                                    deleteFile(x?.id)
                                                }
                                            />
                                        )}
                                    </HStack>
                                </VStack>
                            </Box>
                        ))}
                    <Box onClick={onOpens} cursor="pointer">
                        <Flex
                            border="0.55px solid"
                            borderColor="#6A7F9D"
                            borderRadius="15px"
                            h="106px"
                            w="94px"
                            justify="center"
                            align="center"
                        >
                            <Circle size="48px" border="0.5px solid #6A7F9D">
                                <Icon as={AiOutlinePlus} color="#6A7F9D" />
                            </Circle>
                        </Flex>
                        <Text
                            fontSize="11px"
                            fontWeight={500}
                            color="#1a202c"
                            mt="15px"
                        >
                            Add new material
                        </Text>
                    </Box>
                </HStack>
            </Box>
            <Box mt="1rem" w="100%" borderBottom="1px solid #d9d9d9" pb="2rem">
                <Text
                    fontSize="13px"
                    fontWeight={500}
                    color="#1a202c"
                    mb="27px"
                >
                    Videos
                </Text>
                <HStack gap="39px" align="flex-start" flexWrap="wrap">
                    {newData?.files
                        ?.filter((x) => x.category === 'Video')
                        .map((x) => (
                            <YouTubePreview file={x} key={x.id} />
                        ))}
                </HStack>
            </Box>
            <Box mt="1rem" w="100%">
                <Text
                    fontSize="13px"
                    fontWeight={500}
                    color="#1a202c"
                    mb="27px"
                >
                    Team Members Assigned to the Training
                </Text>
                <Grid templateColumns={['repeat(4, 1fr)']} gap="18px">
                    {newData?.assignees?.map((x) => (
                        <HStack
                            h="42px"
                            align="center"
                            justify="space-between"
                            border="1px solid #CBD5E0"
                            px="1rem"
                        >
                            <Text fontSize="12px" color="#718096">
                                {x.user?.fullName}
                            </Text>
                            {loading.id == x.userId ? (
                                <Spinner size="sm" />
                            ) : (
                                <Icon
                                    as={MdDelete}
                                    onClick={() =>
                                        deleteUserFromTraining(x.userId)
                                    }
                                    cursor="pointer"
                                />
                            )}
                        </HStack>
                    ))}
                </Grid>

                <Box my="2rem">
                    <Button
                        h="30px"
                        color="white"
                        bgColor="brand.400"
                        borderRadius="5px"
                        onClick={onOpen}
                        fontSize="12px"
                    >
                        Assign Team members
                    </Button>
                </Box>
            </Box>
            {isOpen && (
                <AddTeamMemberModal
                    isOpen={isOpen}
                    onClose={onClose}
                    trainingId={id}
                    users={users}
                    training={newData}
                />
            )}
            {open && (
                <AddTrainingMaterialModal
                    isOpen={open}
                    onClose={close}
                    trainingId={id}
                />
            )}
        </Box>
    );
};
