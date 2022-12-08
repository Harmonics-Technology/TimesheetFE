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

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiMailSendFill } from "react-icons/ri";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
import { PrimarySelect } from "@components/bits-utils/PrimarySelect";
import {
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from "src/services";
import Pagination from "@components/bits-utils/Pagination";
import roles from "../generics/roles.json";
import { FaTimes } from "react-icons/fa";
import { useRouter } from "next/router";

const schema = yup.object().shape({
    lastName: yup.string().required(),
    firstName: yup.string().required(),
    role: yup.string().required(),
    email: yup.string().email().required(),
});
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
}

function ProfileManagementAdmin({ adminList }: adminProps) {
    // console.log({ adminList });
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: "all",
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    // console.log(watch("organizationName"));
    const newUser = watch("firstName");
    const oldMember = watch("organizationName");

    const onSubmit = async (data: RegisterModel) => {
        try {
            const result = await UserService.create(data);
            if (result.status) {
                toast({
                    title: `Successfully created`,
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                onClose();
                return;
            }
            toast({
                title: result.message,
                status: "error",
                isClosable: true,
                position: "top-right",
            });
            return;
        } catch (err) {
            toast({
                title: "An error occurred",
                status: "error",
                isClosable: true,
                position: "top-right",
            });
        }
    };

    function Reset() {
        setValue("organizationName", undefined);
    }
    function setFilter(filter: string) {
        router.push({
            query: {
                limit: filter,
            },
        });
    }
    function search(term: string) {
        router.push({
            query: {
                search: term,
            },
        });
    }
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
                        <Select
                            w="fit-content"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="30">30</option>
                        </Select>

                        <Text noOfLines={1}>entries per page</Text>
                    </HStack>
                    <Box>
                        <Input
                            type="search"
                            placeholder="search"
                            onChange={(e) => search(e.target.value)}
                        />
                    </Box>
                </Flex>
                <Tables
                    tableHead={["Name", "Email", "Role", "Status", "Action"]}
                >
                    <>
                        {adminList?.data?.value?.map((x: UserView) => (
                            <Tr key={x.id}>
                                <TableData name={x.firstName} />
                                <TableData name={x.email} />
                                <TableData name={x.role} />
                                <TableStatus name={x.isActive} />
                                <TableActions
                                    id={x.id}
                                    route="admin"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            <DrawerWrapper onClose={onClose} isOpen={isOpen}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {oldMember === undefined || oldMember === "" ? (
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
                                        {roles.slice(0, 4).map((x: any) => {
                                            return (
                                                <option value={x.title}>
                                                    {x.title}
                                                </option>
                                            );
                                        })}
                                    </>
                                }
                            />
                        </Grid>
                    ) : null}

                    {(oldMember === undefined || oldMember === "") &&
                    (newUser === undefined || newUser === "") ? (
                        <Text
                            textAlign="center"
                            borderTop="1px solid"
                            borderBottom="1px solid"
                            borderColor="#e5e5e5"
                            py="1rem"
                        >
                            OR
                        </Text>
                    ) : null}

                    <>
                        {newUser === undefined || newUser === "" ? (
                            <Grid
                                templateColumns="repeat(2,1fr)"
                                gap="1rem 2rem"
                            >
                                <Box>
                                    <PrimarySelect<RegisterModel>
                                        register={register}
                                        name="organizationName"
                                        error={errors.organizationName}
                                        label="Select From Team Members"
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
                                    {oldMember !== undefined && (
                                        <Flex
                                            fontSize=".8rem"
                                            mt=".5rem"
                                            onClick={Reset}
                                            align="center"
                                            cursor="pointer"
                                        >
                                            <FaTimes />{" "}
                                            <Text mb="0" ml=".4rem">
                                                Clear
                                            </Text>
                                        </Flex>
                                    )}
                                </Box>
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
                        ) : null}
                    </>

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
