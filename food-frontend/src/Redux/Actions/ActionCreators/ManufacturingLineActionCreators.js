import { manline_actions } from '../ActionTypes/ManufacturingLineActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import {store} from "../../../index";

const hostname = common.hostname;

export const manlineSearch = (name) => {
  return (dispatch) => {
    return axios.get(hostname + 'manufacturing_line/search', {
      params: {
        name: name,
        orderKey: ''
      }
    })
      .then(response => {
        let totalRows = response.data.length > 0 ? response.data[0].row_count : 0;
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
        console.log(err);
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