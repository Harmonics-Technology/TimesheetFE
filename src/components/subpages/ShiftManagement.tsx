import { Box, Flex, HStack, useDisclosure } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import React, { useRef, useState } from 'react';
import 'react-big-scheduler-stch/lib/css/style.css';
import DragDropContext from '../generics/withDnDContext';
import Schedulers from './Schedulers';
import { AddShiftModal } from '@components/bits-utils/AddShiftModal';
import { useReactToPrint } from 'react-to-print';
import { PublishShiftModal } from '@components/bits-utils/PublishShiftModal';

const ShiftManagement = () => {
    const DemoData = {
        events: [
            {
                id: 1,
                start: '2023-04-12 09:30:00',
                end: '2023-04-12 20:30:00',
                resourceId: 'r1',
                title: 'Morning Shift',
                bgColor: '#f00000',
                movable: true,
            },
            {
                id: 2,
                start: '2023-04-11 12:30:00',
                end: '2023-04-11 23:30:00',
                resourceId: 'r0',
                title: 'Night Shift',
                resizable: false,
            },
            {
                id: 3,
                start: '2017-12-19 12:30:00',
                end: '2017-12-20 23:30:00',
                resourceId: 'r3',
                title: 'I am not movable',
                movable: false,
            },
            {
                id: 4,
                start: '2017-12-19 14:30:00',
                end: '2017-12-20 23:30:00',
                resourceId: 'r1',
                title: 'I am not start-resizable',
                startResizable: false,
            },
            {
                id: 5,
                start: '2017-12-19 15:30:00',
                end: '2017-12-19 23:30:00',
                resourceId: 'r2',
                title: 'Recurring Shift',
                rrule: 'FREQ=WEEKLY;DTSTART=20171219T013000Z;UNTIL=20230619T013000Z;BYDAY=MO,TU,WE,TH,FR',
                bgColor: '#f759ab',
            },
        ],
        resources: [
            {
                id: 'r0',
                name: 'Ade Adeyemi',
                hours: 16,
            },
            {
                id: 'r1',
                name: 'Busayo Moses',
                hours: 8,
            },
            {
                id: 'r2',
                name: 'Dotun Brown',
                hours: 26,
            },
            {
                id: 'r3',
                name: 'Bolaji Olanrewaju',
                hours: 14,
            },
            {
                id: 'r4',
                name: 'Jamila Rufai',
                hours: 10,
            },
        ],
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: opens, onClose: close } = useDisclosure();
    const [data, setData] = useState();
    const openModal = (data) => {
        onOpen();
        setData(data);
    };

    const componentRef = useRef<any>();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <>
            <Box
                bgColor="white"
                borderRadius="15px"
                padding="1.5rem"
                boxShadow="0 20px 27px 0 rgb(0 0 0 / 5%)"
            >
                <LeaveTab
                    tabValue={[
                        {
                            text: 'Schedule',
                            url: '/shift-management/schedule',
                        },
                        {
                            text: 'Employee Shifts',
                            url: '/shift-management/shifts',
                        },
                    ]}
                />
                <Flex justify="flex-end" borderBottom="1px solid #EBEFF2">
                    <HStack py=".5rem">
                        <ShiftBtn text="Add New Shift" onClick={onOpen} />
                        <ShiftBtn
                            text="Print"
                            bg="header.200"
                            onClick={handlePrint}
                        />
                        <ShiftBtn text="Publish Shift" onClick={opens} />
                    </HStack>
                </Flex>
                <Box ref={componentRef}>
                    <Schedulers
                        DemoData={DemoData}
                        openModal={openModal}
                        setData={setData}
                    />
                </Box>
            </Box>

            <AddShiftModal isOpen={isOpen} onClose={onClose} data={data} />
            <PublishShiftModal isOpen={open} onClose={close} data={data} />
        </>
    );
};

export default DragDropContext(ShiftManagement);
