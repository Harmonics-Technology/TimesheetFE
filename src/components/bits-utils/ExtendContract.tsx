import {
    Box,
    Button,
    DrawerFooter,
    Flex,
    FormLabel,
    Grid,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { Widget } from "@uploadcare/react-widget";
import axios from "axios";
import fileDownload from "js-file-download";
import moment from "moment";
import React, { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineDownload } from "react-icons/ai";
import { RiMailSendFill } from "react-icons/ri";
import { DateObject } from "react-multi-date-picker";
import { ContractModel, ContractService } from "src/services";
import DrawerWrapper from "./Drawer";
import { PrimaryDate } from "./PrimaryDate";
import { PrimaryInput } from "./PrimaryInput";
import * as yup from "yup";
import { useRouter } from "next/router";

interface contractProps {
    extend: any;
    setExtend: any;
    clickedItem: any;
}
function ExtendContract({ extend, setExtend, clickedItem }: contractProps) {
    const router = useRouter();
    const toast = useToast();
    const [contract, setContractFile] = useState<any>("");
    const schema = yup.object().shape({
        // title: yup.string().required(),
        // startDate: yup.string().required(),
        // endDate: yup.string().required(),
    });
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ContractModel>({
        resolver: yupResolver(schema),
        mode: "all",
        defaultValues: {
            startDate: clickedItem?.startDate,
            endDate: clickedItem?.endDate,
            userId: clickedItem.userId,
            id: clickedItem.id,
        },
    });

    const downloadFile = (url: any) => {
        console.log(url);
        axios
            .get(url, {
                responseType: "blob",
            })
            .then((res) => {
                fileDownload(res.data, `${url.split(" ").pop()}`);
            });
    };

    const onSubmit = async (data: ContractModel) => {
        if (contract !== "") {
            data.document = `${contract.cdnUrl} ${contract.name}`;
        }
        data.document = clickedItem.document;
        data.id = clickedItem.id;
        data.userId = clickedItem.userId;
        data.title = clickedItem.title;
        {
            data.startDate === undefined
                ? (data.startDate = clickedItem.startDate)
                : data.startDate;
        }
        {
            data.endDate === undefined
                ? (data.endDate = clickedItem.endDate)
                : data.endDate;
        }
        console.log({ data });
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
            const result = await ContractService.updateContract(data);
            if (result.status) {
                toast({
                    title: result.message,
                    status: "success",
                    isClosable: true,
                    position: "top-right",
                });
                router.reload();
                setExtend(!extend);
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

    return (
        <DrawerWrapper
            onClose={() => setExtend(!extend)}
            isOpen={extend}
            title={"Extend Contract"}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <Box w="full">
                    <Grid
                        templateColumns={["repeat(1,1fr)", "repeat(2,1fr)"]}
                        gap="1rem 2rem"
                    >
                        <PrimaryInput<ContractModel>
                            label="Contract Title"
                            name="title"
                            error={errors.title}
                            placeholder=""
                            defaultValue={clickedItem?.title as string}
                            register={register}
                            disableLabel={true}
                        />
                        <PrimaryDate<ContractModel>
                            control={control}
                            name="startDate"
                            label="Start Date"
                            error={errors.startDate}
                            min={new Date()}
                            placeholder={moment(clickedItem?.startDate).format(
                                "DD MM YYYY",
                            )}
                            disabled={true}
                        />
                        <PrimaryDate<ContractModel>
                            control={control}
                            name="endDate"
                            label="End Date"
                            error={errors.endDate}
                            min={new DateObject().add(3, "days")}
                            placeholder={moment(clickedItem.endDate).format(
                                "DD MM YYYY",
                            )}
                        />
                        <Box>
                            <Flex>
                                <FormLabel
                                    textTransform="capitalize"
                                    width="fit-content"
                                    fontSize=".8rem"
                                >
                                    Attach Document
                                </FormLabel>
                                <Box
                                    cursor="pointer"
                                    onClick={() =>
                                        downloadFile(clickedItem?.document)
                                    }
                                >
                                    <AiOutlineDownload />
                                </Box>
                            </Flex>

                            <Flex
                                outline="1px solid"
                                outlineColor="gray.300"
                                h="2.6rem"
                                align="center"
                                pr="1rem"
                                w={["100%", "100%"]}
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
                                    // onClick={() =>
                                    //     widgetApi.current.openDialog()
                                    // }
                                >
                                    Choose File
                                </Flex>
                                {showLoading ? (
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
                                ) : (
                                    <Text noOfLines={1} my="auto" px=".5rem">
                                        {contract.name ||
                                            clickedItem?.document
                                                ?.split(" ")
                                                ?.pop() ||
                                            "No File Chosen"}
                                    </Text>
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
                            onClick={() => setExtend(!extend)}
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
                            <Box>Extend</Box>
                        </Button>
                    </Grid>
                </DrawerFooter>
            </form>
        </DrawerWrapper>
    );
}

export default ExtendContract;
