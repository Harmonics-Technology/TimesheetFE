import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    HStack,
    Button,
    Box,
    Text,
    Heading,
    Stack,
    Grid,
    Progress,
} from '@chakra-ui/react';
import { CustomTime } from '@components/bits-utils/CustomTime';
import useComponentVisible from '@components/generics/useComponentVisible';
import moment from 'moment';
import { useState } from 'react';
import BeatLoader from 'react-spinners/BeatLoader';
const AddHoursToTimesheetModal = ({
    isOpen,
    onClose,
    onSubmit,
    // loading,
    text,
    isProgress,
    data,
    sliderValue,
    watch,
    task,
    subTask,
    onSunmit,
    loading,
    setAddItemToTimesheet,
}: {
    isOpen: any;
    onClose: any;
    onSubmit?: any;
    loading?: any;
    text: any;
    isProgress?: any;
    data?: any;
    sliderValue?: any;
    watch?: any;
    task?: any;
    subTask?: any;
    onSunmit?: any;
    setAddItemToTimesheet?: any;
}) => {
    const subTaskValue = subTask?.find(
        (x: any) => x?.id === watch('projectSubTaskId'),
    );

    const [addTime, setAddTime] = useState(false);
    const [time, setTime] = useState();
    const {
        ref: timeRef,
        isComponentVisible: startVisible,
        setIsComponentVisible: startIsVisible,
    } = useComponentVisible(false);

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            motionPreset="slideInBottom"
            isCentered
        >
            <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px) " />

            <ModalContent
                py="5"
                borderRadius="0px"
                w="88%"
                overflow="hidden"
                maxH="100vh"
                pos="fixed"
            >
                <ModalHeader textAlign="center">
                    <Heading fontSize={16} fontWeight={600}>
                        Do you want to add this hours to your timesheet
                    </Heading>
                </ModalHeader>

                <ModalBody>
                    <Box>
                        <Stack spacing="24px">
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Task Name
                                </Heading>
                                <Text fontSize={14.5}>{task?.name}</Text>
                            </Box>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Sub Task Name
                                </Heading>
                                <Text fontSize={14.5}>
                                    {subTaskValue?.name}
                                    {/* {subTask?.map((x: any) => watch(x.name))} */}
                                    {/* {watch('subtask.name')} */}
                                </Text>
                            </Box>
                            <Grid
                                templateColumns={[
                                    'repeat(1,1fr)',
                                    'repeat(2,1fr)',
                                ]}
                                gap="1rem 1rem"
                                w="full"
                            >
                                <Box>
                                    <Heading
                                        mb="4px"
                                        fontSize={15}
                                        fontWeight={500}
                                    >
                                        Start Date
                                    </Heading>
                                    <Text fontSize={14.5}>
                                        {moment(watch('startDate')).format(
                                            'YYYY/MM/DD',
                                        )}
                                    </Text>
                                </Box>
                                <Box>
                                    <Heading
                                        mb="4px"
                                        fontSize={15}
                                        fontWeight={500}
                                    >
                                        End Date
                                    </Heading>
                                    <Text fontSize={14.5}>
                                        {moment(watch('endDate')).format(
                                            'YYYY/MM/DD',
                                        )}
                                    </Text>
                                </Box>
                            </Grid>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Hours
                                </Heading>
                                <Text fontSize={14.5}>{watch('hours')}</Text>
                            </Box>
                            <Box>
                                <Heading
                                    mb="4px"
                                    fontSize={15}
                                    fontWeight={500}
                                >
                                    Percentage Complete
                                </Heading>
                                <Box>
                                    <Text
                                        textAlign="right"
                                        color="#787486"
                                        fontSize={12}
                                    >
                                        {sliderValue}%
                                    </Text>
                                    <Progress
                                        value={sliderValue}
                                        h="5px"
                                        borderRadius="5px"
                                        colorScheme="green"
                                    />
                                </Box>
                            </Box>
                            {addTime && (
                                <Box w="full">
                                    <CustomTime
                                        time={time}
                                        timeRef={timeRef}
                                        startIsVisible={startIsVisible}
                                        startVisible={startVisible}
                                        setTime={setTime}
                                        w="40%"
                                    />
                                </Box>
                            )}
                            {addTime ? (
                                <HStack
                                    px=".8rem"
                                    spacing={4}
                                    w="full"
                                    justifyContent="space-between"
                                >
                                    <Button
                                        borderRadius="5px"
                                        height="2.6rem"
                                        width="70px"
                                        color="#ffffff"
                                        bg="#FF5B79"
                                        fontWeight={500}
                                        onClick={() => setAddTime(false)}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="solid"
                                        height="2.6rem"
                                        width="auto"
                                        bgColor="brand.400"
                                        color="white"
                                        borderRadius="5px"
                                        fontWeight={500}
                                        _hover={{
                                            bgColor: 'white',
                                            color: 'brand.400',
                                            border: '1px solid',
                                            borderColor: 'brand.400',
                                        }}
                                        isLoading={loading}
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size={10}
                                            />
                                        }
                                        isDisabled={!time}
                                        onClick={() => onSubmit(true, time)}
                                    >
                                        Confirm
                                    </Button>
                                </HStack>
                            ) : (
                                <HStack
                                    px=".8rem"
                                    spacing={4}
                                    w="full"
                                    justifyContent="space-between"
                                >
                                    <Button
                                        borderRadius="5px"
                                        height="2.6rem"
                                        width="70px"
                                        color="#ffffff"
                                        bg="#FF5B79"
                                        fontWeight={500}
                                        onClick={() => onSubmit(false)}
                                    >
                                        No
                                    </Button>
                                    <Button
                                        variant="solid"
                                        height="2.6rem"
                                        width="auto"
                                        bgColor="brand.400"
                                        color="white"
                                        borderRadius="5px"
                                        fontWeight={500}
                                        _hover={{
                                            bgColor: 'white',
                                            color: 'brand.400',
                                            border: '1px solid',
                                            borderColor: 'brand.400',
                                        }}
                                        isLoading={loading}
                                        spinner={
                                            <BeatLoader
                                                color="white"
                                                size={10}
                                            />
                                        }
                                        onClick={() => setAddTime(true)}
                                    >
                                        Add to timesheet
                                    </Button>
                                </HStack>
                            )}
                        </Stack>
                    </Box>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default AddHoursToTimesheetModal;
