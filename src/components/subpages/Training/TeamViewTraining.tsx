import {
    Box,
    Flex,
    HStack,
    Icon,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { TrainingAssigneeView, TrainingService } from 'src/services';
import { useRouter } from 'next/router';
import moment from 'moment';
import YouTubePreview from './YoutubePreview';
import { TrainingInFullScreen } from './TrainingInFullScreen';
import { useState } from 'react';
import { IoDocumentTextSharp } from 'react-icons/io5';
import { formatDate } from '@components/generics/functions/formatDate';

export const TeamViewTraining = ({ training, userId, trainingId }) => {
    const newData = training as TrainingAssigneeView[];
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState({ id: '' });
    const toast = useToast();

    const startTraining = async (value: any) => {
        setLoading({ id: value.id });
        try {
            const result = await TrainingService.startTraining(
                userId,
                trainingId,
                value.id,
            );
            if (result.status) {
                setLoading({ id: '' });
                setData(value);
                onOpen();
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
                {/* <NotText title={newData?.name} /> */}
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
                    {newData
                        ?.filter(
                            (x) => x?.trainingFile?.category === 'Document',
                        )
                        .map((x) => (
                            <Box w="170px">
                                <Flex
                                    border="0.55px solid"
                                    borderColor="#6A7F9D"
                                    borderRadius="15px"
                                    h="106px"
                                    w="100px"
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
                                        {x.trainingFile?.title}
                                    </Text>
                                    <Text
                                        fontSize="10px"
                                        fontWeight={400}
                                        color="#c4c4c4"
                                    >
                                        {moment(
                                            x?.trainingFile?.dateCreated,
                                        ).fromNow()}
                                    </Text>
                                    <Text
                                        fontSize=".8rem"
                                        onClick={() => startTraining(x)}
                                        mt=".5rem"
                                        cursor="pointer"
                                        wordBreak="break-word"
                                        _hover={{
                                            color: 'brand.400',
                                        }}
                                    >
                                        {isLoading.id == x.trainingFileId
                                            ? 'Starting Training ...'
                                            : x?.isCompleted
                                            ? `Training Completed on ${formatDate(
                                                  x?.dateCompleted,
                                              )}`
                                            : x?.isStarted
                                            ? 'Continue Training >>'
                                            : 'Click to Start Training >> '}
                                    </Text>
                                    {/* <HStack
                                        color="#a6acbe"
                                        fontSize="13px"
                                        cursor="pointer"
                                    >
                                        <Icon
                                            as={BsEye}
                                            onClick={() => viewDoc(x?.fileUrl)}
                                        />

                                        <Icon
                                            as={MdDelete}
                                            // onClick={() => deleteFile(x?.id)}
                                        />
                                    </HStack> */}
                                </VStack>
                            </Box>
                        ))}
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
                    {newData
                        ?.filter((x) => x?.trainingFile?.category === 'Video')
                        .map((x) => (
                            <YouTubePreview
                                file={x}
                                key={x.trainingFileId}
                                isLesson
                                viewDoc={startTraining}
                                isLoading={isLoading}
                            />
                        ))}
                </HStack>
            </Box>
            {isOpen && (
                <TrainingInFullScreen
                    isOpen={isOpen}
                    onClose={onClose}
                    file={data}
                    userId={userId}
                    trainingId={trainingId}
                />
            )}
        </Box>
    );
};
