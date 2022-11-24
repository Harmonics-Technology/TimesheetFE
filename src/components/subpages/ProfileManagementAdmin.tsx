import {
    Box,
    Button,
    Flex,
    Select,
    Text,
    HStack,
    Input,
    Tr,
    Circle,
} from "@chakra-ui/react";
import { TableData, TableStatus } from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

function ProfileManagementAdmin() {
    return (
        <Box
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Button
                bgColor="brand.400"
                color="white"
                p=".5rem 1.5rem"
                height="fit-content"
                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
            >
                +Admin
            </Button>
            <Flex justify="space-between" align="center" my="2.5rem">
                <HStack fontSize=".8rem" w="fit-content">
                    <Select w="fit-content">
                        <option>10</option>
                    </Select>

                    <Text>entries per page</Text>
                </HStack>
                <Box>
                    <Input type="search" placeholder="search" />
                </Box>
            </Flex>
            <Tables tableHead={["Name", "Email", "Role", "Status", "Action"]}>
                <>
                    <Tr>
                        <TableData name={"Olade"} />
                        <TableData name={"dotunbrown@gmail.com"} />
                        <TableData name={"SuperAdmin"} />
                        <TableStatus name={"ACTIVE"} />
                        <TableData name={"SuperAdmin"} />
                    </Tr>
                    <Tr>
                        <TableData name={"Olade"} />
                        <TableData name={"dotunbrown@gmail.com"} />
                        <TableData name={"SuperAdmin"} />
                        <TableStatus name={"ACTIVE"} />
                        <TableData name={"SuperAdmin"} />
                    </Tr>
                    <Tr>
                        <TableData name={"Olade"} />
                        <TableData name={"dotunbrown@gmail.com"} />
                        <TableData name={"SuperAdmin"} />
                        <TableStatus name={"ACTIVE"} />
                        <TableData name={"SuperAdmin"} />
                    </Tr>
                </>
            </Tables>
            <Flex justify="space-between" align="center" p="1.5rem 0 .5rem">
                <Text fontSize=".9rem" color="brand.300" mb="0">
                    Showing 1 to 10 of 29 entries
                </Text>
                <HStack>
                    <Circle
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #f2f2f2"
                        size="2rem"
                    >
                        <FaAngleLeft fontSize=".6rem" />
                    </Circle>
                    <Circle bgColor="brand.400" color="white" size="2rem">
                        1
                    </Circle>
                    <Circle
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #f2f2f2"
                        size="2rem"
                    >
                        2
                    </Circle>
                    <Circle
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #f2f2f2"
                        size="2rem"
                    >
                        <FaAngleRight fontSize=".6rem" />
                    </Circle>
                </HStack>
            </Flex>
        </Box>
    );
}

export default ProfileManagementAdmin;
