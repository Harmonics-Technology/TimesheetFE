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
    Checkbox,
} from "@chakra-ui/react";
import DrawerWrapper from "@components/bits-utils/Drawer";
import {
    TableActions,
    TableData,
    TableStatus,
} from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import React, { useState } from "react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiMailSendFill } from "react-icons/ri";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
interface adminProps {
    adminList: UserViewPagedCollectionStandardResponse;
}

import {
    RegisterModel,
    UserService,
    UserView,
    UserViewPagedCollectionStandardResponse,
} from "src/services";
import Pagination from "@components/bits-utils/Pagination";
import { useRouter } from "next/router";
import { PrimaryTextarea } from "@components/bits-utils/PrimaryTextArea";
import { PrimaryPhoneInput } from "@components/bits-utils/PrimaryPhoneInput";

const schema = yup.object().shape({
    // lastName: yup.string().required(),
    // firstName: yup.string().required(),
    // role: yup.string().required(),
    // email: yup.string().email().required(),
    organizationEmail: yup.string().email().required(),
    organizationName: yup.string().required(),
    organizationAddress: yup.string().required(),
    organizationPhone: yup.number().required(),
});

function PaymentPartnerManagement({ adminList }: adminProps) {
    // console.log({ adminList });
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<RegisterModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            role: "Payment Partner",
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();
    // console.log(watch("organizationPhone"));
    const [same, setSame] = useState(false);
    // console.log({ same });

    const onSubmit = async (data: RegisterModel) => {
        {
            same
                ? ((data.firstName = data.organizationName),
                  (data.email = data.organizationEmail),
                  (data.phoneNumber = data.organizationPhone),
                  (data.lastName = data.organizationName))
                : null;
        }
        console.log({ data });
        try {
            const result = await UserService.create(data);
            if (result.status) {
                toast({
                    title: `Invite Sent`,
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                router.reload();
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
                    +Payment Partner
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
                                    route="payment-partners"
                                    email={x.email}
                                />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={"Add new PaymentPartner"}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <PrimaryInput<RegisterModel>
                        label="Organization Name"
                        name="organizationName"
                        error={errors.organizationName}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Grid
                        templateColumns={["1fr", "repeat(2,1fr)"]}
                        gap="1rem 2rem"
                    >
                        <PrimaryInput<RegisterModel>
                            label="Organization Email"
                            name="organizationEmail"
                            error={errors.organizationEmail}
                            placeholder=""
                            defaultValue=""
                            register={register}
                        />
                        <PrimaryPhoneInput<RegisterModel>
                            label="Phone Number"
                            name="organizationPhone"
                            error={errors.organizationPhone}
                            placeholder="Organization Phone No."
                            control={control}
                        />
                    </Grid>
                    <PrimaryTextarea<RegisterModel>
                        label="Organization Address"
                        name="organizationAddress"
                        error={errors.organizationAddress}
                        placeholder=""
                        defaultValue=""
                        register={register}
                    />
                    <Box w="full">
                        <Flex
                            justify="space-between"
                            align="center"
                            my="1rem"
                            py="1rem"
                            borderY="1px solid"
                            borderColor="gray.300"
                        >
                            <Text
                                textTransform="uppercase"
                                mb="0"
                                fontSize="1.3rem"
                                fontWeight="500"
                            >
                                Contact Details
                            </Text>
                            <Checkbox
                                onChange={(e) => setSame(e.target.checked)}
                            >
                                Same as above
                            </Checkbox>
                        </Flex>
                        <Grid
                            templateColumns={["1fr", "repeat(2,1fr)"]}
                            gap="1rem 2rem"
                            display={same ? "none" : "grid"}
                        >
                            <PrimaryInput<RegisterModel>
                                label="Contact First Name"
                                name="firstName"
                                error={errors.firstName}
                                placeholder=""
                                defaultValue={""}
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Last Name"
                                name="lastName"
                                error={errors.lastName}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryInput<RegisterModel>
                                label="Contact Email"
                                name="email"
                                error={errors.email}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryPhoneInput<RegisterModel>
                                label="Contact Phone No."
                                name="phoneNumber"
                                error={errors.phoneNumber}
                                placeholder=""
                                control={control}
                            />
                        </Grid>
                    </Box>

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

export default PaymentPartnerManagement;
