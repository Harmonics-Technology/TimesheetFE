import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import { UserContext } from '@components/context/UserContext';
import { useRouter } from 'next/router';
import React, { useContext } from 'react';

export const ProjectTabs = ({ name }: { name: any[] }) => {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const { isOpen, onOpen, onClose } = useDisclosure();

    console.log({ user });
    return (
        <Flex bgColor="white" w="full" borderRadius=".3rem" p=".5rem 1rem">
            {name.map((x: any) => {
                const isActive = router.pathname.startsWith(
                    `/${role}/project-management/${x?.name.replaceAll(
                        ' ',
                        '-',
                    )}`,
                );
                return (
                    <Flex
                        bgColor={isActive ? 'brand.400' : 'white'}
                        color={isActive ? 'white' : '#2D3748'}
                        borderRadius="0.3rem"
                        height="2.3rem"
                        px="0.5rem"
                        fontWeight="500"
                        textTransform="capitalize"
                        align="center"
                        // onClick={() =>
                        //     router.push(`/${role}/project-management/${x}`)
                        // }
                        onClick={
                            x?.show
                                ? () => {
                                      router.push(
                                          `/${role}/project-management/${x?.name}`,
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
        </Flex>
    );
};
