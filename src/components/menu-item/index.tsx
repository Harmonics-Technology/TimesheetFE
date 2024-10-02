import {
    Box,
    Flex,
    HStack,
    ListItem,
    Square,
    Text,
    UnorderedList,
    useDisclosure,
} from '@chakra-ui/react';
import UpgradePromptModal from '@components/bits-utils/UpgradePromptModal';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaAngleDown } from 'react-icons/fa';

interface MenuProps {
    menuTitle: string;
    linkName: string;
    icon: any;
    option: boolean;
    dropDown: any[];
    role?: string;
    change?: boolean;
    setOpenSidenav: any;
    display?: boolean;
}
function MenuItem({
    menuTitle,
    linkName,
    icon,
    option = false,
    dropDown,
    role,
    change,
    setOpenSidenav,
    display = true,
}: MenuProps) {
    const router = useRouter();
    const [openMenu, setOpenMenu] = useState(false);
    const url = `/${role}/${linkName}`;
    const { isOpen, onOpen, onClose } = useDisclosure();
    //
    return (
        <>
            <Box>
                {change ? (
                    <>
                        {option ? (
                            <Box
                                overflow="hidden"
                                transition="all .35s ease-in-out"
                                maxH={openMenu ? 'auto' : '3rem'}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    cursor="pointer"
                                    bgColor={
                                        router.pathname.startsWith(url)
                                            ? 'brand.100'
                                            : 'brand.400'
                                    }
                                    p=".5rem .5rem"
                                    borderRadius="10px"
                                    boxShadow="sm"
                                    onClick={() =>
                                        display
                                            ? setOpenMenu((prev) => !prev)
                                            : void 0
                                    }
                                >
                                    <HStack>
                                        <Square
                                            bgColor={
                                                !display
                                                    ? 'gray.300'
                                                    : router.pathname.startsWith(
                                                          url,
                                                      )
                                                    ? 'brand.400'
                                                    : 'brand.100'
                                            }
                                            color={
                                                router.pathname.startsWith(url)
                                                    ? 'white'
                                                    : 'brand.400'
                                            }
                                            borderRadius="8px"
                                            size="2rem"
                                            fontSize=".65rem"
                                        >
                                            {icon}
                                        </Square>
                                        <Text
                                            color={
                                                !display
                                                    ? 'gray.300'
                                                    : router.pathname.startsWith(
                                                          url,
                                                      )
                                                    ? 'brand.200'
                                                    : 'white'
                                            }
                                            fontWeight={
                                                router.pathname.startsWith(url)
                                                    ? '600'
                                                    : '500'
                                            }
                                            fontSize=".9rem"
                                            pl=".5rem"
                                            noOfLines={1}
                                            mb="0"
                                        >
                                            {menuTitle}
                                        </Text>
                                        <Text display="none">{linkName}</Text>
                                    </HStack>

                                    <Box
                                        transform={
                                            openMenu
                                                ? 'rotate(-180deg)'
                                                : 'rotate(0deg)'
                                        }
                                        transition="all .35s ease-in-out"
                                        color={
                                            router.pathname.startsWith(url)
                                                ? 'brand.200'
                                                : 'white'
                                        }
                                    >
                                        <FaAngleDown />
                                    </Box>
                                </Flex>
                                <UnorderedList pl="1rem" mt=".4rem !important">
                                    {dropDown.map((x: any, i) => (
                                        <ListItem
                                            key={i}
                                            color={
                                                x?.show ? 'gray.300' : 'white'
                                            }
                                            onClick={() =>
                                                setOpenSidenav(false)
                                            }
                                            fontSize={
                                                router.pathname.startsWith(
                                                    `${url}/${
                                                        x?.name?.replaceAll(
                                                            ' ',
                                                            '-',
                                                        ) ||
                                                        x.replaceAll(' ', '-')
                                                    }`,
                                                )
                                                    ? '1rem'
                                                    : '.875rem'
                                            }
                                            p=" .5rem 0 .5rem 1.2rem"
                                            fontWeight={
                                                router.pathname.startsWith(
                                                    `${url}/${
                                                        x?.name?.replaceAll(
                                                            ' ',
                                                            '-',
                                                        ) ||
                                                        x.replaceAll(' ', '-')
                                                    }`,
                                                )
                                                    ? 'bold'
                                                    : '400'
                                            }
                                            textTransform="capitalize"
                                        >
                                            <Box
                                                onClick={
                                                    x?.show
                                                        ? onOpen
                                                        : () => {
                                                              router.push(
                                                                  `${url}/${
                                                                      x?.name?.replaceAll(
                                                                          ' ',
                                                                          '-',
                                                                      ) ||
                                                                      x.replaceAll(
                                                                          ' ',
                                                                          '-',
                                                                      )
                                                                  }`,
                                                              );
                                                              setOpenSidenav(
                                                                  false,
                                                              );
                                                          }
                                                }
                                                cursor={
                                                    x?.show
                                                        ? 'not-allowed'
                                                        : 'pointer'
                                                }
                                            >
                                                {x?.name || x}
                                            </Box>
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        ) : (
                            <Box
                                overflow="hidden"
                                cursor={!display ? 'not-allowed' : 'pointer'}
                                onClick={
                                    display
                                        ? () => {
                                              router.push(url);
                                              setOpenSidenav(false);
                                          }
                                        : onOpen
                                }
                            >
                                <HStack
                                    bgColor={
                                        router.pathname.startsWith(url)
                                            ? 'brand.100'
                                            : 'brand.400'
                                    }
                                    p=".5rem .5rem"
                                    borderRadius="10px"
                                    boxShadow="sm"
                                >
                                    <Square
                                        bgColor={
                                            !display
                                                ? 'gray.300'
                                                : router.pathname.startsWith(
                                                      url,
                                                  )
                                                ? 'brand.400'
                                                : 'brand.100'
                                        }
                                        color={
                                            router.pathname.startsWith(url)
                                                ? 'white'
                                                : 'brand.400'
                                        }
                                        borderRadius="8px"
                                        size="2rem"
                                        fontSize=".65rem"
                                    >
                                        {icon}
                                    </Square>
                                    <Text
                                        color={
                                            !display
                                                ? 'gray.300'
                                                : router.pathname.startsWith(
                                                      url,
                                                  )
                                                ? 'brand.200'
                                                : 'white'
                                        }
                                        fontWeight={
                                            router.pathname.startsWith(url)
                                                ? '600'
                                                : '500'
                                        }
                                        fontSize=".9rem"
                                        pl=".5rem"
                                        noOfLines={1}
                                        mb="0"
                                    >
                                        {menuTitle}
                                    </Text>
                                    <Text display="none">{linkName}</Text>
                                </HStack>
                            </Box>
                        )}
                    </>
                ) : (
                    <>
                        {option ? (
                            <Box
                                // onClick={() =>
                                //     display ? setOpenMenu(!openMenu) : onOpen()
                                // }
                                overflow="hidden"
                                transition="all .35s ease-in-out"
                                maxH={openMenu ? 'auto' : '2rem'}
                            >
                                <Flex
                                    justify="space-between"
                                    align="center"
                                    cursor="pointer"
                                    onClick={() =>
                                        display
                                            ? setOpenMenu((prev) => !prev)
                                            : void 0
                                    }
                                >
                                    <HStack>
                                        <Square
                                            bgColor={
                                                !display
                                                    ? 'gray.300'
                                                    : router.pathname.startsWith(
                                                          url,
                                                      )
                                                    ? 'brand.400'
                                                    : 'brand.100'
                                            }
                                            color={
                                                router.pathname.startsWith(url)
                                                    ? 'white'
                                                    : 'brand.400'
                                            }
                                            borderRadius="8px"
                                            size="2rem"
                                            fontSize=".65rem"
                                        >
                                            {icon}
                                        </Square>
                                        <Text
                                            color={
                                                !display
                                                    ? 'gray.300'
                                                    : router.pathname.startsWith(
                                                          url,
                                                      )
                                                    ? 'brand.200'
                                                    : 'brand.300'
                                            }
                                            fontWeight={
                                                router.pathname.startsWith(url)
                                                    ? '600'
                                                    : '500'
                                            }
                                            fontSize=".9rem"
                                            pl=".5rem"
                                            noOfLines={1}
                                            mb="0"
                                        >
                                            {menuTitle}
                                        </Text>
                                        <Text display="none">{linkName}</Text>
                                    </HStack>

                                    <Box
                                        transform={
                                            openMenu
                                                ? 'rotate(-180deg)'
                                                : 'rotate(0deg)'
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
                                            color={
                                                x?.show
                                                    ? 'gray.300'
                                                    : 'brand.300'
                                            }
                                            onClick={() =>
                                                setOpenSidenav(false)
                                            }
                                            fontSize={
                                                router.pathname.startsWith(
                                                    `${url}/${
                                                        x?.name?.replaceAll(
                                                            ' ',
                                                            '-',
                                                        ) ||
                                                        x.replaceAll(' ', '-')
                                                    }`,
                                                )
                                                    ? '1rem'
                                                    : '.875rem'
                                            }
                                            p=" .5rem 0 .5rem 1.2rem"
                                            fontWeight={
                                                router.pathname.startsWith(
                                                    `${url}/${
                                                        x?.name?.replaceAll(
                                                            ' ',
                                                            '-',
                                                        ) ||
                                                        x.replaceAll(' ', '-')
                                                    }`,
                                                )
                                                    ? 'bold'
                                                    : '400'
                                            }
                                            textTransform="capitalize"
                                        >
                                            <Box
                                                onClick={
                                                    x?.show
                                                        ? onOpen
                                                        : () => {
                                                              router.push(
                                                                  `${url}/${
                                                                      x?.name?.replaceAll(
                                                                          ' ',
                                                                          '-',
                                                                      ) ||
                                                                      x.replaceAll(
                                                                          ' ',
                                                                          '-',
                                                                      )
                                                                  }`,
                                                              );
                                                              setOpenSidenav(
                                                                  false,
                                                              );
                                                          }
                                                }
                                                cursor={
                                                    x?.show
                                                        ? 'not-allowed'
                                                        : 'pointer'
                                                }
                                            >
                                                {x?.name || x}
                                            </Box>
                                        </ListItem>
                                    ))}
                                </UnorderedList>
                            </Box>
                        ) : (
                            // <Link href={url} passHref>
                            <Box
                                overflow="hidden"
                                cursor={!display ? 'not-allowed' : 'pointer'}
                                onClick={
                                    display
                                        ? () => {
                                              router.push(url);
                                              setOpenSidenav(false);
                                          }
                                        : onOpen
                                }
                            >
                                <HStack>
                                    <Square
                                        bgColor={
                                            !display
                                                ? 'gray.300'
                                                : router.pathname.startsWith(
                                                      url,
                                                  )
                                                ? 'brand.400'
                                                : 'brand.100'
                                        }
                                        color={
                                            router.pathname.startsWith(url)
                                                ? 'white'
                                                : 'brand.400'
                                        }
                                        borderRadius="8px"
                                        size="2rem"
                                        fontSize=".65rem"
                                    >
                                        {icon}
                                    </Square>
                                    <Text
                                        color={
                                            !display
                                                ? 'gray.300'
                                                : router.pathname.startsWith(
                                                      url,
                                                  )
                                                ? 'brand.200'
                                                : 'brand.300'
                                        }
                                        fontWeight={
                                            router.pathname.startsWith(url)
                                                ? '600'
                                                : '500'
                                        }
                                        fontSize=".9rem"
                                        pl=".5rem"
                                        noOfLines={1}
                                        mb="0"
                                    >
                                        {menuTitle}
                                    </Text>
                                    <Text display="none">{linkName}</Text>
                                </HStack>
                            </Box>
                            // </Link>
                        )}
                    </>
                )}
            </Box>
            <UpgradePromptModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}

export default MenuItem;
