import React, { Component } from 'react';
import { SchedulerData, ViewType, DATE_FORMAT } from 'react-big-scheduler-stch';
import 'react-big-scheduler-stch/lib/css/style.css';
import DragDropContext from '../generics/withDnDContext';
import dynamic from 'next/dynamic';
import dayjs from 'dayjs';
import { Flex, TableContainer, Text, VStack } from '@chakra-ui/react';
import { colord } from 'colord';
import moment from 'moment';
import Router from 'next/router';

const Scheduler = dynamic<any>(() => import('react-big-scheduler-stch'), {
    ssr: false,
});
type Props = {
    DemoData: any;
    openModal: any;
    setData: any;
};
type State = {
    viewModel: any;
    DemoData: any;
};
class ShiftManagementInterface extends Component<Props, State> {
    constructor(props) {
        super(props);

        const schedulerData = new SchedulerData(
            dayjs().format(DATE_FORMAT),
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

        schedulerData.setResources(props.DemoData.resources);
        schedulerData.setEvents(props.DemoData.events);
        this.state = {
            viewModel: schedulerData,
            DemoData: props.DemoData,
        };
    }

    shiftDate(data) {
        // console.log(data.startDate.$d);
        Router.push({
            query: {
                from: moment(data.startDate.$d).format('YYYY-MM-DD'),
                to: moment(data.endDate.$d).format('YYYY-MM-DD'),
            },
        });
    }

    render() {
        const { viewModel } = this.state;
        return (
            <TableContainer>
                <Scheduler
                    schedulerData={viewModel}
                    prevClick={this.prevClick}
                    nextClick={this.nextClick}
                    onSelectDate={this.onSelectDate}
                    onViewChange={this.onViewChange}
                    eventItemClick={this.eventClicked}
                    // viewEventClick={this.ops1}
                    // viewEventText="Ops 1"
                    // viewEvent2Text="Ops 2"
                    // viewEvent2Click={this.ops2}
                    // updateEventStart={this.updateEventStart}
                    // updateEventEnd={this.updateEventEnd}
                    // moveEvent={this.moveEvent}
                    eventItemTemplateResolver={this.eventItemTemplateResolver}
                    slotItemTemplateResolver={this.slotItemTemplateResolver}
                    newEvent={this.newEvent}
                    // toggleExpandFunc={this.toggleExpandFunc}
                />
            </TableContainer>
        );
    }

    prevClick = (schedulerData) => {
        schedulerData.prev();
        schedulerData.setEvents(this.state.DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });
        this.shiftDate(schedulerData);
        this.props.setData(schedulerData);
    };

    nextClick = (schedulerData) => {
        schedulerData.next();
        schedulerData.setEvents(this.state.DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });
        this.shiftDate(schedulerData);
        this.props.setData(schedulerData);
    };

    onViewChange = (schedulerData, view) => {
        schedulerData.setViewType(
            view.viewType,
            view.showAgenda,
            view.isEventPerspective,
        );
        schedulerData.setEvents(this.state.DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });
    };

    onSelectDate = (schedulerData, date) => {
        schedulerData.setDate(date);
        schedulerData.setEvents(this.state.DemoData.events);
        this.setState({
            viewModel: schedulerData,
        });
    };

    eventClicked = (schedulerData, event) => {
        // alert(
        //     `You just clicked an event: {id: ${event.id}, title: ${event.title}}`,
        // );
    };

    ops1 = (schedulerData, event) => {
        alert(
            `You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`,
        );
    };

    ops2 = (schedulerData, event) => {
        alert(
            `You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`,
        );
    };

    newEvent = (schedulerData, slotId, slotName, start, end, type, item) => {
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
        this.props.openModal(newEvent);
    };

    updateEventStart = (schedulerData, event, newStart) => {
        if (
            confirm(
                `Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`,
            )
        ) {
            schedulerData.updateEventStart(event, newStart);
        }
        this.setState({
            viewModel: schedulerData,
        });
    };

    updateEventEnd = (schedulerData, event, newEnd) => {
        if (
            confirm(
                `Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`,
            )
        ) {
            schedulerData.updateEventEnd(event, newEnd);
        }
        this.setState({
            viewModel: schedulerData,
        });
    };

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if (
            confirm(
                `Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`,
            )
        ) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            this.setState({
                viewModel: schedulerData,
            });
        }
    };

    toggleExpandFunc = (schedulerData, slotId) => {
        schedulerData.toggleExpandStatus(slotId);
        this.setState({
            viewModel: schedulerData,
        });
    };
    eventItemTemplateResolver = (
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
        // console.log({ isStart, event, bgColor, borderColor });

        const divStyle = {
            borderLeft: borderWidth + 'px solid ' + borderColor,
            backgroundColor: bgColor,
            height: mustBeHeight,
        };

        return (
            <Flex key={event.id} className={mustAddCssClass} style={divStyle}>
                <VStack align="flex-start" spacing={0} fontSize=".8rem">
                    <span>{`${moment(event.start).format('LT')} - ${moment(
                        event.end,
                    ).format('LT')}`}</span>
                    <span>{event.title}</span>
                </VStack>
            </Flex>
        );
    };

    slotItemTemplateResolver = (
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
}

export default DragDropContext(ShiftManagementInterface);
