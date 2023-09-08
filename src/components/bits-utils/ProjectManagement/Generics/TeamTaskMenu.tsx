import { HStack, Flex } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const TeamTaskMenu = ({ name }) => {
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const router = useRouter();
    function filterProjects(val: number) {
        router.push({
            query: {
                ...router.query,
                status: val,
            },
        });
    }
    return (
        <HStack
            my="2rem"
            align="center"
            w="full"
            borderBottom="2px solid #e5e5e5"
        >
            {name.map((x: any) => {
                const isActive = router.pathname.startsWith(
                    `/${role}/project-management/${x.id}`,
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
                        onClick={() => () => filterProjects(x.id)}
                    >
                        {x.name}
                        <Flex
                            ml="0.5rem"
                            bgColor="#E9EDF5"
                            color="brand.400"
                            borderRadius="0.8125rem"
                            p="0rem 0.375rem"
                        >
                            {x.count}
                        </Flex>
                    </Flex>
                );
            })}
        </HStack>
    );
};
