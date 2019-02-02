import {  SKU_DET_GET_ING,SKU_DET_ADD_ING,SKU_DET_UPDATE_SKU,SKU_DET_DELETE_SKU,SKU_DET_DELETE_ING,SKU_DET_SET_SKU, SKU_DET_INGREDIENT_AUTOCOMPLETE, SKU_DET_PRODUCT_LINE_LIST } from "../Actions/SKUDetailActionTypes";

const initialState = {
    name: "Campbell SKU Name",
    case_upc:42,
    unit_upc:34,
    num:12,
    unit_size:"45 Pomericans",
    count_per_case:"34",
    prd_line:"Campbell Home Products",
    ingredients:[],
    comments:"Insert Funny Side Comment",
    completion:"All Good",
    product_lines:[],
    ingredient_suggestions:[]
}

export default function SKUDetailReducer(state = initialState, action) {
    let completion;
    switch (action.type) {
        case SKU_DET_GET_ING:
            console.log("SKU_DET_GET_ING REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                ingredients:action.data,
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
                completion:completion
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
                completion:completion
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
                comments:null
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
            return Object.assign({}, state, {
                name: action.data.name,
                case_upc:action.data.case_upc,
                unit_upc:action.data.unit_upc,
                num:action.data.num,
                unit_size:action.data.unit_size,
                count_per_case:action.data.count_per_case,
                prd_line:action.data.prd_line,
                comments:action.data.comments
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