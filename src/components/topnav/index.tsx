import {
    Flex,
    Box,
    Text,
    Stack,
    HStack,
    MenuButton,
    MenuItem,
    MenuList,
    Menu,
    Circle,
} from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { BsBellFill } from "react-icons/bs";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

function TopNav() {
    const router = useRouter();
    function Logout() {
        Cookies.remove("user");
        router.push("/login");
    }
    const curPage = router.pathname.split("/").at(-1);
    const idPage = router.pathname.split("/").at(-2);
    return (
        <Flex justify="space-between" pt=".5rem" pr="1rem">
            <Box color="brand.200">
                <Text fontSize=".875rem" opacity=".5" mb="0">
                    Super Admin Profile
                </Text>
                <Text
                    fontWeight="bold"
                    fontFamily="Open Sans"
                    fontSize="1rem"
                    textTransform="capitalize"
                >
                    {curPage == "[id]" ? idPage : curPage}
                </Text>
            </Box>
            <Stack direction="row" gap="2rem" color="gray.500" align="center">
                <Menu>
                    <MenuButton>
                        <HStack>
                            <FaUser />
                            <Text>Oluwabukunmi</Text>
                        </HStack>
                    </MenuButton>
                    <MenuList>
                        <MenuItem
                            flexDirection="column"
                            _hover={{ bgColor: "unset" }}
                        >
                            {/* <Circle
                                bgColor="brand.600"
                                size="2.5rem"
                                fontSize="1rem"
                                color="white"
                            >
                                <FaUser />
                            </Circle>
                            <Text fontWeight="bold" color="brand.200">
                                Super Admin Profile
                            </Text> */}
                            <Flex align="center" onClick={() => Logout()}>
                                <FiLogOut />
                                <Text
                                    fontWeight="bold"
                                    color="brand.200"
                                    mb="0"
                                    pl="1rem"
                                >
                                    Sign Out
                                </Text>
                            </Flex>
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Box>
                    <BsBellFill />
                </Box>
            </Stack>
        </Flex>
    );
}

export default TopNav;
