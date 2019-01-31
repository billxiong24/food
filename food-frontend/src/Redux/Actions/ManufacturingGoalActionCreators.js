import { mangoal_actions } from './ManufacturingGoalActionTypes';
import axios from 'axios';
import common from '../../Resources/common';

const hostname = common.hostname;

export const mangaolUpdateMangoalSkus = (manGoal, skus) => {
  console.log({skus:skus});
  return (dispatch) => {
    return axios.post(hostname + 'manufacturing_goals/' + manGoal.id + '/skus', {skus: skus})
    .then((response)=>{
      axios.get(hostname + 'manufacturing_goals/' + manGoal.id + '/skus')
        .then((response) => {
          dispatch({
            type: mangoal_actions.MANGOAL_UPDATE_MANGOAL_SKUS,
            data: response.data
          });
        })
        .catch((err) => {throw(err)});
    })
    .catch((err)=>{
      if(err.response.status === 400) {
        dispatch({
          type: mangoal_actions.MANGOAL_UPDATE_MANGOAL_SKUS,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: mangoal_actions.MANGOAL_UPDATE_MANGOAL_SKUS,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const mangoalUpdateFilters = (filters) => {
  return (dispatch) => {
    return dispatch({
      type: mangoal_actions.MANGOAL_UPDATE_FILTERS,
      data: {
        filters: filters
      }
    });
  }
}

export const mangoalGetProductLines = () => {
  return (dispatch) => {
    return axios.get(hostname + 'productline/search', {
      params: {
        name: ''
      }
    })
    .then((response) => {
      dispatch({
        type: mangoal_actions.MANGOAL_GET_PRODUCTLINES,
        data: {
          productLines: response.data
        }
      })
    })
    .catch((err)=>{
      throw(err);
    })
  }
}

export const mangoalSearchSkus = (name, prdlines) => {
  return (dispatch) => {
    return axios.get(hostname + 'sku/search', {
      params: {
        name: name.name,
        prodlines: prdlines.map((el) => {
          return el.name
        })
      }
    })
    .then((response) => {
      dispatch({
        type: mangoal_actions.MANGOAL_SEARCH_SKUS,
        data: {
          skus: response.data
        }
      })
    })
    .catch((err)=>{
      throw(err);
    })
  }
}

export const mangoalCreateMangoal = (manGoal) => {
  return (dispatch) => {
    return axios.post(hostname + 'manufacturing_goals/', manGoal)
    .then((response)=>{
      dispatch({
        type: mangoal_actions.MANGOAL_CREATE_MANGOAL,
        data: {
          mangoalToAdd: manGoal
        }
      })
    })
    .catch((err)=>{
      if(err.response.status === 409) {
        dispatch({
          type: mangoal_actions.MANGOAL_CREATE_MANGOAL,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: mangoal_actions.MANGOAL_CREATE_MANGOAL,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const mangoalGetMangoals = (user_id) => {
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_goals/', {
      params: {
        user_id: user_id
      }
    })
    .then((response)=>{
      dispatch({
        type: mangoal_actions.MANGOAL_GET_MANGOALS,
        data: {
          goals: response.data
        }
      })
    })
    .catch((err)=>{
      if(err.response.status === 400) {
        dispatch({
          type: mangoal_actions.MANGOAL_GET_MANGOALS,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: mangoal_actions.MANGOAL_GET_MANGOALS,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const mangoalSetActiveMangoal = (manGoal) => {
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_goals/' + manGoal.id + '/skus')
    .then((response) => {
      dispatch({
        type: mangoal_actions.MANGOAL_SET_CURRENT_MANGOAL,
        data: {
          activeGoal: {
            ...manGoal,
            skus: response.data
          }
        }
      });
    })
    .catch((err) => {
      if(err.response.status === 400) {
        dispatch({
          type: mangoal_actions.MANGOAL_SET_CURRENT_MANGOAL,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: mangoal_actions.MANGOAL_SET_CURRENT_MANGOAL,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}