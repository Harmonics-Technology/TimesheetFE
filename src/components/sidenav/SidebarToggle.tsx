import {
    Box,
    Button,
    Circle,
    Flex,
    Icon,
    IconButton,
    Text,
    VStack,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { BsToggle2On } from 'react-icons/bs';
import { FaArrowRight, FaTimes, FaTimesCircle } from 'react-icons/fa';

interface sidebarProps {
    setChange: any;
    change: boolean;
}
const SidebarToggle = ({ setChange, change }: sidebarProps) => {
    //
    const [removeTag, setRemoveTag] = useState(false);
    const setAndClodeSidebarTag = () => {
        setRemoveTag(false);
        localStorage.setItem('sidenote', 'false');
    };
    const setAndStoreSidebarChange = () => {
        setChange(!change);
        localStorage.setItem('timesheet-sidebar', !change as unknown as string);
    };
    useEffect(() => {
        const tag = localStorage.getItem('sidenote');
        const savedChange = localStorage.getItem('timesheet-sidebar');
        setTimeout(() => {
            setRemoveTag(tag !== null || savedChange !== null ? false : true);
        }, 2000);
    }, []);
    return (
        <Flex pos="fixed" right="0" zIndex="999">
            {removeTag && (
                <VStack
                    bgColor="rgba(0,0,0,0.8)"
                    color="white"
                    p=".5rem 0"
                    w="8rem"
                    fontSize=".8rem"
                    borderRadius="10px"
                    pos="relative"
                    left="-6%"
                    transition="ease .5s"
                    spacing=".3rem"
                >
                    <Text textAlign="center" mb="0" lineHeight="1">
                        Change Sidebar theme here
                    </Text>
                    <Button
                        bgColor="brand.400"
                        px="2rem"
                        h="1.5rem"
                        fontSize=".7rem"
                        onClick={setAndClodeSidebarTag}
                    >
                        Close
                    </Button>
                    {/* <Circle
                        as={FaTimesCircle}
                        pos="absolute"
                        left="-3%"
                        top="-10%"
                        fontSize="1rem"
                        boxShadow="md"
                        cursor="pointer"
                        bgColor="rgba(0,0,0,0.8)"
                        onClick={() => setRemoveTag(false)}
                    >
                        <Icon as={FaTimes} color="white" />
                    </Circle> */}
                    <Icon
                        as={FaArrowRight}
                        color="rgba(0,0,0,0.8)"
                        pos="absolute"
                        right="-3"
                        top="30%"
                        transform="translateY(-100%)"
                    />
                </VStack>
            )}

            <IconButton
                aria-label="Toggle sidebar"
                icon={<AiFillSetting />}
                borderRadius="20px 0 0 20px"
                bgColor={change ? 'brand.400' : 'white'}
                boxShadow="sm"
                color={change ? 'white' : 'gray.500'}
                onClick={setAndStoreSidebarChange}
                h={['1.8rem', '2.5rem']}
                // pos="relative"
                // right="0"
            />
        </Flex>
    );
};

export default SidebarToggle;
