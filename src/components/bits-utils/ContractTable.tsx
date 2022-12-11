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
    Spinner,
    FormLabel,
} from "@chakra-ui/react";
import DrawerWrapper from "@components/bits-utils/Drawer";
import { TableData, TableState } from "@components/bits-utils/TableData";
import Tables from "@components/bits-utils/Tables";
import React, { useRef, useState } from "react";
import { Widget } from "@uploadcare/react-widget";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { RiMailSendFill } from "react-icons/ri";
import { PrimaryInput } from "@components/bits-utils/PrimaryInput";
interface adminProps {
    adminList: ContractViewPagedCollectionStandardResponse;
    userProfile?: UserView;
}

import {
    ContractModel,
    ContractService,
    ContractView,
    ContractViewPagedCollectionStandardResponse,
    UserView,
} from "src/services";
import Pagination from "@components/bits-utils/Pagination";
import { useRouter } from "next/router";
import { PrimaryDate } from "@components/bits-utils/PrimaryDate";

const schema = yup.object().shape({
    title: yup.string().required(),
    startDate: yup.string().required(),
    endDate: yup.string().required(),
});

function TeamManagement({ adminList, userProfile }: adminProps) {
    console.log({ adminList });
    const [contract, setContractFile] = useState<any>("");
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ContractModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            userId: userProfile?.id,
        },
    });
    const { isOpen, onOpen, onClose } = useDisclosure();
    const router = useRouter();
    const toast = useToast();

    const [showLoading, setShowLoading] = useState(false);
    const widgetApi = useRef<any>();

    const showLoadingState = (file) => {
        if (file) {
            file.progress((info) => {
                console.log("File progress: ", info.progress),
                    setShowLoading(true);
            });
            file.done((info) => {
                setShowLoading(false),
                    console.log("File uploaded: ", info),
                    setContractFile(info);
            });
        }
    };

    const onSubmit = async (data: ContractModel) => {
        data.document = contract.cdnUrl;
        if (data.document === undefined || "") {
            toast({
                title: "Please select a contract document and try again",
                status: "error",
                isClosable: true,
                position: "top-right",
            });
            return;
        }
        console.log({ data });
        try {
            const result = await ContractService.createContract(data);
            if (result.status) {
                toast({
                    title: result.message,
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
                // padding="1.5rem"
                // boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
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
                        Contract Data
                    </Text>
                    <Button
                        bgColor="brand.400"
                        color="white"
                        p=".5rem 1.5rem"
                        height="fit-content"
                        boxShadow="0 4px 7px -1px rgb(0 0 0 / 11%), 0 2px 4px -1px rgb(0 0 0 / 7%)"
                        onClick={onOpen}
                    >
                        +Contract
                    </Button>
                </Flex>
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
                    tableHead={[
                        "Name",
                        "Contract Title",
                        "Start Date",
                        "End Date",
                        "Tenor",
                        "Contract",
                        "Status",
                        "Action",
                    ]}
                >
                    <>
                        {adminList?.data?.value?.map((x: ContractView) => (
                            <Tr key={x.title}>
                                <TableData name={userProfile?.fullName} />
                                <TableData name={x.title} />
                                <TableData name={x.startDate} />
                                <TableData name={x.endDate} />
                                <TableData
                                    name={x.tenor as unknown as string}
                                />
                                <TableState name={x.status as string} />
                            </Tr>
                        ))}
                    </>
                </Tables>
                <Pagination data={adminList} />
            </Box>
            <DrawerWrapper
                onClose={onClose}
                isOpen={isOpen}
                title={"Add new Contract"}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Box w="full">
                        <Grid templateColumns="repeat(3,1fr)" gap="1rem 2rem">
                            <PrimaryInput<ContractModel>
                                label="Contract Title"
                                name="title"
                                error={errors.title}
                                placeholder=""
                                defaultValue=""
                                register={register}
                            />
                            <PrimaryDate<ContractModel>
                                control={control}
                                name="startDate"
                                label="Start Date"
                                error={errors.startDate}
                            />
                            <PrimaryDate<ContractModel>
                                control={control}
                                name="endDate"
                                label="End Date"
                                error={errors.endDate}
                            />
                        </Grid>
                        <Box>
                            <FormLabel
                                textTransform="capitalize"
                                width="fit-content"
                                fontSize=".8rem"
                            >
                                Attach Document
                            </FormLabel>

                            <Flex
                                outline="1px solid"
                                outlineColor="gray.300"
                                h="2.6rem"
                                align="center"
                                pr="1rem"
                                w="63%"
                                // justifyContent="space-between"
                            >
                                <Flex
                                    bgColor="#f5f5f5"
                                    fontSize=".8rem"
                                    px="2rem"
                                    h="full"
                                    align="center"
                                    cursor="pointer"
                                    my="auto"
                                    fontWeight="600"
                                    onClick={() =>
                                        widgetApi.current.openDialog()
                                    }
                                >
                                    Choose File
                                </Flex>
                                <Text noOfLines={1} my="auto" px=".5rem">
                                    {contract.name}
                                </Text>
                                {showLoading && (
                                    <Flex align="center">
                                        <Text
                                            mb="0"
                                            fontStyle="italic"
                                            mr="1rem"
                                        >
                                            ...loading data info
                                        </Text>
                                        <Spinner />
                                    </Flex>
                                )}
                            </Flex>
                            <Box display="none">
                                <Widget
                                    publicKey="fda3a71102659f95625f"
                                    clearable
                                    onFileSelect={showLoadingState}
                                    ref={widgetApi}
                                    systemDialog={true}
                                    inputAcceptTypes={".docx,.pdf, .doc"}
                                />
                            </Box>
                        </Box>
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
                                <Box>Add</Box>
                            </Button>
                        </Grid>
                    </DrawerFooter>
                </form>
            </DrawerWrapper>
        </>
    );
}

export default TeamManagement;
