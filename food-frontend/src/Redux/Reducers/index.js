import { combineReducers } from 'redux';
import ingredientsDummyReducer from './IngredientsDummyReducer';
import userReducer from './UsersReducer';
import routeReducer from './RouteReducer';
import ingredientReducer from './IngredientReducer';

export default combineReducers({
    dummy_ingredients: ingredientsDummyReducer,
    users: userReducer,
    route: routeReducer,
    ingredients: ingredientReducer
});