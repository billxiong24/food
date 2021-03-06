import { user_actions } from '../ActionTypes/UserActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import Cookies from 'js-cookie';
import {store} from "../../../index";

const hostname = common.hostname;
axios.defaults.withCredentials = true;
// console.log(hostname)

// User Log Out
export const userLogout = () => {
  return (dispatch) => {
    return axios.get(hostname + 'users/logout')
      .then(response => {
        removeCookies();
        dispatch({
          type: user_actions.USER_LOG_OUT
        }, window.location.reload()
        );
      })
      .catch((err) => {
        if (err.response.status == 304) {
          removeCookies();
          dispatch({
            type: user_actions.USER_LOG_OUT,
            data: {
              errMsg: "User already logged out"
            }
          });
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
  // console.log(hostname + 'users/')
  return (dispatch) => {
    return axios.post(hostname + 'users/', {
      uname: dataObj.uname,
      password: dataObj.password
    })
      .then(response => {
        setCookies(response.data);
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
export const userNetIdLogin = (token) => {
  return (dispatch) => {
    return axios.post(hostname + 'users/netid', token)
      .then((response) => {
        setCookies(response.data);
        dispatch({
          type: user_actions.USER_NETID_LOG_IN,
        })
      })
      .catch((err)=>{
        if(err.response.status === 400) {
          dispatch({
            type: user_actions.USER_NETID_LOG_IN,
            data: {
              errMsg: err.response.data.err
            }
          });
        } else {
          dispatch({
            type: user_actions.USER_NETID_LOG_IN,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          });
          throw (err.response);
        }
      })
  }
}

export const userSearch = (user) => {
  return (dispatch) => {
    const curPage = store.getState().users.current_page_number;
    const limit = store.getState().users.limit;
    let offset = limit ? (curPage - 1) * limit : 0;
    return axios.get(hostname + 'users/search', {
      params: {
        names: user,
        offset: offset,
        limit: limit,
        orderKey: 'uname',
      }
    })
    .then((response) => {
      let totalRows = response.data.length > 0 ? response.data[0].row_count : 0;
      dispatch({
        type: user_actions.USER_SEARCH,
        data: {
          users: response.data,
          total_pages: Math.ceil(totalRows / limit),
          errMsg: '',
        },
      })
    })
    .catch((err)=>{
      dispatch({
        type: user_actions.USER_SEARCH,
        data: {
          errMsg: "Something unexpected went wrong"
        }
      });
      throw (err.response);
    })
  }
}

export const userUpdate = (user) => {
  return (dispatch) => {
    return axios.put(hostname + 'users/update/' + user.id, user)
    .then((response) => {
      dispatch({
        type: user_actions.USER_UPDATE,
        data: {
          userToUpdate: user,
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if (err.response.status === 400) {
        dispatch({
          type: user_actions.USER_UPDATE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: user_actions.USER_UPDATE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        })
        throw (err.response);
      }
    })
  }
}

export const userDelete = (user) => {
  return (dispatch) => {
    return axios.delete(hostname + 'users/' + user.id)
    .then((response) => {
      dispatch({
        type: user_actions.USER_DELETE,
        data: {
          userToDelete: user,
          errMsg: '',
        }
      })
    }) 
    .catch((err) => {
      if (err.response.status === 409) {
        dispatch({
          type: user_actions.USER_DELETE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: user_actions.USER_DELETE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw (err.response);
      }
    })
  }
}

export const userChangeLimit = (val) => {
  return (dispatch) => {
    return dispatch({
      type: user_actions.USER_CHANGE_LIMITS,
      data: {
        limit: val
      }
    })
  }
}

export const userPrevPage = () => {
  return (dispatch) => {
    const curPage = store.getState().users.current_page_number;
    return dispatch({
      type: user_actions.USER_PREV_PAGE,
      data: {
        current_page_number: curPage === 1 ? curPage : curPage - 1,
      }
    })
  }
}

export const userNextPage = () => {
  return (dispatch) => {
    const curPage = store.getState().users.current_page_number;
    return dispatch({
      type: user_actions.USER_NEXT_PAGE,
      data: {
        current_page_number: curPage === store.getState().users.total_pages ? curPage : curPage + 1,
      }
    })
  }
}

function setCookies(user) {
  Cookies.set('user', user.uname, { expires: 1 });
  Cookies.set('admin', user.admin, { expires: 1 });
  Cookies.set('id', user.id, { expires: 1 });
  Cookies.set('core_read', user.core_read, { expires: 1 });
  Cookies.set('core_write', user.core_write, { expires: 1 });
  Cookies.set('sales_read', user.sales_read, { expires: 1 });
  Cookies.set('sales_write', user.sales_write, { expires: 1 });
  Cookies.set('goals_read', user.goals_read, { expires: 1 });
  Cookies.set('goals_write', user.goals_write, { expires: 1 });
  Cookies.set('schedule_read', user.schedule_read, { expires: 1 });
  Cookies.set('schedule_write', user.schedule_write, { expires: 1 });
  Cookies.set('user_read', user.user_read, { expires: 1 });
  Cookies.set('user_write', user.user_write, { expires: 1 });
}

function removeCookies() {
  Cookies.remove('user');
  Cookies.remove('admin');
  Cookies.remove('id');
  Cookies.remove('permissions');
  Cookies.remove('core_read');
  Cookies.remove('core_write');
  Cookies.remove('sales_read');
  Cookies.remove('sales_write');
  Cookies.remove('goals_read');
  Cookies.remove('goals_write');
  Cookies.remove('schedule_read');
  Cookies.remove('schedule_write');
  Cookies.remove('user_read');
  Cookies.remove('user_write');
}