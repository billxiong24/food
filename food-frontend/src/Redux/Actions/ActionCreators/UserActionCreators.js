import { user_actions } from '../UserActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import Cookies from 'js-cookie';

const hostname = common.hostname;

// User Log Out
export const userLogout = () => {
  return (dispatch) => {
    return axios.get(hostname + 'users/logout')
      .then(response => {
        Cookies.remove('user');
        Cookies.remove('admin');
        Cookies.remove('id');
        dispatch({
          type: user_actions.USER_LOG_OUT
        })
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status == 304) {
          dispatch({
            type: user_actions.USER_LOG_OUT,
            data: {
              errMsg: "User already logged out"
            }
          });
          throw (err);
        } else {
          dispatch({
            type: user_actions.USER_LOG_OUT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          });
          throw (err);
        }
      })
  }
}

// User Creation
export const userCreateAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.put(hostname + 'users/create', {
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
        Cookies.set('user', response.data.uname, { expires: 1 });
        Cookies.set('admin', response.data.admin, { expires: 1 });
        Cookies.set('id', response.data.id, { expires: 1 });
        dispatch({
          type: user_actions.USER_LOG_IN_ATTEMPT,
          data: {
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

// NetID log in
export const userNetIdLogin = (user) => {
  return (dispatch) => {
    return axios.post(hostname + 'users/netid', user)
      .then((response) => {
        Cookies.set('user', response.data.uname, { expires: 1 });
        Cookies.set('admin', response.data.admin, { expires: 1 });
        Cookies.set('id', response.data.id, { expires: 1 });
        dispatch({
          type: user_actions.USER_NETID_LOG_IN,
        })
      })
      .catch((err)=>{
        dispatch({
          type: user_actions.USER_NETID_LOG_IN,
          data: {
            errMsg: "Something unexpected went wrong"
          }
        });
        throw (err.response);
      })
  }
}