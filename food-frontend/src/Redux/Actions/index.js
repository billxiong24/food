import { FETCH_GITHUB_DATA, GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from './UserActionTypes';
import { ROUTERS_ROUTE_TO_PAGE } from './RoutingActionTypes';
import axios from 'axios';

const hostname = 'http://cmdev.colab.duke.edu:8000/';

export const getDummyIngredients = () => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/dummyData')
      .then(response => {
        dispatch(
          {
            type: GET_INGREDIENTS_DUMMY_DATA,
            data: response.data
          }
        )
      })
      .catch(error => {
        throw(error);
      });
  };
};

// Temporary Routing for now
export const routeToPage = (val) => {
  return (dispatch) => {
    return dispatch(
      {
        type: ROUTERS_ROUTE_TO_PAGE,
        data: val
      }
    )
  }
};

// User Creation
export const userCreateAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.put(hostname + 'users/' + dataObj.uname, {
      uname: dataObj.uname,
      password: dataObj.password
    })
    .then(response => {
      dispatch(
        {
          type: USER_CREATE_ATTEMPT,
          data: {
            isSuccess: true
          }
        }
      )
    })
    .catch(err => {
      if(err.response.status == 400 || err.response.status == 409) {
        dispatch(
          {
            type: USER_CREATE_ATTEMPT,
            data: {
              isSuccess: false,
              errMsg: err.response.data.error
            }
          }
        )
      } else {
        dispatch(
          {
            type: USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          }
        )
        throw(err.response);
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
      dispatch(
        {
          type: USER_LOG_IN_ATTEMPT,
          data: {
            name: response.data.uname
          }
        }
      )
    })
    .catch(error => {
      let msg = '';
      if(error.response.status == 400) {
        if(error.response.data.error == "User Doesn't Exist") {
          msg = "Incorrect Username or Password";
        } else {
          msg = "Incorrect Password";
        }
        dispatch(
          {
            type: USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: msg
            }
          }
        )
      } else {
        dispatch(
          {
            type: USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          }
        )
        throw(error.response);
      }
    });
  }
}

