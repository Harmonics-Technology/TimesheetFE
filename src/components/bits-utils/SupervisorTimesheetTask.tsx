import {
    Box,
    Button,
    Flex,
    HStack,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import {
    Calendar,
    momentLocalizer,
    Views,
    Navigate as navigate,
} from 'react-big-calendar';
import moment from 'moment';
import { LiaAngleLeftSolid, LiaAngleRightSolid } from 'react-icons/lia';
import { TabMenuTimesheet } from './ProjectManagement/Generics/TabMenuTimesheet';
import { Round } from '@components/generics/functions/Round';
import { ApproveTimesheet } from './ApproveTimesheet';
import { ApproveAllTimesheet } from './ApproveAllTimesheet';
import { startOfWeek } from 'date-fns';
import { CheckboxCircle } from './CheckboxCircle';

const localizer = momentLocalizer(moment);

interface shiftProps {
    allShift: any;
    id: string;
    superAdminId: any;
}

const SupervisorTimesheetTask = ({
    allShift,
    id,
    superAdminId,
}: shiftProps) => {
    const EventList = allShift?.data?.projectTimesheets?.map((obj: any) => {
        return {
            id: obj?.id,
            title:
                obj.projectSubTask?.name ||
                obj.projectTask?.name ||
                obj.project?.name,
            start: new Date(obj?.startDate as string),
            end: new Date(obj?.endDate as string),
            bill: obj?.billable,
            progress: obj?.percentageOfCompletion,
            approved: obj?.status,
            reason: obj?.reason,
            assigneeId: id,
        };
    });
    console.log({ allShift });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const {
        isOpen: opened,
        onOpen: onOpened,
        onClose: closed,
    } = useDisclosure();
    const [data, setData] = useState<any>();
    const [noneSelected, setNoneSelected] = useState<any>();
    function openModal(data) {
        setData(data);
        onOpen();
    }
    function openApproveModal() {
        if (checked.length <= 0) {
            setNoneSelected(true);
            return;
        }
        onOpened();
    }
    function ViewNamesGroup({ views: viewNames, view, messages, onView }) {
        return viewNames.map((name) => (
            <Button
                bgColor="#F0F0F0 !important"
                borderRadius="0 !important"
                type="button"
                key={name}
                // className={clsx({ 'rbc-active': view === name })}
                onClick={() => onView(name)}
                color="#696969"
                fontSize=".8rem"
            >
                {messages[name]}ly View
            </Button>
        ));
    }
    function CustomToolbar({
        date,
        label,
        localizer: { messages },
        onNavigate,
        onView,
        view,
        views,
    }) {
        const firstDay = startOfWeek(date);
        const goPrevious = () => {
            const newDate = moment(firstDay)
                .subtract(7, 'day')
                .format('YYYY-MM-DD');
            const nextRange = moment(newDate)
                .add(6, 'days')
                .format('YYYY-MM-DD');
            router.push({
                query: {
                    ...router.query,
                    from: newDate,
                    to: nextRange,
                },
            });
            onNavigate(navigate.PREVIOUS);
        };
        const goNext = () => {
            const newDate = moment(firstDay).add(7, 'day').format('YYYY-MM-DD');
            const nextRange = moment(newDate)
                .add(6, 'days')
                .format('YYYY-MM-DD');

            router.push({
                query: {
                    ...router.query,
                    from: newDate,
                    to: nextRange,
                },
            });
            onNavigate(navigate.NEXT);
        };
        return (
            // <div className="rbc-toolbar">

            <Flex w="full" justify="space-between" my="1rem">
                <span className="rbc-btn-group">
                    <ViewNamesGroup
                        view={view}
                        views={views}
                        messages={messages}
                        onView={onView}
                    />
                </span>
                <Flex align="center" gap="1rem">
                    <Button
                        onClick={() => goPrevious()}
                        aria-label={messages.previous}
                        h="2.2rem"
                        w="2.5rem"
                        p="0"
                        bgColor="#F0F0F0"
                    >
                        <LiaAngleLeftSolid />
                    </Button>
                    <Text fontWeight={500} fontSize=".8rem">
                        {label}
                    </Text>
                    <Button
                        onClick={() => goNext()}
                        aria-label={messages.previous}
                        h="2.2rem"
                        w="2.5rem"
                        p="0"
                        bgColor="#F0F0F0"
                    >
                        <LiaAngleRightSolid />
                    </Button>
                </Flex>

                <Flex
                    bgColor="brand.400"
                    color="white"
                    px="1rem"
                    h="2.1rem"
                    borderRadius="0.3rem"
                    align="center"
                    justify="center"
                    fontSize=".8rem"
                    cursor="pointer"
                    onClick={openApproveModal}
                >
                    Approve{' '}
                    {checked?.length > 0 ? `${checked?.length} day(s)` : ''}{' '}
                    Timesheet
                </Flex>
            </Flex>
            // </div>
        );
    }
    const router = useRouter();

    const timeSlotWrapper = (timeSlotWrapperProps) => {
        const style =
            timeSlotWrapperProps.resource === null ||
            timeSlotWrapperProps.value.getMinutes() !== 0
                ? {}
                : {
                      backgroundColor: 'rgba(46, 175, 163, 0.09)',
                      minHeight: '55px',
                      fontSize: '.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0rem .7rem',
                  };
        return <div style={style}>{timeSlotWrapperProps.children}</div>;
    };

    const eventPropGetter = useCallback((event, start, end, isSelected) => {
        //
        return {
            ...(event.bill && {
                className: 'billable',
            }),
            ...(event.approved == 'APPROVED' &&
                event.bill && {
                    className: 'billable-approved',
                }),
            ...(event.approved == 'REJECTED' &&
                event.bill && {
                    className: 'billable-declined',
                }),
            ...(event.approved == 'APPROVED' &&
                !event.bill && {
                    className: 'nbillable-approved',
                }),
            ...(event.approved == 'REJECTED' &&
                !event.bill && {
                    className: 'nbillable-declined',
                }),
        };
    }, []);

    const TimeGutter = () => {
        const style = {
            padding: '0 3.5px',
            fontSize: '.8rem',
            color: '#707683',
            fontWeight: '500',
        };
        return <p style={style}>TIME</p>;
    };

    const [checked, setChecked] = useState<any>([]);
    const updateSelection = (date) => {
        setNoneSelected(false);
        const exists = checked.find((x) => x == date);
        if (exists) {
            setChecked(checked.filter((x) => x !== date));
            return;
        }
        setChecked([...checked, `${date}`]);
    };
    const MyCustomHeader = ({ label, date }) => {
        const formattedDate = moment(date).format('YYYY-MM-DD');
        return (
            <Flex gap=".5rem" align="center">
                <div>{label}</div>
                <CheckboxCircle
                    label={label}
                    onClick={() => updateSelection(formattedDate)}
                    checked={checked.find((x) => x == formattedDate)}
                    noneSelected={noneSelected}
                />
            </Flex>
        );
    };
    const components = {
        timeGutterHeader: TimeGutter,
        timeSlotWrapper: timeSlotWrapper,
        toolbar: CustomToolbar,
        week: { header: MyCustomHeader },
    };

    const { from } = router.query;
    const { defaultDate, formats, views } = useMemo(
        () => ({
            defaultDate: new Date((from as unknown as string) || new Date()),
            formats: {
                dayFormat: (date, culture, localizer) =>
                    localizer.format(date, 'ddd', culture),
                eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
                    localizer.format(start, 'hh:mm a', culture) +
                    ' - ' +
                    localizer.format(end, 'hh:mm a', culture),
                timeGutterFormat: (date, culture, localizer) =>
                    localizer.format(date, 'hh:mm a', culture),
            },
            views: [Views.WEEK],
        }),
        [],
    );

    const onSelectEvent = useCallback((slotInfo) => {
        openModal(slotInfo);
    }, []);

    //
    return (
        <>
            <Box bgColor="white" borderRadius=".6rem" p=".5rem">
                <TabMenuTimesheet
                    name={[
                        { title: 'Calendar View', url: `${id}` },
                        { title: 'Task View', url: `task/${id}` },
                    ]}
                />
                <Flex
                    justify="flex-end"
                    w="full"
                    borderBottom="1px solid #c2cfe0"
                    align="flex-end"
                    pb="2rem"
                    mb="2rem"
                >
                    <HStack>
                        {[
                            {
                                bill: allShift?.data?.billable,
                                color: '#2eafa3',
                                title: 'Billable Hours',
                            },
                            {
                                bill: allShift?.data?.nonBillable,
                                color: '#5dc6e7',
                                title: 'Non Billable',
                            },
                        ].map((x, i) => (
                            <Flex
                                h="2.5rem"
                                bgColor={x.color}
                                color="white"
                                px="1rem"
                                align="center"
                                key={i}
                            >
                                <Box>
                                    <Box fontSize=".6rem">{x.title} :</Box>
                                    <Box fontSize=".8rem">
                                        {Round(x.bill) || 0}
                                    </Box>
                                </Box>
                            </Flex>
                        ))}
                    </HStack>
                </Flex>
                <Box>
                    <Calendar
                        localizer={localizer}
                        events={EventList}
                        // startAccessor="start"
                        // endAccessor="end"
                        style={{ height: 500 }}
                        defaultView={Views.WEEK}
                        components={components}
                        defaultDate={defaultDate}
                        min={moment('8 am', 'h a').toDate()}
                        max={moment('9 pm', 'h a').toDate()}
                        formats={formats}
                        views={views}
                        dayLayoutAlgorithm={'no-overlap'}
                        eventPropGetter={eventPropGetter}
                        onSelectEvent={onSelectEvent}
                        selectable
                    />
                </Box>
            </Box>

            {isOpen && (
                <ApproveTimesheet
                    isOpen={isOpen}
                    onClose={onClose}
                    data={data}
                />
            )}
            {opened && (
                <ApproveAllTimesheet
                    isOpen={opened}
                    onClose={closed}
                    id={id}
                    data={checked}
                    setData={setChecked}
                />
            )}
        </>
    );
};

export default SupervisorTimesheetTask;
