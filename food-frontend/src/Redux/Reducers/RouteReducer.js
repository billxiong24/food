import { ROUTERS_ROUTE_TO_PAGE } from '../Actions/RoutingActionTypes';

const initialState = 2

export default function routeReducer(state = initialState, action) {
  switch (action.type) {
    case ROUTERS_ROUTE_TO_PAGE:
      return action.data;
    default:
      return state;
  }
}