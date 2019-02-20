import { user_actions } from '../Actions/UserActionTypes';

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
    default:
      return state;
  }
}