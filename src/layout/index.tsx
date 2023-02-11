import { Box, Flex } from '@chakra-ui/react';
import SideNav from '@components/sidenav';
import TopNav from '@components/topnav';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';
import SidebarToggle from '@components/sidenav/SidebarToggle';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const noSideBar =
        router.pathname.startsWith('/login') ||
        router.pathname.startsWith('/password') ||
        router.pathname.startsWith('/forgot-password');
    // ||
    // router.pathname.startsWith('/user/activate');
    const [openSidenav, setOpenSidenav] = useState(false);
    const [change, setChange] = useState<boolean>(true);

    useEffect(() => {
        const savedChange = localStorage.getItem('timesheet-sidebar');
        console.log({ savedChange });
        setChange(savedChange === undefined ? true : savedChange === 'true');
    }, []);

    return (
        <>
            {!noSideBar ? (
                <Flex pos="relative" p="0rem" bg="#f6f7f8">
                    <SideNav
                        openSidenav={openSidenav}
                        setOpenSidenav={setOpenSidenav}
                        change={change}
                    />
                    <SidebarToggle setChange={setChange} change={change} />
                    <Box w={['full', '83%']} as="main" ml="auto" minH="95vh">
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
