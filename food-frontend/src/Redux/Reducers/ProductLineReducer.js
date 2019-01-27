import { PRDLINE_ADD_PRDLINE, PRDLINE_UPDATE_PRDLINE, PRDLINE_DELETE_PRDLINE, PRDLINE_SEARCH } from './ProductLineActionTypes';

const initialState = {
  keyword: "",
  productLines: [],
  current_page_number: 1,
  total_pages: 1,
  errMsg: null
}

export default function productLineReducer(state = initialState, action) {
  switch(action.type) {
    case PRDLINE_ADD_PRDLINE:
      return Object.assign({}, state, action.data);
    case PRDLINE_DELETE_PRDLINE:
      return Object.assign({}, state, action.data);
    case PRDLINE_SEARCH:
      return Object.assign({}, state, action.data);
    case PRDLINE_UPDATE_PRDLINE:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}