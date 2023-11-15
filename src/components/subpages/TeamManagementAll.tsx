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
    shiftUser: ShiftUsersListViewPagedCollectionStandardResponse;
    id: any;
    myShift?: any;
}

const TeamManagementAll = ({
    allShift,
    shiftUser,
    id,
    myShift,
}: shiftProps) => {
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
    const url = `${role}/shift-management/schedule`;

    console.log({ shiftUser, myShift, allShift });

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
                data={myShift}
                allShift={allShift}
            />
        </>
    );
};

export default DragDropContext(TeamManagementAll);
