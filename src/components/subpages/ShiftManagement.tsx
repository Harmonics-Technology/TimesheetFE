import { Box, Flex, HStack, useDisclosure, useToast } from '@chakra-ui/react';
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
} from 'src/services';
import { useRouter } from 'next/router';
import { UserContext } from '@components/context/UserContext';
import Pagination from '@components/bits-utils/Pagination';
import { useNonInitialEffect } from '@components/generics/useNonInitialEffect';

interface shiftProps {
    allShift: ShiftViewListStandardResponse;
    shiftUser: ShiftUsersListViewPagedCollectionStandardResponse;
    shiftTypes: ShiftTypeViewStandardResponse;
}

const ShiftManagement = ({ allShift, shiftUser, shiftTypes }: shiftProps) => {
    // console.log({ allShift });
    const EventList = allShift?.data?.map((obj) => {
        return {
            id: obj.id,
            start: obj.start,
            end: obj.end,
            resourceId: obj.userId,
            title: obj.title == null ? 'Shift' : obj.title,
            rrule: obj.repeatQuery,
            bgColor: obj.color == null ? '#000000' : obj.color,
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
    const superAdminId = user?.superAdminId;

    useNonInitialEffect(() => {
        router.replace(router.asPath);
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
                    superAdminId={superAdminId}
                />
            )}
            {open && (
                <PublishShiftModal
                    isOpen={open}
                    onClose={close}
                    data={allShift}
                    superAdminId={superAdminId}
                />
            )}
        </>
    );
};

export default DragDropContext(ShiftManagement);
