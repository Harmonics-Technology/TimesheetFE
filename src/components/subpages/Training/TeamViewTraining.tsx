import {
    Box,
    Flex,
    HStack,
    Image,
    Spinner,
    Text,
    VStack,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { NotText } from '@components/bits-utils/NotText';
import { TrainingService, TrainingView } from 'src/services';
import { useRouter } from 'next/router';
import moment from 'moment';
import YouTubePreview from './YoutubePreview';
import { TrainingInFullScreen } from './TrainingInFullScreen';
import { useState } from 'react';

export const TeamViewTraining = ({ training, userId, trainingId }) => {
    const newData = training as TrainingView;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const [data, setData] = useState();
    const [isLoading, setLoading] = useState(false);
    const toast = useToast();

    const startTraining = async (value: any) => {
        setLoading(true);
        try {
            const result = await TrainingService.startTraining(
                userId,
                trainingId,
                value.id,
            );
            if (result.status) {
                setLoading(false);
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
                <HStack gap="68px" align="flex-start">
                    {newData?.files
                        ?.filter((x) => x.category === 'Document')
                        .map((x) => (
                            <Box>
                                <Flex
                                    border="0.55px solid"
                                    borderColor="#6A7F9D"
                                    borderRadius="15px"
                                    h="106px"
                                    w="94px"
                                    justify="center"
                                    align="center"
                                >
                                    <Image src="/assets/doc.png" />
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
                                    <Text
                                        fontSize=".9rem"
                                        color="brand.400"
                                        onClick={() => startTraining(x)}
                                    >
                                        {'Click to Start Training >> '}{' '}
                                        {isLoading && <Spinner size="sm" />}
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
                <HStack gap="39px">
                    {newData?.files
                        ?.filter((x) => x.category === 'Video')
                        .map((x) => (
                            <YouTubePreview
                                file={x}
                                key={x.id}
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
