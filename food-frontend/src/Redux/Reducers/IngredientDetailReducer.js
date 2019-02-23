
import { ING_DET_GET_SKUS, ING_DET_SET_EDITING, ING_DET_UPDATE_ING, ING_DET_SET_INGREDIENT,ING_DET_ADD_ING, ING_DET_DELETE_ERROR, ING_DET_ADD_ERROR, ING_DET_SET_VALID, ING_DET_SET_NEW } from '../Actions/IngredientDetailsActionTypes';
import { dummy_ing_det_skus } from '../Store/DummyData';
import { addToList, removeFromList } from '../../Resources/common';
  
  const initialState = {
        ingredientName:null,
        ingredientNum:null,
        vend_info:null,
        packageSize:null,
        costPerPackage:null,
        comment:null,
        id:null,
        skus:[]
    }
  
  export default function ingredientDetailReducer(state = initialState, action) {
    switch (action.type) {
        case ING_DET_UPDATE_ING:
            console.log("ING_DET_UPDATE_ING")
            console.log(action.data)
            console.log(true)
            return Object.assign({}, state, {
                ingredientName: action.data.ing.name,
                ingredientNum: action.data.ing.num,
                vend_info: action.data.ing.vend_info,
                packageSize: action.data.ing.pkg_size,
                costPerPackage: action.data.ing.pkg_cost,
                comment:action.data.ing.comments,
                editing: false
            });
        case ING_DET_SET_INGREDIENT:
            console.log("ING_DET_SET_INGREDIENT")
            console.log(action.data)
            return Object.assign({}, state, {
                ingredientName: action.data.name,
                ingredientNum: action.data.num,
                vend_info: action.data.vend_info,
                packageSize: action.data.pkg_size,
                costPerPackage: action.data.pkg_cost,
                comment:action.data.comments,
                id:action.data.id
            });
        case ING_DET_GET_SKUS:
            console.log("ING_DET_GET_SKUS REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                skus:action.data
            });
        case ING_DET_ADD_ING:
            console.log("ING_DET_ADD_ING REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                editing: false,
                new:false
            });
        case ING_DET_ADD_ERROR:
            console.log("ING_DET_ADD_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              errors: addToList(action.data, state.errors)
            });
        case ING_DET_DELETE_ERROR:
            console.log("ING_DET_DELETE_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              errors: removeFromList(action.data, state.errors)
            });
        case ING_DET_SET_VALID:
            console.log("ING_DET_DELETE_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              valid: action.data
            });
        case ING_DET_SET_EDITING:
            console.log("ING_DET_SET_EDITING REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                editing: action.data
            });
        case ING_DET_SET_NEW:
            console.log("ING_DET_SET_NEW REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                new: action.data
            });
        default:
        return state;
    }
  }
