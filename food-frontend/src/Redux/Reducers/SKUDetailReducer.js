import {SKU_DET_SET_FORMULA_LOCAL, SKU_DET_FORMULA_AUTOCOMPLETE, SKU_DET_GET_FORMULA, SKU_DET_GET_ING,SKU_DET_ADD_ING,SKU_DET_UPDATE_SKU,SKU_DET_DELETE_SKU,SKU_DET_DELETE_ING,SKU_DET_SET_SKU, SKU_DET_INGREDIENT_AUTOCOMPLETE, SKU_DET_PRODUCT_LINE_LIST, SKU_DET_ADD_ING_LOCAL, SKU_DET_DELETE_ING_LOCAL, SKU_DET_ADD_SKU, SKU_DET_ADD_ERROR, SKU_DET_DELETE_ERROR, SKU_DET_SET_NEW, SKU_DET_SET_VALID, SKU_DET_SET_EDITING } from "../Actions/SKUDetailActionTypes";


import { addToList, removeFromList } from "../../Resources/common";

const initialState = {
    name: "Campbell SKU Name",
    case_upc:42,
    unit_upc:34,
    num:12,
    id:null,
    unit_size:"45 Pomericans",
    count_per_case:"34",
    prd_line:"Campbell Home Products",
    ingredients:[],
    comments:"Insert Funny Side Comment",
    completion:"All Good",
    product_lines:[],
    current_ingredients:[]
}

export default function SKUDetailReducer(state = initialState, action) {
    let completion;
    switch (action.type) {
        case SKU_DET_GET_ING:
            console.log("SKU_DET_GET_ING REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                ingredients:action.data,
                current_ingredients: action.data
            });
        case SKU_DET_ADD_ING:
            console.log("SKU_DET_ADD_ING REDUCER")
            console.log(action.data)
            if(action.data.errMsg === ""){
                completion = "Adding Ingredients Successful"
            }else{
                completion = "Error:"+ action.data.errMsg
            }
            return Object.assign({}, state, {
                completion:completion,
            });
        case SKU_DET_UPDATE_SKU:
            console.log("SKU_DET_UPDATE_SKU REDUCER")
            console.log(action.data)
            if(action.data.errMsg === ""){
                completion = "Updating SKU Successful"
            }else{
                completion = "Error:"+ action.data.errMsg
            }
            return Object.assign({}, state, {
                completion:completion,
                editing: false
            });
        case SKU_DET_DELETE_SKU:
            console.log("SKU_DET_DELETE_SKU REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                name: null,
                case_upc:null,
                unit_upc:null,
                num:null,
                unit_size:null,
                count_per_case:null,
                prd_line:null,
                ingredients:null,
                comments:null,
                id:null
            });
        case SKU_DET_DELETE_ING:
            console.log("SKU_DET_DELETE_ING REDUCER")
            console.log(action.data)
            if(action.data.errMsg === ""){
                completion = "Adding Ingredients Successful"
            }else{
                completion = "Error:"+ action.data.errMsg
            }
            return Object.assign({}, state, {
                completion: completion
            });
        case SKU_DET_SET_SKU:
            console.log("SKU_DET_SET_SKU REDUCER")
            console.log(action.data)
            let obj = {
                name: action.data.name,
                case_upc:action.data.case_upc,
                unit_upc:action.data.unit_upc,
                num:action.data.num,
                unit_size:action.data.unit_size,
                count_per_case:action.data.count_per_case,
                prd_line:action.data.prd_line,
                comments:action.data.comments,
                id:action.data.id,
                formula_id :action.data.formula_id,
                man_rate: action.data.man_rate,
                formula_scale: action.data.formula_scale
            }
            if(action.data.id === null)
                obj.current_ingredients = [];

            return Object.assign({}, state, obj);
        case SKU_DET_FORMULA_AUTOCOMPLETE:
            return Object.assign({}, state, {
                formula_suggestions: action.data
            });
        case SKU_DET_INGREDIENT_AUTOCOMPLETE:
            console.log("SKU_DET_INGREDIENT_AUTOCOMPLETE REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                ingredient_suggestions: action.data
            });
        case SKU_DET_PRODUCT_LINE_LIST:
            console.log("SKU_DET_PRODUCT_LINE_LIST REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                product_lines: action.data
            });
        case SKU_DET_GET_FORMULA:
            console.log("AMMMM IN DET GET FORMULA");
            console.log(action.data);
            return Object.assign({}, state, {
                current_formula: action.data
            });
        case SKU_DET_SET_FORMULA_LOCAL:
            return Object.assign({}, state, {
                current_formula: action.data
            });
        case SKU_DET_ADD_ING_LOCAL:
            return Object.assign({}, state, {
                current_ingredients:addToList(action.data,state.current_ingredients),
            });
        case SKU_DET_DELETE_ING_LOCAL:
            console.log("SKU_DET_DELETE_ING_LOCAL REDUCER")
            console.log(action.data)
            console.log(state)
            console.log(removeFromList(action.data, state.current_ingredients))
            return Object.assign({}, state, {
                current_ingredients:removeFromList(action.data, state.current_ingredients),
            });
        case SKU_DET_ADD_SKU:
            console.log("SKU_DET_ADD_SKU REDUCER")
            console.log(action.data.id)
            return Object.assign({}, state, {
                id: action.data.id,
                editing: false,
                new: false,
            });
        case SKU_DET_ADD_ERROR:
            console.log("SKU_DET_ADD_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              errors: addToList(action.data, state.errors)
            });
        case SKU_DET_DELETE_ERROR:
            console.log("SKU_DET_DELETE_ERROR REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
              errors: removeFromList(action.data, state.errors)
            });
        case SKU_DET_SET_NEW:
            console.log("SKU_DET_SET_NEW REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                new: action.data
            });
        case SKU_DET_SET_VALID:
            console.log("SKU_DET_SET_VALID REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                valid: action.data
            });
        case SKU_DET_SET_EDITING:
            console.log("SKU_DET_SET_EDITING REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                editing: action.data
            });
            
            
        // case ING_DET_UPDATE_ING:
        //     console.log("ING_DET_UPDATE_ING")
        //     console.log(action.data)
        //     return Object.assign({}, state, {
        //         ingredientName: action.data.ing.name,
        //         ingredientNum: action.data.ing.num,
        //         vend_info: action.data.ing.vend_info,
        //         packageSize: action.data.ing.pkg_size,
        //         costPerPackage: action.data.ing.pkg_cost,
        //         comment:action.data.ing.comments
        //     });
        // case ING_DET_SET_INGREDIENT:
        //     console.log("ING_DET_SET_INGREDIENT")
        //     console.log(action.data)
        //     return Object.assign({}, state, {
        //         ingredientName: action.data.name,
        //         ingredientNum: action.data.num,
        //         vend_info: action.data.vend_info,
        //         packageSize: action.data.pkg_size,
        //         costPerPackage: action.data.pkg_cost,
        //         comment:action.data.comments
        //     });
        // case ING_DET_GET_SKUS:
        //     console.log("ING_DET_GET_SKUS REDUCER")
        //     console.log(action.data)
        //     return Object.assign({}, state, {
        //         skus:[]
        //     });
        default:
            return state;
    }
  }
