import {
    Box,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    useToast,
    Link,
    Spinner,
    Th,
    Td,
    Tooltip,
    Icon,
    Text,
    Tr,
} from '@chakra-ui/react';
import axios from 'axios';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useState } from 'react';
import { AiOutlineDownload } from 'react-icons/ai';
import { FaAppStore, FaEllipsisH, FaEye } from 'react-icons/fa';
import {
    DraftService,
    ExpenseView,
    FinancialService,
    InitiateResetModel,
    InvoiceView,
    LeaveService,
    SettingsService,
    ShiftService,
    TrainingService,
    UserService,
} from 'src/services';
import fileDownload from 'js-file-download';
import { UserContext } from '@components/context/UserContext';
import { BiTrash } from 'react-icons/bi';
import { MdVerified, MdCancel } from 'react-icons/md';
import { BsEye, BsPencil } from 'react-icons/bs';
import { RiInboxArchiveFill } from 'react-icons/ri';
import shadeColor from '@components/generics/functions/shadeColor';
import validateEmail from '@components/generics/functions/validateEmail';

export function TableHead({
    name,
    border,
    value,
    borderColor,
    p,
}: {
    name: string | number | undefined | null;
    border?: boolean | undefined;
    value?: string;
    borderColor?: string;
    p?: any;
}) {
    return (
        <Th
            borderRight={border ? value : 0}
            borderColor={borderColor}
            borderRightColor={borderColor}
            color="inherit"
            paddingInlineStart={p}
        >
            {name}
        </Th>
    );
}

export function TableData({
    name,
    border,
    value,
    borderColor,
    classes,
    full,
    fontWeight = '400',
    customColor,
    breakWord,
    onClick,
}: {
    name: any;
    border?: boolean | undefined;
    value?: string;
    borderColor?: string;
    classes?: any;
    full?: boolean;
    fontWeight?: string;
    customColor?: any;
    breakWord?: any;
    onClick?: any;
}) {
    return (
        <Td
            borderColor={borderColor}
            borderRight={border ? value : 0}
            borderRightColor={borderColor}
            paddingInlineStart="1rem"
            className={classes}
            fontWeight={fontWeight}
            maxW={breakWord ? '150px' : 'unset'}
            textTransform={validateEmail(name) ? 'lowercase' : 'capitalize'}
            onClick={onClick}
            cursor="pointer"
            // textOverflow=""
            // overflow="hidden"
            // noOfLines={1}
            color={
                name == 'OFFSHORE'
                    ? 'brand.700'
                    : name == 'ONSHORE'
                    ? 'brand.400'
                    : customColor
                    ? customColor
                    : 'black'
            }
        >
            <Tooltip label={name} hasArrow>
                <Text whiteSpace={breakWord ? 'normal' : 'unset'}>
                    {full ? name : name?.toString()?.substring(0, 20) || ''}
                </Text>
            </Tooltip>
        </Td>
    );
}
export function TableRow({ children, bg }: { children: any; bg?: string }) {
    return (
        <Tr border="1px solid #EFEFEF" bgColor={bg || 'white'}>
            {children}
        </Tr>
    );
}
export function TableDataShiftDate({
    name,
    border,
    value,
    borderColor,
    classes,
    full,
    date,
}: {
    name: any;
    border?: boolean | undefined;
    value?: string;
    borderColor?: string;
    classes?: any;
    full?: boolean;
    date?: any;
}) {
    return (
        <Td
            borderColor={borderColor}
            borderRight={border ? value : 0}
            borderRightColor={borderColor}
            paddingInlineStart="1rem"
            className={classes}
            // maxW="120px"
            // textOverflow=""
            // overflow="hidden"
            // noOfLines={1}
            color={
                name == 'OFFSHORE'
                    ? 'brand.700'
                    : name == 'ONSHORE'
                    ? 'brand.400'
                    : 'black'
            }
        >
            <Tooltip label={name} hasArrow>
                {full ? name : name?.toString()?.substring(0, 20) || ''}
            </Tooltip>
            <Text fontSize="11px" color="#b8b9b9" mb="0" fontWeight="500">
                {date}
            </Text>
        </Td>
    );
}
export function TableStatus({ name }: { name: boolean | undefined }) {
    return (
        <td>
            <Box
                fontSize="10px"
                bgColor={name == true ? 'brand.400' : 'red'}
                borderRadius="4px"
                color="white"
                fontWeight="bold"
                padding=".2rem 1rem"
                width="fit-content"
                cursor="pointer"
                textTransform="uppercase"
            >
                {name == true ? 'Active' : 'Inactive'}
            </Box>
        </td>
    );
}
export function TableState({ name }: { name: string | undefined | null }) {
    return (
        <td>
            <Box
                fontSize="10px"
                bgColor={
                    name == 'ACTIVE' ||
                    name == 'APPROVED' ||
                    name == 'Completed'
                        ? 'brand.400'
                        : name == 'PENDING'
                        ? 'brand.700'
                        : name == 'REVIEWED' ||
                          name == 'SUBMITTED' ||
                          name == 'REVIEWING'
                        ? 'brand.600'
                        : name == 'INVOICED' || name == 'PROCESSED'
                        ? '#28a3ef'
                        : name == 'In progress'
                        ? 'gray.400'
                        : 'red'
                }
                borderRadius="4px"
                color="white"
                fontWeight="bold"
                padding=".2rem 1rem"
                width="fit-content"
                cursor="pointer"
                textTransform="uppercase"
            >
                {name || 'Inactive'}
            </Box>
        </td>
    );
}
export function NewTableState({
    name,
    color,
}: {
    name: string | undefined | null;
    color: any;
}) {
    //
    return (
        <td>
            <Box
                fontSize=".75rem"
                bgColor={shadeColor(color, 0.3)}
                borderRadius="4px"
                color={color}
                fontWeight="500"
                padding=".4rem .4rem"
                width="fit-content"
                cursor="pointer"
                textTransform="capitalize"
            >
                {name || 'Inactive'}
            </Box>
        </td>
    );
}
export function TableContract({ url, label }: { url: any; label?: any }) {
    //
    const [loading, setLoading] = useState(false);
    const downloadFile = (url: string) => {
        setLoading(true);
        axios
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, `${url.split(' ').pop()}`);
                setLoading(false);
            });
    };
    return (
        <td>
            <Box
                fontSize=".9rem"
                fontWeight="500"
                padding=".2rem 0rem"
                width="fit-content"
                cursor="pointer"
                color=" #2383BD"
                onClick={() => downloadFile(url)}
            >
                {loading ? (
                    <Spinner size="sm" />
                ) : (
                    label || <AiOutlineDownload />
                )}
            </Box>
        </td>
    );
}
export function TableInvoiceSub({ url }: { url: any }) {
    //
    const [loading, setLoading] = useState(false);
    const downloadFile = (url: string) => {
        setLoading(true);
        axios
            .get(url, {
                responseType: 'blob',
            })
            .then((res) => {
                fileDownload(res.data, `${url.split(' ').pop()}`);
                setLoading(false);
            });
    };
    return (
        <td>
            <Box
                fontSize="1.4rem"
                fontWeight="bold"
                padding=".2rem 1rem"
                width="fit-content"
                cursor="pointer"
                onClick={() => downloadFile(url)}
            >
                {loading ? (
                    <Spinner size="sm" />
                ) : (
                    `Download Invoice${(<AiOutlineDownload />)}`
                )}
            </Box>
        </td>
    );
}
export function TableActions({
    id,
    route,
    email,
}: {
    id: any;
    route: string;
    email: any;
}) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const resendInvite = async (data: InitiateResetModel) => {
        //
        try {
            setLoading(true);
            const result = await UserService.resendInvite(data);
            if (result.status) {
                //
                toast({
                    title: 'Invite Sent',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={() => resendInvite({ email })} w="full">
                        Resend Invite
                    </MenuItem>
                    <MenuItem w="full">
                        <NextLink href={`${route}/${id}`} passHref>
                            <Link width="100%" textDecor="none !important">
                                View Profile
                            </Link>
                        </NextLink>
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function TablePmActions({
    func,
    loading,
    id,
}: {
    func: any;
    loading: any;
    id: any;
}) {
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading.id === id ? (
                            <Spinner size="sm" />
                        ) : (
                            <FaEllipsisH />
                        )}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={() => func({ id })} w="full">
                        Remove
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function TableCustomActions({
    loading,
    data,
}: {
    loading: any;
    data: any;
}) {
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    {data?.map((x) => (
                        <MenuItem onClick={x?.onClick} w="full" key={x?.id}>
                            {x?.name}
                        </MenuItem>
                    ))}
                </MenuList>
            </Menu>
        </td>
    );
}
export function TableDraftActions({
    data,
    setDraftData,
    loading,
    setLoading,
}: {
    data: any;
    setDraftData: any;
    loading: boolean;
    setLoading: any;
}) {
    const toast = useToast();
    const router = useRouter();

    const deleteDraft = async () => {
        //
        try {
            setLoading(true);
            const result = await DraftService.deleteDraft(data?.id);
            if (result.status) {
                //
                toast({
                    title: 'Action Succesful',
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem w="full" onClick={() => setDraftData(data)}>
                        Continue Onboarding
                    </MenuItem>
                    <MenuItem w="full" onClick={() => deleteDraft()}>
                        Delete
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function LeaveActions({
    id,
    route,
    click,
    type,
    data,
    edit,
}: {
    id: any;
    route: any;
    click?: any;
    type?: any;
    data?: any;
    edit?: any;
}) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const { user } = useContext(UserContext);
    const router = useRouter();
    const role = user?.role.replaceAll(' ', '');
    const treatLeave = async (id, type) => {
        try {
            setLoading(true);
            const result = await LeaveService.treatLeave(id, type);
            if (result.status) {
                //
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const deleteLeave = async (id, service) => {
        try {
            setLoading(true);
            const result = await service(id);
            if (result.status) {
                //
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={click} w="full">
                        <Icon as={BsEye} mr=".5rem" color="brand.400" />
                        View
                    </MenuItem>
                    {type == 'asTeam' && data.status == 'PENDING' && (
                        <MenuItem onClick={edit} w="full">
                            <Icon as={BsPencil} mr=".5rem" color="brand.400" />
                            Edit
                        </MenuItem>
                    )}
                    {type == 'asTeam' &&
                        (data.status == 'APPROVED' ||
                            data.status == 'PENDING') && (
                            <MenuItem
                                onClick={() =>
                                    deleteLeave(id, LeaveService.cancelLeave)
                                }
                                w="full"
                            >
                                <Icon
                                    as={MdCancel}
                                    mr=".5rem"
                                    color="#D62242"
                                />
                                Cancel Request
                            </MenuItem>
                        )}
                    {/* {type == 'asTeamHistory' &&
                        (data.status == 'APPROVED' ||
                            data.status == 'PENDING') && (
                            <MenuItem
                                onClick={() =>
                                    deleteLeave(id, LeaveService.cancelLeave)
                                }
                                w="full"
                            >
                                <Icon
                                    as={MdCancel}
                                    mr=".5rem"
                                    color="#D62242"
                                />
                                Request Cancellation
                            </MenuItem>
                        )} */}
                    {type == 'asAdmin' && (
                        <>
                            <MenuItem
                                onClick={() => treatLeave(id, 1)}
                                w="full"
                                isDisabled={data.status == 'APPROVED'}
                            >
                                <Icon
                                    as={MdVerified}
                                    mr=".5rem"
                                    color="brand.400"
                                />
                                Approve
                            </MenuItem>
                            <MenuItem
                                onClick={() => treatLeave(id, 2)}
                                w="full"
                                isDisabled={
                                    data.status == 'DECLINED' ||
                                    data.status == 'APPROVED'
                                }
                            >
                                <Icon
                                    as={MdCancel}
                                    mr=".5rem"
                                    color="#FF5B79"
                                />{' '}
                                Decline
                            </MenuItem>

                            <MenuItem
                                onClick={() =>
                                    deleteLeave(id, LeaveService.deleteLeave)
                                }
                                w="full"
                            >
                                <Icon as={BiTrash} mr=".5rem" color="#D62242" />
                                Delete
                            </MenuItem>
                        </>
                    )}
                    {type == 'asCancel' && (
                        <>
                            <MenuItem
                                onClick={() => treatLeave(id, 3)}
                                w="full"
                            >
                                <Icon
                                    as={MdVerified}
                                    mr=".5rem"
                                    color="brand.400"
                                />
                                Approve
                            </MenuItem>
                            <MenuItem
                                onClick={() => treatLeave(id, 4)}
                                w="full"
                            >
                                <Icon
                                    as={MdCancel}
                                    mr=".5rem"
                                    color="#FF5B79"
                                />{' '}
                                Decline
                            </MenuItem>
                        </>
                    )}
                </MenuList>
            </Menu>
        </td>
    );
}
export function ShiftSwapActions({ id }: { id: any }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    const treatLeave = async (id, type) => {
        try {
            setLoading(true);
            const result = await ShiftService.approveSwap(id, type);
            if (result.status) {
                //
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);
            toast({
                title: err?.body?.message || err.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem
                        onClick={
                            role == 'TeamMember'
                                ? () => treatLeave(id, 1)
                                : () => treatLeave(id, 1)
                        }
                        w="full"
                    >
                        <Icon as={MdVerified} mr=".5rem" color="brand.400" />
                        Approve
                    </MenuItem>
                    <MenuItem
                        onClick={
                            role == 'TeamMember'
                                ? () => treatLeave(id, 1)
                                : () => treatLeave(id, 1)
                        }
                        w="full"
                    >
                        <Icon as={MdCancel} mr=".5rem" color="#FF5B79" />{' '}
                        Decline
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}

export function TableContractOptions({
    id,
    extend,
    modify,
    clicked,
    data,
}: {
    id: any;
    extend?: any;
    modify?: any;
    clicked?: any;
    data: any;
}) {
    const setExtend = (data: any) => {
        clicked(data);
        extend(true);
    };
    const setModify = (data: any) => {
        clicked(data);
        modify(true);
    };
    const terminate = (data: any) => {
        clicked(data);
        id();
    };

    return (
        <td>
            <Menu>
                <MenuButton type="button">
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        <FaEllipsisH />
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={() => setExtend(data)} w="full">
                        Extend
                    </MenuItem>
                    <MenuItem onClick={() => setModify(data)} w="full">
                        Modify
                    </MenuItem>
                    <MenuItem onClick={() => terminate(data)} w="full">
                        Terminate
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function TableContractAction({
    id,
    timeSheets,
    supervisor,
    date,
    end,
    team,
}: {
    id: any;
    timeSheets?: boolean;
    supervisor?: boolean;
    date?: any;
    end?: any;
    team?: boolean;
}) {
    const { user } = useContext(UserContext);
    const role = user?.role.replaceAll(' ', '');
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        <FaEllipsisH />
                    </Box>
                </MenuButton>
                <MenuList>
                    <MenuItem>
                        {timeSheets === true ? (
                            <>
                                <NextLink
                                    href={
                                        date !== undefined
                                            ? `/${role}/timesheets/${id}?date=${date}&end=${end}`
                                            : `/${role}/timesheets/${id}`
                                    }
                                    passHref
                                >
                                    <Link
                                        width="100%"
                                        textDecor="none !important"
                                    >
                                        View Timesheet
                                    </Link>
                                </NextLink>
                            </>
                        ) : supervisor === true ? (
                            <NextLink
                                href={`/Supervisor/timesheets/${id}`}
                                passHref
                            >
                                <Link width="100%" textDecor="none !important">
                                    View Timesheet
                                </Link>
                            </NextLink>
                        ) : team === true ? (
                            <NextLink
                                href={
                                    date !== undefined
                                        ? `/${role}/timesheets/my-timesheet?date=${date}`
                                        : `/${role}/timesheets/my-timesheet`
                                }
                                passHref
                            >
                                <Link width="100%" textDecor="none !important">
                                    View Timesheet
                                </Link>
                            </NextLink>
                        ) : (
                            <NextLink
                                href={`/${role}/profile-management/team-members/${id}`}
                                passHref
                            >
                                <Link width="100%" textDecor="none !important">
                                    View Profile
                                </Link>
                            </NextLink>
                        )}
                    </MenuItem>
                    {timeSheets === true && !team && (
                        <MenuItem>
                            <NextLink
                                href={
                                    date !== undefined
                                        ? `/${role}/timesheets/${id}?date=${date}`
                                        : `/${role}/timesheets/all/${id}`
                                }
                                passHref
                            >
                                <Link width="100%" textDecor="none !important">
                                    View Details
                                </Link>
                            </NextLink>
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </td>
    );
}
export function ToggleStatus({ id, status }: { id: any; status: string }) {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const toggleStatus = async (data: string) => {
        //
        try {
            setLoading(true);
            const result = await SettingsService.toggleStatus(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            setLoading(false);

            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={() => toggleStatus(id)} w="full">
                        {status == 'ACTIVE' ? 'Deactivate' : 'Activate'}
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}

export function ExpenseActions({
    id,
    manager = false,
}: {
    id: ExpenseView;
    manager?: boolean;
}) {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const Approve = async (data: string) => {
        try {
            setLoading(true);
            if (manager) {
                const result = await FinancialService.approveExpense(data);
                if (result.status) {
                    toast({
                        title: result.message,
                        status: 'success',
                        isClosable: true,
                        position: 'top-right',
                    });
                    setLoading(false);
                    router.replace(router.asPath);
                    return;
                }
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            } else {
                const result = await FinancialService.reviewExpense(data);
                if (result.status) {
                    toast({
                        title: result.message,
                        status: 'success',
                        isClosable: true,
                        position: 'top-right',
                    });
                    setLoading(false);
                    router.replace(router.asPath);
                    return;
                }
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'error',
                    isClosable: true,
                    position: 'top-right',
                });
            }
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    const Decline = async (data: string) => {
        try {
            setLoading(true);
            const result = await FinancialService.declineExpense(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (err: any) {
            setLoading(false);

            toast({
                title: err.body.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    {(manager && id.status !== 'APPROVED') ||
                        (id.status === 'PENDING' && (
                            <MenuItem
                                onClick={() => Approve(id.id as string)}
                                w="full"
                            >
                                {manager ? 'Approve' : 'Review'}
                            </MenuItem>
                        ))}
                    <MenuItem onClick={() => Decline(id.id as string)} w="full">
                        Reject
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function PayrollActions({ id, userId }: { id: any; userId: any }) {
    const toast = useToast();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    // const Approve = async (data: string) => {
    //     try {
    //         setLoading(true);
    //         const result = await FinancialService.approvePayroll(data);
    //         if (result.status) {
    //
    //             toast({
    //                 title: result.message,
    //                 status: 'success',
    //                 isClosable: true,
    //                 position: 'top-right',
    //             });
    //             setLoading(false);
    //              router.replace(router.asPath);
    //             return;
    //         }
    //         setLoading(false);
    //         toast({
    //             title: result.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //     } catch (error: any) {
    //
    //         setLoading(false);
    //         toast({
    //             title: error?.body?.message || error?.message,
    //             status: 'error',
    //             isClosable: true,
    //             position: 'top-right',
    //         });
    //     }
    // };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    {/* <MenuItem  onClick={() => Approve(id)} w="full">
                        Approve
                    </MenuItem> */}
                    <MenuItem w="full">
                        <NextLink
                            href={`/PayrollManager/timesheets/${userId}`}
                            passHref
                        >
                            <Link width="100%" textDecor="none !important">
                                View Timesheet
                            </Link>
                        </NextLink>
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
export function InvoiceAction({
    clicked,
    data,
    onOpen,
}: {
    clicked?: any;
    data: any;
    onOpen?: any;
}) {
    const showInvoice = (data: any) => {
        onOpen();
        clicked(data);
    };

    return (
        <td>
            <Box
                onClick={() => showInvoice(data)}
                fontSize="1rem"
                cursor="pointer"
            >
                <FaEye />
            </Box>
        </td>
    );
}
export function TableInvoiceActions({ id, x }: { id: any; x: InvoiceView }) {
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const approveInvoiceItems = async () => {
        try {
            setLoading(true);
            const result = await FinancialService.treatSubmittedInvoice(id);
            if (result.status) {
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                setLoading(false);
                router.replace(router.asPath);
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        } catch (error: any) {
            setLoading(false);
            toast({
                title: error?.body?.message || error?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    {x?.status != 'APPROVED' && (
                        <MenuItem
                            onClick={
                                x?.status == 'APPROVED'
                                    ? () => void 0
                                    : () => approveInvoiceItems()
                            }
                            w="full"
                        >
                            Treat item
                        </MenuItem>
                    )}
                    {/* <MenuItem w="full">
                        <NextLink href={`${route}/${id}`} passHref>
                            <Link width="100%" textDecor="none !important">
                                View Profile
                            </Link>
                        </NextLink>
                    </MenuItem> */}
                </MenuList>
            </Menu>
        </td>
    );
}
export function TableSubscriptionActions({
    x,
    openRenew,
    // openPayment,
    setData,
}: {
    x: any;
    openRenew: any;
    // openPayment: any;
    setData: any;
}) {
    const openRenewSub = () => {
        setData(x);
        openRenew();
    };
    const upgradeSub = () => {
        setData(x);
        // openPayment();
    };
    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        <FaEllipsisH />
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem onClick={openRenewSub} w="full">
                        <Icon as={MdVerified} mr=".5rem" color="#777777" />
                        Renew Subscription
                    </MenuItem>
                    <MenuItem onClick={upgradeSub} w="full">
                        <Icon
                            as={RiInboxArchiveFill}
                            mr=".5rem"
                            color="#777777"
                        />
                        Upgrade Subscription
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}

export function TrainingActions({
    loading,
    route,
    viewOnly,
    deleteTraining,
}: {
    loading?: any;
    route?: any;
    viewOnly?: any;
    deleteTraining?: any;
}) {
    const router = useRouter();

    return (
        <td>
            <Menu>
                <MenuButton>
                    <Box
                        fontSize="1rem"
                        pl="1rem"
                        fontWeight="bold"
                        cursor="pointer"
                        color="brand.300"
                    >
                        {loading ? <Spinner size="sm" /> : <FaEllipsisH />}
                    </Box>
                </MenuButton>
                <MenuList w="full">
                    <MenuItem w="full" onClick={() => router.push(route)}>
                        View
                    </MenuItem>
                    {!viewOnly && (
                        <MenuItem onClick={deleteTraining} w="full">
                            Delete
                        </MenuItem>
                    )}
                </MenuList>
            </Menu>
        </td>
    );
}
