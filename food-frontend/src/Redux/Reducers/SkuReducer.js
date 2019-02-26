import { SKU_ADD_FILTER, SKU_REMOVE_FILTER, SKU_SEARCH, SKU_SORT_BY,
  SKU_GET_ING, SKU_ADD_ING, SKU_DELETE_ING, SKU_ADD_SKU, SKU_UPDATE_SKU,
  SKU_DELETE_SKU, 
  SKU_SET_FILTER_TYPE,
  SKU_ING_NAME_AUTOCOMPLETE,
  SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE,
  SKU_ADD_ERROR,
  SKU_DELETE_ERROR,
  SKU_ADD_SELECTED,
  SKU_REMOVE_SELECTED} from '../Actions/SkuActionType';

  import { addToList, removeFromList } from '../../Resources/common';

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
    case SKU_ADD_SELECTED:
      return Object.assign({}, state, {
        selectedSkus: [...new Set([...state.selectedSkus, ...action.skus])],
      });
    case SKU_REMOVE_SELECTED:
      return Object.assign({}, state, {
        selectedSkus: state.selectedSkus.filter((el) => {return !action.skus.includes(el)})
      });
    case SKU_ADD_FILTER:
      let filters = state.filters.filter((el)=>{
        return el.id !== action.filter_id
      })
      return Object.assign({}, state, {
        filters: [
          ...filters,
          action.data
        ]
      });
    case SKU_REMOVE_FILTER:
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          return el.id !== action.data
        })
      });
    case SKU_SEARCH:
      let items = action.data.items
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
    case SKU_ING_NAME_AUTOCOMPLETE:
      return Object.assign({}, state, {
        ingredient_names: action.data
      });
    case SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE:
      return Object.assign({}, state, {
        product_line_names: action.data.productLines
      }); 
    case SKU_SET_FILTER_TYPE:
      return Object.assign({}, state, {
        filter_type: action.data
      });
    case SKU_ADD_ERROR:
      return Object.assign({}, state, {
        errors: addToList(action.data, state.errors)
      });
    case SKU_DELETE_ERROR:
      return Object.assign({}, state, {
        errors: removeFromList(action.data, state.errors)
      });
    default:
      return state;
  }
}
