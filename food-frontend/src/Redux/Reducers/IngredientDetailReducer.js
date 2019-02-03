
import { ING_DET_GET_SKUS, ING_DET_UPDATE_ING, ING_DET_SET_INGREDIENT } from '../Actions/IngredientDetailsActionTypes';
import { dummy_ing_det_skus } from '../Store/DummyData';
  
  const initialState = {
        ingredientName:"Cheeseded __",
        ingredientNum:"56ede __",
        vend_info:"Campbells",
        packageSize:"56 lbs.dede __",
        costPerPackage:"15.99eded __",
        comment:"This cheese is goodded __",
        id:31,
        skus:dummy_ing_det_skus
    }
  
  export default function ingredientDetailReducer(state = initialState, action) {
    switch (action.type) {
        case ING_DET_UPDATE_ING:
            console.log("ING_DET_UPDATE_ING")
            console.log(action.data)
            return Object.assign({}, state, {
                ingredientName: action.data.ing.name,
                ingredientNum: action.data.ing.num,
                vend_info: action.data.ing.vend_info,
                packageSize: action.data.ing.pkg_size,
                costPerPackage: action.data.ing.pkg_cost,
                comment:action.data.ing.comments
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
                comment:action.data.comments
            });
        case ING_DET_GET_SKUS:
            console.log("ING_DET_GET_SKUS REDUCER")
            console.log(action.data)
            return Object.assign({}, state, {
                skus:[]
            });
        default:
        return state;
    }
  }