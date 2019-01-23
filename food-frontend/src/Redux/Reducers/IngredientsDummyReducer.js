import { GET_INGREDIENTS_DUMMY_DATA } from "../Actions/ActionTypes";

export default function ingredientsDummyReducer(state = [], action) {
    switch (action.type) {
        case GET_INGREDIENTS_DUMMY_DATA:
        return action.data;
      default:
        return state;
    }
  }