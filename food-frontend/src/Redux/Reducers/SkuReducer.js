import { SKU_ADD_FILTER, SKU_REMOVE_FILTER, SKU_SEARCH, SKU_SORT_BY,
  SKU_GET_ING, SKU_ADD_ING, SKU_DELETE_ING, SKU_ADD_SKU, SKU_UPDATE_SKU,
  SKU_DELETE_SKU } from '../Actions/SkuActionType';

const initialState = {
  filters: [],
  items: [],
  sortby: null,
  current_page_number: 1,
  total_pages: 1,
  ingredients: [],
  errMsg: null
};

export default function skuReducer(state = initialState, action) {
  switch(action.type) {
    case SKU_ADD_FILTER:
      return Object.assign({}, state, {
        filters: [
          ...state.filters,
          action.data
        ]
      });
    case SKU_REMOVE_FILTER:
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          return el.type !== action.data.type && el.string !== action.data.type;
        })
      });
    case SKU_SEARCH:
      return Object.assign({}, state, action.data);
    case SKU_SORT_BY:
      return Object.assign({}, state, {
        sortby: action.data
      })
    case SKU_GET_ING:
      return Object.assign({}, state, action.data);
    case SKU_ADD_ING:
      return Object.assign({}, state, action.data);
    case SKU_DELETE_ING:
      return Object.assign({}, state, action.data);
    case SKU_ADD_SKU:
      return Object.assign({}, state, action.data);
    case SKU_UPDATE_SKU:
      return Object.assign({}, state, action.data);
    case SKU_DELETE_SKU:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}