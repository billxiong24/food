import { combineReducers } from 'redux';
import ingredientsDummyReducer from './IngredientsDummyReducer';
import userReducer from './UsersReducer';
import routeReducer from './RouteReducer';
import ingredientsReducer from './IngredientsReducer';

export default combineReducers({
    dummy_ingredients: ingredientsDummyReducer,
    users: userReducer,
    route: routeReducer,
    ingredients: ingredientsReducer
});