import { Flex, Text, Circle, HStack, Button } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface pageOptions {
    data: any;
}

function Pagination({ data }: pageOptions) {
    data = data?.data;
    // console.log({ data });
    const current = data?.offset + 1;
    const totalPages = Math.ceil(
        (data?.size as number) / (data?.limit as unknown as number),
    );
    const currentPage = (((data?.limit as unknown as number) +
        (data?.offset as unknown as number)) /
        (data?.limit as unknown as number)) as number;
    const total = data?.size;
    const pageSize = data?.value?.length;

    const router = useRouter();
    const next = data?.next?.href;
    const previous = data?.previous?.href;

    const paginate = (direction: "next" | "previous") => {
        let link = "";
        if (direction == "previous" && previous != null) {
            link = previous!.split("?")[1];
            router.push({
                query: {
                    url: link,
                },
            });
        }
        if (direction == "next" && next != null) {
            link = next!.split("?")[1];
            router.push({
                query: {
                    url: link,
                },
            });
        }
    };
    return (
        <Flex
            justify="space-between"
            align="center"
            p="1.5rem 0 .5rem"
            gap="1rem"
            flexDirection={["column", "row"]}
        >
            <Text fontSize=".9rem" color="brand.300" mb="0">
                Showing {current} to {pageSize} of {total} entries
            </Text>
            {totalPages > 1 && (
                <HStack cursor="pointer">
                    <Button
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        width="2rem"
                        height="2rem"
                        minW="unset"
                        padding="0"
                        borderRadius="50%"
                        disabled={!previous}
                        onClick={() => paginate("previous")}
                    >
                        <FaAngleLeft fontSize=".6rem" />
                    </Button>
                    <Circle bgColor="brand.400" color="white" size="2rem">
                        {currentPage}
                    </Circle>
                    <Text mx=".5rem">of</Text>
                    <Circle
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        size="2rem"
                    >
                        {totalPages}
                    </Circle>

                    <Button
                        bgColor="white"
                        color="brand.200"
                        border="1px solid #767676"
                        width="2rem"
                        height="2rem"
                        minW="unset"
                        padding="0"
                        borderRadius="50%"
                        disabled={!next}
                        onClick={() => paginate("next")}
                    >
                        <FaAngleRight fontSize=".6rem" />
                    </Button>
                </HStack>
            )}
        </Flex>
    );
}

export default Pagination;