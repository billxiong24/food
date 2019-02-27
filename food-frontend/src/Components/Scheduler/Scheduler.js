import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { default as SchedulerComponent} from 'react-big-scheduler'
import {SchedulerData, ViewTypes, DATE_FORMAT} from 'react-big-scheduler'
//include `react-big-scheduler/lib/css/style.css` for styles, link it in html or import it here 
import 'react-big-scheduler/lib/css/style.css'
import moment from 'moment'
import labels from '../../Resources/labels';
import Basic from './Components/Basic';
import CustomTimeWindow from './Components/CustomTimeWindow';
import OverlapCheck from './Components/OverlapCheck';
import { mapStateToProps, mapDispatchToProps } from './DataConverter';
import { store } from '../..';
import { Button, Typography } from '@material-ui/core';
import GoalAutocomplete from './GoalAutocomplete';
import GoalFilterDropdown from './GoalFilterDropdown';
import GoalList from './GoalList';
import AddActivityPopUpWrapped from './AddActivityPopUp';
import UnscheduledActivitiesListWrapped from './UnscheduledActivitiesList';
import SimpleModalWrapped from './SimpleModalWrapped';
import CustomPopoverStyle from './Components/CustomPopoverStyle';
import { get_all_warnings } from './UtilityFunctions';

const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
        width:'100%',
    },
    ingredient_detail_view:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: '50px',
        backgroundColor: labels.colors.primaryColor,
        borderRadius: 12
    },
    textField:{
        width: '500px',
    },
    text:{
        width: '500px'
    },
    button:{
        width: '300px',
        backgroundColor: 'white'
    },
    list_autocomplete_container:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50vh'
    },
    title:{
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
        float: 'left',
        overflowWrap: 'breakWord',
        wordWrap: 'breakWord',
        hyphens: 'auto',
        fontFamily: 'Open Sans',
        fontWeight: 400
    },
    calendar_view:{
        display:'flex',
        flexDirection: 'column',
    },
    lists_view:{
        display:'flex',
        flexDirection: 'column',
        width: '30%',
        margin: 10
    },
    goals_list_view:{
        height: '45vh',
        overflow: 'auto',
    },
    goals_list_container:{
        width: '100%',
        overflow: 'auto'
    },
    unscheduled_activities_list_container:{
        width: '100%',
    },
    unscheduled_activities_list_view:{
        height: '45vh',
        width: '100%',
        overflow: 'auto',

    },
    warnings_list_view:{

    },
    page_view:{
        display:'flex',
        flexDirection: 'row',
    },
    scheduler_view:{

    },
    goals_search_view:{
        display:'flex',
        flexDirection: 'row'
    },
    goals_search_bar:{
        width: '300px',
        paddingLeft: '20px',
        paddingRight: '20px',
        paddingTop: '20px',
        paddingBottom: '20px',
    },
    goals_search_filter_dropdown:{

    },
    warning_box:labels.common_styles.warning_box,
    unscheduled_activities_title: {
        textAlign:'left',
        fontSize: 22,
        fontFamily: 'Open Sans',
        fontWeight: 700,
        padding:10
    },
    
    info_box: labels.common_styles.info_box,
    warning_box: labels.common_styles.warning_box,
    error_box: labels.common_styles.error_box,
    small_list: labels.common_styles.small_list

};

class Scheduler extends Component {



    componentWillMount() {
        this.props.get_goals()
        this.props.set_filter("")
        this.props.set_filter_type_index(1)
        this.props.get_goal_names()
        this.props.get_goal_user_names()
        this.props.get_man_lines()
        //this.props.goal_set_enable(this.props.goals[0], false)
    }

    

    render() {
        const { classes , editing, newValue} = this.props
        // console.log.log(this.props)
        
        //2. create the view model, put it in the props obj
        let schedulerData = new SchedulerData(new moment().format(DATE_FORMAT), ViewTypes.Week);
        //set locale moment to the schedulerData, if your locale isn't English. By default, Scheduler comes with English(en, United States).
        moment.locale('zh-cn');
        schedulerData.setLocaleMoment(moment);
        //set resources here or later
        let resources = [
                            {
                            id: 'r1',
                            name: 'Resource1'
                            },
                            {
                            id: 'r2',
                            name: 'Resource2'
                            },
                            {
                            id: 'r3',
                            name: 'Resource3'
                            },
                            {
                                id: 'r4',
                                name:'Manufacturing Line 2'
                            }
                        ];
        schedulerData.setResources(resources);
        
        // console.log.log(store.getState())
        //set events here or later, 
        //the event array should be sorted in ascending order by event.start property, otherwise there will be some rendering errors
        let events = [
                        {
                            id: 1,
                            start: '2019-02-13 09:30:00',
                            end: '2019-02-14 23:30:00',
                            resourceId: 'r1',
                            title: 'I am finished',
                            bgColor: '#D9D9D9'
                        }
                    ];
        schedulerData.setEvents(events);
        // calendar_view:{

        // },
        // lists_view:{
    
        // },
        // goals_list_view:{
    
        // },
        // unscheduled_activities_list_view:{
    
        // },
        // warnings_list_view:{
    
        // }

        return (
            
            <div className={classes.page_view}>
                <div className={classes.lists_view}>
                    <div className={classes.goals_list_view}>
                            <div 
                                className={classes.unscheduled_activities_title}
                            >
                                Goal List
                            </div>
                        <div className={classes.goals_search_view}>
                            <div className={classes.goals_search_bar}>
                                <GoalAutocomplete></GoalAutocomplete>
                            </div>
                            <div className={classes.goals_search_filter_dropdown}>
                                <GoalFilterDropdown></GoalFilterDropdown>
                            </div>
                        </div>
                        <div className={classes.small_list}>
                            {
                                [
                                    "note: checked goals are enabled"
                                ].map(alert => (
                                    <div className={classes.info_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                            </div>
                        <div className={classes.goals_list_container}>
                            <GoalList></GoalList>
                        </div>
                    </div>
                    <div className={classes.unscheduled_activities_list_view}>
                            <div 
                                className={classes.unscheduled_activities_title}
                            >
                                Unscheduled Activities
                            </div>
                            <div className={classes.small_list}>
                            {
                                [
                                    "note: activities with multiple goals are bolded",
                                    "note: click to scheduled activities"
                                ].map(alert => (
                                    <div className={classes.info_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                            </div>
                        <div className={classes.unscheduled_activities_list_container}>
                            <UnscheduledActivitiesListWrapped></UnscheduledActivitiesListWrapped>
                        </div>
                    </div>
                </div>
                <div className={classes.calendar_view}>
                    <div className={classes.scheduler_view}>
                        <OverlapCheck></OverlapCheck>
                    </div>
                    <div className={classes.small_list}>
                            {
                                [
                                    "note: the scheduler displays and allows adjustments to activities on the granularity of the time span selected\n(ex: if an activity starts at 13:00 on 02/18 and ends at 9:00 on 02/19 then on Week View it will occupy both 02/18 and 02/19 and if it is adjusted on Week View start times will be adjusted to the begining of the start day and end times will be adjusted to the ending of the end day. For higher granularity go to more specific view"
                                ].map(alert => (
                                    <div className={classes.info_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                    </div>
                    <div className={classes.small_list}>
                        {
                            get_all_warnings(this.props.scheduled_activities, this.props.unscheduled_activities).map(warning => (
                                <div className={classes.warning_box}>
                                    {warning}
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>

        );
    }
}




export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(Scheduler)));
