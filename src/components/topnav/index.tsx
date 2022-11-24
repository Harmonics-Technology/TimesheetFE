import { Flex, Box, Text, Stack, HStack } from "@chakra-ui/react";
import { FaUser } from "react-icons/fa";
import { BsBellFill } from "react-icons/bs";
import { useRouter } from "next/router";

function TopNav() {
    const router = useRouter();
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
                    {router.pathname.replace("/admin/", "").split("/")[0]}
                </Text>
            </Box>
            <Stack direction="row" gap="2rem" color="gray.500" align="center">
                <HStack>
                    <FaUser />
                    <Text>Oluwabukunmi</Text>
                </HStack>
                <Box>
                    <BsBellFill />
                </Box>
            </Stack>
        </Flex>
    );
}

export default TopNav;
