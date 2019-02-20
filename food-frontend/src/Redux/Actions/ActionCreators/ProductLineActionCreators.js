import { prdline_actions } from '../ActionTypes/ProductLineActionTypes';
import axios from 'axios';
import common from '../../../Resources/common';
import {store} from "../../../index";

const hostname = common.hostname;

export const prdlineChangeLimit = (val) => {
  return (dispatch) => {
    return dispatch({
      type: prdline_actions.PRDLINE_CHANGE_LIMITS,
      data: {
        limit: val
      }
    })
  }
}

export const prdlinePrevPage = () => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    return dispatch({
      type: prdline_actions.PRDLINE_NEXT_PAGE,
      data: {
        current_page_number: curPage === 1 ? curPage : curPage - 1,
      }
    })
  }
}

export const prdlineNextPage = () => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    return dispatch({
      type: prdline_actions.PRDLINE_PREV_PAGE,
      data: {
        current_page_number: curPage === store.getState().productLine.total_pages ? curPage : curPage + 1,
      }
    })
  }
}

export const prdlineSearch = (name) => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    const limit = store.getState().productLine.limit;
    let offset = limit ? (curPage - 1) * limit : 0;
    return axios.get(hostname + 'productline/search', {
      params: {
        names: name,
        offset: offset,
        limit: limit,
      }
    })
      .then(response => {
        let totalRows = response.data.length > 0 ? response.data[0].row_count : 0;
        dispatch({
          type: prdline_actions.PRDLINE_SEARCH,
          data: {
            productLines: response.data,
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

export const prdlineAddPrdline = (prdline) => {
  return (dispatch) => {
    return axios.post(hostname + 'productline/', prdline)
      .then((response) => {
        dispatch({
          type: prdline_actions.PRDLINE_ADD_PRDLINE,
          data: {
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        console.log(err);
        if (err.response.status === 409) {
          dispatch({
            type: prdline_actions.PRDLINE_ADD_PRDLINE,
            data: {
              errMsg: err.response.data.error
            }
          })
        } else {
          dispatch({
            type: prdline_actions.PRDLINE_ADD_PRDLINE,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      });
  }
}

export const prdlineUpdatePrdline = (prdline) => {
  return (dispatch) => {
    return axios.put(hostname + 'productline/' + prdline.id, prdline)
      .then((response) => {
        dispatch({
          type: prdline_actions.PRDLINE_UPDATE_PRDLINE,
          data: {
            productLineToUpdate: prdline,
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 400) {
          dispatch({
            type: prdline_actions.PRDLINE_UPDATE_PRDLINE,
            data: {
              errMsg: err.response.data.error
            }
          })
        } else {
          dispatch({
            type: prdline_actions.PRDLINE_UPDATE_PRDLINE,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          })
          throw (err.response);
        }
      })
  }
}

export const prdlineDeletePrdline = (prdline) => {
  return (dispatch) => {
    return axios.delete(hostname + 'productline/' + prdline.id)
      .then((response) => {
        dispatch({
          type: prdline_actions.PRDLINE_DELETE_PRDLINE,
          data: {
            productLineToDelete: prdline,
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 409) {
          dispatch({
            type: prdline_actions.PRDLINE_DELETE_PRDLINE,
            data: {
              errMsg: err.response.data.error
            }
          })
        } else {
          dispatch({
            type: prdline_actions.PRDLINE_DELETE_PRDLINE,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      })
  }
}