import { Box, Flex } from '@chakra-ui/react';
import SideNav from '@components/sidenav';
import TopNav from '@components/topnav';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import Footer from './Footer';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const noSideBar =
        router.pathname.startsWith('/login') ||
        router.pathname.startsWith('/password') ||
        router.pathname.startsWith('/forgot-password');
    const [openSidenav, setOpenSidenav] = useState(false);

    return (
        <>
            {!noSideBar ? (
                <Flex pos="relative" p="1rem" bg="#f6f7f8">
                    <SideNav
                        openSidenav={openSidenav}
                        setOpenSidenav={setOpenSidenav}
                    />
                    <Box w={['full', '82%']} as="main" ml="auto" minH="95vh">
                        <Box as="div" w="95%" mx="auto" mb="3rem">
                            <TopNav
                                setOpenSidenav={setOpenSidenav}
                                openSidenav={openSidenav}
                            />
                            <Box mt="1rem">{children}</Box>
                            <Footer />
                        </Box>
                    </Box>
                </Flex>
            ) : (
                <Box>{children}</Box>
            )}
        </>
    );
};

export default Layout;
