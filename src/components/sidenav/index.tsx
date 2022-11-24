import {
    Box,
    HStack,
    Square,
    VStack,
    Text,
    Divider,
    Image,
    Flex,
    UnorderedList,
    ListItem,
} from "@chakra-ui/react";
import MenuItem from "@components/menu-item";
import Link from "next/link";
import { useState } from "react";
import { AiFillHome } from "react-icons/ai";
import { FaAngleDown } from "react-icons/fa";

function SideNav() {
    const [openMenu, setOpenMenu] = useState(false);
    return (
        <Box
            bgColor="#FFFFFF"
            borderRadius="30px"
            h="95vh"
            w="17%"
            pos="fixed"
            pl="2rem"
            pt="2rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Link href="/" passHref>
                <HStack>
                    <Box h="2rem">
                        <Image src="/assets/logo.png" h="full" />
                    </Box>
                    <Text fontWeight="600" fontSize=".875rem" color="brand.300">
                        Admin Timesheet
                    </Text>
                </HStack>
            </Link>
            <Divider my="2rem" />
            <VStack align="left" gap="1.5rem" pr="1rem">
                <MenuItem
                    linkName="dashboard"
                    menuTitle="Dashboard"
                    icon={<AiFillHome opacity=".8" />}
                    option={false}
                    dropDown={[]}
                />
                <MenuItem
                    linkName="profile"
                    menuTitle="Profile Management"
                    icon={<AiFillHome opacity=".8" />}
                    option={true}
                    dropDown={["admin", "New Admin"]}
                />
                <MenuItem
                    linkName="profile"
                    menuTitle="Management"
                    icon={<AiFillHome opacity=".8" />}
                    option={true}
                    dropDown={["test", "New Admin"]}
                />
            </VStack>
        </Box>
    );
}

export default SideNav;
