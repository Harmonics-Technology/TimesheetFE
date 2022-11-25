import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Td,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useState } from "react";
import { FaEllipsisH } from "react-icons/fa";

export function TableData({ name }: { name: string }) {
    return (
        <Td
            pl="1rem"
            fontSize="13px"
            color="brand.200"
            fontWeight="400"
            // textTransform="uppercase"
            py=".8rem"
        >
            {name}
        </Td>
    );
}
export function TableStatus({ name }: { name: string }) {
    return (
        <td>
            <Box
                fontSize="10px"
                bgColor={name == "ACTIVE" ? "brand.400" : "red"}
                borderRadius="4px"
                color="white"
                fontWeight="bold"
                padding=".2rem 1rem"
                width="fit-content"
                cursor="pointer"
            >
                {name}
            </Box>
        </td>
    );
}
export function TableActions({ id }: { id: any }) {
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
                    <MenuItem>Resend Invite</MenuItem>
                    <MenuItem>
                        <Link href={`admin/${id}`}>View Profile</Link>
                    </MenuItem>
                </MenuList>
            </Menu>
        </td>
    );
}
