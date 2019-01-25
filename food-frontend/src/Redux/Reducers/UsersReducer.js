import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from '../Actions/UserActionTypes';

const initialState = {
  name: null,
  isSuccess: false,
  errMsg: "test"
}

export default function userReducer(state = initialState, action) {
  switch (action.type) {
    case USER_LOG_IN_ATTEMPT:
    console.log(action.data);
      return Object.assign({}, action.data);
    case USER_CREATE_ATTEMPT:
      return Object.assign({}, action.data);
    default:
      return state;
  }
}