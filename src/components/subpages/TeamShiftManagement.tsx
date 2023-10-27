import { Box, Flex, HStack, useDisclosure, useToast } from '@chakra-ui/react';
import { LeaveTab } from '@components/bits-utils/LeaveTab';
import { ShiftBtn } from '@components/bits-utils/ShiftBtn';
import React, { useContext, useRef, useState } from 'react';
import 'react-big-scheduler-stch/lib/css/style.css';
import DragDropContext from '../generics/withDnDContext';
import Schedulers from './Schedulers';
import { AddShiftModal } from '@components/bits-utils/AddShiftModal';
import { useReactToPrint } from 'react-to-print';
import { PublishShiftModal } from '@components/bits-utils/PublishShiftModal';
import {
    ShiftService,
    ShiftUsersListViewPagedCollectionStandardResponse,
    ShiftViewListStandardResponse,
    ShiftViewStandardResponse,
    UserViewListStandardResponse,
} from 'src/services';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import ScheduleData from '@components/bits-utils/ScheduleData';
import TeamSchedulers from './TeamSchedulers';
import { SwapRequestModal } from '@components/bits-utils/SwapRequestModal';

interface shiftProps {
    allShift: ShiftViewListStandardResponse;
    id: string;
    shiftUser: any;
}

const TeamShiftManagement = ({ allShift, id, shiftUser }: shiftProps) => {
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
                rrule: 'FREQ=WEEKLY;DTSTART=20171219T133000Z;UNTIL=20230619T013000Z;BYDAY=MO,TU,WE,TH,FR',
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

    const EventList = allShift?.data?.map((obj) => {
        return {
            id: obj.id,
            start: obj.start,
            end: obj.end,
            resourceId: obj.userId,
            title: obj.title,
            rrule: obj.repeatQuery,
            bgColor: obj.color,
        };
    });

    const ShiftData = {
        events: EventList,
        resources: [
            {
                id: id,
                name: 'My Shift For The Week',
            },
        ],
        // ResourceList,
    };

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: opens, onClose: close } = useDisclosure();
    const [data, setData] = useState();
    const [schedule, setSchedule] = useState();

    const router = useRouter();
    const toast = useToast();
    const fromDate = router?.query?.from;
    const openModal = (data) => {
        onOpen();
        setData(data);
    };
    const setSchedules = (data) => {
        setSchedule(data);
    };
    const [loading, setLoading] = useState(false);
    const deleteShiftItem = async (id) => {
        try {
            setLoading(true);
            const result = await ShiftService.deleteShift(id);
            if (result.status) {
                setLoading(false);
                toast({
                    title: result.message,
                    status: 'success',
                    isClosable: true,
                    position: 'top-right',
                });
                router.replace(router.asPath);
                onClose();
                return;
            }
            setLoading(false);
            toast({
                title: result.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
            return;
        } catch (err: any) {
            toast({
                title: err?.body?.message || err?.message,
                status: 'error',
                isClosable: true,
                position: 'top-right',
            });
        }
    };

    const componentRef = useRef<any>();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const { user } = useContext(UserContext);
    const role = user?.role?.replaceAll(' ', '');
    const url = `${role}/shift-management/my-schedule`;

    return (
        <>
            <Flex justify="flex-end" borderBottom="1px solid #EBEFF2">
                <HStack py=".5rem">
                    <ShiftBtn
                        text="Print"
                        bg="header.200"
                        onClick={handlePrint}
                    />
                    <ShiftBtn text="Swap Shift Request" onClick={opens} />
                </HStack>
            </Flex>
            <Box ref={componentRef}>
                <TeamSchedulers
                    DemoData={ShiftData}
                    openModal={openModal}
                    setData={setData}
                    date={fromDate}
                    url={url}
                    schedule={setSchedules}
                    deleteShiftItem={deleteShiftItem}
                />
            </Box>

            <SwapRequestModal
                isOpen={open}
                onClose={close}
                employee={shiftUser}
                data={allShift}
            />
        </>
    );
};

export default DragDropContext(TeamShiftManagement);
