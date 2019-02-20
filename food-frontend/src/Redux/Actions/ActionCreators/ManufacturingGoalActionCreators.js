import { mangoal_actions } from '../ActionTypes/ManufacturingGoalActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';

const hostname = common.hostname;

export const mangoalGetCalculations = (manGoal) => {
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_goals/' + manGoal.id + '/calculations')
    .then((response) => {
      dispatch({
        type: mangoal_actions.MANGOAL_GET_CALCULATIONS,
        data: {
          ingredients: response.data
        }
      })
    })
    .catch((err)=>{
      if (err.response.status === 400) {
        dispatch({
          type: mangoal_actions.MANGOAL_GET_CALCULATIONS,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: mangoal_actions.MANGOAL_GET_CALCULATIONS,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw (err.response);
      }
    })
  }
}

export const mangoalDeleteMangoalSkus = (manGoal, skus) => {
  console.log({skus:skus});
  return (dispatch) => {
    return axios.delete(hostname + 'manufacturing_goals/' + manGoal.id + '/skus',
      {
        data: {
          skus: skus,
        }
      })
      .then((response) => {
        dispatch({
          type: mangoal_actions.MANGOAL_DELETE_MANGOAL_SKUS,
          data: {
            skusToDelete: skus
          }
        });
      })
      .catch((err) => {
        if (err.response.status === 400) {
          dispatch({
            type: mangoal_actions.MANGOAL_DELETE_MANGOAL_SKUS,
            data: {
              errMsg: err.response.data.error
            }
          });
        } else {
          dispatch({
            type: mangoal_actions.MANGOAL_DELETE_MANGOAL_SKUS,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      })
  }
}

export const mangaolDeleteMangoal = (manGoal) => {
  return (dispatch) => {
    return axios.delete(hostname + 'manufacturing_goals/' + manGoal.id)
      .then((response) => {
        dispatch({
          type: mangoal_actions.MANGOAL_DELETE_MANGOAL,
          data: manGoal
        })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch({
            type: mangoal_actions.MANGOAL_DELETE_MANGOAL,
            data: {
              errMsg: err.response.data.error
            }
          });
        } else {
          dispatch({
            type: mangoal_actions.MANGOAL_DELETE_MANGOAL,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      })
  }
}

export const mangaolUpdateMangoalSkus = (manGoal, skus) => {
  return (dispatch) => {
    return axios.post(hostname + 'manufacturing_goals/' + manGoal.id + '/skus', { skus: skus })
      .then((response) => {
        axios.get(hostname + 'manufacturing_goals/' + manGoal.id + '/skus')
          .then((response) => {
            dispatch({
              type: mangoal_actions.MANGOAL_UPDATE_MANGOAL_SKUS,
              data: response.data
            });
          })
          .catch((err) => { throw (err) });
      })
      .catch((err) => {
        if (err.response.status === 400) {
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
          throw (err.response);
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

export const mangoalAddFilter = (prdline) => {
  return (dispatch) => {
    return dispatch({
      type: mangoal_actions.MANGOAL_ADD_FILTER,
      data: {
        filterToAdd: prdline
      }
    });
  }
}

export const mangoalRemoveFilter = (prdline) => {
  return (dispatch) => {
    return dispatch({
      type: mangoal_actions.MANGOAL_REMOVE_FILTER,
      data: {
        filterToRemove: prdline
      }
    });
  }
}

export const mangoalGetProductLines = () => {
  return (dispatch) => {
    return axios.get(hostname + 'productline/search', {
      params: {
        name: '',
        orderKey: 'name'
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
      .catch((err) => {
        throw (err);
      })
  }
}

export const mangoalSearchSkus = (name, prdlines) => {
  return (dispatch) => {
    return axios.get(hostname + 'sku/search', {
      params: {
        names: name.name,
        prodlines: prdlines.map((el) => {
          return el.name
        }),
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
      .catch((err) => {
        throw (err);
      })
  }
}

export const mangoalCreateMangoal = (manGoal) => {
  return (dispatch) => {
    return axios.post(hostname + 'manufacturing_goals/', manGoal)
      .then((response) => {
        axios.get(hostname + 'manufacturing_goals/', {
          params: {
            user_id: manGoal.user_id,
          }
        })
          .then((response) => {
            dispatch({
              type: mangoal_actions.MANGOAL_CREATE_MANGOAL,
              data: {
                goals: response.data,
              }
            });
          })
          .catch((err) => { throw (err) });
      })
      .catch((err) => {
        if (err.response.status === 409) {
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
          throw (err.response);
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
      .then((response) => {
        dispatch({
          type: mangoal_actions.MANGOAL_GET_MANGOALS,
          data: {
            goals: response.data
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 400) {
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
          throw (err.response);
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
        if (err.response.status === 400) {
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
          throw (err.response);
        }
      })
  }
}