import {
    Box,
    Button,
    Flex,
    FormLabel,
    Grid,
    HStack,
    Icon,
    Text,
    Textarea,
    VStack,
    useDisclosure,
    useSteps,
    useToast,
} from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { formatDate } from '@components/generics/functions/formatDate';
import moment from 'moment';
import React, { useContext, useState } from 'react';
import {
    AiOutlineCalendar,
    AiOutlinePause,
    AiOutlinePercentage,
} from 'react-icons/ai';
import { StepperBlock } from './StepperBlock';
import { useRouter } from 'next/router';
import Checkbox from '../Checkbox';
import { CancelServiceBox } from './CancelServiceBox';
import { PauseModal } from './PauseModal';
import { BiSupport } from 'react-icons/bi';
import TitleText from '../TitleText';
import { CancelSubscriptionModel, UserService } from 'src/services';

const steps = [
    { title: 'Details', id: 1 },
    { title: 'Feedback', id: 2 },
    { title: 'Service', id: 3 },
    { title: 'Offer', id: 4 },
    { title: 'Review', id: 5 },
];
const reasons = [
    { title: 'I’m not using the product(s) often enough', id: 1 },
    { title: 'I’m looking to change my plan', id: 2 },
    { title: 'Too expensive', id: 3 },
    { title: 'Software crashing/failing', id: 4 },
    { title: 'Product features are not working well', id: 5 },
    { title: 'It doesn’t have the features that I want', id: 6 },
    { title: 'I just want to cancel automatic renewal', id: 7 },
    { title: 'The purpose of use was completed', id: 8 },
];
const CancelSub = () => {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const currentSub: any = user?.subscriptiobDetails?.data;
    const { activeStep, setActiveStep } = useSteps({
        index: 1,
        count: steps.length,
    });
    const [reason, setReason] = useState<any>([]);
    const selectReason = (base) => {
        const exists = reason.find((x) => x.id == base?.id);
        if (exists) {
            setReason(reason.filter((x) => x.id !== base?.id));
            return;
        }
        setReason([...reason, base]);
    };
    const stringifiedReason = reason.map((x) => x?.title)?.join(',');

    const { isOpen, onOpen, onClose } = useDisclosure();
    const role = user?.role.replaceAll(' ', '');
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const cancelSubscription = async (data: CancelSubscriptionModel) => {
        data.userId = user?.id;
        data.reason = stringifiedReason;
        try {
            setLoading(true);
            const result = await UserService.cancelSubscription(data);
            if (result.status) {
                //
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.reload();
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <Box>
            <Flex
                justify="space-between"
                p="1rem"
                borderRadius="0.44rem"
                bgColor="white"
                mb="1.2rem"
            >
                <Text
                    fontSize=".875rem"
                    color="#2d3758"
                    fontWeight="500"
                    mb="0"
                >
                    Cancel Plan
                </Text>
                <Button
                    bgColor="#A6ACBE"
                    color="white"
                    h="1.62rem"
                    fontSize=".812rem"
                    borderRadius="4px"
                    onClick={() => router.back()}
                >
                    Back
                </Button>
            </Flex>
            <Box
                borderRadius="0.44rem"
                bgColor="white"
                p="2rem 1rem"
                mb="1.2rem"
            >
                <StepperBlock steps={steps} activeStep={activeStep} w="80%" />
            </Box>
            <Box borderRadius="0.44rem" bgColor="white" p="2rem 1rem">
                {activeStep == 1 ? (
                    <Box w="60%">
                        <Text
                            fontSize="1.125rem"
                            color="#2d3758"
                            fontWeight="500"
                            mb="2rem"
                        >
                            We are sorry to see you go
                        </Text>
                        <Text
                            fontSize="0.875rem"
                            color="#8c8c8c"
                            fontWeight="400"
                        >
                            You have used {currentSub?.subscription?.name}{' '}
                            {currentSub?.annualBilling ? 'annual' : 'monthly'}{' '}
                            subscription for
                        </Text>
                        <HStack align="flex-end" my="1.5rem">
                            <Box pos="relative">
                                <Icon as={AiOutlineCalendar} fontSize="4rem" />
                                <Text
                                    pos="absolute"
                                    color="#2d3748"
                                    fontWeight="500"
                                    mb="0"
                                    transform="translate(-50%, -27%)"
                                    top="50%"
                                    left="50%"
                                >
                                    {moment().diff(
                                        moment(currentSub?.startDate),
                                        'day',
                                    )}
                                </Text>
                            </Box>
                            <Text
                                fontSize="0.875rem"
                                color="#8c8c8c"
                                fontWeight="400"
                                mb="1rem !important"
                            >
                                days
                            </Text>
                        </HStack>
                        <Text
                            fontSize="0.875rem"
                            color="#8c8c8c"
                            fontWeight="400"
                        >
                            Canceling subscription means you will lose the
                            following service after{' '}
                            <span
                                style={{ color: '#073367', fontWeight: '600' }}
                            >
                                {formatDate(currentSub?.endDate)}
                            </span>
                        </Text>
                    </Box>
                ) : activeStep == 2 ? (
                    <Box w="60%">
                        <Text
                            fontSize="1.125rem"
                            color="#2d3758"
                            fontWeight="500"
                            mb="2rem"
                        >
                            Why do you want to cancel your subscription plan ?
                        </Text>
                        <VStack align="flex-start" spacing="1.5rem">
                            {reasons?.map((x) => (
                                <Checkbox
                                    label={x.title}
                                    key={x.id}
                                    onChange={() => selectReason(x)}
                                    checked={reason.find((b) => b.id == x.id)}
                                    dir="rtl"
                                    color="#8c8c8c"
                                    className="formscheck"
                                />
                            ))}
                            <Box w="full">
                                <FormLabel
                                    fontSize=".9rem"
                                    mb=".5rem"
                                    fontWeight={400}
                                >
                                    Other Feedbacks
                                </FormLabel>
                                <Textarea
                                    resize="none"
                                    borderRadius=".18rem"
                                    border="1px solid #C4C4C4"
                                    color="#8c8c8c"
                                    placeholder="Enter your comment"
                                    onChange={(e) =>
                                        selectReason({
                                            id: 12,
                                            title: e.target.value,
                                        })
                                    }
                                />
                            </Box>
                        </VStack>
                    </Box>
                ) : activeStep == 3 ? (
                    <Box w="100%">
                        <Text
                            fontSize="1.125rem"
                            color="#2d3758"
                            fontWeight="500"
                            mb="2rem"
                        >
                            Before you go consider these alternatives
                        </Text>
                        <Grid
                            templateColumns={['1fr', 'repeat(3, 1fr)']}
                            gap="2rem"
                        >
                            <CancelServiceBox
                                title={'Pause Subscription'}
                                icon={AiOutlinePause}
                                sub={'Take a break instead'}
                                minSub="you can resume at anytime"
                                onClick={onOpen}
                                btnText="Pause Subscription"
                            />
                            <CancelServiceBox
                                title={'Customer Service'}
                                icon={BiSupport}
                                sub={'Get 1 - 1 with support'}
                                minSub="Describe your problem and get a solution"
                                onClick={undefined}
                                btnText="Chat Now"
                            />
                        </Grid>
                    </Box>
                ) : activeStep == 4 ? (
                    <Box w="100%">
                        <Text
                            fontSize="1.125rem"
                            color="#2d3758"
                            fontWeight="500"
                            mb="2rem"
                        >
                            Before you go consider these alternatives
                        </Text>
                        <Grid
                            templateColumns={['1fr', 'repeat(3, 1fr)']}
                            gap="2rem"
                        >
                            <CancelServiceBox
                                title={'20% Off Discount'}
                                icon={AiOutlinePercentage}
                                sub={'Special discount for next renewal'}
                                maxSub="USD 30.00"
                                onClick={undefined}
                                btnText="Get Discount"
                            />
                        </Grid>
                    </Box>
                ) : activeStep == 5 ? (
                    <Box w="60%">
                        <Text
                            fontSize="1.125rem"
                            color="#2d3758"
                            fontWeight="500"
                            mb="2rem"
                        >
                            Cancellation Details Include
                        </Text>
                        <VStack spacing="2.5rem" align="flex-start">
                            <TitleText
                                title="Deductions"
                                text="No more deductions next period"
                                fontSize="1rem"
                            />
                            <TitleText
                                title="Limited Access"
                                text="After your plan expires, you don’t have access to the features and application again"
                                fontSize="1rem"
                            />
                            <TitleText
                                title="Plan Date"
                                text="Access to your current plan will end after the expiration date"
                                fontSize="1rem"
                            />
                        </VStack>
                        <HStack mt="2rem" spacing="1rem">
                            <Button
                                color="white"
                                bgColor="brand.400"
                                h="2.75rem"
                                fontSize=".875rem"
                                w="7.6rem"
                                fontWeight={600}
                                borderRadius=".3rem"
                                isLoading={loading}
                                // onClick={cancelSubscription}
                            >
                                Confirm
                            </Button>
                            <Button
                                color="white"
                                bgColor="#dd2025"
                                h="2.75rem"
                                fontSize=".875rem"
                                w="7.6rem"
                                fontWeight={600}
                                borderRadius=".3rem"
                                onClick={() =>
                                    router.push(
                                        `/${role}/account-management/manage-subscription`,
                                    )
                                }
                            >
                                Cancel
                            </Button>
                        </HStack>
                    </Box>
                ) : null}

                {activeStep <= 4 && (
                    <Flex justify="flex-end" mt="4rem">
                        <Button
                            bgColor="brand.400"
                            color="white"
                            fontWeight="600"
                            fontSize=".875rem"
                            px="2rem"
                            h="2.75rem"
                            borderRadius=".37rem"
                            onClick={() => setActiveStep((prev) => prev + 1)}
                        >
                            Continue
                        </Button>
                    </Flex>
                )}
            </Box>
            {isOpen && <PauseModal isOpen={isOpen} onClose={onClose} />}
        </Box>
    );
};

export default CancelSub;
