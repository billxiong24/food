import { combineReducers } from 'redux';
import ingredientsDummyReducer from './IngredientsDummyReducer';

export default combineReducers({
    dummy_ingredients: ingredientsDummyReducer
});