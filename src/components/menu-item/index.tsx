import {
    Box,
    Flex,
    HStack,
    ListItem,
    Square,
    Text,
    UnorderedList,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";

interface MenuProps {
    menuTitle: string;
    linkName: string;
    icon: any;
    option: boolean;
    dropDown: string[];
    role?: string;
}
function MenuItem({
    menuTitle,
    linkName,
    icon,
    option = false,
    dropDown,
    role,
}: MenuProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const url = `/${role}/${linkName}`;
    // console.log({ url });
    return (
        <>
            {option ? (
                <Box
                    onClick={() => setOpenMenu(!openMenu)}
                    overflow="hidden"
                    transition="all .35s ease-in-out"
                    maxH={openMenu ? "13rem" : "2rem"}
                >
                    <Flex
                        justify="space-between"
                        align="center"
                        cursor="pointer"
                    >
                        <HStack>
                            <Square
                                bgColor={
                                    router.pathname.startsWith(url)
                                        ? "brand.400"
                                        : "brand.500"
                                }
                                color={
                                    router.pathname.startsWith(url)
                                        ? "white"
                                        : "brand.400"
                                }
                                borderRadius="8px"
                                size="2rem"
                                fontSize=".65rem"
                            >
                                {icon}
                            </Square>
                            <Text
                                color={
                                    router.pathname.startsWith(url)
                                        ? "brand.200"
                                        : "brand.300"
                                }
                                fontWeight={
                                    router.pathname.startsWith(url)
                                        ? "600"
                                        : "500"
                                }
                                fontSize=".9rem"
                                fontFamily="Open Sans"
                                pl=".5rem"
                                noOfLines={1}
                            >
                                {menuTitle}
                            </Text>
                            <Text display="none">{linkName}</Text>
                        </HStack>

                        <Box
                            transform={
                                openMenu ? "rotate(-180deg)" : "rotate(0deg)"
                            }
                            transition="all .35s ease-in-out"
                        >
                            <FaAngleDown color="gray" />
                        </Box>
                    </Flex>
                    <UnorderedList pl="1rem" mt=".4rem !important">
                        {dropDown.map((x, i) => (
                            <ListItem
                                key={i}
                                color="brand.300"
                                fontSize={
                                    router.pathname.startsWith(`${url}/${x}`)
                                        ? "1rem"
                                        : ".875rem"
                                }
                                p=" .5rem 0 .5rem 1.2rem"
                                fontWeight={
                                    router.pathname.startsWith(`${url}/${x}`)
                                        ? "bold"
                                        : "400"
                                }
                                textTransform="capitalize"
                            >
                                <Link href={`${url}/${x}`}>{x}</Link>
                            </ListItem>
                        ))}
                    </UnorderedList>
                </Box>
            ) : (
                <Link href={url} passHref>
                    <Box overflow="hidden" cursor="pointer">
                        <HStack>
                            <Square
                                bgColor={
                                    router.pathname.startsWith(url)
                                        ? "brand.400"
                                        : "brand.500"
                                }
                                color={
                                    router.pathname.startsWith(url)
                                        ? "white"
                                        : "brand.400"
                                }
                                borderRadius="8px"
                                size="2rem"
                                fontSize=".65rem"
                            >
                                {icon}
                            </Square>
                            <Text
                                color={
                                    router.pathname.startsWith(url)
                                        ? "brand.200"
                                        : "brand.300"
                                }
                                fontWeight={
                                    router.pathname.startsWith(url)
                                        ? "600"
                                        : "500"
                                }
                                fontSize=".9rem"
                                fontFamily="Open Sans"
                                pl=".5rem"
                                noOfLines={1}
                            >
                                {menuTitle}
                            </Text>
                            <Text display="none">{linkName}</Text>
                        </HStack>
                    </Box>
                </Link>
            )}
        </>
    );
}

export default MenuItem;
