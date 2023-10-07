import {
    Box,
    Button,
    Flex,
    HStack,
    Square,
    Text,
    useDisclosure,
} from '@chakra-ui/react';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
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
import { FillTimesheetModal } from './FillTimesheetModal';
import { CustomSelectBox } from './ProjectManagement/Generics/CustomSelectBox';
import { ProjectManagementService } from 'src/services';
import Loading from './Loading';
import { TabMenuTimesheet } from './ProjectManagement/Generics/TabMenuTimesheet';
import { Round } from '@components/generics/functions/Round';
import { ApproveTimesheet } from './ApproveTimesheet';
import { ApproveAllTimesheet } from './ApproveAllTimesheet';
import { startOfWeek } from 'date-fns';

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
    const [tasks, setTasks] = useState<any>();
    const [loading, setLoading] = useState<any>();
    const [selectedProject, setSelectedProject] = useState<any>();
    const addProject = (user) => {
        setSelectedProject(user);
    };
    const assigneeId = allShift.data?.projectTimesheets[0]?.projectTaskAsigneeId
    // console.log({allShift, assigneeId})
    
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
            assigneeId: obj?.projectTaskAsigneeId,
        };
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const { isOpen: opened, onOpen: onOpened, onClose: closed } = useDisclosure();
    const [data, setData] = useState<any>();
    function openModal(data) {
        setData(data);
        onOpen();
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
        const firstDay = startOfWeek(date)
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
                    onClick={onOpened}
                >
                    Approve Timesheet
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
    const components = {
        timeGutterHeader: TimeGutter,
        timeSlotWrapper: timeSlotWrapper,
        toolbar: CustomToolbar,
    };

    const {from} = router.query
    const { defaultDate, formats, views } = useMemo(
        () => ({
            defaultDate: new Date(from as unknown as string || new Date()),
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

    useEffect(() => {
        async function getTasks() {
            if (selectedProject?.id) {
                setLoading(true);
            }
            try {
                const res = await ProjectManagementService.listTasks(
                    0,
                    25,
                    superAdminId,
                    selectedProject?.id || undefined,
                    2,
                    id,
                );
                if (res?.status) {
                    setLoading(false);
                    setTasks(res?.data?.value);
                    return;
                }
            } catch (error) {
                setLoading(false);
            }
        }
        getTasks();
    }, [selectedProject]);

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

                <Loading loading={loading} />
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
                    data={assigneeId}
                />
            )}
        </>
    );
};

export default SupervisorTimesheetTask;
