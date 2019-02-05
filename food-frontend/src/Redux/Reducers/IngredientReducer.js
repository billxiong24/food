import { ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
  ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING, ING_SET_FILTER_TYPE, ING_ADD_DEPENDENCY, ING_REMOVE_DEPENDENCY, ING_ADD_ERROR, ING_DELETE_ERROR } from '../Actions/IngredientActionTypes';
import { addToList, removeFromList } from '../../Resources/common';

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
      let filters = state.filters.filter((el)=>{
        return el.id !== action.filter_id
      })
      console.log("ING ADD FILTER")
      console.log(filters)
      console.log(action.data)
      return Object.assign({}, state, {
        filters: [
          ...filters,
          action.data
        ]
      });
    case ING_REMOVE_FILTER:
      console.log("filter delete reducer")
      console.log(state.filters)
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          console.log(el.id)
          console.log(action.filter_id)
          return el.id !== action.filter_id
        })
      });
    case ING_SEARCH:
      console.log("ING_SEARCH")
      console.log(action)
      let items = action.data
      let row_count = 0
      let offset = action.offset
      let end = false
      if (items === undefined || items.length == 0) {
          end = true
      }else{
        end = !(state.limit + 1 == items.length)
        row_count = items[0].row_count
      }
      console.log(row_count)
      console.log("Full:"+action.full)
      let full = action.full
      if(!full){
        items = items.slice(0,state.limit)
      }
      return Object.assign({}, state, {
        items,
        row_count,
        offset,
        full: action.full,
        end
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
      console.log("ING GET SKUS")
      console.log(action.data)
      return Object.assign({}, state, {
        skus: action.data.items
      });
    case ING_UPDATE_ING:
      return Object.assign({}, state, action.data);
    case ING_DELETE_ING:
      return Object.assign({}, state, action.data);
    case ING_ADD_ERROR:
      console.log("ING_ADD_ERROR REDUCER")
      console.log(action.data)
      return Object.assign({}, state, {
        errors: addToList(action.data, state.errors)
      });
    case ING_DELETE_ERROR:
      console.log("ING_DELETE_ERROR REDUCER")
      console.log(action.data)
      return Object.assign({}, state, {
        errors: removeFromList(action.data, state.errors)
      });

    default:
      return state;
  }
}