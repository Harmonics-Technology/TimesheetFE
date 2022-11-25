import { Box, Flex, HStack, Square, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { FaArrowRight, FaUser } from "react-icons/fa";

interface DashboardCardProps {
    title: string;
    url: string;
    value: any;
}

function DashboardCard({ title, url, value }: DashboardCardProps) {
    return (
        <Flex
            justify="space-between"
            bgColor="white"
            borderRadius="15px"
            padding="1.5rem"
            align="center"
            boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
        >
            <Box fontFamily="Open Sans" color="brand.200">
                <Text
                    fontWeight="600"
                    fontSize=".875rem"
                    opacity=".8"
                    mb="0"
                    textTransform="capitalize"
                >
                    {title}
                </Text>
                <Text fontWeight="700" fontSize="1.25rem" mb="0">
                    {value}
                </Text>
            </Box>
            <Stack direction="column" align="flex-end">
                <Square
                    bgColor="brand.400"
                    color="white"
                    borderRadius="8px"
                    size="2rem"
                    fontSize="1rem"
                >
                    <FaUser />
                </Square>
                <Link passHref href={url}>
                    <HStack
                        align="center"
                        color="brand.600"
                        fontSize=".7rem"
                        fontWeight="bold"
                        cursor="pointer"
                    >
                        <Text mb="0">View more</Text>
                        <FaArrowRight />
                    </HStack>
                </Link>
            </Stack>
        </Flex>
    );
}

export default DashboardCard;
