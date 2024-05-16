import { Box, Spinner, Text } from '@chakra-ui/react';
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
    const videoId = file.fileUrl.split('v=')[1];

    return (
        <Box>
            <Text fontSize="12px" fontWeight={500} color="#1a202c" mb="7px">
                {file.title}
            </Text>
            <Box w="170px" h="104px" overflow="hidden">
                <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${videoId}`}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="YouTube Video"
                />
            </Box>
            {isLesson && (
                <Text
                    fontSize=".9rem"
                    color="brand.400"
                    onClick={() => viewDoc(file)}
                >
                    {'Click to Start Training >> '}{' '}
                    {isLoading && <Spinner size="sm" />}
                </Text>
            )}
        </Box>
    );
};

export default YouTubePreview;
