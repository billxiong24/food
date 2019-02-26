import { manline_actions } from '../ActionTypes/ManufacturingLineActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import {store} from "../../../index";

const hostname = common.hostname;

export const manlineSearch = (str) => {
  let params = {
    orderKey: 'name',
  }
  if (str) params.name = str;
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_line/search', {
      params: {
        orderKey: 'name'
      }
    })
      .then(response => {
        dispatch({
          type: manline_actions.MANLINE_SEARCH,
          data: {
            manLines: response.data,
            errMsg: '',
          }
        })
      })
      .catch(error => {
        throw (error);
      })
  }
}

export const manlineCreate = (manline) => {
  return (dispatch) => {
    return axios.post(hostname + 'manufacturing_line/', manline)
      .then((response) => {
        dispatch({
          type: manline_actions.MANLINE_CREATE,
          data: {
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch({
            type: manline_actions.MANLINE_CREATE,
            data: {
              errMsg: err.response.data.error
            }
          })
        } else {
          dispatch({
            type: manline_actions.MANLINE_CREATE,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      });
  }
}

export const manlineUpdate = (manline) => {
  return (dispatch) => {
    return axios.put(hostname + 'manufacturing_line/' + manline.id, manline)
    .then((response) => {
      dispatch({
        type: manline_actions.MANLINE_UPDATE,
        data: {
          manlineToUpdate: manline,
          errMsg: '',
        }
      })
    })
    .catch((err) => {
      if (err.response.status === 409) {
        dispatch({
          type: manline_actions.MANLINE_UPDATE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: manline_actions.MANLINE_UPDATE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        })
        throw (err.response);
      }
    })
  }
}

export const manlineDelete = (manline) => {
  return (dispatch) => {
    return axios.delete(hostname + 'manufacturing_line/' + manline.id)
      .then((response) => {
        dispatch({
          type: manline_actions.MANLINE_DELETE,
          data: {
            manlineToDelete: manline,
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch({
            type: manline_actions.MANLINE_DELETE,
            data: {
              errMsg: err.response.data.error
            }
          })
        } else {
          dispatch({
            type: manline_actions.MANLINE_DELETE,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      })
  }
}

export const manlineChangeMapping = (manline, mapping) => {
  return (dispatch) => {
    dispatch({
      type: manline_actions.MANLINE_CHANGE_MAPPING,
      data: {
        manline: manline,
        mapping: mapping,
      }
    })
  }
}

export const manlineResetMapping = () => {
  return (dispatch) => {
    dispatch({
      type: manline_actions.MANLINE_RESET_MAPPING,
    })
  }
}

export const manlineGetMappings = (skus) => {
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_line/sku_mapping', {
      params: {
        skus: skus,
      }
    })
    .then(response => {
      dispatch({
        type: manline_actions.MANLINE_GET_MAPPINGS,
        data: response.data,
      })
    })
  }
}

export const manlineUpdateMappings = () => {
  return (dispatch) => {
    let skus = store.getState().skus.selectedSkus;
    let none = [];
    let all = [];
    const values = store.getState().manLine.values;
    Object.keys(values).forEach((key) => {
      if(values[key] === 0) return;
      if(values[key] === 1) none.push(key);
      else all.push(key);
    });
    return axios.put(hostname + 'manufacturing_line/sku_mapping', {
      all,
      none,
      skus,
    })
    .then((response) => {
      dispatch({
        type: manline_actions.MANLINE_UPDATE_MAPPINGS,
      })
    })
    .catch((err) => {
      if (err.response.status === 409) {
        dispatch({
          type: manline_actions.MANLINE_UPDATE_MAPPINGS,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: manline_actions.MANLINE_UPDATE_MAPPINGS,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw (err.response);
      }
    })
  }
}