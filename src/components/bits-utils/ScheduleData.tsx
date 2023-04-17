import { Flex, TableContainer, VStack, Text } from '@chakra-ui/react';
import DragDropContext from '@components/generics/withDnDContext';
import { colord } from 'colord';
import moment from 'moment';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DATE_FORMAT, SchedulerData, ViewType } from 'react-big-scheduler-stch';
const Scheduler = dynamic<any>(() => import('react-big-scheduler-stch'), {
    ssr: false,
});

const ScheduleData = ({ DemoData, date, url, setData, openModal }) => {
    const schedulerData = new SchedulerData(
        dayjs(date).format(DATE_FORMAT),
        ViewType.Week,
        false,
        false,
        {
            displayWeekend: false,
            weekCellWidth: '16%',
            schedulerWidth: '75%',
            schedulerContentHeight: 'auto',
            endResizable: false,
            movable: false,
            eventItemPopoverTrigger: 'click',
            dayStartFrom: 10,
            dayStopTo: 22,
            // dayResourceTableWidth: '300px',
            resourceName: 'Employees',
            views: [
                {
                    viewName: 'Day',
                    viewType: ViewType.Day,
                    showAgenda: false,
                    isEventPerspective: false,
                },
                {
                    viewName: 'Week',
                    viewType: ViewType.Week,
                    showAgenda: false,
                    isEventPerspective: false,
                },
                {
                    viewName: 'Month',
                    viewType: ViewType.Month,
                    showAgenda: false,
                    isEventPerspective: false,
                },
            ],
        },
    );
    schedulerData.setResources(DemoData.resources);
    schedulerData.setEvents(DemoData.events);
    const [viewModel, setViewModel] = useState();

    function shiftDate(data) {
        window.location.href = `/${url}?from=${moment(data.startDate.$d).format(
            'YYYY-MM-DD',
        )}&to=${moment(data.endDate.$d).format('YYYY-MM-DD')}`;
    }

    const prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(DemoData.events);
        setViewModel(schedulerData);
        shiftDate(schedulerData);
        setData(schedulerData);
    };

    const nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(DemoData.events);
        setViewModel(schedulerData);
        shiftDate(schedulerData);
        setData(schedulerData);
    };

    const onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(
            view.viewType,
            view.showAgenda,
            view.isEventPerspective,
        );
        schedulerData.setEvents(DemoData.events);
        setViewModel(schedulerData);
    };

    const onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(DemoData.events);
        setViewModel(schedulerData);
    };

    const eventClicked = (schedulerData, event) => {
        // alert(
        //     `You just clicked an event: {id: ${event.id}, title: ${event.title}}`,
        // );
    };

    const ops1 = (schedulerData, event) => {
        alert(
            `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`,
        );
    };

    const ops2 = (schedulerData, event) => {
        alert(
            `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`,
        );
    };

    const newEvent = (
        schedulerData,
        slotId,
        slotName,
        start,
        end,
        type,
        item,
    ) => {
        const randomColor = Math.floor(Math.random() * 16777215).toString(16);
        const newEvent = {
            title: '',
            start: start,
            end: end,
            resourceId: slotId,
            slotName: slotName,
            bgColor: '#' + randomColor,
            schedulerData: schedulerData,
        };
        openModal(newEvent);
    };

    const updateEventStart = (schedulerData, event, newStart) => {
        if (
            confirm(
                `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`,
            )
        ) {
            schedulerData.updateEventStart(event, newStart);
        }
        setViewModel(schedulerData);
    };

    const updateEventEnd = (schedulerData, event, newEnd) => {
        if (
            confirm(
                `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`,
            )
        ) {
            schedulerData.updateEventEnd(event, newEnd);
        }
        setViewModel(schedulerData);
    };

    const moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if (
            confirm(
                `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`,
            )
        ) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            setViewModel(schedulerData);
        }
    };

    const toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        setViewModel(schedulerData);
    };
    const eventItemTemplateResolver = (
        schedulerData,
        event,
        bgColor,
        isStart,
        isEnd,
        mustAddCssClass,
        mustBeHeight,
        agendaMaxEventWidth,
    ) => {
        const borderWidth = isStart ? '4' : '0';
        const borderColor = colord(bgColor).darken(0.25).toHex();
        console.log({ event, schedulerData });

        const divStyle = {
            borderLeft: borderWidth + 'px solid ' + borderColor,
            backgroundColor: bgColor,
            height: mustBeHeight,
        };

        return (
            <Flex key={event.id} className={mustAddCssClass} style={divStyle}>
                <VStack align="flex-start" spacing={0} fontSize=".8rem">
                    {event.rrule ? (
                        <span>{`${moment(event.recurringEventStart).format(
                            'LT',
                        )} - ${moment(event.recurringEventEnd).format(
                            'LT',
                        )}`}</span>
                    ) : (
                        <span>{`${moment(event.start).format('LT')} - ${moment(
                            event.end,
                        ).format('LT')}`}</span>
                    )}
                    <span>{event.title}</span>
                </VStack>
            </Flex>
        );
    };

    const slotItemTemplateResolver = (
        schedulerData,
        slot,
        slotClickedFunc,
        width,
        clsName,
    ) => {
        // console.log({ schedulerData, slot });
        const hour = schedulerData.resources.filter(
            (x) => x.id == slot.slotId,
        )[0];
        // console.log({ hour });

        return (
            <Flex key={slot.id} className={clsName}>
                <VStack
                    align="flex-start"
                    spacing={0}
                    fontSize=".8rem"
                    fontWeight="500"
                    pl="1.5rem"
                >
                    <Text fontWeight="600" mb="0">
                        {slot.slotName}
                    </Text>
                    <Text mb="0" color="#4FAA94">
                        {`Shift: ${hour.hours}hours`}
                    </Text>
                </VStack>
            </Flex>
        );
    };
    return (
        <TableContainer>
            <Scheduler
                schedulerData={viewModel}
                prevClick={prevClick}
                nextClick={nextClick}
                onSelectDate={onSelectDate}
                onViewChange={onViewChange}
                eventItemClick={eventClicked}
                // viewEventClick={this.ops1}
                // viewEventText="Ops 1"
                // viewEvent2Text="Ops 2"
                // viewEvent2Click={this.ops2}
                // updateEventStart={this.updateEventStart}
                // updateEventEnd={this.updateEventEnd}
                // moveEvent={this.moveEvent}
                eventItemTemplateResolver={eventItemTemplateResolver}
                slotItemTemplateResolver={slotItemTemplateResolver}
                newEvent={newEvent}
                // toggleExpandFunc={this.toggleExpandFunc}
            />
        </TableContainer>
    );
};

export default DragDropContext(ScheduleData);
