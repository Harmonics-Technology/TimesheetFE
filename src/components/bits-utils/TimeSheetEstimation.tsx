import { Button, Flex, Tooltip } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

interface TimeProps {
    label: string;
    data: any;
    tip?: string;
}
export default function TimeSheetEstimation({ label, data, tip }: TimeProps) {
    return (
        <Flex
            flexDirection="column"
            fontSize=".8rem"
            width="100%"
            cursor="default"
        >
            <Flex
                border="1px solid"
                m="0"
                py="1rem"
                w="full"
                justify="center"
                align="center"
                fontWeight="500"
                borderColor="#e5e5e5"
            >
                {label}
            </Flex>
            <Tooltip
                label={tip}
                hasArrow
                bgColor="gray.300"
                color="black"
                placement="bottom"
            >
                <Flex
                    border="1px solid"
                    m="0"
                    h="3rem"
                    w="full"
                    justify="center"
                    align="center"
                    fontWeight="500"
                    borderColor="#e5e5e5"
                >
                    {data}
                </Flex>
            </Tooltip>
        </Flex>
    );
}
export function TimeSheetEstimationBtn({
    id,
    loading,
}: {
    id: any;
    loading: boolean;
}) {
    const router = useRouter();
    return (
        <Flex flexDirection="column" fontSize="1rem" width="100%">
            <Flex
                border="1px solid"
                m="0"
                h="full"
                w="full"
                justify="center"
                align="center"
                fontWeight="500"
                borderColor="#e5e5e5"
                p="1.5rem .8rem"
            >
                <Button
                    bgColor="brand.400"
                    borderRadius="0"
                    h="full"
                    width="100"
                    color="white"
                    disabled={loading}
                    onClick={() => router.reload()}
                >
                    Update Timesheet
                </Button>
            </Flex>
            {/* <Flex
                border="1px solid"
                m="0"
                h="3rem"
                w="full"
                justify="center"
                align="center"
                fontWeight="500"
                borderColor="#e5e5e5"
            ></Flex> */}
        </Flex>
    );
}
