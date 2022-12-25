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
} from '@chakra-ui/react';
import { FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { TfiClose, TfiMenu, TfiMenuAlt } from 'react-icons/tfi';
import { BsBellFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { UserContext } from '@components/context/UserContext';
import { useContext } from 'react';
import { UserView } from 'src/services';
interface topnavProps {
    setOpenSidenav: any;
    openSidenav: boolean;
}

function TopNav({ setOpenSidenav, openSidenav }: topnavProps) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role;
    function Logout() {
        Cookies.remove('user');
        Cookies.remove('token');
        router.push('/login');
    }
    const curPage = router.pathname.split('/').at(-1);
    const idPage = router.pathname.split('/').at(-2);
    return (
        <Flex
            justify="space-between"
            pt="2rem"
            pr="1rem"
            pos="sticky"
            top="0"
            bgColor="#f6f7f8"
            zIndex="800"
            align="center"
        >
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
                <Box
                    cursor="pointer"
                    display={['block', 'none']}
                    onClick={() => setOpenSidenav(!openSidenav)}
                >
                    {openSidenav ? <TfiClose /> : <TfiMenu />}
                </Box>
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
                                <Text noOfLines={1} textTransform="capitalize">
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
            </VStack>
        </Flex>
    );
}

export default TopNav;
