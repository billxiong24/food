import { combineReducers } from 'redux';
import ingredientsDummyReducer from './IngredientsDummyReducer';
import userReducer from './UsersReducer'

export default combineReducers({
    dummy_ingredients: ingredientsDummyReducer,
    users: userReducer
});