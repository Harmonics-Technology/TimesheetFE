/* eslint-disable no-sparse-arrays */
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
    useDisclosure,
    Grid,
    DrawerFooter,
    useToast,
} from "@chakra-ui/react";
import DrawerWrapper from "@components/bits-utils/Drawer";
import {
    TableActions,
    TableData,
    TableStatus,
} from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CleaningModel } from "@interfaces/types";
import { RiMailSendFill } from "react-icons/ri";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import { PrimarySelect } from "@components/bits-utils/PrimarySelect";
import { RegisterModel, UserService } from "src/services";

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    role: yup.string().required(),
    email: yup.string().required(),
});

function ProfileManagementAdmin() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const roles = [
        {
            id: 1,
            title: "admin",
        },
        {
            id: 2,
            title: "superAdmin",
        },
        {
            id: 3,
            title: "internal payroll mgr",
        },
        ,
        {
            id: 4,
            title: "developer",
        },
    ];
    const onSubmit = async (data: RegisterModel) => {
        // try {
        //     const result = await UserService.create(data);
        //     if (result.status) {
        //         toast({
        //             title: `Successfully created`,
        //             status: "success",
        //             isClosable: true,
        //             position: "top-right",
        //         });
        //         onClose();
        //         return;
        //     }
        //     toast({
        //         title: result.message,
        //         status: "error",
        //         isClosable: true,
        //         position: "top-right",
        //     });
        //     return;
        // } catch (err) {
        //     toast({
        //         title: "An error occurred",
        //         status: "error",
        //         isClosable: true,
        //         position: "top-right",
        //     });
        // }
    };
    return (
        <>
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
                    onClick={onOpen}
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
                <Tables
                    tableHead={["Name", "Email", "Role", "Status", "Action"]}
                >
                    <>
                        <Tr>
                            <TableData name={"Olade"} />
                            <TableData name={"dotunbrown@gmail.com"} />
                            <TableData name={"SuperAdmin"} />
                            <TableStatus name={"ACTIVE"} />
                            <TableActions id={"12"} route="clients" />
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
                            border="1px solid #767676"
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
                            border="1px solid #767676"
                            size="2rem"
                        >
                            2
                        </Circle>
                        <Circle
                            bgColor="white"
                            color="brand.200"
                            border="1px solid #767676"
                            size="2rem"
                        >
                            <FaAngleRight fontSize=".6rem" />
                        </Circle>
                    </HStack>
                </Flex>
            </Box>
            <DrawerWrapper onClose={onClose} isOpen={isOpen}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                        <PrimaryInput<RegisterModel>
                            label="First Name"
                            name="firstName"
                            error={errors.firstName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryInput<RegisterModel>
                            label="Last Name"
                            name="lastName"
                            error={errors.lastName}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryInput<RegisterModel>
                            label="Email"
                            name="email"
                            error={errors.email}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimarySelect<RegisterModel>
                            register={register}
                            name="role"
                            error={errors.role}
                            label="Role"
                            placeholder="..."
                            options={
                                <>
                                    {roles.map((x: any) => {
                                        return (
                                            <option value={x.id}>
                                                {x.title}
                                            </option>
                                        );
                                    })}
                                </>
                            }
                        />
                    </Grid>
                    <Text
                        textAlign="center"
                        borderTop="1px solid"
                        borderBottom="1px solid"
                        borderColor="#e5e5e5"
                        py="1rem"
                    >
                        OR
                    </Text>
                    <Grid templateColumns="repeat(2,1fr)" gap="1rem 2rem">
                        <PrimarySelect<RegisterModel>
                            register={register}
                            name="organizationName"
                            error={errors.organizationName}
                            label="Role"
                            placeholder="..."
                            options={
                                <>
                                    {roles.map((x: any) => {
                                        return (
                                            <option value={x.id}>
                                                {x.title}
                                            </option>
                                        );
                                    })}
                                </>
                            }
                        />
                        <PrimarySelect<RegisterModel>
                            register={register}
                            name="organizationEmail"
                            error={errors.organizationEmail}
                            label="Role"
                            placeholder="..."
                            options={
                                <>
                                    {roles.map((x: any) => {
                                        return (
                                            <option value={x.id}>
                                                {x.title}
                                            </option>
                                        );
                                    })}
                                </>
                            }
                        />
                    </Grid>
                    <DrawerFooter borderTopWidth="1px" mt="2rem" p="0">
                        <Grid
                            templateColumns="repeat(2,1fr)"
                            gap="1rem 2rem"
                            my="2rem"
                            w="full"
                        >
                            <Button
                                bgColor="gray.500"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                                onClick={() => onClose()}
                            >
                                Close
                            </Button>
                            <Button
                                bgColor="brand.400"
                                color="white"
                                height="3rem"
                                fontSize="14px"
                                type="submit"
                                isLoading={isSubmitting}
                                boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                            >
                                <Box pr=".5rem">
                                    <RiMailSendFill />
                                </Box>
                                <Box>Send Invite</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
        </>
    );
}

export default ProfileManagementAdmin;
