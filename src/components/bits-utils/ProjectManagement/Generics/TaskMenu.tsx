import { HStack, Flex } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const TaskMenu = ({ name, id }) => {
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const router = useRouter();
    return (
        <HStack
            my="2rem"
            align="center"
            w="full"
            borderBottom="2px solid #e5e5e5"
        >
            {name.map((x: any) => {
                const isActive = router.pathname.startsWith(
                    `/${role}/project-management/projects/[id]/${x.replaceAll(
                        ' ',
                        '-',
                    )}`,
                );
                return (
                    <Flex
                        borderBottom={isActive ? '2px solid' : 'none'}
                        borderColor="brand.400"
                        color={isActive ? 'brand.400' : '#696969'}
                        pb="0.5rem"
                        fontWeight="500"
                        textTransform="capitalize"
                        fontSize=".87rem"
                        cursor="pointer"
                        onClick={() =>
                            router.push(
                                `/${role}/project-management/projects/${id}/${x}`,
                            )
                        }
                    >
                        {x.replaceAll('-', ' ')}
                    </Flex>
                );
            })}
        </HStack>
    );
};
