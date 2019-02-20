import { reduceGetGoals, SCHEDULER_GET_GOALS, SCHEDULER_SET_FILTER, reduceFilter, reduceFilterTypeIndex, SCHEDULER_SET_FILTER_TYPE_INDEX, SCHEDULER_GET_GOAL_NAMES, reduce_get_goal_names, SCHEDULER_GET_USER_NAMES, reduce_get_user_names, SCHEDULER_GET_MAN_LINES, reduce_get_man_lines, SCHEDULER_GOAL_SET_ENABLE, reduce_goal_set_enable, SCHEDULER_SET_ACTIVITY_SCHEDULE, reduce_set_activity_schedule } from "./DataConverter";

export default function schedulerReducer(state = {}, action) {
    switch (action.type) {
        case SCHEDULER_GET_GOALS: return reduceGetGoals(state, action)
        case SCHEDULER_SET_FILTER: return reduceFilter(state, action)
        case SCHEDULER_SET_FILTER_TYPE_INDEX: return reduceFilterTypeIndex(state, action)
        case SCHEDULER_GET_GOAL_NAMES: return reduce_get_goal_names(state, action)
        case SCHEDULER_GET_USER_NAMES: return reduce_get_user_names(state, action)
        case SCHEDULER_GET_MAN_LINES: return reduce_get_man_lines(state, action)
        case SCHEDULER_GOAL_SET_ENABLE: return reduce_goal_set_enable(state, action)
        case SCHEDULER_SET_ACTIVITY_SCHEDULE: return reduce_set_activity_schedule(state, action)

      
        default:
            return state;
    }
  }