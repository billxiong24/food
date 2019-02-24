import moment from 'moment'

export function getActivities(goals){
    var activities_map = {}
    for(var i = 0; i < goals.length; i++){
      let {activities, ...goal} = goals[i]
      for(var j = 0; j < activities.length; j++){
        let activity = activities[j]
        if(typeof(activities_map[activity.num]) === "undefined"){
            activities_map[activity.num] = {
              ...activity,
              goals:[goal],
              completion_time:Math.ceil(activity.cases_needed/activity.mfg_rate)
            }
        }else{
            activities_map[activity.num].goals.push(goal)
        }
      }
    }
    var activities = []
    for (var num in activities_map) {
      if (activities_map.hasOwnProperty(num)) {
          activities.push(activities_map[num])
      }
    }
    return activities
  }

  export function isScheduled(activity){
    return activity.start_time != null && activity.end_time != null && activity.man_line_num != null
  }

  export function isUnscheduled(activity){
    return hasEnabledGoals(activity) && !isScheduled(activity)
  }


  export function filterScheduledActivities(activities){
    return activities.filter(activity => isScheduled(activity))
  }

  export function filterUnscheduledActivities(activities){
    return activities.filter(activity => isUnscheduled(activity))
  }

  export function multipleGoalActivity(activity){
    var goals_num = 0
    for(var i = 0; i < activity.goals.length; i++){
      if(activity.goals[i].enabled){
        goals_num += 1
      }
    }
    return goals_num > 1
  }

  export function hasEnabledGoals(activity){
    var enabled = false
    for(var i = 0; i < activity.goals.length; i++){
      enabled = enabled || activity.goals[i].enabled
    }
    return enabled
  }

  export function getEnabledGoals(activity){
    var enabled_goals = []
    for(var i = 0; i < activity.goals.length; i++){
      enabled_goals.push(activity.goals[i])
    }
    return enabled_goals
  }

  export function valid_man_line_shrt_name(man_line_name, man_lines){
    var man_line_names = man_lines.map(man_line => man_line.shrt_name)
    return man_line_names.includes(man_line_name)
  }

  export function valid_time(time){
    var time_moment = moment(time, "MM-DD-YYYY HH:mm")
    console.log(time_moment)
    console.log(time_moment.hours());
  }

  export const empty_activity = {
    "name":"Fake Activity",
    "case_upc":null,
    "unit_upc":null,
    "num":-1,
    "unit_size":"Non existent",
    "count_per_case":-1,
    "prd_line":"Nonexistent",
    "comments":"Nonexistent Comment",
    "cases_needed":-1,
    "mfg_rate":-1,
    "start_time":null,
    "end_time":null,
    "man_line_num":"",
    "goals":[
      {
        "name":"Dumbass Goal 1",
        "enabled":true,
        "deadline":"NA",
        "author":"Nonexitent Person",
        "id":-1
      },
      {
        "name":"Dumbass Goal 2",
        "enabled":false,
        "deadline":"2019-02-21",
        "author":"None ",
        "id":-1}
      ],
      "completion_time":-1
    }