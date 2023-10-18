import { Avatar, Box, HStack, Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { TextSub } from './TextSub';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import { ProjectTaskAsigneeView } from 'src/services';

export const TeamMemberCard = ({
    data,
    id,
}: {
    data: ProjectTaskAsigneeView;
    id: any;
}) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    // console.log({ data });
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
                    `/${role}/project-management/projects/${id}/team-members/${data?.userId}`,
                )
            }
        >
            <Avatar
                size={'md'}
                name={data?.user?.fullName as string}
                src={data?.user?.profilePicture as string}
                border="2px solid white"
            />
            <VStack spacing="1rem" align="flex-start">
                <TextSub name={data?.user?.fullName} sub={data?.user?.email} />
                <TextSub
                    name={data?.user?.employeeInformation?.jobTitle}
                    sub="IT Department"
                />
                <TextSub
                    name={`${data?.hoursLogged} Hrs Logged`}
                    sub="Total hours logged"
                />
            </VStack>
        </HStack>
    );
};
