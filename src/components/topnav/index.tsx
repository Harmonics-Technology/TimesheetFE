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
    VStack,
    Circle,
    Image,
    Button,
    Icon,
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { TfiClose, TfiMenu, TfiMenuAlt } from 'react-icons/tfi';
import { BsBellFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { UserContext } from '@components/context/UserContext';
import { useCallback, useContext, useRef } from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { UserView } from 'src/services';
import { NotificationContext } from '@components/context/NotificationContext';
import { Logout } from '@components/bits-utils/LogUserOut';
import { GrShieldSecurity } from 'react-icons/gr';
import Link from 'next/link';
import useClickOutside from '@components/generics/useClickOutside';
interface topnavProps {
    setOpenSidenav: any;
    openSidenav: boolean;
}

function TopNav({ setOpenSidenav, openSidenav }: topnavProps) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role;

    console.log({ user });

    const curPage = router.pathname.split('/').at(-1);
    const idPage = router.pathname.split('/').at(-2);
    const { messages } = useContext(NotificationContext);
    const messageCount = messages?.data?.value.filter(
        (x) => x.isRead == false,
    ).length;
    const close = useCallback(() => setOpenSidenav(false), []);
    const popover = useRef(null);
    useClickOutside(popover, close);
    return (
        <Box pos="sticky" top="0" zIndex="800" bgColor="#f6f7f8">
            {/* <Button
                onClick={() => router.back()}
                variant="solid"
                mb="1rem"
                fontSize=".9rem"
                leftIcon={<MdOutlineArrowBackIos />}
            >
                Back
            </Button> */}
            {user?.twoFactorEnabled == false && (
                <Flex
                    gap=".5rem"
                    bgColor="red.100"
                    w="full"
                    h={['fit-content', '3rem']}
                    justify="center"
                    py={['1rem', '0']}
                    align="center"
                    flexDir={['column', 'row']}
                >
                    <Icon as={GrShieldSecurity} />
                    <Text mb="0" fontSize=".8rem">
                        Set up two factor authentication for an extra level of
                        security
                    </Text>
                    <Link
                        passHref
                        href={`/${role?.replace(' ', '')}/my-profile`}
                    >
                        <Text
                            mb="0"
                            fontSize=".8rem"
                            cursor="pointer"
                            border="1px solid"
                            p=".1rem .5rem"
                            borderRadius="25px"
                            _hover={{
                                bgColor: 'white',
                            }}
                        >
                            Click Here!
                        </Text>
                    </Link>
                </Flex>
            )}

            <Box
                pr="1rem"
                pos="relative"
                w="95%"
                mx="auto"
                pb=".5rem"
                pt={['2.5rem', '1.5rem']}
                // ref={popover}
            >
                <Box
                    cursor="pointer"
                    display={['flex', 'none']}
                    onClick={() => setOpenSidenav(!openSidenav)}
                    w="full"
                    justifyContent={openSidenav ? 'flex-end' : 'flex-end'}
                >
                    {openSidenav ? <TfiClose /> : <TfiMenu />}
                </Box>
                <Flex justify="space-between" align="center">
                    <Box color="brand.200">
                        <Text
                            fontSize=".875rem"
                            opacity=".5"
                            mb="0"
                            textTransform="capitalize"
                        >
                            {` ${role} Profile`}
                        </Text>
                        <Text
                            fontWeight="bold"
                            fontSize="1rem"
                            textTransform="capitalize"
                            mb="0"
                        >
                            {curPage == '[id]'
                                ? idPage?.replace('-', ' ')
                                : curPage?.replace('-', ' ')}
                        </Text>
                    </Box>
                    <VStack alignItems="flex-end">
                        <Stack
                            direction="row"
                            gap={['.5rem', '2rem']}
                            color="gray.500"
                            align="center"
                        >
                            <Menu>
                                <MenuButton>
                                    <HStack>
                                        <Circle size="2rem" overflow="hidden">
                                            {user?.profilePicture ? (
                                                <Image
                                                    src={user?.profilePicture}
                                                    w="full"
                                                    h="full"
                                                    objectFit="cover"
                                                />
                                            ) : (
                                                <FaUser />
                                            )}
                                        </Circle>
                                        <Text
                                            noOfLines={1}
                                            textTransform="capitalize"
                                        >
                                            {user?.firstName}
                                        </Text>
                                    </HStack>
                                </MenuButton>
                                <MenuList>
                                    <MenuItem
                                        flexDirection="column"
                                        _hover={{ bgColor: 'unset' }}
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
                                        <Flex
                                            align="center"
                                            onClick={() => Logout('/login')}
                                        >
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
                            <Box
                                cursor="pointer"
                                pos="relative"
                                onClick={() =>
                                    router.asPath.includes('/dashboard')
                                        ? () => void 0
                                        : router.push(
                                              `/${role.replace(
                                                  ' ',
                                                  '',
                                              )}/dashboard`,
                                          )
                                }
                            >
                                <BsBellFill />
                                <Circle
                                    bgColor={'brand.700'}
                                    size=".8rem"
                                    display={
                                        messageCount <= 0 ? 'none' : 'flex'
                                    }
                                    fontSize=".5rem"
                                    color="white"
                                    fontWeight="bold"
                                    pos="absolute"
                                    justifyContent="center"
                                    top="-30%"
                                    right="-30%"
                                    border="1px solid white"
                                >
                                    {messageCount}
                                </Circle>
                            </Box>
                        </Stack>
                    </VStack>
                </Flex>
            </Box>
        </Box>
    );
}

export default TopNav;
