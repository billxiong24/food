import { dummy_filters, dummy_ingredients, dummy_ingredient_names } from "./DummyData";
import labels from "../../Resources/labels";

export const InitialStore = {
  // For now, only persistent data about users is who is actually logged in if there is someone logged in
  users: {
    uname: 'admin',
    id: 7,
    isSuccess: false,
    errMsg: null
  },
  // Persistent data concerning routing
  route: 5,
  // Persistent data concnerning ingredients view
  ingredients: {
    filters: [],
    items: [],
    ingredient_names: [],
    sortby: labels.ingredients.sort_by.INGREDIENT_NAME,
    filter_type: labels.ingredients.filter_type.SKU_NAME,
    current_page_number: 1,
    total_pages: 12,
    skus: [],
    errMsg: null
  },
  // Persistent data concerning productline view
  productLine: {
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
    sortby: labels.ingredients.sort_by.INGREDIENT_NAME,
    filter_type: labels.ingredients.filter_type.SKU_NAME,
    current_page_number: 1,
    total_pages: 1,
    ingredient_names: [],
    product_line_names:[],
    errMsg: null
  },
  // Manufacturing Goals
  manGoals: {
    goals: [],
    activeGoal:{
      name: 'Please Select a Manufacturing Goal',
      id: null,
      skus: [],
      user_id: null
    },
    skus: [],
    productLines: [],
    filters: [],
    errMsg: null
  },
  ingredient_detail:{
    ingredientName:"Cheese __",
    ingredientNum:"56 __",
    packageSize:"56 lbs. __",
    costPerPackage:"15.99 __",
    comment:"This cheese is good __",
  }
}