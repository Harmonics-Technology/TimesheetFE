import { Box, VStack, Text, HStack, Avatar } from '@chakra-ui/react';
import { CAD } from '@components/generics/functions/Naira';
import moment from 'moment';
import React, { useContext } from 'react';
import { ProgressBar } from '../Generics/ProgressBar';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';

export const ProjectCard = ({ data }: { data: any }) => {
    const duration = '6 Months';
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <Box
            borderRadius=".6rem"
            bgColor="white"
            padding="1.5rem 1.5rem"
            cursor="pointer"
            onClick={() =>
                router.push(`/${role}/project-management/projects/${data?.id}`)
            }
        >
            <VStack justify="space-between" align="flex-start" w="full">
                <Box>
                    <Text
                        fontWeight={500}
                        color="black"
                        mb="0"
                        fontFamily="Roboto"
                    >
                        {data?.title}
                    </Text>
                    <Text
                        fontWeight={400}
                        color="#b6b6b6"
                        mb="0"
                        fontSize=".8rem"
                    >
                        {data?.desc}
                    </Text>
                </Box>
                <Box
                    bgColor="#bff1df"
                    color="#2eb67d"
                    p="0.44rem 0.75rem"
                    borderRadius="0.25rem"
                    fontSize="0.75rem"
                    my="0.5rem"
                >
                    Due Date: {moment().format('Do MMM YYYY')}
                </Box>
                <HStack justify="space-between" align="flex-start" w="full">
                    <Text
                        mb="0"
                        fontSize="0.75rem"
                        color="#455A64"
                        fontWeight={600}
                    >
                        Budget: {CAD(data?.budget)}
                    </Text>
                    <HStack gap="0">
                        {data?.users?.map((x: any, i: any) => (
                            <Avatar
                                size={'sm'}
                                name={x?.fullName}
                                src={x?.url}
                                border="1px solid white"
                                transform={`translateX(${-i * 10}px)`}
                            />
                        ))}
                    </HStack>
                </HStack>
                <Box w="full" mt="0.5rem">
                    <ProgressBar
                        barWidth={50}
                        showProgress={true}
                        barColor={'brand.400'}
                        leftText="Progress"
                        rightText={`$ {duration} left`}
                    />
                </Box>
            </VStack>
        </Box>
    );
};
