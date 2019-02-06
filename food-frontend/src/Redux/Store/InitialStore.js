import labels from "../../Resources/labels";

export const InitialStore = {
  // For now, only persistent data about users is who is actually logged in if there is someone logged in
  users: {
    uname: '',
    id: null,
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
    offset:0,
    limit:10,
    full:false,
    row_count:0,
    end:false,
    skus: [],
    errMsg: null,
    errors:[],
    ingDependency: [],
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
    errMsg: null,
    offset:0,
    limit:10,
    full:false,
    row_count:0,
    end:false,
    errors:[]
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
    skus:[],
    errors:[],
    new: false
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
      current_ingredients:[],
      errors:[],
      new: false
  },
  bulk_import:{
    errors:[]
  }
}