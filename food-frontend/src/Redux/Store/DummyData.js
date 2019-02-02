import labels from "../../Resources/labels";

export let dummy_ingredients = [
    {
        name: "Cheddar Cheese",
        num: 53,
        vend_info: "Walmart",
        pkg_size: "345lbs",
        pkg_cost: "45",
        comments: "cheese is awesome",
        id: 1
    },
    {
        name: "Chicken Thigh",
        num: 6,
        vend_info: "Target",
        pkg_size: "345lbs",
        pkg_cost: "45",
        comments: "how about them thighs tho",
        id: 12
    },
    {
        name: "2% Milk",
        num: 6,
        vend_info: "Walmart",
        pkg_size: "345lbs",
        pkg_cost: "45",
        comments: "got milk",
        id: 167
    },
    {
        name: "Georgian Oranges",
        num: 12,
        vend_info: null,
        pkg_size: "55 gallons",
        pkg_cost: "10",
        comments: null,
        id: 93
    },
    {
        name: "Water",
        num: 698,
        vend_info: "Ozark",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "its not actually spring water",
        id: 278
    },
    {
        name: "Sesame Seeds",
        num: 698,
        vend_info: "Haldirams'",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "that indian thing",
        id: 7697
    },
    {
        name: "Cauliflower",
        num: 698,
        vend_info: "Albertson's",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "Call me Flower ;)",
        id: 234089
    },
    {
        name: "Rice",
        num: 5633,
        vend_info: "Its better than the university",
        pkg_size: "266",
        pkg_cost: "5300",
        comments: null,
        id: 1287
    }];
export let dummy_filters = [
    {
        type: labels.ingredients.filter_type.INGREDIENTS,
        string: "c",
        id: 0
    },
    {
        type: labels.ingredients.filter_type.SKU_NAME,
        string: "Chef Boyarde Beefy Bites",
        id: 1
    },
    {
        type: labels.ingredients.filter_type.SKU_NAME,
        string: "Pizza Rolls",
        id: 2
    },
    {
        type: labels.ingredients.filter_type.INGREDIENTS,
        string: "Campbells Creamy Chicken Noodle Soup",
        id: 3
    }
]

export let dummy_ing_det_skus = [
    {      
        name: "sku723",     
        case_upc: 123345,     
        unit_upc: 65653,     
        unit_size: "12 lbs",     
        count_per_case: 998,    
        prd_line: "prod4",    
        comments: "commentingg"    
    },
    {      
        name: "sku3",     
        case_upc: 123305,     
        unit_upc: 655653,     
        unit_size: "12 lbs",     
        count_per_case: 998,    
        prd_line: "prod4",    
        comments: "commentingg"    
      },
      {      
        name: "skweew3",     
        case_upc: 1237345,     
        unit_upc: 656753,     
        unit_size: "12 lbs",     
        count_per_case: 998,    
        prd_line: "prod4",    
        comments: "commentingg"    
      }  
]

export let dummy_ingredient_names = dummy_ingredients.map(ingredient => ingredient.name);