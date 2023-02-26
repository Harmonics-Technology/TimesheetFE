import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import SideNav from '@components/sidenav';
import TopNav from '@components/topnav';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import Footer from './Footer';
import SidebarToggle from '@components/sidenav/SidebarToggle';
import Cookies from 'js-cookie';
import SessionModal from '@components/bits-utils/SessionModal';
import { NotificationProvider } from '@components/context/NotificationContext';
import { OnboardingFeeProvider } from '@components/context/OnboardingFeeContext';
import { UserProvider } from '@components/context/UserContext';

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
    const [change, setChange] = useState<boolean>(false);

    useEffect(() => {
        const savedChange = localStorage.getItem('timesheet-sidebar');
        setChange(savedChange === null ? true : savedChange === 'true');
    }, []);
    let user = Cookies.get('user') as unknown as any;
    if (user !== undefined) {
        user = JSON.parse(user);
    }
    const { isOpen, onOpen, onClose } = useDisclosure();
    const route = `/login`;
    const urlRoute = router.asPath.split('/')[1];
    const loggedInUser = user?.role?.replaceAll(' ', '');
    useEffect(() => {
        if (urlRoute !== loggedInUser) {
            onOpen();
        }
    }, [urlRoute, loggedInUser]);

    return (
        <>
            {!noSideBar ? (
                <OnboardingFeeProvider>
                    <NotificationProvider>
                        <Flex pos="relative" p="0rem" bg="#f6f7f8">
                            <SideNav
                                openSidenav={openSidenav}
                                setOpenSidenav={setOpenSidenav}
                                change={change}
                            />
                            <SidebarToggle
                                setChange={setChange}
                                change={change}
                            />
                            <Box
                                w={['full', '83%']}
                                as="main"
                                ml="auto"
                                minH="95vh"
                            >
                                <Box as="div" w="95%" mx="auto" mb="3rem">
                                    <TopNav
                                        setOpenSidenav={setOpenSidenav}
                                        openSidenav={openSidenav}
                                    />
                                    <Box mt="1rem">{children}</Box>
                                    <Footer />
                                </Box>
                            </Box>
                            <SessionModal
                                isOpen={isOpen}
                                onClose={onClose}
                                route={route}
                            />
                        </Flex>
                    </NotificationProvider>
                </OnboardingFeeProvider>
            ) : (
                <Box>{children}</Box>
            )}
        </>
    );
};

export default Layout;
