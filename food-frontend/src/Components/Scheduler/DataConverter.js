import { SchedulerData, ViewTypes } from "react-big-scheduler";
import { DemoData as defaultData} from 'react-big-scheduler'
import common from "../../Resources/common";
import Axios from "axios";
import { store } from "../..";
import { getActivities, filterScheduledActivities, filterUnscheduledActivities, sort_scheduled_activities, activity_to_event, man_line_to_resource } from "./UtilityFunctions";
import moment from 'moment'

const hostname = common.hostname + "scheduler"
// // console.log.log(JSON.stringify(demoData))

export const demoData = {
    "resources":[
       {
          "id":"r1",
          "name":"Resource1"
       },
       {
          "id":"r2",
          "name":"Resource2"
       },
       {
          "id":"r3",
          "name":"Resource3"
       },
       {
          "id":"r4",
          "name":"Resource4"
       },
       {
          "id":"r5",
          "name":"Resource5"
       },
       {
          "id":"r6",
          "name":"Resource6"
       },
       {
          "id":"r7",
          "name":"Resource7Resource7Resource7Resource7Resource7"
       }
    ],
    "events":[
       {
          "id":50,
          "start":"2019-02-18 09:30:00",
          "end":"2019-02-19 23:30:00",
          "resourceId":"BMP1",
          "title":"I am finishedoooo",
          "bgColor":"#D9D9D9"
       }
    ]
    //,
    // "eventsForCustomEventStyle":[
    //    {
    //       "id":1,
    //       "start":"2017-12-18 09:30:00",
    //       "end":"2017-12-19 23:30:00",
    //       "resourceId":"r1",
    //       "title":"I am finished",
    //       "bgColor":"#D9D9D9",
    //       "type":1
    //    },
    //    {
    //       "id":2,
    //       "start":"2017-12-18 12:30:00",
    //       "end":"2017-12-26 23:30:00",
    //       "resourceId":"r2",
    //       "title":"I am not resizable",
    //       "resizable":false,
    //       "type":2
    //    },
    //    {
    //       "id":3,
    //       "start":"2017-12-19 12:30:00",
    //       "end":"2017-12-20 23:30:00",
    //       "resourceId":"r3",
    //       "title":"I am not movable",
    //       "movable":false,
    //       "type":3
    //    },
    //    {
    //       "id":4,
    //       "start":"2017-12-19 14:30:00",
    //       "end":"2017-12-20 23:30:00",
    //       "resourceId":"r4",
    //       "title":"I am not start-resizable",
    //       "startResizable":false,
    //       "type":1
    //    },
    //    {
    //       "id":5,
    //       "start":"2017-12-19 15:30:00",
    //       "end":"2017-12-20 23:30:00",
    //       "resourceId":"r5",
    //       "title":"I am not end-resizable",
    //       "endResizable":false,
    //       "type":2
    //    },
    //    {
    //       "id":6,
    //       "start":"2017-12-19 15:35:00",
    //       "end":"2017-12-19 23:30:00",
    //       "resourceId":"r6",
    //       "title":"I am normal",
    //       "type":3
    //    },
    //    {
    //       "id":7,
    //       "start":"2017-12-19 15:40:00",
    //       "end":"2017-12-20 23:30:00",
    //       "resourceId":"r7",
    //       "title":"I am exceptional",
    //       "bgColor":"#FA9E95",
    //       "type":1
    //    },
    //    {
    //       "id":8,
    //       "start":"2017-12-19 15:50:00",
    //       "end":"2017-12-19 23:30:00",
    //       "resourceId":"r1",
    //       "title":"I am locked",
    //       "movable":false,
    //       "resizable":false,
    //       "bgColor":"red",
    //       "type":2
    //    },
    //    {
    //       "id":9,
    //       "start":"2017-12-19 16:30:00",
    //       "end":"2017-12-27 23:30:00",
    //       "resourceId":"r1",
    //       "title":"R1 has many tasks 1",
    //       "type":3
    //    },
    //    {
    //       "id":10,
    //       "start":"2017-12-20 18:30:00",
    //       "end":"2017-12-20 23:30:00",
    //       "resourceId":"r1",
    //       "title":"R1 has many tasks 2",
    //       "type":1
    //    },
    //    {
    //       "id":11,
    //       "start":"2017-12-21 18:30:00",
    //       "end":"2017-12-22 23:30:00",
    //       "resourceId":"r1",
    //       "title":"R1 has many tasks 3",
    //       "type":2
    //    },
    //    {
    //       "id":12,
    //       "start":"2017-12-23 18:30:00",
    //       "end":"2017-12-27 23:30:00",
    //       "resourceId":"r1",
    //       "title":"R1 has many tasks 4",
    //       "type":3
    //    }
    // ]
 }

 export const GOAL_NAME_FILTER = "GOAL_NAME_FILTER"
 export const USER_NAME_FILTER = "USER_NAME_FILTER"
 export const goal_filters = [GOAL_NAME_FILTER, USER_NAME_FILTER]

 export const initialSchedulerStore = {
     "goals":[],
     "filter":null,
     "filter_types":goal_filters,
     "filter_type_index":0,
     "goal_names":[],
     "goal_user_names":[],
     "activities":[],
     "current_duration":null,
     "man_lines":[],
     scheduler_data: create_scheduler_data([],[]),
     activities: [],
     scheduled_activities: [],
     resources: [],
     events: [],
     filtered_goals:[],
     unscheduled_activities:[],
     open: false
 }

export function create_scheduler_data(resources, events){
   let scheduler_data = new SchedulerData('2019-02-18', ViewTypes.Week, false, false, {
      checkConflict: true,
   });
   scheduler_data.localeMoment.locale('en');
   scheduler_data.setResources(resources);
   scheduler_data.setEvents(events);
   return scheduler_data
 }
export const SCHEDULER_GET_GOALS = "SCHEDULER_GET_GOALS"

export const get_goals = () => {
   return (dispatch) => {
     return Axios.get(hostname + '/goals', {
      
     })
     .then(response => {
      // console.log.log("finished SCHEDULER_GET_GOALS")
       dispatch({
         type: SCHEDULER_GET_GOALS,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduceGetGoals = (state, action) => {
    console.log("REDUCE GET GOALS")
    console.log(action.data)
    // console.log.log("REDUCE SCHEDULER_GET_GOALS")
   let activities = getActivities(action.data.goals)
   //// console.log.log("REDUCE SCHEDULER_GET_GOALS - 1")
   let scheduled_activities = filterScheduledActivities(activities)
   let unscheduled_activities = filterUnscheduledActivities(activities)
   //// console.log.log("REDUCE SCHEDULER_GET_GOALS - 2")
   scheduled_activities = sort_scheduled_activities(scheduled_activities)
   //// console.log.log("REDUCE SCHEDULER_GET_GOALS - 3")
   //// console.log.log(state)
   // let resources = state.man_lines.map(function(man_line){
   //    return {
   //       id:man_line.shrt_name,
   //       name:man_line.shrt_name
   //       }
   //    })
   //    // console.log.log("REDUCE SCHEDULER_GET_GOALS - 4")
   let scheduler_data = Object.assign({}, state.scheduler_data);
   let events = scheduled_activities.map(activity => activity_to_event(activity))
   //// console.log.log("REDUCE SCHEDULER_GET_GOALS- Middle")
   //// console.log.log(events)
   
   //scheduler_data.setEvents(events);
   //// console.log.log(action.data.goals)
   //// console.log.log("REDUCE SCHEDULER_GET_GOALS- End")
   //console.log(unscheduled_activities)
   return Object.assign({}, state, {
         goals:action.data.goals,
         activities,
         scheduled_activities,
         events,
         unscheduled_activities,
         scheduler_data: create_scheduler_data(state.resources, events)
   });
}
export const SCHEDULER_SET_FILTER = "SCHEDULER_SET_FILTER"

export const set_filter = (filter) => {
   return (dispatch) => {
     return dispatch({
       type: SCHEDULER_SET_FILTER,
       data: filter
     })
   }
 }

 export const reduceFilter = (state, action) => {
   return Object.assign({}, state, {
         filter:action.data,
   });
}

export const SCHEDULER_SET_OPEN = "SCHEDULER_SET_OPEN"

export const set_open = (open_state) => {
   return (dispatch) => {
     return dispatch({
       type: SCHEDULER_SET_OPEN,
       data: open_state
     })
   }
 }

 export const reduce_set_open = (state, action) => {
   return Object.assign({}, state, {
         open:action.data,
   });
}

export const SCHEDULER_SET_FILTER_TYPE_INDEX = "SCHEDULER_SET_FILTER_TYPE_INDEX"

export const set_filter_type_index = (filter_type_index) => {
   return (dispatch) => {
     return dispatch({
       type: SCHEDULER_SET_FILTER_TYPE_INDEX,
       data: filter_type_index
     })
   }
 }

 export const reduceFilterTypeIndex = (state, action) => {
   return Object.assign({}, state, {
      filter_type_index:action.data,
   });
}

export const SCHEDULER_GET_GOAL_NAMES = "SCHEDULER_GET_GOAL_NAMES"

export const get_goal_names = () => {
   let filter = store.getState().scheduler.filter 
   return (dispatch) => {
     return Axios.put(hostname + '/goal_names', {
         filter
     })
     .then(response => {
       dispatch({
         type: SCHEDULER_GET_GOAL_NAMES,
         data: response.data
       })
     })
     .catch(error => {
        console.log(JSON.stringify(error))
       
     });
   }
 }

 export const reduce_get_goal_names = (state, action) => {
   return Object.assign({}, state, {
         goal_names:action.data.goal_names,
   });
}

export const SCHEDULER_GET_USER_NAMES = "SCHEDULER_GET_USER_NAMES"

export const get_user_names = () => {
   let filter = store.getState().scheduler.filter 
   return (dispatch) => {
     return Axios.put(hostname + '/goal_user_names', {
         filter
     })
     .then(response => {
       dispatch({
         type: SCHEDULER_GET_USER_NAMES,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduce_get_user_names = (state, action) => {
   return Object.assign({}, state, {
         goal_user_names:action.data.goal_user_names,
   });
}

export const SCHEDULER_GET_MAN_LINES = "SCHEDULER_GET_MAN_LINES"

export const get_man_lines = () => {
   return (dispatch) => {
     return Axios.get(hostname + '/man_lines', {
      
     })
     .then(response => {
       dispatch({
         type: SCHEDULER_GET_MAN_LINES,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduce_get_man_lines = (state, action) => {
   
   let resources = action.data.man_lines.map(man_line => man_line_to_resource(man_line))
   let scheduler_data = create_scheduler_data(resources,state.events)
   return Object.assign({}, state, {
         man_lines:action.data.man_lines,
         resources: resources,
         scheduler_data: scheduler_data
   });
}

export const SCHEDULER_GOAL_SET_ENABLE = "SCHEDULER_GOAL_SET_ENABLE"

export const goal_set_enable = (goal, enable_status) => {
   return (dispatch) => {
     return Axios.put(hostname + '/set_enable', {
         id:goal.id,
         enable_status:enable_status
     })
     .then(response => {
      // console.log.log("finished SCHEDULER_GOAL_SET_ENABLE")
       dispatch({
         type: SCHEDULER_GOAL_SET_ENABLE,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduce_goal_set_enable = (state, action) => {
   return Object.assign({}, state, {
      
   });
}

export const SCHEDULER_SET_ACTIVITY_SCHEDULE = "SCHEDULER_SET_ACTIVITY_SCHEDULE"

export const set_activity_schedule = (activity) => {
   console.log("set activity")
   console.log(activity)
   return (dispatch) => {
     return Axios.put(hostname + '/schedule', {
         id:activity.num,
         start_time:activity.start_time,
         end_time:activity.end_time,
         man_line_num:activity.man_line_num
     })
     .then(response => {
       dispatch({
         type: SCHEDULER_SET_ACTIVITY_SCHEDULE,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduce_set_activity_schedule = (state, action) => {
   return Object.assign({}, state, {
         
   });
}

export const SCHEDULER_PREV_CLICK = "SCHEDULER_PREV_CLICK"

export const prev_click = () => {
   return (dispatch) => {
      return dispatch({
        type: SCHEDULER_PREV_CLICK,
        data: null
      })
    }
 }

 export const reduce_prev_click = (state, action) => {
   let scheduler_data = create_scheduler_data(state.resources,state.events)
   scheduler_data.prev()
   // console.log.log("REDICER END")
   return Object.assign({}, state, {
      scheduler_data
   });
}

export const SCHEDULER_GET_FILTERED_GOALS = "SCHEDULER_GET_FILTERED_GOALS"

export const get_filtered_goals = (filter, filter_type_index) => {
   // console.log(SCHEDULER_GET_FILTERED_GOALS + "Action")
   return (dispatch) => {
     return Axios.put(hostname + '/filtered_goals', {
         filter,
         filter_type_index
     })
     .then(response => {
       dispatch({
         type: SCHEDULER_GET_FILTERED_GOALS,
         data: response.data
       })
     })
     .catch(error => {
       
     });
   }
 }

 export const reduce_get_filtered_goals = (state, action) => {
   // console.log(SCHEDULER_GET_FILTERED_GOALS + "Reducer")
   // console.log(action.data)
   return Object.assign({}, state, {
         filtered_goals: action.data.filtered_goals,
   });
}




 export const mapStateToProps = state => {
    
   //  for(var i = 0; i < state.scheduler.activities.length; i ++){
   //     var activity = state.scheduler.activities[i]
   //     // console.log.log({
   //       id:i + 1,
   //       start:activity.start_time,
   //       end:activity.end_time,
   //       resourceId:activity.man_line_num,
   //       title:activity.name,
   //     })
   //  }
    // console.log.log("MAP STATE TO PROPS")
    // console.log.log(state)
    //console.log(state.scheduler.unscheduled_activities)
    return {
        scheduler_data: state.scheduler.scheduler_data,
        goals: state.scheduler.goals,
        filter: state.scheduler.filter,
        filter_type_index: state.scheduler.filter_type_index,
        filter_types: state.scheduler.filter_types,
        goal_names: state.scheduler.goal_names,
        goal_user_names: state.scheduler.goal_user_names,
        activities: state.scheduler.activities,
        current_duration: state.scheduler.current_duration,
        man_lines: state.scheduler.man_lines,
        resources: state.scheduler.resources,
        events: state.scheduler.events,
        scheduled_activities: state.scheduler.scheduled_activities,
        filtered_goals: state.scheduler.filtered_goals,
        unscheduled_activities: state.scheduler.unscheduled_activities,
        open: state.scheduler.open
    };
};

export const mapDispatchToProps = (dispatch, ownProps) => {

    return {
      get_goals: () => {
         dispatch(get_goals())
      },
      set_filter: (filter, filter_type_index) => {
         dispatch(set_filter(filter))
         if(filter_type_index == 0){
            dispatch(get_goal_names())
         }else{
            dispatch(get_user_names())
         }
      },
      set_filter_type_index: (index) => {
         dispatch(set_filter_type_index(index))
      },
      get_goal_names: () => {
         dispatch(get_goal_names())
      },
      get_goal_user_names: () => {
         dispatch(get_user_names())
      },
      get_man_lines: () => {
         dispatch(get_man_lines())
      },
      goal_set_enable: (goal, enable_status) => {
         dispatch(goal_set_enable(goal, enable_status))
         setTimeout(() => {
            dispatch(get_goals())
            dispatch(get_filtered_goals(store.getState().scheduler.filter, store.getState().scheduler.filter_type_index))
         }, 500);
      },
      set_activity_schedule: (activity) => {
         dispatch(set_activity_schedule(activity))
         setTimeout(() => {
            dispatch(get_goals())
            dispatch(get_filtered_goals(store.getState().scheduler.filter, store.getState().scheduler.filter_type_index))
         }, 500);
      },
      prev_click: () => {dispatch(prev_click())},
      get_filtered_goals: (filter, filter_type_index) => {
         // Promise.resolve(dispatch(set_filter(filter)))
         // .then(dispatch(get_filtered_goals(filter, filter_type_index)))
         dispatch(set_filter(filter))
         dispatch(get_filtered_goals(filter, filter_type_index))
      },
      close_popup: () =>{
         dispatch(set_open(false))
      },
      open_popup: () =>{
         dispatch(set_open(true))
      }
    };
};






