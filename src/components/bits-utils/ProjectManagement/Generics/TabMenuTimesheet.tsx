import { Flex, HStack } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const TabMenuTimesheet = ({name}) => {
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
                    `/${role}/timesheets/${x.replaceAll(
                        ' ',
                        '-',
                    )}`,
                );
                return (
                    <Flex
                        bgColor={isActive ? 'brand.400' : 'transparent'}
                        borderRadius="0.3125rem 0.3125rem 0rem 0rem"
                        color={isActive ? 'white' : '#263238'}
                        p="0.5rem"
                        fontWeight="500"
                        textTransform="capitalize"
                        fontSize=".87rem"
                        cursor="pointer"
                        onClick={() =>
                            router.push(
                                `/${role}/timesheets/${x}`,
                            )
                        }
                        key={x}
                    >
                        {x.replaceAll('-', ' ')}
                    </Flex>
                );
            })}
        </HStack>
    );
};
