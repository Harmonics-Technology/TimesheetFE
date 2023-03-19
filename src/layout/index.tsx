import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();

    return (
        <>
            <Header />
            <Box>{children}</Box>
            <Footer />
        </>
    );
};

export default Layout;
