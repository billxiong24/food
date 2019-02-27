import {
    FORMULA_ADD_FILTER,
    FORMULA_ADD_INGREDIENT,
    FORMULA_REMOVE_INGREDIENT, 
    FORMULA_REMOVE_FILTER,
    FORMULA_SEARCH,
    FORMULA_UPDATE_FORMULA,
    FORMULA_ADD_FORMULA,
    FORMULA_DELETE_FORMULA,
    FORMULA_SORT_BY,
    FORMULA_SET_FILTER_TYPE,
    FORMULA_ADD_ERROR,
    FORMULA_DELETE_ERROR,
    FORMULA_ING_NAME_AUTOCOMPLETE
} from '../Actions/FormulaActionTypes';
import { addToList, removeFromList } from '../../Resources/common';

const initialState = {};
export default function FormulaReducer(state = initialState, action) {
  switch (action.type) {
    case FORMULA_ADD_FILTER:
      let filters = state.filters.filter((el)=>{
        return el.id !== action.filter_id
      })
      return Object.assign({}, state, {
        filters: [
          ...filters,
          action.data
        ]
      });
    case FORMULA_REMOVE_FILTER:
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          return el.id !== action.filter_id
        })
      });
    case FORMULA_SEARCH:
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
    case FORMULA_ING_NAME_AUTOCOMPLETE:
      return Object.assign({}, state, {
        ingredient_names: action.data
      });
    case FORMULA_SORT_BY:
      return Object.assign({}, state, {
        sortby: action.data
      });
    case FORMULA_SET_FILTER_TYPE:
      return Object.assign({}, state, {
        filter_type: action.data
      });
    case FORMULA_ADD_INGREDIENT:
      return Object.assign({}, state, action.data);
    case FORMULA_UPDATE_FORMULA:
      return Object.assign({}, state, action.data);
    case FORMULA_DELETE_FORMULA:
      return Object.assign({}, state, action.data);
    case FORMULA_ADD_ERROR:
      return Object.assign({}, state, {
        errors: addToList(action.data, state.errors)
      });
    case FORMULA_DELETE_ERROR:
      return Object.assign({}, state, {
        errors: removeFromList(action.data, state.errors)
      });
    default:
      return state;
  }
}
