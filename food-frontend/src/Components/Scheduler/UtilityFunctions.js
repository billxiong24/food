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