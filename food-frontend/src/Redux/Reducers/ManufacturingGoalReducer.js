import { mangoal_actions } from '../Actions/ManufacturingGoalActionTypes';

const initialState = {
  goals: [],
  activeGoal: {
    name: 'Please Select a Manufacturing Goal',
    id: null,
    skus: [],
    user_id: null,
    ingredients: [],
  },
  skus: [],
  productLines: [],
  filters: [],
  errMsg: null
}

export default function manufacturingGoalReducer(state = initialState, action) {
  switch (action.type) {
    case mangoal_actions.MANGOAL_GET_CALCULATIONS:
      console.log(Object.assign({}, state, {
        activeGoal: {
          ...state.activeGoal,
          ingredients: action.data.ingredients,
          errMsg: action.data.errMsg
        }
      }));
      return Object.assign({}, state, {
        activeGoal: {
          ...state.activeGoal,
          ingredients: action.data.ingredients,
          errMsg: action.data.errMsg
        }
      })
    case mangoal_actions.MANGOAL_DELETE_MANGOAL_SKUS:
      return Object.assign({}, state, {
        activeGoal: {
          ...state.activeGoal,
          skus: state.activeGoal.skus.filter((el) => {
            return action.data.skusToDelete.indexOf(el.id) === -1;
          })
        },
        errMsg: action.data.errMsg,
      })
    case mangoal_actions.MANGOAL_DELETE_MANGOAL:
      return Object.assign({}, state, {
        goals: state.goals.filter((el) => {
            return el.id !== action.data.id;
          }),
        activeGoal: initialState.activeGoal,
        errMsg: action.data.errMsg,
      })
    case mangoal_actions.MANGOAL_UPDATE_MANGOAL_SKUS:
      return Object.assign({}, state, {
        activeGoal: {
          ...state.activeGoal,
          skus: action.data,
          errMsg: action.data.errMsg,
        }
      })
    case mangoal_actions.MANGOAL_UPDATE_FILTERS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_GET_PRODUCTLINES:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_GET_MANGOALS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_CREATE_MANGOAL:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_SEARCH_SKUS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_SET_CURRENT_MANGOAL:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}