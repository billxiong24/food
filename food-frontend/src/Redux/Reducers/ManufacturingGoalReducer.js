import { mangoal_actions } from '../Actions/ManufacturingGoalActionTypes';

const initialState = {
  goals: [
    {
      name: 'My Goal 1',
      skus: [
        {
          name: 'sku1',
          size_per_unit: '28oz',
          case_count: '128',
          quantity: '20'
        },
        {
          name: 'sku2',
          size_per_unit:'10lbs',
          case_count: '100',
          quantity: '100'
        }
      ]
    },
    {
      name: 'My Other Goal',
      skus: [

      ]
    }
  ],
  activeGoal: {
    name: 'Please Select a Manufacturing Goal'
  },
  skus: [
    {
      "name": "Tomato Soup",
      "num": 7,
      "case_upc": "1001",
      "unit_upc": "65345",
      "unit_size": "12 lbs",
      "count_per_case": 98,
      "prd_line": "prod4",
      "comments": "commentingg",
      "id": 13
    },
    {
      "name": "Potatoes",
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
      "name": "Hot Dogs",
      "num": 123,
      "case_upc": "1023553",
      "unit_upc": "11222",
      "unit_size": "6 lbs",
      "count_per_case": 6,
      "prd_line": "veggies",
      "comments": "another comment",
      "id": 9
    },
  ],
  productLines: [

  ],
  filters: [

  ],
  errMsg: null,
}

export default function manufacturingGoalReducer(state = initialState, action) {
  switch (action.type) {
    case mangoal_actions.MANGOAL_UPDATE_FILTERS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_GET_PRODUCTLINES:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_GET_MANGOALS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_CREATE_MANGOAL:
      return Object.assign({}, state, {
        goals: [
          ...state.goals,
          action.data.mangoalToAdd
        ]
      });
    case mangoal_actions.MANGOAL_SEARCH_SKUS:
      return Object.assign({}, state, action.data);
    case mangoal_actions.MANGOAL_SET_CURRENT_MANGOAL:
      return Object.assign({}, state, action.data);
    default:
      return state;
  }
}