import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';
import { AiFillSetting } from 'react-icons/ai';
import { BsToggle2On } from 'react-icons/bs';

interface sidebarProps {
    setChange: any;
    change: boolean;
}
const SidebarToggle = ({ setChange, change }: sidebarProps) => {
    console.log({ change });
    const setAndStoreSidebarChange = () => {
        setChange(!change);
        localStorage.setItem('timesheet-sidebar', !change as unknown as string);
    };
    return (
        <Box pos="absolute" right="0" zIndex="999">
            <IconButton
                aria-label="Toggle sidebar"
                icon={<AiFillSetting />}
                borderRadius="20px 0 0 20px"
                bgColor={change ? 'brand.400' : 'white'}
                boxShadow="sm"
                color={change ? 'white' : 'gray.500'}
                onClick={setAndStoreSidebarChange}
            />
        </Box>
    );
};

export default SidebarToggle;
