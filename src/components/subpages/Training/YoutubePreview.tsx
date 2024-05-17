import { Box, Text } from '@chakra-ui/react';
import { formatDate } from '@components/generics/functions/formatDate';
import React from 'react';

const YouTubePreview = ({
    file,
    isLesson,
    viewDoc,
    isLoading,
}: {
    file: any;
    isLesson?: boolean;
    viewDoc?: any;
    isLoading?: any;
}) => {
    // Extract video ID from the YouTube link
    const videoId =
        file?.trainingFile?.fileUrl?.split('v=')[1] ||
        file?.fileUrl?.split('v=')[1];

    return (
        <Box w="170px">
            <Text fontSize="12px" fontWeight={500} color="#1a202c" mb="7px">
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
            {isLesson && (
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
            )}
        </Box>
    );
};

export default YouTubePreview;
