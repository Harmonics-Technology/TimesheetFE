import { HStack, Flex, useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const TaskMenu = ({ name, id }) => {
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const router = useRouter();
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <HStack
            my="2rem"
            align="center"
            w="full"
            borderBottom="2px solid #e5e5e5"
        >
            {name.map((x: any) => {
                const isActive = router.pathname.startsWith(
                    `/${role}/project-management/projects/[id]/${x?.name.replaceAll(
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
                        onClick={
                            x?.show
                                ? () => {
                                      router.push(
                                          `/${role}/project-management/projects/${id}/${x?.name}`,
                                      );
                                  }
                                : onOpen
                        }
                        cursor={x?.show ? 'pointer' : 'not-allowed'}
                    >
                        {x?.name.replaceAll('-', ' ')}
                    </Flex>
                );
            })}
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </HStack>
    );
};
