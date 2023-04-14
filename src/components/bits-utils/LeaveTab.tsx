import { HStack, Link, Text } from '@chakra-ui/react';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

interface leaveProps {
    tabValue: any[];
}

export const LeaveTab = ({ tabValue }: leaveProps) => {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const role = user?.role?.replaceAll(' ', '');
    return (
        <HStack w="full" borderBottom="1px solid #EBEFF2" gap="1rem">
            {tabValue.map((x) => (
                <Link
                    href={`/${role}${x.url}`}
                    color={
                        router.asPath.startsWith(`/${role}${x.url}`)
                            ? 'black'
                            : ' #A6ACBE'
                    }
                    _hover={{
                        textDecor: 'none',
                        color: 'brand.400',
                    }}
                >
                    <Text
                        fontWeight="700"
                        fontSize=".9rem"
                        borderBottom={
                            router.asPath.startsWith(`/${role}${x.url}`)
                                ? '4px solid #2EAFA3'
                                : '0'
                        }
                        mb="0"
                        pb=".5rem"
                        cursor="pointer"
                    >
                        {x.text}
                    </Text>
                </Link>
            ))}
        </HStack>
    );
};
