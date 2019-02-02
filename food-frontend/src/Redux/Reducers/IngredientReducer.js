import { ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
  ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING, ING_SET_FILTER_TYPE, ING_ADD_DEPENDENCY, ING_REMOVE_DEPENDENCY } from '../Actions/IngredientActionTypes';

const initialState = {
  filters: [],
  items: [],
  sortby: null,
  current_page_number: 1,
  total_pages: 12,
  skus: [],
  errMsg: null,
  ingDependency: []
};

export default function ingredientReducer(state = initialState, action) {
  switch (action.type) {
    case ING_REMOVE_DEPENDENCY:
      return Object.assign({}, state, {
        ingDependency: state.ingDependency.filter((ing) => {
          return ing.id !== action.data.id;
        })
      });
    case ING_ADD_DEPENDENCY:
      return Object.assign({}, state, {
        ingDependency: [
          ...state.ingDependency,
          action.data.ingDependency,
        ]
      });
    case ING_ADD_FILTER:
      return Object.assign({}, state, {
        filters: [
          ...state.filters,
          action.data
        ]
      });
    case ING_REMOVE_FILTER:
      console.log("filter delete reducer")
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          console.log(el.id)
          console.log(action.filter_id)
          return el.id !== action.filter_id
        })
      });
    case ING_SEARCH:
      console.log(action.data)
      return Object.assign({}, state, {
        items: action.data
      });
    case ING_SORT_BY:
      return Object.assign({}, state, {
        sortby: action.data
      });
    case ING_SET_FILTER_TYPE:
      console.log("filter type set to " + action.data)
      return Object.assign({}, state, {
        filter_type: action.data
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