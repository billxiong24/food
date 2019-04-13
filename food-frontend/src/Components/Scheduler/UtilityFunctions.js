import moment from 'moment'

export function getActivities(goals){
    var activities_map = {}
    var activities_list = []
    for(var i = 0; i < goals.length; i++){
      let {activities, ...goal} = goals[i]
      for(var j = 0; j < activities.length; j++){
        let activity = activities[j]
        activity.name = `${activity.name}:${activity.unit_size}*${activity.count_per_case} (${activity.num})`
        if(typeof(activities_map[activity.num]) === "undefined"){
            activities_map[activity.num] = {
              ...activity,
              goals:[goal],
              completion_time:Math.ceil(activity.cases_needed/activity.mfg_rate)
            }
        }else{
            activities_map[activity.num].goals.push(goal)
        }
        //let act = {
        activities_list.push({
          ...activity,
          goals:[goal],
          completion_time:Math.ceil(activity.cases_needed/activity.mfg_rate)
        })
      }
    }
    
    // for (var num in activities_map) {
    //   if (activities_map.hasOwnProperty(num)) {
    //       activities.push(activities_map[num])
    //   }
    // }
    return activities_list
  }

  // export function getActivities(goals){
  //   var activities = []
  //     for(var i = 0; i < goals.length; i++){
  //       let {activities, ...goal} = goals[i]
  //       for(var j = 0; j < activities.length; j++){
  //         let activity = activities[j]
  //         activity.name = `${activity.name}:${activity.unit_size}*${activity.count_per_case} (${activity.num})`
  //         activities.push({
  //           ...activity,
  //           goals:[goal],
  //           completion_time:Math.ceil(activity.cases_needed/activity.mfg_rate)
  //         })
  //       }
  //     }
  //     console.log("poooopoo")
  //     console.log(activities)
  //     return activities
  //   }

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
      if(activity.goals[i].enabled){
        enabled_goals.push(activity.goals[i])
      }
    }
    return enabled_goals
  }

  export function valid_man_line_shrt_name(man_line_name, man_lines){
    var man_line_names = man_lines.map(man_line => man_line.shrt_name)
    return man_line_names.includes(man_line_name)
  }

  export function valid_time(time){
    var time_moment = moment(time, "YYYY-MM-DD HH:mm")
    //// // // console.log.log(time_moment)
    //// // // console.log.log(time_moment.hours());
    // // // console.log(time_moment.hours())
    // // // console.log(time_moment.hours() <= 18 && time_moment.hours() >= 8)
    return time_moment.hours() <= 18 && time_moment.hours() >= 8
  }

  export function valid_start_end_pair(start_time, end_time){
    var start_moment = moment(start_time, "YYYY-MM-DD HH:mm")
    var end_moment = moment(end_time, "YYYY-MM-DD HH:mm")
    var seconds_difference = moment.duration(end_moment.diff(start_moment)).asSeconds();
    // // console.log("VALID START END TIME")
    // // console.log(seconds_difference)
    return seconds_difference > 0
  }

  export function check_override_duration_warning(start_time, end_time, completion_time){
    var start_moment = moment(start_time, "YYYY-MM-DD HH:mm")
    var end_moment = moment(end_time, "YYYY-MM-DD HH:mm")
    var completion_end_moment = moment(calculate_end_time(start_time, completion_time).replace("T"," "),"YYYY-MM-DD HH:mm")
    var seconds_difference = moment.duration(end_moment.diff(completion_end_moment)).asSeconds();
    // // console.log("check override duration")
    // // console.log(start_moment)
    // // console.log(end_moment)
    // // console.log(completion_end_moment)
    // // console.log(seconds_difference)
    return seconds_difference != 0
  }

  export function check_exceeds_deadline_warning(end_time, deadline){
    var end_moment = moment(end_time, "YYYY-MM-DD HH:mm")
    var deadline = moment(deadline,"YYYY-MM-DD")
    deadline.hour(18)
    var seconds_difference = moment.duration(deadline.diff(end_moment)).asSeconds();
    // // // console.log("EXCEEDS DEADLINE WARNING")
    // // // console.log(seconds_difference)
    return seconds_difference < 0
  }

  export function get_override_duration_warning_string(activity_name){
    return `warning: ${activity_name} overrides duration`
  }

  export function get_exceeds_deadline_warning_string(activity_name, deadline){
    return `warning: ${activity_name} exceeds deadline on ${deadline}`
  }

  export function get_orphaned_activity_warning_string(activity_name){
    return `warning: ${activity_name} is an orphaned activity`
  }

  export function get_override_duration_warning(activity_name, start_time, end_time, completion_time){
    if(check_override_duration_warning(start_time, end_time, completion_time)){
      return get_override_duration_warning_string(activity_name)
    }else{
      return null
    }
  }



  export function get_exceeds_deadline_warning(activity_name, end_time, deadline){
    if(check_exceeds_deadline_warning(end_time, deadline)){
      return get_exceeds_deadline_warning_string(activity_name,deadline)
    }else{
      return null
    }
  }

  export function get_unscheduled_activity_warnings(activity, start_time, end_time){
    let warnings = []
    if(check_override_duration_warning(start_time, end_time, activity.completion_time)){
      warnings.push(get_override_duration_warning_string(activity.name))
    }
    var goals = getEnabledGoals(activity)
    for(var i = 0; i < goals.length; i++){
      if(check_exceeds_deadline_warning(end_time, goals[i].deadline)){
        warnings.push(get_exceeds_deadline_warning_string(activity.name,goals[i].deadline))
      }
    }
    return warnings
  }

  export function get_scheduled_activity_warnings(activity){
    let warnings = []
    let start_time = activity.start_time
    let end_time = activity.end_time
    if(check_override_duration_warning(start_time, end_time, activity.completion_time)){
      warnings.push(get_override_duration_warning_string(activity.name))
    }
    var goals = getEnabledGoals(activity)
    if(goals.length == 0){
      warnings.push(get_orphaned_activity_warning_string(activity.name))
    }
    for(var i = 0; i < goals.length; i++){
      if(check_exceeds_deadline_warning(end_time, goals[i].deadline)){
        warnings.push(get_exceeds_deadline_warning_string(activity.name,goals[i].deadline))
      }
    }
    return warnings 
  }

  export function get_all_warnings(scheduled_activities, unscheduled_activities){
    let warnings = []
    console.log("get all warnings")
    console.log(scheduled_activities)
    console.log(unscheduled_activities)
    if(unscheduled_activities.length > 0){
      warnings.push("There are unscheduled activities")
    }
    for(var i = 0; i < scheduled_activities.length; i++){
      warnings.push(...get_scheduled_activity_warnings(scheduled_activities[i]))
    }
    return warnings
  }

  export function sort_scheduled_activities(scheduled_activities){
    scheduled_activities.sort(function(activity_a,activity_b){ 
      var a = moment(activity_a.start_time, "YYYY-MM-DD HH:mm")
      var b = moment(activity_b.start_time, "YYYY-MM-DD HH:mm")
      return a.toDate() - b.toDate();
    });
    return scheduled_activities
  }

  export function activity_to_event(activity){
    let warnings = get_scheduled_activity_warnings(activity)
    let event = {
       id:activity.num,
       start:activity.start_time,
       end:activity.end_time,
       resourceId:activity.man_line_num,
       title:activity.name,
       activity
    }
    //console.log(warnings)
    if(warnings.length > 0){
      event.warning = true
    }
    //console.log(event)
    return event
 }

 export function get_time_conflict_errors(start_time, end_time, man_line,scheduled_activities){
   let conflicts = scheduled_activities.filter(activity => {
      var start_moment = moment(activity.start_time, "YYYY-MM-DD HH:mm")
      var end_moment = moment(activity.end_time, "YYYY-MM-DD HH:mm")
      var time_moment = moment(start_time.replace("T", " "), "YYYY-MM-DD HH:mm")
      var time_since_start = moment.duration(time_moment.diff(start_moment)).asSeconds();
      var time_to_end = moment.duration(end_moment.diff(time_moment)).asSeconds();
      if (time_since_start >= 0 && time_to_end > 0){
        // // console.log("CONFLICT")
        // // console.log(man_line)
        // // console.log(activity.man_line_num)
        // // console.log(man_line == activity.man_line_num)
        return man_line == activity.man_line_num
      }else{
        return false
      }
   }).map(activity => get_conflict_error("start_time", activity.name, activity))

   conflicts.push(...scheduled_activities.filter(activity => {
    var start_moment = moment(activity.start_time, "YYYY-MM-DD HH:mm")
    var end_moment = moment(activity.end_time, "YYYY-MM-DD HH:mm")
    var time_moment = moment(end_time.replace("T", " "), "YYYY-MM-DD HH:mm")
    var time_since_start = moment.duration(time_moment.diff(start_moment)).asSeconds();
    var time_to_end = moment.duration(end_moment.diff(time_moment)).asSeconds();
    if (time_since_start >= 0 && time_to_end > 0){
      // // console.log("CONFLICT")
      // // console.log(man_line)
      // // console.log(activity.man_line_num)
      // // console.log(man_line == activity.man_line_num)
      return man_line == activity.man_line_num
    }else{
      return false
    }
  }).map(activity => get_conflict_error("end_time", activity.name, activity)))

  conflicts.push(...scheduled_activities.filter(activity => {
    var start_moment = moment(activity.start_time, "YYYY-MM-DD HH:mm")
    var start_time_moment = moment(start_time.replace("T", " "), "YYYY-MM-DD HH:mm")
    var end_time_moment = moment(end_time.replace("T", " "), "YYYY-MM-DD HH:mm")
    var time_since_start = moment.duration(start_moment.diff(start_time_moment)).asSeconds();
    var time_to_end = moment.duration(end_time_moment.diff(start_moment)).asSeconds();
    if (time_since_start >= 0 && time_to_end > 0){
      // // console.log("CONFLICT")
      // // console.log(man_line)
      // // console.log(activity.man_line_num)
      // // console.log(man_line == activity.man_line_num)
      return man_line == activity.man_line_num
    }else{
      return false
    }
  }).map(activity => {
    let activity_name = activity.name + "'s start time"
    return get_conflict_error("time", activity_name, activity)
  }))

  conflicts.push(...scheduled_activities.filter(activity => {
    var start_moment = moment(activity.end_time, "YYYY-MM-DD HH:mm")
    var start_time_moment = moment(start_time.replace("T", " "), "YYYY-MM-DD HH:mm")
    var end_time_moment = moment(end_time.replace("T", " "), "YYYY-MM-DD HH:mm")
    var time_since_start = moment.duration(start_moment.diff(start_time_moment)).asSeconds();
    var time_to_end = moment.duration(end_time_moment.diff(start_moment)).asSeconds();
    if (time_since_start >= 0 && time_to_end > 0){
      // // console.log("CONFLICT")
      // // console.log(man_line)
      // // console.log(activity.man_line_num)
      // // console.log(man_line == activity.man_line_num)
      return man_line == activity.man_line_num
    }else{
      return false
    }
  }).map(activity => {
    let activity_name = activity.name + "'s end time"
    return get_conflict_error("time", activity_name, activity)
  }))

  return conflicts
 }

 export function push_conflict_errors_without_duplication(start_time, end_time, man_line, scheduled_activities, a){
  let conflicts = get_time_conflict_errors(start_time, end_time, man_line,scheduled_activities)
  for(var i = 0; i < conflicts.length; i++){
    a = push_without_duplication(conflicts[i], a)
  }
  return a
 }

 export function delete_conflict_errors_without_duplication(errors){
   let errors_to_delete = errors.filter(error => error.includes("conflicts with"))
   for(var i = 0; i < errors_to_delete.length; i++){
    errors = delete_without_duplication(errors_to_delete[i], errors)
   }
   return errors
 }


 export function man_line_to_resource(man_line){
  return {
     backend_id:man_line.id,
     id:man_line.shrt_name,
     name:man_line.shrt_name
     }
  }

  export function get_man_line_by_id(man_line_id, man_lines){
    return man_lines.find(man_line => {
      return man_line.id == man_line_id
    })
  }

  export function get_current_start_time(){
    var now = moment()
    now.hour(8);
    now.minute(0);
    // // // console.log.log(now.format('YYYY-MM-DD HH:mm').replace(" ","T"))
    return now.format('YYYY-MM-DD HH:mm').replace(" ","T");
  }

  export function calculate_end_time(start_time, completion_hours){
    //// // // console.log.log(start_time)
    let start_time_string = start_time.replace("T", " ")
    var start_moment = moment(start_time_string, "YYYY-MM-DD HH:mm")
    var start_moment_morning = moment(start_time_string, "YYYY-MM-DD HH:mm")
    start_moment_morning.hour(8)
    var current_hours = moment.duration(start_moment.diff(start_moment_morning)).asHours();
    // // // console.log.log(current_hours)
    var total_hours = current_hours + completion_hours
    var days = Math.floor(total_hours/10)
    var hours = total_hours % 10
    // // // console.log.log(start_moment)
    start_moment.hour(8)
    start_moment.add(days, 'days')
    start_moment.add(hours, 'hours')
    // // // console.log.log(start_moment)
    return start_moment.format('YYYY-MM-DD HH:mm').replace(" ","T");
    //return "2019-02-19T08:00"
  }

  export function day_start_time_trim(time){
    //// // // console.log.log(start_time)
    let time_string = time.replace("T", " ")
    var time_moment = moment(time_string, "YYYY-MM-DD HH:mm")
    time_moment.hour(8)
    time_moment.minute(0)
    // // // console.log.log(start_moment)
    return time_moment.format('YYYY-MM-DD HH:mm');
    //return "2019-02-19T08:00"
  }

  export function day_end_time_trim(time){
    //// // // console.log.log(start_time)
    let time_string = time.replace("T", " ")
    var time_moment = moment(time_string, "YYYY-MM-DD HH:mm")
    time_moment.hour(18)
    time_moment.minute(0)
    // // // console.log.log(start_moment)
    return time_moment.format('YYYY-MM-DD HH:mm');
    //return "2019-02-19T08:00"
  }

  export function hour_time_trim(time){
    //// // // console.log.log(start_time)
    let time_string = time.replace("T", " ")
    var time_moment = moment(time_string, "YYYY-MM-DD HH:mm")
    time_moment.minute(0)
    // // // console.log.log(start_moment)
    return time_moment.format('YYYY-MM-DD HH:mm');
    //return "2019-02-19T08:00"
  }


  export function calculate_scheduled_time(start_time, end_time){
    //// // // console.log.log(start_time)
    let start_time_string = start_time.replace("T", " ")
    var start_moment = moment(start_time_string, "YYYY-MM-DD HH:mm")
    var start_moment_morning = moment(start_time_string, "YYYY-MM-DD HH:mm")
    start_moment_morning.hour(8)
    var start_hours_diff = moment.duration(start_moment.diff(start_moment_morning)).asHours();
    
    let end_time_string = end_time.replace("T", " ")
    var end_moment = moment(end_time_string, "YYYY-MM-DD HH:mm")
    var end_moment_morning = moment(end_time_string, "YYYY-MM-DD HH:mm")
    end_moment_morning.hour(8)
    var end_hours_diff = moment.duration(end_moment.diff(end_moment_morning)).asHours();

    var days = moment.duration(end_moment_morning.diff(start_moment_morning)).asDays();

    var total_hours = days * 10 - start_hours_diff + end_hours_diff
    // // // console.log.log(current_hours)
    return total_hours
  }

  export function push_without_duplication(item, a){
    a.push(item)
    return Array.from(new Set(a));
  }

  export function delete_without_duplication(item, a){
    let b = new Set(a)
    b.delete(item)
    return Array.from(b)

  }

  export const ADD_A_MAN_LINE_ERROR = "error: add a manufacturing line";
  export const INVALID_START_TIME_ERROR = "error: invalid start time";  
  export const INVALID_END_TIME_ERROR = "error: invalid end time";
  export const START_TIME_GREATER_THAN_END_TIME_ERROR = "error: start time later than end time"
  
 export function get_conflict_error(time_type,conflict_activity_name,conflict_activity){
   return `error: ${time_type} conflicts with ${conflict_activity_name}:${conflict_activity.start_time}-${conflict_activity.end_time}`
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