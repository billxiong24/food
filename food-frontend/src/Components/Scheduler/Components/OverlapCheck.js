import React, {Component} from 'react'
import {PropTypes} from 'prop-types'
import { DemoData as defaultData} from 'react-big-scheduler'
import Scheduler, {SchedulerData, ViewTypes} from 'react-big-scheduler'
import { withStyles } from '@material-ui/core/styles';
import Nav from './Nav'
import ViewSrcCode from './ViewSrcCode'
import withDragDropContext from './withDnDContext'
import { mapStateToProps, mapDispatchToProps } from '../DataConverter';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Col from 'antd/lib/col'
import Row from 'antd/lib/row'
import Button from 'antd/lib/button'
import moment from 'moment'
import { ENETDOWN } from 'constants';
import { getEnabledGoals, calculate_scheduled_time, get_scheduled_activity_warnings, day_start_time_trim, day_end_time_trim, hour_time_trim, valid_start_end_pair, valid_time, push_conflict_errors_without_duplication, calculate_end_time } from '../UtilityFunctions';
import { Typography } from '@material-ui/core';
import labels from '../../../Resources/labels';
import config from '../config';
import swal from 'sweetalert';

const styles = theme => ({
    card: {
        width: '100 %',
        marginBottom: 20,
        marginTop: 20,
    },
    cardAction: {
        padding: 10
    },
    bullet: {
        display: 'inline-block',
        margin: '0 2px',
    },
    ingredrient_name: {
        fontSize: 14,
        float: 'left',
        fontFamily: 'Open Sans',
        fontWeight: 400,
    },
    ingredient_id: {
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
    },
    goal_name: {
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
        float: 'left'
    },
    goal_deadline:{
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
        float: 'right'
    },
    left: {
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 700,
        float: 'left'
    },
    right: {
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 700,
        float: 'right'
    },
    pos: {
        marginBottom: 12,
    },
    button: {
        width: '100%'
    },
    activity_popup_text: {
        fontSize: 14,
        float: 'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
        color: 'red'
    },
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
      },
    goal_list_view:{
        display:'flex',
        flexDirection: 'column',
        marginBottom: 12
    },
    popup_view:{
        display:'flex',
        flexDirection: 'column',
    },
    goal_name_deadline_title_container: {
        marginTop: 12,
    },
    info_box:{
        backgroundColor:"#DCDCDC",
        color:"#696969",
        paddingRight: "10px",
        paddingTop:"5px",
        paddingBottom:"5px",
        marginBottom:"2px",
        marginTop:"2px"
    },
    warning_box:{
        backgroundColor:"#FFFF99",
        color:"#696969",
        paddingRight: "10px",
        paddingTop:"5px",
        paddingBottom:"5px",
        marginBottom:"2px",
        marginTop:"2px"
    },
    error_box:{
        backgroundColor:"#F08080",
        color:"#696969",
        paddingRight: "10px",
        paddingTop:"5px",
        paddingBottom:"5px",
        marginBottom:"2px",
        marginTop:"2px"
    },
    left_button:{
        float: 'left'
    },
    right_button:{
        float: 'right'
    },
    button_view:{
        marginTop: 24
    },
    textField:{
        marginTop: 12
    },
    error_list:{
        marginTop: "12px"
    }

});


class OverlapCheck extends Component{
    constructor(props){
        super(props);
        let scheduler_data = new SchedulerData('2019-02-18', ViewTypes.Week, false, false, {
            checkConflict: true,newConfig : config
        });
        console.log(config)
        scheduler_data.localeMoment.locale('en');
        scheduler_data.setDate('2019-02-18');
        scheduler_data.setResources(this.props.resources);
        scheduler_data.setEvents(this.props.events);
        console.log("hello")
        scheduler_data.config.schedulerWidth = "65%"
        scheduler_data.config.views = [scheduler_data.config.views[0], scheduler_data.config.views[1]]
        this.state = {
            scheduler_data
        }
    }

    componentWillReceiveProps(newProps) {
        // console.log.log("COMPONENTWILLRECEIVEPROPS")
        // console.log.log(newProps)
        this.state.scheduler_data.setEvents(newProps.events)
        this.state.scheduler_data.setResources(newProps.resources)
    }

    render(){
        // console.log.log("RENDER")
        // console.log.log(this.state.scheduler_data)
        return (
            <div>
                <div>
                    <Scheduler schedulerData={this.state.scheduler_data}
                               prevClick={this.prevClick}
                               nextClick={this.nextClick}
                               onSelectDate={this.onSelectDate}
                               onViewChange={this.onViewChange}
                               updateEventStart={this.updateEventStart}
                               updateEventEnd={this.updateEventEnd}
                               moveEvent={this.moveEvent}
                               newEvent={this.newEvent}
                               conflictOccurred={this.conflictOccurred}
                               eventItemPopoverTemplateResolver={this.eventItemPopoverTemplateResolver}
                               eventItemTemplateResolver={this.eventItemTemplateResolver}
                    />
                </div>
            </div>
        )
    }

    prevClick = (scheduler_data)=> {
        // console.log.log("previous clicked")
        scheduler_data.prev()
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    nextClick = (scheduler_data)=> {
        // console.log.log("next clicked")
        scheduler_data.next()
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    onViewChange = (scheduler_data, view) => {
        // console.log.log("view change clicked")
        scheduler_data.setViewType(view.viewType, view.showAgenda, view.isEventPerspective);;
        scheduler_data.setEvents(this.props.events)
        this.setState({
            scheduler_data
        })
    }

    onSelectDate = (scheduler_data, date) => {
        // console.log.log("date selected")
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
        if(schedulerData.viewType == 0){
            newStart = hour_time_trim(newStart)
        }else{
            newStart = day_start_time_trim(newStart)
        }
        // console.log(event)
        // if(!valid_start_end_pair(newStart, event.activity.end_time)){
        //     swal(`Invalid Start Time: ${event.activity.end_time} is before start time ${newStart}`,{
        //         icon: "error",
        //       });
        //     return
        // }
        if(!valid_time(newStart)){
            swal(`Invalid Start Time: Operating Hours are between 8:00 and 18:00`,{
                icon: "error",
              });
            return
        }
        let conflict_errors = push_conflict_errors_without_duplication(newStart, event.activity.end_time, event.activity.man_line_num, this.props.scheduled_activities.filter(activity => activity.id != event.activity.id), [])
        if(conflict_errors.length > 0){
            swal(`Activity Conflicts`,{
                icon: "error",
              });
            return
        }
        swal(`Do you want to adjust the start of ${event.title}?\n\n New Start: ${newStart}`, {
            buttons: ["No", "Yes"],
          })
          .then((value) => {
            if(value){
                schedulerData.updateEventStart(event, newStart);
                let activity = event.activity
                activity.start_time = newStart
                // console.log.log("NEW ACTIVITY")
                // console.log.log(activity)
                this.props.set_activity_schedule(activity)
            }
        })
        // if(window.confirm(`Do you want to adjust the start of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newStart: ${newStart}}`)) {
        //     schedulerData.updateEventStart(event, newStart);
        //     let activity = event.activity
        //     activity.start_time = newStart
        //     // console.log.log("NEW ACTIVITY")
        //     // console.log.log(activity)
        //     this.props.set_activity_schedule(activity)
        // }
        this.setState({
            viewModel: schedulerData
        })
    }

    updateEventEnd = (schedulerData, event, newEnd) => {
        if(schedulerData.viewType == 0){
            newEnd = hour_time_trim(newEnd)
        }else{
            newEnd = day_start_time_trim(newEnd)
        }
        // if(!valid_start_end_pair(event.start_time, newEnd)){
        //     swal(`Invalid End Time: ${newEnd} is before start time ${event.activity.start_time}`,{
        //         icon: "error",
        //       });
        //     return
        // }
        // if(!valid_start_end_pair(event.start_time, newEnd)){
        //     swal(`Invalid End Time: ${newEnd} is before start time ${event.activity.start_time}`,{
        //         icon: "error",
        //       });
        //     return
        // }
        if(!valid_time(newEnd)){
            swal(`Invalid End Time: Operating Hours are between 8:00 and 18:00`,{
                icon: "error",
              });
            return
        }
        let conflict_errors = push_conflict_errors_without_duplication(event.activity.start_time, newEnd, event.activity.man_line_num, this.props.scheduled_activities.filter(activity => activity.id != event.activity.id), [])
        if(conflict_errors.length > 0){
            swal(`Activity Conflicts`,{
                icon: "error",
              });
            return
        }
        swal(`Do you want to adjust the end of ${event.title}?\n\n New End: ${newEnd}`, {
            buttons: ["No", "Yes"],
          })
          .then((value) => {
            if(value){
                schedulerData.updateEventEnd(event, newEnd);
                let activity = event.activity
                activity.end_time = newEnd
                // console.log.log("NEW ACTIVITY")
                // console.log.log(activity)
                this.props.set_activity_schedule(activity)
            }
        })
        // if(window.confirm(`Do you want to adjust the end of the event? {eventId: ${event.id}, eventTitle: ${event.title}, newEnd: ${newEnd}}`)) {
        //     schedulerData.updateEventEnd(event, newEnd);
        //     let activity = event.activity
        //     activity.end_time = newEnd
        //     // console.log.log("NEW ACTIVITY")
        //     // console.log.log(activity)
        //     this.props.set_activity_schedule(activity)
        // }
        this.setState({
            viewModel: schedulerData
        })
    }


    
    eventItemPopoverTemplateResolver = (schedulerData, eventItem, title, start, end, statusColor) => {
        const {localeMoment, config} = schedulerData;
        let dateFormat = config.eventItemPopoverDateFormat;
        console.log(eventItem)
        let activity = eventItem.activity
        const { classes , editing, newValue} = this.props
        let dot_color = statusColor
        if(eventItem.warning){
            dot_color = labels.colors.warningColor
        }
        return (
            // <React.Fragment>
            //     <h3>{title}</h3>
            //     <h5>{start.format("HH:mm")} - {end.format("HH:mm")}</h5>
            //     <img src="./icons8-ticket-96.png" />
            // </React.Fragment>
            <div style={{width: '300px'}}>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div className="status-dot" style={{backgroundColor: dot_color}} />
                    </Col>
                    <Col span={22} className="overflow-text">
                        <span className="header2-text" title={title}>{title}</span>
                    </Col>
                </Row>
                <Row type="flex" align="middle">
                    <Col span={2}>
                        <div />
                    </Col>
                    <Col span={22}>
                        <span className="header1-text">{start.format('HH:mm')}</span><span className="help-text" style={{marginLeft: '8px'}}>{start.format(dateFormat)}</span><span className="header2-text"  style={{marginLeft: '8px'}}>-</span><span className="header1-text" style={{marginLeft: '8px'}}>{end.format('HH:mm')}</span><span className="help-text" style={{marginLeft: '8px'}}>{end.format(dateFormat)}</span>
                    </Col>
                </Row>
                <Row className={classes.popup_view}>
                    <Col span={2}>
                        <div />
                    </Col>
                        <div className={classes.goal_name_deadline_title_container}>
                            <Typography className={classes.left} color="textSecondary" >
                                Goals
                            </Typography>
                        
                            <Typography className={classes.right} color="textSecondary">
                                Deadline
                            </Typography>
                        </div>
                    
                        {
                            getEnabledGoals(activity).map(goal => (
                                <div>
                                    <Typography className={classes.goal_name} color="textSecondary" >
                                        {goal.name}
                                    </Typography>
                                    <Typography className={classes.goal_deadline} color="textSecondary">
                                        {goal.deadline}
                                    </Typography>
                                </div>
                            ))
                        }

                        <div>
                            <Typography className={classes.left} color="textSecondary" >
                                Completion Time: 
                            </Typography>
                            <Typography className={classes.goal_deadline} color="textSecondary">
                                {activity.completion_time + " hours"}
                            </Typography>
                        </div>
                        <div>
                            <Typography className={classes.left} color="textSecondary" >
                                Scheduled Time: 
                            </Typography>
                            <Typography className={classes.goal_deadline} color="textSecondary">
                                {calculate_scheduled_time(activity.start_time, activity.end_time) + " hours"}
                            </Typography>
                        </div>
                        <div className={classes.error_list}>
                            {
                                get_scheduled_activity_warnings(activity).map(alert => (
                                    <div className={classes.warning_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                    
                    <Col span={22}>
                        <Button onClick={()=>{this.unschedule_activity(eventItem);}}>Unschedule</Button>
                    </Col>
                </Row>
            </div>
        );
    }

    unschedule_activity = (item) => {
        let activity = JSON.parse(JSON.stringify(item.activity))
        activity.start_time = null
        activity.end_time = null
        activity.man_line_num = null
        this.props.set_activity_schedule(activity)
    }

    eventItemTemplateResolver = (schedulerData, event, bgColor, isStart, isEnd, mustAddCssClass, mustBeHeight, agendaMaxEventWidth) => {
        let borderWidth = isStart ? '4' : '0';
        let borderColor =  'rgba(0,139,236,1)', backgroundColor = '#80C5F6';
        let titleText = schedulerData.behaviors.getEventTextFunc(schedulerData, event);
        if(!!event.type){
            borderColor = event.type == 1 ? 'rgba(0,139,236,1)' : (event.type == 3 ? 'rgba(245,60,43,1)' : '#999');
            backgroundColor = event.type == 1 ? '#80C5F6' : (event.type == 3 ? '#FA9E95' : '#D9D9D9');
        }
        let color = "white"
        if(event.warning){
            backgroundColor = "#FFFF99"
            color = labels.colors.grayText
            borderColor = labels.colors.yellow
        }
        let divStyle = {borderLeft: borderWidth + 'px solid ' + borderColor, backgroundColor: backgroundColor, height: mustBeHeight, color:color };
        if(!!agendaMaxEventWidth)
            divStyle = {...divStyle, maxWidth: agendaMaxEventWidth};

        return <div key={event.id} className={mustAddCssClass} style={divStyle}>
            <span style={{marginLeft: '4px', lineHeight: `${mustBeHeight}px` }}>{titleText}</span>
        </div>;
    }


    moveEvent = (schedulerData, event, slotId, slotName, start, end) => {
        
        if(schedulerData.viewType == 0){
            start = hour_time_trim(start)
            end = calculate_end_time(start, calculate_scheduled_time(event.activity.start_time, event.activity.end_time))
        }else{
            start = day_start_time_trim(start)
            end = day_end_time_trim(end)
        }
        // if(!valid_start_end_pair(start, end)){
        //     swal(`Invalid End Time: ${end} is before start time ${start}`,{
        //         icon: "error",
        //       });
        //     return
        // }
        if(!valid_time(start)){
            swal(`Invalid Start Time: Operating Hours are between 8:00 and 18:00`,{
                icon: "error",
              });
            return
        }
        if(!valid_time(end)){
            swal(`Invalid End Time: Operating Hours are between 8:00 and 18:00`,{
                icon: "error",
              });
            return
        }
        let conflict_errors = push_conflict_errors_without_duplication(start, end, event.activity.man_line_num, this.props.scheduled_activities.filter(activity => activity.id != event.activity.id), [])
        if(conflict_errors.length > 0){
            swal(`Activity Conflicts`,{
                icon: "error",
              });
            return
        }
        swal(`Do you want to adjust the end of ${event.title}?\n\n New Start: ${start}\n New End: ${end}`, {
            buttons: ["No", "Yes"],
          })
          .then((value) => {
            if(value){
                schedulerData.moveEvent(event, slotId, slotName, start, end);
                let activity = event.activity
                activity.start_time = start
                activity.end_time = end
                activity.man_line_num = slotName
                // console.log.log("NEW ACTIVITY")
                // console.log.log(activity)
                this.props.set_activity_schedule(activity)
                //schedulerData.moveEvent(event, slotId, slotName, start, end);
                // this.setState({
                //     viewModel: schedulerData
                // })
            }
        })
        // if(window.confirm(`Do you want to move the event? {eventId: ${event.id}, eventTitle: ${event.title}, newSlotId: ${slotId}, newSlotName: ${slotName}, newStart: ${start}, newEnd: ${end}`)) {
        //     schedulerData.moveEvent(event, slotId, slotName, start, end);
        //     let activity = event.activity
        //     activity.start_time = start
        //     activity.end_time = end
        //     activity.man_line_num = slotName
        //     // console.log.log("NEW ACTIVITY")
        //     // console.log.log(activity)
        //     this.props.set_activity_schedule(activity)
        //     //schedulerData.moveEvent(event, slotId, slotName, start, end);
        //     // this.setState({
        //     //     viewModel: schedulerData
        //     // })
        // }
    }

    conflictOccurred = (schedulerData, action, event, type, slotId, slotName, start, end) => {
        swal(`Activity Conflicts`,{
            icon: "error",
          });
    }
}

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(withDragDropContext(OverlapCheck))));
