import { user_actions } from '../UserActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';

const hostname = common.hostname;

// User Log Out
export const userLogout = () => {
  return (dispatch) => {
    dispatch({
      type: user_actions.USER_LOG_OUT
    })
  }
}

// User Creation
export const userCreateAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.put(hostname + 'users/' + dataObj.uname, {
      uname: dataObj.uname,
      password: dataObj.password
    })
      .then(response => {
        dispatch({
          type: user_actions.USER_CREATE_ATTEMPT,
          data: {
            isSuccess: true,
            errMsg: ''
          }
        });
      })
      .catch(err => {
        if (err.response.status == 400 || err.response.status == 409) {
          dispatch({
            type: user_actions.USER_CREATE_ATTEMPT,
            data: {
              isSuccess: false,
              errMsg: err.response.data.error
            }
          });
        } else {
          dispatch({
            type: user_actions.USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          });
          throw (err.response);
        }
      })
  }
}

// User Authentication
export const userLoginAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.post(hostname + 'users/', {
      uname: dataObj.uname,
      password: dataObj.password
    })
      .then(response => {
        dispatch({
          type: user_actions.USER_LOG_IN_ATTEMPT,
          data: {
            uname: response.data.uname,
            id: response.data.id,
            errMsg: ''
          }
        });
      })
      .catch(error => {
        let msg = '';
        if (error.response.status == 400) {
          if (error.response.data.error == "User Doesn't Exist") {
            msg = "Incorrect Username or Password";
          } else {
            msg = "Incorrect Password";
          }
          dispatch({
            type: user_actions.USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: msg
            }
          });
        } else {
          dispatch({
            type: user_actions.USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          });
          throw (error.response);
        }
      });
  }
}

