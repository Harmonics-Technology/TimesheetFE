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
    useDisclosure,
    useToast,
    Spinner,
} from '@chakra-ui/react';
import { FaAngleDown, FaUser } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi';
import { TfiClose, TfiMenu, TfiMenuAlt } from 'react-icons/tfi';
import { BsBellFill } from 'react-icons/bs';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { UserContext } from '@components/context/UserContext';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import { UserService, UserView } from 'src/services';
import { Logout } from '@components/bits-utils/LogUserOut';
import { GrShieldSecurity } from 'react-icons/gr';
import Link from 'next/link';
import useClickOutside from '@components/generics/useClickOutside';
import { ConfettiIcon } from './ConfettiIcon';
import moment from 'moment';
import { BirthDayModal } from '@components/bits-utils/ProjectManagement/Modals/BirthDayModal';
import { OnboardingFeeContext } from '@components/context/OnboardingFeeContext';
import { NotificationContext } from '@components/context/NotificationContext';
import { OrgIcon } from '@components/icons/OrgIcon';
import { LiaAngleDownSolid } from 'react-icons/lia';
interface topnavProps {
    setOpenSidenav: any;
    openSidenav: boolean;
}

function TopNav({ setOpenSidenav, openSidenav }: topnavProps) {
    const router = useRouter();
    const { user } = useContext(UserContext);
    const { controls } = useContext(OnboardingFeeContext);
    const role = user?.role;

    const curPage = router.pathname.split('/').at(-1);
    const idPage = router.pathname.split('/').at(-2);
    const { messages } = useContext(NotificationContext);
    const messageCount = messages?.data?.value.filter(
        (x) => x.isRead == false,
    ).length;
    const close = useCallback(() => setOpenSidenav(false), []);
    const popover = useRef(null);
    useClickOutside(popover, close);
    const todaysDate = moment().format('MM-DD');
    const isUserBirthDay = user?.isBirthDayToday;
    // moment(user?.dateOfBirth).format('MM-DD') == todaysDate;
    const isUserAnniversary = user?.isAnniversaryToday;
    // moment(user?.contractStartDate).format('MM-DD') == todaysDate;
    const pageIsDashboard =
        router.pathname === `/${role?.replaceAll(' ', '')}/dashboard`;

    const { isOpen, onOpen, onClose } = useDisclosure();
    const isTfa = controls?.twoFactorEnabled;

    const closeModal = () => {
        Cookies.set('isBdChecked', 'true');
        onClose();
    };

    const birthdayCheck =
        controls.allowBirthdayNotification && controls.notifyCelebrant;
    const workdayCheck =
        controls.allowWorkAnniversaryNotification && controls.notifyCelebrant;

    const massiveCheck = birthdayCheck
        ? isUserBirthDay && pageIsDashboard && birthdayCheck
        : isUserAnniversary && pageIsDashboard && workdayCheck;

    useEffect(() => {
        const hasCheckedOnThisDevice = Cookies.get('isBdChecked');
        if (massiveCheck && hasCheckedOnThisDevice !== 'true') {
            onOpen();
        }
    }, [massiveCheck]);

    const [loadingAuth, setLoadingAuth] = useState('');
    const [orgAvailable, setOrgAvailable] = useState();
    const toast = useToast();
    const completeAuthForCollaborator = async (selected) => {
        setLoadingAuth(selected?.superAdminId);
        try {
            const res = await UserService.completeTimbaUserAuthentication({
                userId: selected?.userId,
                superAdminId: selected?.superAdminId,
            });
            const user = res?.data;
            if (res?.status) {
                const strippedData = {
                    clientSubscriptionId: user?.clientSubscriptionId,
                    email: user?.user?.email,
                    firstName: user?.user?.firstName,
                    lastName: user?.user?.lastName,
                    fullName: user?.user?.fullName,
                    role: user?.user?.role,
                    isActive: user?.isActive,
                    organizationName: user?.user?.organizationName,
                    superAdminId: user?.superAdminId,
                    organizationEmail: user?.user?.organizationEmail,
                    organizationPhone: user?.user?.organizationPhone,
                    organizationAddress: user?.user?.organizationAddress,
                    isSendingInvoice: user?.isSendingInvoice,
                };
                Cookies.set('user', JSON.stringify(strippedData));
                router.replace(router?.asPath);
                return;
            }
            toast({
                title: res?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            toast({
                title: error?.message || error?.body?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } finally {
            setLoadingAuth('');
        }
    };

    useEffect(() => {
        const orgs = Cookies.get('orgs');
        if (orgs && orgs !== 'undefined') {
            setOrgAvailable(JSON.parse(orgs));
        }
    }, []);

    return (
        <Box pos="sticky" top="0" zIndex="990" bgColor="#f6f7f8">
            {/* <Button
                onClick={() => router.back()}
                variant="solid"
                mb="1rem"
                fontSize=".9rem"
                leftIcon={<MdOutlineArrowBackIos />}
            >
                Back
            </Button> */}
            {user?.twoFactorEnabled == false && isTfa && (
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
                        href={
                            role == 'Super Admin'
                                ? `/${role?.replaceAll(
                                      ' ',
                                      '',
                                  )}/account-management/personal-info`
                                : `/${role?.replaceAll(' ', '')}/my-profile`
                        }
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
                        {massiveCheck ? (
                            <HStack align="center">
                                <Text
                                    fontWeight="bold"
                                    fontSize="1rem"
                                    textTransform="capitalize"
                                    mt=".3rem"
                                >
                                    {`Happy ${
                                        isUserBirthDay
                                            ? 'Birthday'
                                            : 'Work Anniversary'
                                    }, ${user?.fullName}`}
                                </Text>
                                <ConfettiIcon />
                            </HStack>
                        ) : (
                            <>
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
                                    {curPage?.startsWith('[')
                                        ? idPage?.replaceAll('-', ' ')
                                        : curPage?.replaceAll('-', ' ')}
                                </Text>
                            </>
                        )}
                    </Box>
                    <VStack alignItems="flex-end">
                        <Stack
                            direction="row"
                            gap={['.5rem', '2rem']}
                            color="gray.500"
                            align="center"
                        >
                            {role == 'Collaborator' ? (
                                <Menu>
                                    <MenuButton>
                                        <HStack>
                                            <Circle
                                                size="2.5rem"
                                                overflow="hidden"
                                                border="1px solid #A6ACBE"
                                            >
                                                {user?.profilePicture ? (
                                                    <Image
                                                        src={
                                                            user?.profilePicture
                                                        }
                                                        w="full"
                                                        h="full"
                                                        objectFit="cover"
                                                    />
                                                ) : (
                                                    <FaUser />
                                                )}
                                            </Circle>
                                            <Box textAlign="left">
                                                <Text
                                                    noOfLines={1}
                                                    textTransform="capitalize"
                                                    fontSize="14px"
                                                    color="#2F363A"
                                                    fontWeight={500}
                                                >
                                                    {user?.firstName}
                                                </Text>
                                                <Text
                                                    noOfLines={1}
                                                    textTransform="capitalize"
                                                    fontSize="14px"
                                                    color="#718096"
                                                >
                                                    {user?.organizationName}
                                                </Text>
                                            </Box>
                                            <Icon as={FaAngleDown} ml="1rem" />
                                        </HStack>
                                    </MenuButton>
                                    <MenuList>
                                        {(orgAvailable as any)?.map((x) => (
                                            <MenuItem
                                                _hover={{ bgColor: 'unset' }}
                                            >
                                                <HStack
                                                    justify="space-between"
                                                    border="1px solid #C4C4C4"
                                                    borderRadius="10px"
                                                    h="3rem"
                                                    w="full"
                                                    px="8.5px"
                                                    onClick={() =>
                                                        completeAuthForCollaborator(
                                                            x,
                                                        )
                                                    }
                                                >
                                                    <HStack gap="8px">
                                                        <Circle
                                                            size="28px"
                                                            border="1px solid #A6ACBE"
                                                            overflow="hidden"
                                                        >
                                                            {x?.superAdmin
                                                                ?.profilePicture ? (
                                                                <Image
                                                                    src={
                                                                        x
                                                                            ?.superAdmin
                                                                            ?.profilePicture
                                                                    }
                                                                    h="full"
                                                                    w="full"
                                                                    objectFit="cover"
                                                                />
                                                            ) : (
                                                                <Icon
                                                                    as={OrgIcon}
                                                                    color="#78A3AD"
                                                                    h="14px"
                                                                    w="12px"
                                                                />
                                                            )}
                                                        </Circle>
                                                        <Text
                                                            fontSize="13px"
                                                            fontWeight={500}
                                                            color="#2F363A"
                                                        >
                                                            {
                                                                x?.superAdmin
                                                                    ?.organizationName
                                                            }
                                                        </Text>
                                                    </HStack>

                                                    <Circle
                                                        border="1px solid #696969"
                                                        size="18px"
                                                    >
                                                        {loadingAuth ==
                                                            x?.superAdminId && (
                                                            <Spinner
                                                                size="xs"
                                                                colorScheme="brand"
                                                            />
                                                        )}
                                                        {/* <Circle bgColor="brand.400" size="10px" /> */}
                                                    </Circle>
                                                </HStack>
                                            </MenuItem>
                                        ))}
                                        <MenuItem
                                            flexDirection="row"
                                            _hover={{ bgColor: 'unset' }}
                                        >
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
                            ) : (
                                <Menu>
                                    <MenuButton>
                                        <HStack>
                                            <Circle
                                                size="2.5rem"
                                                overflow="hidden"
                                                border="1px solid #A6ACBE"
                                            >
                                                {user?.profilePicture ? (
                                                    <Image
                                                        src={
                                                            user?.profilePicture
                                                        }
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
                            )}
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
            {isOpen && (
                <BirthDayModal
                    isOpen={true}
                    onClose={closeModal}
                    user={user}
                    type={isUserBirthDay ? 'Birthday' : 'Work Anniversary'}
                />
            )}
        </Box>
    );
}

export default TopNav;
