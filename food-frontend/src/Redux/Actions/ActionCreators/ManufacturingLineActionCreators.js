import { manline_actions } from '../ActionTypes/ManufacturingLineActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import {store} from "../../../index";

const hostname = common.hostname;

export const manlineSearch = (name) => {
  return (dispatch) => {
    const curPage = store.getState().manLine.current_page_number;
    const limit = store.getState().manLine.limit;
    let offset = limit ? (curPage - 1) * limit : 0;
    return axios.get(hostname + 'manufacturing_line/search', {
      params: {
        name: name,
        offset: offset,
        limit: limit,
        orderKey: ''
      }
    })
      .then(response => {
        let totalRows = response.data.length > 0 ? response.data[0].row_count : 0;
        dispatch({
          type: manline_actions.MANLINE_SEARCH,
          data: {
            manLines: response.data,
            total_pages: Math.ceil(totalRows / limit),
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
      if (err.response.status === 400) {
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

export const manlineChangeLimit = (val) => {
  return (dispatch) => {
    return dispatch({
      type: manline_actions.MANLINE_CHANGE_LIMITS,
      data: {
        limit: val
      }
    })
  }
}

export const manlinePrevPage = () => {
  return (dispatch) => {
    const curPage = store.getState().manLine.current_page_number;
    return dispatch({
      type: manline_actions.MANLINE_PREV_PAGE,
      data: {
        current_page_number: curPage === 1 ? curPage : curPage - 1,
      }
    })
  }
}

export const manlineNextPage = () => {
  return (dispatch) => {
    const curPage = store.getState().manLine.current_page_number;
    return dispatch({
      type: manline_actions.MANLINE_NEXT_PAGE,
      data: {
        current_page_number: curPage === store.getState().manLine.total_pages ? curPage : curPage + 1,
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