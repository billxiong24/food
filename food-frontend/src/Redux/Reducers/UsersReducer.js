import { user_actions } from '../Actions/ActionTypes/UserActionTypes';

const initialState = {
  isSuccess: false,
  errMsg: null
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case user_actions.USER_LOG_OUT:
      return Object.assign({}, initialState);
    case user_actions.USER_LOG_IN_ATTEMPT:
      return Object.assign({}, state, action.data);
    case user_actions.USER_CREATE_ATTEMPT:
      return Object.assign({}, state, action.data);
    case user_actions.USER_NETID_LOG_IN:
      return Object.assign({}, state, action.data);
    case user_actions.USER_SEARCH:
      return Object.assign({}, state, action.data);
    case user_actions.USER_UPDATE:
      if (action.data.UserToUpdate) {
        return Object.assign({}, state, {
          errMsg: action.data.errMsg,
          users: state.users.map((el) => {
            if (el.id === action.data.userToUpdate.id) {
              return {
                ...el,
                ...action.data.UserToUpdate
              }
            }
            return el;
          })
        });
      } else {
        return Object.assign({}, state, action.data);
      }
    case user_actions.USER_DELETE:
      if (action.data.userToDelete) {
        return Object.assign({}, state, {
          errMsg: action.data.errMsg,
          productLines: state.users.filter((el) => {
            return el.id !== action.data.userToDelete.id;
          })
        });
      } else {
        return Object.assign({}, state, action.data);
      }
    case user_actions.USER_CHANGE_LIMITS:
      return Object.assign({}, state, action.data);
    case user_actions.USER_PREV_PAGE:
      return Object.assign({}, state, action.data);
    case user_actions.USER_NEXT_PAGE:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}