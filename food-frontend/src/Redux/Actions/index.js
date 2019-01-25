import { FETCH_GITHUB_DATA, GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from './UserActionTypes';
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
          data: response.data
        }
      );
    })
    .catch(error => {
      throw(error);
    });
  }
}