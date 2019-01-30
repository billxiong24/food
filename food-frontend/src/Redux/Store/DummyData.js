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
        id: 1
    },
    {
        name: "2% Milk",
        num: 6,
        vend_info: "Walmart",
        pkg_size: "345lbs",
        pkg_cost: "45",
        comments: "got milk",
        id: 1
    },
    {
        name: "Georgian Oranges",
        num: 12,
        vend_info: null,
        pkg_size: "55 gallons",
        pkg_cost: "10",
        comments: null,
        id: 9
    },
    {
        name: "Water",
        num: 698,
        vend_info: "Ozark",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "its not actually spring water",
        id: 2
    },
    {
        name: "Sesame Seeds",
        num: 698,
        vend_info: "Haldirams'",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "that indian thing",
        id: 76
    },
    {
        name: "Cauliflower",
        num: 698,
        vend_info: "Albertson's",
        pkg_size: "5lbs",
        pkg_cost: "45",
        comments: "Call me Flower ;)",
        id: 234
    },
    {
        name: "Rice",
        num: 5633,
        vend_info: "Its better than the university",
        pkg_size: "266",
        pkg_cost: "5300",
        comments: null,
        id: 12
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

export let dummy_ingredient_names = dummy_ingredients.map(ingredient => ingredient.name);