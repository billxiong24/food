import { FETCH_GITHUB_DATA, GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from './UserActionTypes';
import { ROUTERS_ROUTE_TO_PAGE } from './RoutingActionTypes';
import { ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
   ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING } from './IngredientActionTypes';
import labels from "../../Resources/labels";
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

/*
========================================================( Ingredients Action Creators )========================================================
*/

export const ingAddFilter = (filter) => {
  return (dispatch) => {
    return dispatch(
      {
        type: ING_ADD_FILTER,
        data: filter
      }
    )
  }
}

export const ingRemoveFilter = (filter) => {
  return (dispatch) => {
    return dispatch(
      {
        type: ING_REMOVE_FILTER,
        data: filter
      }
    )
  }
}

export const ingSearch = (filters) => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/search', {
      query: {
        name: filters.filter((el)=>{return el.type === labels.ingredients.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
        skus: filters.filter((el)=>{return el.type === labels.ingredients.filter_type.SKU_NAME}).map((a)=>{return a.string})
      }
    })
    .then(response => {
      dispatch(
        {
          type: ING_SEARCH,
          data: response.data
        }
      )
    })
    .catch(error => {
      throw(error);
    });
  }
}

export const ingSortBy = (category) => {
  return (dispatch) => {
    return dispatch(
      {
        type: ING_SORT_BY,
        data: category
      }
    )
  }
}

export const ingAddIn = (ing) => {
  return (dispatch) => {
    return axios.post(hostname + 'ingredients/', ing)
    .then((response) => {
      dispatch(
        {
          type: ING_ADD_ING,
        }
      )
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch(
          {
            type: ING_ADD_ING,
            data: {
              errMsg: err.response.data.error
            }
          }
        );
      } else {
        dispatch(
          {
            type: ING_ADD_ING,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          }
        );
        throw(err.response);
      }
    });
  }
}

export const ingGetSkus = (ing) => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/' + ing.name + '/skus', ing)
    .then((response) => {
      dispatch(
        {
          type: ING_GET_SKUS,
          data: {
            skus: response.data
          }
        }
      )
    })
    .catch((err) => {
      if(err.response.status === 400) {
        dispatch(
          {
            type: ING_GET_SKUS,
            data: {
              errMsg: err.response.data.error
            }
          }
        );
      } else {
        dispatch(
          {
            type: ING_GET_SKUS,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          }
        );
        throw(err.response);
      }
    });
  }
}

export const ingUpdateIng = (ing) => {
  return (dispatch) => {
    return axios.put(hostname + 'ingredients/' + ing.name, ing)
    .then((response) => {
      dispatch(
        {
          type: ING_UPDATE_ING,
        }
      )
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch(
          {
            type: ING_UPDATE_ING,
            data: {
              errMsg: err.response.data.error
            }
          }
        );
      } else {
        dispatch(
          {
            type: ING_UPDATE_ING,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          }
        );
        throw(err.response);
      }
    });
  }
}

export const ingDeleteIng = (ing) => {
  return (dispatch) => {
    return axios.put(hostname + 'ingredients/' + ing.name, ing)
    .then((response) => {
      dispatch(
        {
          type: ING_DELETE_ING,
        }
      )
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch(
          {
            type: ING_DELETE_ING,
            data: {
              errMsg: err.response.data.error
            }
          }
        );
      } else {
        dispatch(
          {
            type: ING_DELETE_ING,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          }
        );
        throw(err.response);
      }
    });
  }
}

/*
========================================================( Routing Action Creators )========================================================
*/

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

/*
========================================================( Users Action Creators )========================================================
*/

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
      );
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
        );
      } else {
        dispatch(
          {
            type: USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          }
        );
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
      );
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
        );
      } else {
        dispatch(
          {
            type: USER_LOG_IN_ATTEMPT,
            data: {
              errMsg: "Something unexpected went wrong"
            }
          }
        );
        throw(error.response);
      }
    });
  }
}