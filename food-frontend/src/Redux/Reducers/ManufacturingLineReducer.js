import { manline_actions } from '../Actions/ActionTypes/ManufacturingLineActionTypes';

const initialState = {
  manLines: [],
  errMsg: null,
}

export default function manufacturingLineReducer(state = initialState, action) {
  switch (action.type) {
    case manline_actions.MANLINE_SEARCH:
      return Object.assign({}, state, {
        manLines: action.data.manLines.filter(man_line => man_line.id != 0),
        values: action.data.manLines.filter(man_line => man_line.id != 0
        ).reduce((obj, item) => {
          obj[item.id] = 0;
          return obj
        }, {}),
      });
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
    case manline_actions.MANLINE_GET_MAPPINGS:
      return Object.assign({}, state, {
        ...action.data
      });
    case manline_actions.MANLINE_CHANGE_MAPPING:
      return Object.assign({}, state, {
        values: Object.assign({}, state.values, {
          [action.data.manline.id]:action.data.mapping,
        })
      })
    case manline_actions.MANLINE_RESET_MAPPING:
      let newValues = {};
      Object.keys(state.values).forEach((value) => {
        newValues[value] = 0;
      });
      return Object.assign({}, state, {
        values: newValues,
      })
    default:
      return state;
  }
}