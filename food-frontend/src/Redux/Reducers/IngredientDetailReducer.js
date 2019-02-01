
import { ING_DET_GET_SKUS, ING_DET_UPDATE_ING } from '../Actions/IngredientDetailsActionTypes';
  
  const initialState = {
        ingredientName:"Cheeseded __",
        ingredientNum:"56ede __",
        packageSize:"56 lbs.dede __",
        costPerPackage:"15.99eded __",
        comment:"This cheese is goodded __",
    }
  
  export default function ingredientDetailReducer(state = initialState, action) {
    switch (action.type) {
        case ING_DET_UPDATE_ING:
            console.log("ING_DET_UPDATE_ING")
            console.log(action.data)
            return Object.assign({}, state, {
            });
        default:
        return state;
    }
  }