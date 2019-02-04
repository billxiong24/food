import { dummy_filters, dummy_ingredients, dummy_ingredient_names, dummy_ing_det_skus } from "./DummyData";
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
  route: 0,
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
    errMsg: null,
    ingDependency: [
    {
      "name": "skuskus",
      "num": 698,
      "vend_info": "someinfo please",
      "pkg_size": "5lbs",
      "pkg_cost": "45",
      "comments": "newcomment wiht id",
      "id": 2,
      "skus": [
        {
          "name": "sku1",
          "num": 12,
          "case_upc": "2449",
          "unit_upc": "112553",
          "unit_size": "10 lbs",
          "count_per_case": 4,
          "prd_line": "prod4",
          "comments": "a comment",
          "id": 4
        },
        {
          "name": "sku1245872",
          "num": 55,
          "case_upc": "2477",
          "unit_upc": "1123",
          "unit_size": "5 lbs",
          "count_per_case": 4,
          "prd_line": "prod69",
          "comments": "a comment",
          "id": 1
        },
        {
          "name": "sku2355",
          "num": 1,
          "case_upc": "5048",
          "unit_upc": "1128",
          "unit_size": "5 lbs",
          "count_per_case": 4,
          "prd_line": "prod69",
          "comments": "a comment",
          "id": 3
        },
      ]
    },
      {
        "name": "ing234",
        "num": 47,
        "vend_info": "please",
        "pkg_size": "3587 poundsss",
        "pkg_cost": "15",
        "comments": "a comment",
        "id": 5,
        skus: [],
      },]
  },
  // Persistent data concerning productline view
  productLine: {
    keyword: "",
    productLines: [],
    current_page_number: 1,
    total_pages: 1,
    limit: 10,
    errMsg: null,
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
      user_id: null,
      ingredients: [],
    },
    skus: [],
    productLines: [],
    filters: [],
    errMsg: null
  },
  ingredient_details:{
    ingredientName:null,
    ingredientNum:null,
    packageSize:null,
    costPerPackage:null,
    comment:null,
    id:null,
    skus:[]
  },
  sku_details:{
      name: "Campbell SKU Name",
      case_upc:42,
      unit_upc:34,
      num:12,
      unit_size:"45 Pomericans",
      count_per_case:"34",
      prd_line:"Campbell Home Products",
      ingredients:[],
      comments:"Insert Funny Side Comment",
      completion:"All Good",
      id:null,
      product_lines:[],
      ingredient_suggestions:[],
      current_ingredients:[]
  }
}