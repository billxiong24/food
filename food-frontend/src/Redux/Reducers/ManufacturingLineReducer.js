import { manline_actions } from '../Actions/ActionTypes/ManufacturingLineActionTypes';

const initialState = {
  manLines: [],
  current_page_number: 1,
  total_pages: 1,
  limit: 10,
  errMsg: null,
}

export default function manufacturingLineReducer(state = initialState, action) {
  switch (action.type) {
    case manline_actions.MANLINE_SEARCH:
      return Object.assign({}, state, action.data);
    case manline_actions.MANLINE_CREATE:
      return Object.assign({}, state, action.data);
    case manline_actions.MANLINE_UPDATE:
      return Object.assign({}, state, {
        errMsg: action.data.errMsg,
        manLines: state.manLines.map((el)=>{
          if(el.id === action.data.manlineToUpdate.id) {
            return {
              ...el,
              ...action.data.manlineToUpdate
            }
          }
          return el;
        })
      });
    case manline_actions.MANLINE_CHANGE_LIMITS:
      return Object.assign({}, state, action.data);
    case manline_actions.MANLINE_NEXT_PAGE:
      return Object.assign({}, state, action.data);
    case manline_actions.MANLINE_PREV_PAGE:
      return Object.assign({}, state, action.data);
    case manline_actions.MANLINE_DELETE:
      if(action.data.manlineToDelete) {
        return Object.assign({}, state, {
          errMsg: action.data.errMsg,
          manLines: state.manLines.filter((el)=>{
            return el.id !== action.data.manlineToDelete.id;
          })
        });
      } else {
        return Object.assign({}, state, action.data);
      }
    default:
      return state;
  }
}