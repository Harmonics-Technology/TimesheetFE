import { Box, Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import React, { useMemo } from 'react';
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
import { ProjectTimesheetView } from 'src/services';

const localizer = momentLocalizer(moment);

interface shiftProps {
    allShift: any;
    id: string;
    allProjects: any;
}

const TeamTimeSheetTask = ({ allShift, id, allProjects }: shiftProps) => {
    // console.log({ allShift, id, allProjects });
    const DemoData = [
        {
            id: 0,
            title: 'All Day Event very long title',
            start: new Date(2015, 3, 1, 9, 30, 0),
            end: new Date(2015, 3, 1, 12, 0, 0),
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
            start: new Date(2016, 2, 13, 0, 0, 0),
            end: new Date(2016, 2, 20, 0, 0, 0),
        },
    ];

    const EventList = allShift?.data?.map((obj: ProjectTimesheetView) => {
        return {
            id: obj.id,
            title: obj.projectId,
            start: obj.startDate,
            end: obj.endDate,
        };
    });

    const { isOpen, onOpen, onClose } = useDisclosure();
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
                    onClick={onOpen}
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
            defaultDate: new Date(2015, 3, 1),
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

    return (
        <>
            <Box w="full" borderBottom="1px solid #c2cfe0">
                <Box w="40%" mb="2rem">
                    <Text fontSize=".8rem" fontWeight={500} mb=".3rem">
                        Projects
                    </Text>
                    <CustomSelectBox
                        placeholder={'ERP Projects'}
                        customKeys={{
                            key: 'id',
                            label: 'label',
                        }}
                        data={[{ id: 'any', label: 'any' }]}
                        items={[]}
                        updateFunction={void 0}
                    />
                </Box>
            </Box>
            <Box>
                <Calendar
                    localizer={localizer}
                    events={DemoData}
                    // startAccessor="start"
                    // endAccessor="end"
                    style={{ height: 500 }}
                    defaultView={Views.WEEK}
                    components={components}
                    defaultDate={defaultDate}
                    min={moment('9 am', 'h a').toDate()}
                    max={moment('9 pm', 'h a').toDate()}
                    formats={formats}
                    views={views}
                />
            </Box>

            {isOpen && <FillTimesheetModal isOpen={isOpen} onClose={onClose} />}
        </>
    );
};

export default TeamTimeSheetTask;
