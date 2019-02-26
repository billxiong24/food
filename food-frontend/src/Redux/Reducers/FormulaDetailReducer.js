import {
    FORMULA_DET_GET_SKUS,
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
        case FORMULA_DET_GET_SKUS: 
            return Object.assign({}, state, {
                skus: action.data
            });
        case FORMULA_DET_DELETE_INGREDIENTS: 
            return Object.assign({}, state, {
                ingredients: removeFromList(action.data, state.ingredients)
            });
        case FORMULA_DET_ADD_INGREDIENTS:
            return Object.assign({}, state, {
                ingredients: addToList(action.data, state.ingredients)
            });
        case FORMULA_DET_UPDATE_FORMULA:
            return Object.assign({}, state, {
                formulaName: action.data.formula.name,
                formulaNum: action.data.formula.num,
                formulaComment: action.data.formula.comment,
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
            return Object.assign({}, state, {
                made_formula: action.data.made_formula,
                formulaName: action.data.name,
                formulaNum: action.data.num,
                formulaComment: action.data.comment,
                id:action.data.id
            });

        case FORMULA_DET_GET_INGREDIENTS:
            return Object.assign({}, state, {
                ingredients: action.data
            });
        case FORMULA_DET_ADD_FORMULA:
            return Object.assign({}, state, {
                editing: false,
                made_formula: true,
                new:false,
                formulaName: action.data.formula.name,
                formulaNum: action.data.formula.num,
                formulaComment: action.data.formula.comment,
                id: action.data.formula.id
            });
        case FORMULA_DET_ADD_ERROR:
            return Object.assign({}, state, {
              errors: addToList(action.data, state.errors)
            });
        case FORMULA_DET_DELETE_ERROR:
            return Object.assign({}, state, {
              errors: removeFromList(action.data, state.errors)
            });
        case FORMULA_DET_SET_VALID:
            return Object.assign({}, state, {
              valid: action.data
            });
        case FORMULA_DET_SET_EDITING:
            return Object.assign({}, state, {
                editing: action.data,
                made_formula: action.data
            });
        case FORMULA_DET_SET_NEW:
            return Object.assign({}, state, {
                new: action.data
            });
        default:
        return state;
    }
  }
