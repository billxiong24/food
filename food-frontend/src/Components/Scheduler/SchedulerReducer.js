import { reduceGetGoals, SCHEDULER_GET_GOALS, SCHEDULER_SET_FILTER, reduceFilter, reduceFilterTypeIndex, SCHEDULER_SET_FILTER_TYPE_INDEX, SCHEDULER_GET_GOAL_NAMES, reduce_get_goal_names, SCHEDULER_GET_USER_NAMES, reduce_get_user_names } from "./DataConverter";

export default function schedulerReducer(state = {}, action) {
    switch (action.type) {
        case SCHEDULER_GET_GOALS: return reduceGetGoals(state, action)
        case SCHEDULER_SET_FILTER: return reduceFilter(state, action)
        case SCHEDULER_SET_FILTER_TYPE_INDEX: return reduceFilterTypeIndex(state, action)
        case SCHEDULER_GET_GOAL_NAMES: return reduce_get_goal_names(state, action)
        case SCHEDULER_GET_USER_NAMES: return reduce_get_user_names(state, action)

      
        default:
            return state;
    }
  }