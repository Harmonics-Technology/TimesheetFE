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
    ShiftTypeViewStandardResponse,
    ShiftUsersListViewPagedCollectionStandardResponse,
    ShiftViewListStandardResponse,
    ShiftViewStandardResponse,
    UserViewListStandardResponse,
} from 'src/services';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import ScheduleData from '@components/bits-utils/ScheduleData';
import ShiftPagination from '@components/bits-utils/ShiftPagination';
import Pagination from '@components/bits-utils/Pagination';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';

interface shiftProps {
    allShift: ShiftViewListStandardResponse;
    shiftUser: ShiftUsersListViewPagedCollectionStandardResponse;
    shiftTypes: ShiftTypeViewStandardResponse;
}

const ShiftManagement = ({ allShift, shiftUser, shiftTypes }: shiftProps) => {
    console.log({ allShift, shiftUser });
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

    const ResourceList = shiftUser?.data?.value?.map((obj) => {
        return {
            id: obj.userId,
            name: obj.fullName,
            hours: obj.totalHours,
        };
    });

    const ShiftData = {
        events: EventList,
        resources: ResourceList,
        // ResourceList,
    };

    console.log({ ShiftData });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: open, onOpen: opens, onClose: close } = useDisclosure();
    const [data, setData] = useState();
    const [schedule, setSchedule] = useState();
    console.log({ schedule });
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
                router.reload();
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
    const url = `${role}/shift-management/schedule`;

    useNonInitialEffect(() => {
        router.reload();
    }, [router.isReady]);

    return (
        <>
            <Flex justify="flex-end" borderBottom="1px solid #EBEFF2">
                <HStack py=".5rem">
                    <ShiftBtn text="Add New Shift" onClick={() => onOpen()} />
                    <ShiftBtn
                        text="Print"
                        bg="header.200"
                        onClick={() => handlePrint()}
                    />
                    <ShiftBtn text="Publish Shift" onClick={() => opens()} />
                </HStack>
            </Flex>
            <Box ref={componentRef}>
                <Schedulers
                    DemoData={ShiftData}
                    openModal={openModal}
                    setData={setData}
                    date={fromDate}
                    url={url}
                    schedule={setSchedules}
                    deleteShiftItem={deleteShiftItem}
                />
            </Box>
            <Pagination data={shiftUser} shift />

            {isOpen && (
                <AddShiftModal
                    isOpen={isOpen}
                    onClose={onClose}
                    datas={data}
                    user={shiftUser}
                    shiftTypes={shiftTypes}
                />
            )}
            {open && (
                <PublishShiftModal isOpen={open} onClose={close} data={data} />
            )}
        </>
    );
};

export default DragDropContext(ShiftManagement);
