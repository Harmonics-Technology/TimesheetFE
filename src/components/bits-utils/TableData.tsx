import { Box, Td } from "@chakra-ui/react";
import React from "react";

export function TableData({ name }: { name: string }) {
    return (
        <Td
            pl="1rem"
            fontSize="11px"
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
