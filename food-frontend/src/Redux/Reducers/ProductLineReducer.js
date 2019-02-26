import { prdline_actions } from '../Actions/ActionTypes/ProductLineActionTypes';

const initialState = {
  keyword: "",
  productLines: [],
  current_page_number: 1,
  total_pages: 1,
  errMsg: null
};

export default function productLineReducer(state = initialState, action) {
  switch(action.type) {
    case prdline_actions.PRDLINE_CHANGE_LIMITS:
      return Object.assign({}, state, action.data);
    case prdline_actions.PRDLINE_PREV_PAGE:
      return Object.assign({}, state, action.data);
    case prdline_actions.PRDLINE_NEXT_PAGE:
      return Object.assign({}, state, action.data);
    case prdline_actions.PRDLINE_ADD_PRDLINE:
      return Object.assign({}, state, action.data);
    case prdline_actions.PRDLINE_DELETE_PRDLINE:
      if(action.data.productLineToDelete) {
        return Object.assign({}, state, {
          errMsg: action.data.errMsg,
          productLines: state.productLines.filter((el)=>{
            return el.id !== action.data.productLineToDelete.id;
          })
        });
      } else {
        return Object.assign({}, state, action.data);
      }
    case prdline_actions.PRDLINE_SEARCH:
      return Object.assign({}, state, action.data);
    case prdline_actions.PRDLINE_UPDATE_PRDLINE:
      if(action.data.productLineToUpdate){
        return Object.assign({}, state, {
          errMsg: action.data.errMsg,
          productLines: state.productLines.map((el)=>{
            if(el.id === action.data.productLineToUpdate.id) {
              return {
                ...el,
                ...action.data.productLineToUpdate
              }
            }
            return el;
          })
        });
      } else {
        return Object.assign({}, state, action.data);
      }
      
    default:
      return state;
  }
}