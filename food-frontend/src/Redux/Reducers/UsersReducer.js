import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from '../Actions/UserActionTypes';

const initialState = {
  uname: 'admin',
  id: 7,
  isSuccess: false,
  errMsg: null
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOG_IN_ATTEMPT:
      return Object.assign({}, state, action.data);
    case USER_CREATE_ATTEMPT:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}