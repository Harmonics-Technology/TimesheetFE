import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { TextSub } from './TextSub';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';

export const TeamMemberCard = ({ data, id }: { data: any; id: any }) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    return (
        <HStack
            borderRadius=".6rem"
            bgColor="white"
            padding="1rem"
            align="flex-start"
            gap="1rem"
            cursor="pointer"
            onClick={() =>
                router.push(
                    `/${role}/project-management/projects/${id}/team-members/${5}`,
                )
            }
        >
            <Avatar
                size={'md'}
                name={'Ade john'}
                src={'https://bit.ly/sage-adebayo'}
                border="2px solid white"
            />
            <VStack spacing="1rem" align="flex-start">
                <TextSub name="Jamila Rufai" sub="jamila.rufai@sample.com" />
                <TextSub name="Business Analyst" sub="IT Department" />
                <TextSub name="40 Hrs Logged" sub="Total hours logged" />
            </VStack>
        </HStack>
    );
};
