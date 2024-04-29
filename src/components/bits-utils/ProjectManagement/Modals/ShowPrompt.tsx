import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    Flex,
    ModalBody,
    HStack,
    Button,
    Box,
    Text,
} from '@chakra-ui/react';
import { ProgressSlider } from '@components/bits-utils/ProgressSlider';
import { Round } from '@components/generics/functions/Round';
import moment from 'moment';
import React, { useState } from 'react';
import { FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import BeatLoader from 'react-spinners/BeatLoader';

export const ShowPrompt = ({
    isOpen,
    onClose,
    onSubmit,
    loading,
    text,
    isProgress,
    data,
}: {
    isOpen: any;
    onClose: any;
    onSubmit?: any;
    loading?: any;
    text: any;
    isProgress?: any;
    data?: any;
}) => {
    const [sliderValue, setSliderValue] = useState(
        data?.percentageOfCompletion,
    );
    const pastDate = moment().diff(moment(data?.endDate), 'days') > 0;
    const [isLoading, setIsLoading] = useState(false);

    const updateProgress = () => {
        // setIsLoading(true);
        return;
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
                w={['88%', '35%']}
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
                mt="1rem"
                mb="1rem"
            >
                <ModalHeader textAlign="center">
                    <>
                        <Flex
                            justify="center"
                            color="gray.500"
                            fontSize="3rem"
                            mb="1rem"
                        >
                            <FaInfoCircle />
                        </Flex>
                        <Text
                            fontSize="1rem"
                            mb="1rem"
                            px={['1.5rem', '.5rem']}
                            fontWeight="400"
                            dangerouslySetInnerHTML={{ __html: text }}
                        ></Text>
                    </>
                </ModalHeader>

                <ModalBody>
                    <Box maxH="77vh" overflowY="auto" px={5}>
                        {isProgress && (
                            <ProgressSlider
                                sliderValue={sliderValue}
                                setSliderValue={setSliderValue}
                                leftText="SubTask Status"
                                showProgress
                                rightText={`${Round(sliderValue)}%`}
                                barColor={
                                    status == 'completed'
                                        ? 'brand.400'
                                        : status == 'ongoing' && pastDate
                                        ? 'red'
                                        : status == 'ongoing'
                                        ? '#f7e277'
                                        : status == 'not started'
                                        ? 'gray.100'
                                        : 'red'
                                }
                            />
                        )}
                        {!isProgress ? (
                            <HStack px=".8rem" spacing={4} w="full">
                                <Button
                                    variant="outline"
                                    height="2.6rem"
                                    width="full"
                                    borderColor="black"
                                    // bgColor="black"
                                    // _hover={{
                                    //   bgColor: 'white',
                                    //   color: 'black',
                                    //   border: '1px solid',
                                    //   borderColor: 'black',
                                    // }}
                                    onClick={() => {
                                        onClose();
                                    }}
                                >
                                    No
                                </Button>
                                <Button
                                    variant="solid"
                                    height="2.6rem"
                                    width="full"
                                    bgColor="brand.400"
                                    color="white"
                                    _hover={{
                                        bgColor: 'white',
                                        color: 'brand.400',
                                        border: '1px solid',
                                        borderColor: 'brand.400',
                                    }}
                                    isLoading={loading}
                                    spinner={
                                        <BeatLoader color="white" size={10} />
                                    }
                                    onClick={() => {
                                        onSubmit();
                                    }}
                                >
                                    Yes
                                </Button>
                            </HStack>
                        ) : (
                            <Button
                                variant="solid"
                                height="2.6rem"
                                width="full"
                                bgColor="brand.400"
                                color="white"
                                _hover={{
                                    bgColor: 'white',
                                    color: 'brand.400',
                                    border: '1px solid',
                                    borderColor: 'brand.400',
                                }}
                                isLoading={isLoading}
                                spinner={<BeatLoader color="white" size={10} />}
                                onClick={() => {
                                    updateProgress();
                                }}
                            >
                                Update
                            </Button>
                        )}
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
