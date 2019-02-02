import { combineReducers } from 'redux';
import ingredientsDummyReducer from './IngredientsDummyReducer';
import userReducer from './UsersReducer';
import routeReducer from './RouteReducer';
import ingredientReducer from './IngredientReducer';
import skuReducer from './SkuReducer';
import productLineReducer from './ProductLineReducer';
import manufacturingGoalReducer from './ManufacturingGoalReducer';
import ingredientDetailReducer from './IngredientDetailReducer';
import SKUDetailReducer from './SKUDetailReducer';



export default combineReducers({
    dummy_ingredients: ingredientsDummyReducer,
    users: userReducer,
    route: routeReducer,
    ingredients: ingredientReducer,
    skus: skuReducer,
    productLine: productLineReducer,
    manGoals: manufacturingGoalReducer,
    ingredient_details:ingredientDetailReducer,
    sku_details:SKUDetailReducer
});