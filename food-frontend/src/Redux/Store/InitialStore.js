import { dummy_filters, dummy_ingredients } from "./DummyData";
import labels from "../../Resources/labels";

export default {
  // For now, only persistent data about users is who is actually logged in if there is someone logged in
  users: {
    name: null,
    isSuccess: false,
    errMsg: null
  },
  // Persistent data concnerning ingredients view
  ingredients: {
    filters: dummy_filters,
    items: dummy_ingredients,
    sortby: labels.ingredients.sort_by.INGREDIENT_NAME,
    input_filter_type: labels.filter_type.INGREDIENT_NAME,
    current_page_number: 1,
    total_pages: 12,
    cards: []
  }
}