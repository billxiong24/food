import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import { DemoData as defaultData} from 'react-big-scheduler'
import Scheduler, {SchedulerData, ViewTypes} from 'react-big-scheduler'
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import { mapStateToProps, mapDispatchToProps } from '../DataConverter';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';



class OverlapCheck extends Component{
    constructor(props){
        super(props);
        let scheduler_data = new SchedulerData('2019-02-18', ViewTypes.Week, false, false, {
            checkConflict: true,
        });
        scheduler_data.localeMoment.locale('en');
        scheduler_data.setDate('2019-02-18');
        scheduler_data.setResources(this.props.resources);
        scheduler_data.setEvents(this.props.events);
        this.state = {
            scheduler_data
        }
    }

    componentWillReceiveProps(newProps) {
        console.log("COMPONENTWILLRECEIVEPROPS")
        console.log(newProps)
        this.state.scheduler_data.setEvents(newProps.events)
        this.state.scheduler_data.setResources(newProps.resources)
    }

    render(){
        console.log("RENDER")
        console.log(this.state.scheduler_data)
        return (
            <div>
                <div>
                    <Scheduler schedulerData={this.state.scheduler_data}
                               prevClick={this.prevClick}
                               nextClick={this.nextClick}
                               onSelectDate={this.onSelectDate}
                               onViewChange={this.onViewChange}
                               eventItemClick={this.eventClicked}
                               viewEventClick={this.ops1}
                               viewEventText="Ops 1"
                               viewEvent2Text="Ops 2"
                               viewEvent2Click={this.ops2}
                               updateEventStart={this.updateEventStart}
                               updateEventEnd={this.updateEventEnd}
                               moveEvent={this.moveEvent}
                               newEvent={this.newEvent}
                               conflictOccurred={this.conflictOccurred}
                    />
                </div>
            </div>
        )
    }

    prevClick = (scheduler_data)=> {
        console.log("previous clicked")
        scheduler_data.prev()
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    nextClick = (scheduler_data)=> {
        console.log("next clicked")
        scheduler_data.next()
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    onViewChange = (scheduler_data, view) => {
        console.log("view change clicked")
        scheduler_data.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);;
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    onSelectDate = (scheduler_data, date) => {
        console.log("date selected")
        scheduler_data.setDate(date);
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    eventClicked = (scheduler_data, event) => {
        alert(`You just clicked an event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops1 = (scheduler_data, event) => {
        alert(`You just executed ops1 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    ops2 = (scheduler_data, event) => {
        alert(`You just executed ops2 to event: {id: ${event.id}, title: ${event.title}}`);
    };

    newEvent = (scheduler_data, slotId, slotName, start, end, type, item) => {
        // if(window.confirm(`Do you want to create a new event? {slotId: ${slotId}, slotName: ${slotName}, start: ${start}, end: ${end}, type: ${type}, item: ${item}}`)){

        //     // let newFreshId = 0;
        //     // schedulerData.events.forEach((item) => {
        //     //     if(item.id >= newFreshId)
        //     //         newFreshId = item.id + 1;
        //     // });

        //     // let newEvent = {
        //     //     id: newFreshId,
        //     //     title: 'New event you just created',
        //     //     start: start,
        //     //     end: end,
        //     //     resourceId: slotId,
        //     //     bgColor: 'purple'
        //     // }
        //     // schedulerData.addEvent(newEvent);
        //     // this.setState({
        //     //     viewModel: schedulerData
        //     // })
        // }
    }

    updateEventStart = (schedulerData, event, newStart) => {
        if(window.confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
            schedulerData.updateEventStart(event, newStart);
            let activity = event.activity
            activity.start_time = newStart
            console.log("NEW ACTIVITY")
            console.log(activity)
            this.props.set_activity_schedule(activity)
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        if(window.confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
            schedulerData.updateEventEnd(event, newEnd);
            let activity = event.activity
            activity.end_time = newEnd
            console.log("NEW ACTIVITY")
            console.log(activity)
            this.props.set_activity_schedule(activity)
        }
        this.setState({
            viewModel: schedulerData
        })
    }

    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        if(window.confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
            schedulerData.moveEvent(event, slotId, slotName, start, end);
            let activity = event.activity
            activity.start_time = start
            activity.end_time = end
            activity.man_line_num = slotName
            console.log("NEW ACTIVITY")
            console.log(activity)
            this.props.set_activity_schedule(activity)
            //schedulerData.moveEvent(event, slotId, slotName, start, end);
            // this.setState({
            //     viewModel: schedulerData
            // })
        }
    }

    conflictOccurred = (schedulerData, action, event, type, slotId, slotName, start, end) => {
        alert(`Conflict occurred. {action: ${action}, event: ${event}`);
    }
}

export default withRouter(connect(mapStateToProps,mapDispatchToProps)(withDragDropContext(OverlapCheck)));
