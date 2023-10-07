import { Button, Flex, Tooltip, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import BeatLoader from 'react-spinners/BeatLoader';

interface TimeProps {
    label: string;
    data: any;
    tip?: string;
}
export default function TimeSheetEstimation({ label, data, tip }: TimeProps) {
    return (
        <Flex
            flexDirection="column"
            fontSize={['.75rem', '.8rem']}
            width={['47%', '100%']}
            cursor="default"
        >
            <Flex
                border={['none', '1px solid #e5e5e5']}
                m="0"
                py="1rem"
                px=".5rem"
                w="full"
                justify="center"
                align="center"
                fontWeight="500"
                // borderColor="#e5e5e5"
            >
                <Text mb="0" noOfLines={1}>
                    {label}
                </Text>
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
                    h={['2rem', '3rem']}
                    w="full"
                    justify="center"
                    align="center"
                    fontWeight="500"
                    borderColor={['gray.500', '#e5e5e5']}
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
    title,
    click,
    bg = 'brand.400',
    disabled,
}: {
    id: any;
    loading: boolean;
    title: string;
    click?: any;
    bg?: string;
    disabled?: boolean;
}) {
    const router = useRouter();
    return (
        <Flex flexDirection="column" width="fit-content">
            <Flex
                border={['none', '1px solid #e5e5e5']}
                m="0"
                h="full"
                w="full"
                justify="center"
                align="center"
                fontWeight="500"
                p={['1rem .8rem', '1.5rem .8rem']}
            >
                <Button
                    bgColor={bg}
                    borderRadius="0"
                    h={['2.5rem', '3rem']}
                    width={['80%', 'auto']}
                    fontSize={['.9rem', '1rem']}
                    color="white"
                    isLoading={loading}
                    disabled={disabled}
                    spinner={<BeatLoader color="white" size={10} />}
                    onClick={click}
                >
                    {title}
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
