import { dummy_filters, dummy_ingredients } from "./DummyData";
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
    sortby: labels.ingredients.sort_by.INGREDIENT_NAME,
    current_page_number: 1,
    total_pages: 12,
    skus: [],
    errMsg: null
  },
  // Persistent data concerning productline view
  productline: {
    keyword: "",
    productLines: [],
    current_page_number: 1,
    total_pages: 1,
    errMsg: null
  },
  // Persistent data concerning skus view
  skus: {
    filters: [],
    items: [],
    sortby: null,
    current_page_number: 1,
    total_pages: 1,
    ingredients: [],
    errMsg: null
  }
}