import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, Modal, TextField, ListItem, ListItemText, Divider, Checkbox } from '@material-ui/core';
import { routeToPage } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { ingDetSetIng, ingDetGetSkus } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import labels from '../../Resources/labels';
import { mapStateToProps, mapDispatchToProps } from './DataConverter';
import swal from '@sweetalert/with-react'
import '../../Resources/Styles/dropdown.css'
import GoalList from './GoalList';
import MenuItem from '@material-ui/core/MenuItem';
import { empty_activity, multipleGoalActivity, hasEnabledGoals, getEnabledGoals, valid_man_line_shrt_name, valid_time, get_current_start_time, calculate_end_time, push_without_duplication, delete_without_duplication, ADD_A_MAN_LINE_ERROR, INVALID_START_TIME_ERROR, INVALID_END_TIME_ERROR, valid_start_end_pair, START_TIME_GREATER_THAN_END_TIME_ERROR, get_unscheduled_activity_warnings, get_time_conflict_errors, push_conflict_errors_without_duplication, delete_conflict_errors_without_duplication, get_man_line_by_id, is_manager_of, get_unique_activity_id } from './UtilityFunctions';
import moment from 'moment'
import common, { addToList } from '../../Resources/common';
import axios from 'axios';



function rand() {
    return Math.round(Math.random() * 20) - 10;
  }
  
  function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }

const styles = theme => ({
    card: {
        width: '100 %',
        marginBottom: 20,
        marginTop: 20,
    },
    cardAction: {
        padding: 10
    },
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
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
        ...labels.common_styles.simple_list_text,
        minWidth: 325,
        minHeight:50,
        verticalAlign: "middle",
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
    info_box: labels.common_styles.info_box,
    warning_box: labels.common_styles.warning_box,
    error_box: labels.common_styles.error_box,
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
    },
    button_left:{
        float: 'left'
    },
    button_right:{
        float: 'right'
    },
    unscheduled_activities_title: labels.common_styles.simple_list_title,
    divider: labels.common_styles
});


class UnscheduledActivitiesList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false,
            activity: empty_activity,
            start_time: get_current_start_time(),
            auto_schedule_start_time: get_current_start_time(),
            auto_schedule_end_time: calculate_end_time(get_current_start_time(), 0),
            end_time: calculate_end_time(get_current_start_time(), 0),
            man_line:"",
            errors:[],
            auto_schedule_warnings: [],
            auto_schedule_errors: [],
            warnings: [],
            man_lines: [],
            checked_activities: [],
            openAutoScheduler: false
        }
    }


    componentWillMount() {

    }

    handleOpen = (activity) => {
        let errors = []
        errors = push_without_duplication(ADD_A_MAN_LINE_ERROR, errors)
        let start_time = get_current_start_time()
        let end_time = calculate_end_time(get_current_start_time(), parseInt(activity.completion_time))
        errors = push_conflict_errors_without_duplication(start_time, end_time, this.state.man_line, this.props.scheduled_activities, errors)
        console.log(activity)
        this.setState({
             open: true,
             man_lines: activity.potential_man_lines.map(man_line_num => get_man_line_by_id(man_line_num, this.props.man_lines)),
             activity: activity,
             start_time: start_time,
             end_time: end_time,
             errors: errors,
             warnings: get_unscheduled_activity_warnings(activity, get_current_start_time(), calculate_end_time(get_current_start_time(), parseInt(activity.completion_time)))
        });
      };
    
    handleClose = () => {
        this.setState({
            open: false,
            activity: empty_activity,
            start_time: get_current_start_time(),
            end_time: calculate_end_time(get_current_start_time(), 0),
            man_line:"",
            errors:[],
            warnings: [],
            man_lines: []
        });
    };

    autoScheduleHandleClose = () => {
        this.setState({
            openAutoScheduler: false,
            auto_schedule_start_time: get_current_start_time(),
            auto_schedule_end_time: calculate_end_time(get_current_start_time(), 0),
            auto_schedule_warnings: [],
            auto_schedule_errors: []
        });
    }

    onChange = (event, cheese) => {
        //console.log("INGREDIETNTVIEW DETAIL CHANGE")
        //console.log(JSON.stringify(event))
        //console.log(JSON.stringify(cheese))
        this.setState({
            time:event.target.value
        });
    }
   
    onStartTimeChange = (e) => {
        //console.log(e.target.value)
        let start_time = e.target.value.split(":")[0] + ":00";
        let end_time = calculate_end_time(start_time, this.state.activity.completion_time)
        this.setState({
          start_time: start_time,
          end_time: end_time
        });
        let errors = []
        if(!valid_time(start_time.replace("T", " "))){
            errors = push_without_duplication(INVALID_START_TIME_ERROR, this.state.errors)
            this.setState({
                warnings: get_unscheduled_activity_warnings(this.state.activity, start_time, end_time)
            });
        }else{
            errors = delete_without_duplication(INVALID_START_TIME_ERROR, this.state.errors)
            this.setState({
                warnings: get_unscheduled_activity_warnings(this.state.activity, start_time, end_time),
            });
        }
        errors = delete_conflict_errors_without_duplication(errors)
        errors = push_conflict_errors_without_duplication(start_time, end_time, this.state.man_line, this.props.scheduled_activities, errors)
        this.setState({
            errors: errors
        });
      };

      autoScheduleOnStartTimeChange = (e) => {
        //console.log(e.target.value)
        let start_time = e.target.value.split(":")[0] + ":00";
        this.setState({
          auto_schedule_start_time: start_time,
        });
        let errors = this.state.auto_schedule_errors
        if(!valid_time(start_time.replace("T", " "))){
            errors = push_without_duplication(INVALID_START_TIME_ERROR, this.state.auto_schedule_errors)
        }else{
            errors = delete_without_duplication(INVALID_START_TIME_ERROR, this.state.auto_schedule_errors)
        }
        this.setState({
            auto_schedule_errors: errors
        });
      };

    onEndTimeChange = (e) => {
        //console.log(e.target.value)
        let start_time = this.state.start_time
        let end_time = e.target.value.split(":")[0] + ":00";
        this.setState({
          end_time: end_time,
        });
        let errors = this.state.errors
        if(!valid_time(end_time.replace("T", " "))){
            errors = push_without_duplication(INVALID_END_TIME_ERROR, errors)
        }else{
            errors = delete_without_duplication(INVALID_END_TIME_ERROR, errors)           
        }
        if(!valid_start_end_pair(start_time, end_time.replace("T", " "))){
            errors =  push_without_duplication(START_TIME_GREATER_THAN_END_TIME_ERROR, errors)
        }else{
            // console.log("delete error")
            errors = delete_without_duplication(START_TIME_GREATER_THAN_END_TIME_ERROR, errors)
            
        }
        errors = delete_conflict_errors_without_duplication(errors)
        errors = push_conflict_errors_without_duplication(start_time, end_time, this.state.man_line, this.props.scheduled_activities, errors)
        this.setState({
            errors: errors,
            warnings: get_unscheduled_activity_warnings(this.state.activity, start_time, end_time)
        })
    };

    autoScheduleOnEndTimeChange = (e) => {
        //console.log(e.target.value)
        let end_time = e.target.value.split(":")[0] + ":00";
        this.setState({
          auto_schedule_end_time: end_time,
        });
        let errors = this.state.auto_schedule_errors
        if(!valid_time(end_time.replace("T", " "))){
            errors = push_without_duplication(INVALID_END_TIME_ERROR, this.state.auto_schedule_errors)
        }else{
            errors = delete_without_duplication(INVALID_END_TIME_ERROR, this.state.auto_schedule_errors)
        }
        this.setState({
            auto_schedule_errors: errors
        });
    };
    
      handleManLineChange = (e) => {
        //console.log(e.target.value)
        let man_line = e.target.value
        let start_time = this.state.start_time
        let end_time = this.state.end_time
        let errors = delete_without_duplication(ADD_A_MAN_LINE_ERROR, this.state.errors)
        errors = delete_conflict_errors_without_duplication(errors)
        errors = push_conflict_errors_without_duplication(start_time, end_time, man_line, this.props.scheduled_activities, errors)
        this.setState({
          man_line: man_line,
          errors: errors
        });
      }
    
    scheduleActivity = () => {
        let activity = this.state.activity
        if(this.state.errors.length == 0){
             activity.start_time = this.state.start_time.replace("T"," ")
             activity.end_time = this.state.end_time.replace("T"," ")
             activity.man_line_num = this.state.man_line
             this.props.set_activity_schedule(activity)
             this.handleClose()
        }
        
    }
    

    onClick = (item) => {
        //console.log(JSON.stringify(item))
        //  this.props.setIngredient(item, this.props.history)
        // if(item.enabled){
        //     if(window.confirm(`Do you want to disable ${item.name} goal`)) {
        //         this.props.goal_set_enable(item, !item.enabled)
        //     }
        // }else{
        //     if(window.confirm(`Do you want to enable ${item.name} goal`)) {
        //         this.props.goal_set_enable(item, !item.enabled)
        //     }
        // }
        this.handleOpen(item)
        // var g = "cdcdcd"
        // swal({
        //     buttons: {
        //         cancel: "Run away!",
        //         catch: {
        //             text: "Throw Pokéball!",
        //             value: "catch",
        //         },
        //         defeat: true,
        //     },
        //     content: (
        //         <div>
        //             <div className="activity_popup_text">
        //                 {item.name}
        //             </div>
        //             <div>
        //                 {
        //                     item.goals.map(goal => (
        //                         <div>
        //                             <p>
        //                                 {goal.name}
        //                             </p>
        //                             <p>
        //                                 {goal.deadline}
        //                             </p>   
        //                         </div>
        //                     ))
        //                 }
        //             </div>
        //         </div>
        //     )
        // })
        //     .then((value) => {
        //         switch (value) {

        //             case "defeat":
        //                 swal("Pikachu fainted! You gained 500 XP!");
        //                 break;
        //             case "catch":
        //                 swal("Gotcha!", "Pikachu was caught!", "success");
        //                 break;
        //             default:
        //                 swal("Got away safely!");
        //         }
        //     });


    }

    render() {
        const { classes } = this.props
        return (
            <div>
                {/* <Typography gutterBottom>Click to get the full Modal experience!</Typography>
                <Button onClick={this.handleOpen}>Open Modal</Button> */}
                <div>
                    {
                        this.state.checked_activities.length == this.props.unscheduled_activities.length
                        ?
                        <Button 
                            className={classes.left_button}
                            onClick={()=>{
                                console.log("I am here")
                                let new_checked_activities = this.props.unscheduled_activities
                                console.log(new_checked_activities)
                                this.setState({
                                    checked_activities: []
                                })
                            }}
                        >
                            {"Unselect All"}
                        </Button>
                        :
                        <Button 
                            className={classes.left_button}
                            onClick={()=>{
                                console.log("I am here")
                                let new_checked_activities = this.props.unscheduled_activities
                                console.log(new_checked_activities)
                                this.setState({
                                    checked_activities: new_checked_activities
                                })
                            }}
                        >
                            {"Select All"}
                        </Button>
                    }
                    <Button 
                        className={classes.right_button}
                        onClick={() => {
                            this.setState({
                                openAutoScheduler: true
                            })
                        }}
                    >
                        {"Autoschedule Selected"}
                    </Button>
                </div>
                {
                    this.props.unscheduled_activities.map((item, index) => (
                        // <Card className={classes.card} key={index} onClick={() => { this.onClick(item) }}>
                        //     <CardActionArea
                        //         className={classes.cardAction}
                        //     >
                        //         <CardContent>
                        //             <Typography className={classes.ingredrient_name} color="textSecondary" >
                        //                 {item.name}
                        //             </Typography>
                        //             {
                        //                 multipleGoalActivity(item) ?
                        //                 <Typography className={classes.ingredient_id} color="textSecondary" >
                        //                     Multigoal Activity
                        //                 </Typography>
                        //                 :
                        //                 <div></div>
                        //             }
                        //         </CardContent>
                        //     </CardActionArea>
                        // </Card>
                        multipleGoalActivity(item) ?
                        
                            <ListItem 
                                button 
                                onClick={() => { this.onClick(item) }}
                                divider={true}
                            >
                                <div className={classes.left}>
                                    {item.name}
                                </div>
                                <Checkbox
                                    checked={this.state.checked_activities.map(activity => parseInt(String(item.id) + String(item.goals[0].id)).includes(String(item.id) + String(item.goals[0].id)))}
                                    onChange={() => {
                                        if(this.state.checked_activities.map(activity => parseInt(String(item.id) + String(item.goals[0].id)).includes(String(item.id) + String(item.goals[0].id)))){
                                            let new_checked_activities = this.state.checked_activities.filter(activity => parseInt(String(item.id) + String(item.goals[0].id) != parseInt(String(activity.id) + String(activity.goals[0].id))))
                                            this.setState({
                                                checked_activities: new_checked_activities
                                            })
                                        }else{
                                            this.checked_activities.push(item)
                                        }
                                    }}
                                    value="Select"
                                    className={classes.right}
                                />
                                <Divider></Divider>
                            </ListItem>
                            :
                            <div>
                            <ListItem 
                                button
                                
                                divider={true}
                            >
                                <div 
                                    className={classes.ingredient_id}
                                    onClick={() => { this.onClick(item) }}
                                >
                                    {item.goals[0].name + "-" + item.name}
                                </div>
                                <Checkbox
                                checked={this.state.checked_activities.map(activity => get_unique_activity_id(activity)).includes(get_unique_activity_id(item))}
                                onClick={() => {
                                    console.log(item)
                                    console.log(this.state.checked_activities)
                                    console.log(this.state.checked_activities.map(activity => get_unique_activity_id(activity)))
                                    if(this.state.checked_activities.map(activity => get_unique_activity_id(activity)).includes(get_unique_activity_id(item))){
                                        let new_checked_activities = this.state.checked_activities.filter(activity => get_unique_activity_id(activity) != get_unique_activity_id(item))
                                        this.setState({
                                            checked_activities: new_checked_activities
                                        })
                                    }else{
                                        let new_checked_activities = this.state.checked_activities.slice()
                                        new_checked_activities.push(item)
                                        this.setState({
                                            checked_activities: new_checked_activities
                                        })
                                    }
                                }}
                                value="Select"
                                className={classes.right}
                                >
                            </Checkbox>
                                
                                <Divider></Divider>
                            </ListItem>
                            
                        </div>
                    ))
                }
                <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.open}
                onClose={this.handleClose}
                >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        {this.state.activity.name}
                    </Typography>
                    <div className={classes.popup_view}>
                        <div className={classes.goal_list_view}>
                            <div className={classes.goal_name_deadline_title_container}>
                                <Typography className={classes.left} color="textSecondary" >
                                    Goals
                                </Typography>
                            
                                <Typography className={classes.right} color="textSecondary">
                                    Deadline
                                </Typography>
                            </div>
                            {
                                getEnabledGoals(this.state.activity).map(goal => (
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
                        </div>
                        <div>
                            <Typography className={classes.left} color="textSecondary" >
                                Completion Time: 
                            </Typography>
                            <Typography className={classes.goal_deadline} color="textSecondary">
                                {this.state.activity.completion_time + " hours"}
                            </Typography>
                        </div>
                        <div className={classes.error_list}>
                            {
                                [
                                    "note: operating hours are from 8 AM to 6PM",
                                    "note: activities can only be added on hour granularity",
                                    "note: changing start time will set end time to accomadate completion time",
                                    "note: errors will prohibit event from being scheduled"
                                ].map(alert => (
                                    <div className={classes.info_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                        {/* <div className={classes.warning_box}>
                            activities can only be added on hour granularity
                        </div>
                        <div className={classes.warning_box}>
                            changing start time will set end time to accomadate completion time
                        </div> */}
                        <TextField
                                id="datetime-local"
                                label="Start Time"
                                type="datetime-local"
                                key="start_time"
                                value={this.state.start_time}
                                className={classes.textField}
                                onChange={this.onStartTimeChange}
                                InputLabelProps={{
                                shrink: true,
                                }}
                        />
                        <TextField
                                id="datetime-local"
                                label="End Time"
                                type="datetime-local"
                                key="end_time"
                                value={this.state.end_time}
                                className={classes.textField}
                                onChange={this.onEndTimeChange}
                                InputLabelProps={{
                                shrink: true,
                                }}
                        />
                        
                        <TextField
                            id="standard-select-currency"
                            select
                            label="Manufacturing Line"
                            className={classes.textField}
                            value={this.state.man_line}
                            onChange={this.handleManLineChange}
                            SelectProps={{
                                MenuProps: {
                                className: classes.menu,
                                },
                            }}
                            margin="normal"
                            >
                             {this.state.man_lines.filter(man_line => is_manager_of(man_line.id)).map(man_line => (
                                <MenuItem key={man_line.shrt_name} value={man_line.shrt_name}>
                                {man_line.shrt_name}
                                </MenuItem>
                            ))}
                        </TextField>
                        <div className={classes.error_list}>
                            {
                                this.state.warnings.map(alert => (
                                    <div className={classes.warning_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                        <div className={classes.error_list}>
                            {
                                this.state.errors.map(alert => (
                                    <div className={classes.error_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                        <div className={classes.button_view}>
                            <Button 
                                variant="outlined" 
                                color="secondary"
                                className={classes.left_button}
                                onClick={this.handleClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                className={classes.right_button}
                                onClick={this.scheduleActivity}
                            >
                                Schedule
                            </Button>
 
                        </div>
                    </div>
                </div>
                </Modal>
                <Modal
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
                open={this.state.openAutoScheduler}
                onClose={() => {
                    this.autoScheduleHandleClose()
                }}
                >
                <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="h6" id="modal-title">
                        {"Autoschedule the following?"}
                    </Typography>
                    <div className={classes.popup_view}>
                        <div className={classes.goal_list_view}>
                            <div className={classes.goal_name_deadline_title_container}>
                                <Typography className={classes.left} color="textSecondary" >
                                    Activity
                                </Typography>
                            
                                <Typography className={classes.right} color="textSecondary">
                                    Goal
                                </Typography>
                            </div>
                            {
                                this.state.checked_activities.map(activity => (
                                    <div>
                                        <Typography className={classes.goal_name} color="textSecondary" >
                                            {activity.name}
                                        </Typography>
                                        <Typography className={classes.goal_deadline} color="textSecondary">
                                            {activity.goals[0].name}
                                        </Typography>
                                    </div>
                                ))
                            }
                        </div>
                        <TextField
                            id="datetime-local"
                            label="Start Time"
                            type="datetime-local"
                            key="start_time"
                            value={this.state.auto_schedule_start_time}
                            className={classes.textField}
                            onChange={this.autoScheduleOnStartTimeChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            id="datetime-local"
                            label="End Time"
                            type="datetime-local"
                            key="end_time"
                            value={this.state.auto_schedule_end_time}
                            className={classes.textField}
                            onChange={this.autoScheduleOnEndTimeChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <div className={classes.error_list}>
                            {
                                this.state.auto_schedule_warnings.map(alert => (
                                    <div className={classes.warning_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                        <div className={classes.error_list}>
                            {
                                this.state.auto_schedule_errors.map(alert => (
                                    <div className={classes.error_box}>
                                        {alert}
                                    </div>
                                ))
                            }
                        </div>
                        <div className={classes.button_view}>
                            <Button 
                                variant="outlined" 
                                color="secondary"
                                className={classes.left_button}
                                onClick={this.autoScheduleHandleClose}
                            >
                                Cancel
                            </Button>
                            <Button 
                                variant="outlined" 
                                color="primary" 
                                className={classes.right_button}
                                onClick={() => {
                                    if(this.state.checked_activities.length == 0){
                                        swal(`No activities selected`,{
                                            icon: "error",
                                          });
                                          return
                                    }
                                    if(this.state.auto_schedule_errors.length > 0){
                                        swal(`Cannot autoschedule with errors`,{
                                            icon: "error",
                                          });
                                          return
                                    }
                                    let that = this
                                    let body = {
                                        "activities":this.state.checked_activities,
                                        "start_time":this.state.auto_schedule_start_time.replace("T", " "),
                                        "end_time":this.state.auto_schedule_end_time.replace("T", " "),
                                        "man_lines": this.props.man_lines.filter(man_line => is_manager_of(man_line.id)).map(mn => mn.id)
                                    }
                                    console.log(body)
                                    axios.put(`${common.hostname}scheduler/autoschedule`, body)
                                    .then(function (response) {
                                        //that.props.submit(item)
                                        console.log(response)
                                        let autoscheduled_activities = response.data.autoscheduled_activities
                                        let failed_activities = response.data.failed_activities
                                        if(failed_activities.length > 0){
                                            
                                            swal(`The following activities could not be scheduled ${failed_activities.map(act => act.name).join(",")}`,{
                                                icon: "success",
                                              });
                                            
                                            
                                        }else{
                                            
                                            swal(`All activities were scheduled`,{
                                                icon: "success",
                                              });
                                        }
                                        that.props.set_provisional_activities(autoscheduled_activities)
                                        that.autoScheduleHandleClose()
                                        
                                    })
                                    .catch(function (error) {
                                        swal(`${error}`,{
                                            icon: "error",
                                        });
                                    });
                                    
                                }}
                            >
                                AutoSchedule
                            </Button>
 
                        </div>
                    </div>
                </div>
                </Modal>
            </div>

        );
    }
    
}

const UnscheduledActivitiesListWrapped = withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UnscheduledActivitiesList)));

export default UnscheduledActivitiesListWrapped
