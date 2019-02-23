import {
    FORMULA_DET_GET_INGREDIENTS,
    FORMULA_DET_SET_FORMULA, 
    FORMULA_DET_UPDATE_FORMULA,
    FORMULA_DET_ADD_FORMULA,
    FORMULA_DET_ADD_INGREDIENTS,
    FORMULA_DET_ADD_ERROR,
    FORMULA_DET_DELETE_ERROR,
    FORMULA_DET_SET_VALID,
    FORMULA_DET_DELETE_INGREDIENTS,
    FORMULA_DET_SET_EDITING,
    FORMULA_DET_DELETE_FORMULA,
    FORMULA_DET_SET_NEW
} from '../Actions/FormulaDetailActionTypes'
import { addToList, removeFromList } from '../../Resources/common';
  
const initState = {};
  export default function FormulaDetailReducer(state=initState, action) {
    switch (action.type) {
        case FORMULA_DET_DELETE_INGREDIENTS: 
            console.log(state.ingredients);
            console.log(action.data);
            return Object.assign({}, state, {
                ingredients: removeFromList(action.data, state.ingredients)
            });
        case FORMULA_DET_ADD_INGREDIENTS:
            console.log("add ingredients formla");
            console.log(state.ingredients);
            console.log(action.data);
            return Object.assign({}, state, {
                ingredients: addToList(action.data, state.ingredients)
            });
        case FORMULA_DET_UPDATE_FORMULA:
            return Object.assign({}, state, {
                formulaName: action.data.formula.name,
                formulaNum: action.data.formula.num,
                formulaComment: action.data.formula.comments,
                editing: false
            });
        case FORMULA_DET_DELETE_FORMULA:
            return Object.assign({}, state, {
                formulaName: null, 
                formulaNum: null,
                formulaComment: null, 
                editing: false
            });
        case FORMULA_DET_SET_FORMULA:
            console.log(action.data)
            return Object.assign({}, state, {
                formulaName: action.data.name,
                formulaNum: action.data.num,
                formulaComment: action.data.comments,
                id:action.data.id
            });

        case FORMULA_DET_GET_INGREDIENTS:
            return Object.assign({}, state, {
                ingredients: action.data
            });
        case FORMULA_DET_ADD_FORMULA:
            return Object.assign({}, state, {
                editing: false,
                new:false
            });
        case FORMULA_DET_ADD_ERROR:
            console.log(action.data)
            return Object.assign({}, state, {
              errors: addToList(action.data, state.errors)
            });
        case FORMULA_DET_DELETE_ERROR:
            console.log("formula_DET_DELETE_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              errors: removeFromList(action.data, state.errors)
            });
        case FORMULA_DET_SET_VALID:
            console.log(action.data)
            return Object.assign({}, state, {
              valid: action.data
            });
        case FORMULA_DET_SET_EDITING:
            console.log(action.data)
            return Object.assign({}, state, {
                editing: action.data
            });
        case FORMULA_DET_SET_NEW:
            console.log(action.data)
            return Object.assign({}, state, {
                new: action.data
            });
        default:
        return state;
    }
  }
