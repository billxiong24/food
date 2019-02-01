import { SKU_ADD_FILTER, SKU_REMOVE_FILTER, SKU_SEARCH, SKU_SORT_BY,
  SKU_GET_ING, SKU_ADD_ING, SKU_DELETE_ING, SKU_ADD_SKU, SKU_UPDATE_SKU,
  SKU_DELETE_SKU, 
  SKU_SET_FILTER_TYPE,
  SKU_ING_NAME_AUTOCOMPLETE,
  SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE} from '../Actions/SkuActionType';

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
      let filters = state.filters.filter((el)=>{
        return el.id !== action.filter_id
      })
      console.log("SKU_ADD_FILTER REDUCER")
      console.log(filters)
      console.log(action.data)
      return Object.assign({}, state, {
        filters: [
          ...filters,
          action.data
        ]
      });
    case SKU_REMOVE_FILTER:
      console.log("SKU_REMOVE_FILTER REDUCER")
      console.log(state.filters)
      console.log(action.data)
      return Object.assign({}, state, {
        filters: state.filters.filter((el)=>{
          console.log(el.id)
          console.log(action.data)
          return el.id !== action.data
        })
      });
    case SKU_SEARCH:
      console.log("SKU_SEARCH")
      console.log(action.data)
      return Object.assign({}, state, {
        items: action.data.items
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
      console.log("SKU_ING_NAME_AUTOCOMPLETE REDUCER")
      console.log(action.data)
      return Object.assign({}, state, {
        ingredient_names: action.data
      });
    case SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE:
      console.log("SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE REDUCER")
      console.log(action.data)
      return Object.assign({}, state, {
        product_line_names: action.data.productLines
      }); 
    case SKU_SET_FILTER_TYPE:
      console.log("SKU filter type set to " + action.data)
      return Object.assign({}, state, {
        filter_type: action.data
      });
    default:
      return state;
  }
}