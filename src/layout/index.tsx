import { Box, Flex } from "@chakra-ui/react";
import SideNav from "@components/sidenav";
import TopNav from "@components/topnav";
import React, { ReactNode } from "react";

type LayoutProps = {
    children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
    return (
        <Flex pos="relative" p="1rem" bg="#f6f7f8">
            <SideNav />
            <Box w={["full", "82%"]} as="main" ml="auto">
                <Box as="div" w="95%" mx="auto" mt="1rem" mb="3rem">
                    <TopNav />
                    <Box mt="2rem">{children}</Box>
                </Box>
            </Box>
        </Flex>
    );
};

export default Layout;
