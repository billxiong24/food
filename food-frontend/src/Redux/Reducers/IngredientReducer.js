import { ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
  ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING } from '../Actions/IngredientActionTypes';

const initialState = {
  filters: [],
  items: [],
  sortby: null,
  current_page_number: 1,
  total_pages: 1,
  skus: [],
  errMsg: null
};

export default function ingredientReducer(state = initialState, action) {
  switch (action.type) {
    case ING_ADD_FILTER:
      return Object.assign({}, state, {
        filters: [
          ...state.filters,
          action.data
        ]
      });
    case ING_REMOVE_FILTER:
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          return el.type === action.data.type && el.string === action.data.type;
        })
      });
    case ING_SEARCH:
      return Object.assign({}, state, {
        ingredients: action.data
      });
    case ING_SORT_BY:
      return Object.assign({}, state, {
        sortby: action.data
      });
    case ING_ADD_ING:
      return Object.assign({}, state, action.data);
    case ING_GET_SKUS:
      return Object.assign({}, state, action.data);
    case ING_UPDATE_ING:
      return Object.assign({}, state, action.data);
    case ING_DELETE_ING:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}