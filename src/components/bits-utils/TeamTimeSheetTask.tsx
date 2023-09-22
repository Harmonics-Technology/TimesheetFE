import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
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

const localizer = momentLocalizer(moment);

interface shiftProps {
    allShift: any;
    id: string;
    allProjects: any;
    superAdminId: any;
}

const TeamTimeSheetTask = ({
    allShift,
    id,
    allProjects,
    superAdminId,
}: shiftProps) => {
    const [tasks, setTasks] = useState<any>();
    const [loading, setLoading] = useState<any>();
    const [selectedProject, setSelectedProject] = useState<any>();
    const addProject = (user) => {
        setSelectedProject(user);
    };

    const DemoData = [
        {
            id: 0,
            title: 'All Day Event very long title',
            start: new Date('2023/09/11 10:30'),
            end: new Date(2023, 8, 11, 12, 0, 0),
        },
        {
            id: 1,
            title: 'Long Event',
            start: new Date(2015, 3, 2, 13, 30, 0),
            end: new Date(2015, 3, 2, 15, 0, 0),
        },

        {
            id: 2,
            title: 'DTS STARTS',
            start: new Date(2015, 3, 4, 10, 0, 0),
            end: new Date(2015, 3, 4, 12, 14, 0),
        },
    ];

    const EventList = allShift?.data?.map((obj: any) => {
        return {
            id: obj?.id,
            title:
                obj.projectSubTask?.name ||
                obj.projectTask?.name ||
                obj.project?.name,
            start: new Date(obj?.startDate as string),
            end: new Date(obj?.endDate as string),
            bill: obj?.billable,
        };
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [data, setData] = useState<any>();
    function openModal(startDate?: any, endDate?: any) {
        // if (!tasks) {

        //     alert('select a project to continue');
        //     return;
        // }
        setData({ tasks, startDate, endDate });
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
        // date, // available, but not used here
        label,
        localizer: { messages },
        onNavigate,
        onView,
        view,
        views,
    }) {
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
                        onClick={() => onNavigate(navigate.PREVIOUS)}
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
                        onClick={() => onNavigate(navigate.NEXT)}
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
                    onClick={openModal}
                >
                    Fill my timesheet
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

    const { defaultDate, formats, views } = useMemo(
        () => ({
            defaultDate: new Date(),
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

    const onSelectSlot = useCallback((slotInfo) => {
        openModal(slotInfo.start, slotInfo.end);
        //
    }, []);

    //
    return (
        <>
            <Loading loading={loading} />
            <Box w="full" borderBottom="1px solid #c2cfe0">
                <Box w="40%" mb="2rem">
                    <Text fontSize=".8rem" fontWeight={500} mb=".3rem">
                        Projects
                    </Text>
                    <CustomSelectBox
                        placeholder={'Select a project'}
                        customKeys={{
                            key: 'id',
                            label: 'name',
                        }}
                        data={allProjects?.data?.value}
                        items={selectedProject}
                        updateFunction={addProject}
                        single
                        id="Projects"
                    />
                </Box>
            </Box>
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
                    onSelectSlot={onSelectSlot}
                    selectable
                />
            </Box>

            {isOpen && (
                <FillTimesheetModal
                    isOpen={isOpen}
                    onClose={onClose}
                    data={data}
                    superAdminId={superAdminId}
                    userId={id}
                    projectId={selectedProject?.id}
                />
            )}
        </>
    );
};

export default TeamTimeSheetTask;
