import {
    Box,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Td,
    useToast,
} from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { FaEllipsisH } from "react-icons/fa";
import { InitiateResetModel, UserService } from "src/services";

export function TableData({ name }: { name: string | undefined | null }) {
    return (
        <Td
            pl="1rem"
            fontSize="13px"
            color="brand.200"
            fontWeight="400"
            // textTransform="capitalize"
            py=".8rem"
        >
            {name}
        </Td>
    );
}
export function TableStatus({ name }: { name: boolean | undefined }) {
    return (
        <td>
            <Box
                fontSize="10px"
                bgColor={name == true ? "brand.400" : "red"}
                borderRadius="4px"
                color="white"
                fontWeight="bold"
                padding=".2rem 1rem"
                width="fit-content"
                cursor="pointer"
                textTransform="uppercase"
            >
                {name == true ? "Active" : "Inactive"}
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
    const resendInvite = async (data: InitiateResetModel) => {
        // console.log(data.email);
        try {
            const result = await UserService.resendInvite(data);
            if (result.status) {
                // console.log({ result });
                toast({
                    title: `Login Successful`,
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                return;
            }
            toast({
                title: result.message,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        } catch (error) {
            console.log({ error });
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
                        <FaEllipsisH />
                    </Box>
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => resendInvite({ email })}>
                        Resend Invite
                    </MenuItem>
                    <MenuItem>
                        <Link href={`${route}/${id}`}>View Profile</Link>
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
