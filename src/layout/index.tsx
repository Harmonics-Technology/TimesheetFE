import { Box, Flex, HStack, Text } from "@chakra-ui/react";
import { UserContext } from "@components/context/UserContext";
import SideNav from "@components/sidenav";
import TopNav from "@components/topnav";
import { useRouter } from "next/router";
import React, { ReactNode, useContext, useState } from "react";
import Footer from "./Footer";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    const router = useRouter();
    const [openSidenav, setOpenSidenav] = useState(false);

    return (
        <>
            <Flex pos="relative" p="1rem" bg="#f6f7f8">
                <SideNav openSidenav={openSidenav} />
                <Box w={["full", "82%"]} as="main" ml="auto" minH="95vh">
                    <Box as="div" w="95%" mx="auto" mt="1rem" mb="3rem">
                        <TopNav
                            setOpenSidenav={setOpenSidenav}
                            openSidenav={openSidenav}
                        />
                        <Box mt="2rem">{children}</Box>
                        <Footer />
                    </Box>
                </Box>
            </Flex>
        </>
    );
};

export default Layout;
