import { HStack, Text } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

interface leaveProps {
    tabValue: any[];
    useStartWith?: boolean;
}

export const LeaveTab = ({ tabValue, useStartWith }: leaveProps) => {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const role = user?.role?.replaceAll(' ', '');

    return (
        <HStack w="full" borderBottom="1px solid #EBEFF2" gap="1rem">
            {tabValue.map((x) => {
                const isActive = useStartWith
                    ? router.pathname.startsWith(`/${role}${x.url}`)
                    : router.pathname == `/${role}${x.url}`;
                return (
                    <Link href={x?.upgrade ? '' : `/${role}${x.url}`} passHref>
                        <Text
                            fontWeight="700"
                            fontSize=".9rem"
                            color={isActive ? 'black' : ' #A6ACBE'}
                            _hover={{
                                textDecor: 'none',
                                color: 'brand.400',
                            }}
                            borderBottom={isActive ? '4px solid #2EAFA3' : '0'}
                            mb="0"
                            pb=".5rem"
                            cursor="pointer"
                        >
                            {x.text}
                        </Text>
                    </Link>
                );
            })}
        </HStack>
    );
};
