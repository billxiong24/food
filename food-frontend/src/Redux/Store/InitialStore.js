import { dummy_filters, dummy_ingredients, dummy_ingredient_names } from "./DummyData";
import labels from "../../Resources/labels";

export default {
  // For now, only persistent data about users is who is actually logged in if there is someone logged in
  users: {
    name: null,
    isSuccess: false,
    errMsg: null
  },
  // Persistent data concerning routing
  route: 0,
  // Persistent data concnerning ingredients view
  ingredients: {
    filters: dummy_filters,
    items: dummy_ingredients,
    ingredient_names: dummy_ingredient_names,
    sortby: labels.ingredients.sort_by.INGREDIENT_NAME,
    filter_type: labels.ingredients.filter_type.SKU_NAME,
    current_page_number: 1,
    total_pages: 12,
    cards: []
  }
}