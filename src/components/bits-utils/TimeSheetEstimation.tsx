import { Button, Flex } from "@chakra-ui/react";
import React from "react";

interface TimeProps {
    label: string;
    data: any;
}
export default function TimeSheetEstimation({ label, data }: TimeProps) {
    return (
        <Flex flexDirection="column" fontSize=".8rem" width="100%">
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
        </Flex>
    );
}
export function TimeSheetEstimationBtn({ id }: { id: any }) {
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
