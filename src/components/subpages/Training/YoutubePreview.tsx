import { Box, HStack, Icon, Spinner, Text } from '@chakra-ui/react';
import { formatDate } from '@components/generics/functions/formatDate';
import React from 'react';
import { MdDelete } from 'react-icons/md';

const YouTubePreview = ({
    file,
    isLesson,
    viewDoc,
    isLoading,
    deleteFile,
    loading,
}: {
    file: any;
    isLesson?: boolean;
    viewDoc?: any;
    isLoading?: any;
    deleteFile?: any;
    loading?: any;
}) => {
    // Extract video ID from the YouTube link
    const videoId =
        file?.trainingFile?.fileUrl?.split('v=')[1] ||
        file?.fileUrl?.split('v=')[1];

    return (
        <Box w="170px">
            <Text fontSize="12px" fontWeight={500} color="#1a202c" mb="7px" noOfLines={2}>
                {file?.trainingFile?.title || file?.title}
            </Text>
            <Box w="100%" h="104px" overflow="hidden">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                    style={{ pointerEvents: 'none' }}
                />
            </Box>
            {isLesson ? (
                <Text
                    fontSize=".8rem"
                    // color="brand.400"
                    onClick={() => viewDoc(file.trainingFile)}
                    mt=".5rem"
                    cursor="pointer"
                    wordBreak="break-word"
                    _hover={{
                        color: 'brand.400',
                    }}
                >
                    {/* {'Click to Start Training >> '}{' '}  <Spinner size="sm" /> */}
                    {isLoading.id == file.trainingFileId
                        ? 'Starting Training ...'
                        : file?.isCompleted
                        ? `Training Completed on ${formatDate(
                              file?.dateCompleted,
                          )}`
                        : file?.isStarted
                        ? 'Continue Training >>'
                        : 'Click to Start Training >> '}
                </Text>
            ) : (
                <HStack
                    color="#a6acbe"
                    fontSize="16px"
                    cursor="pointer"
                    mt=".2rem"
                >
                    {loading?.id === file?.id ? (
                        <Spinner size="sm" />
                    ) : (
                        <Icon
                            as={MdDelete}
                            onClick={() => deleteFile(file?.id)}
                        />
                    )}
                </HStack>
            )}
        </Box>
    );
};

export default YouTubePreview;
