import { BULK_IMPORT_ADD_ERROR, BULK_IMPORT_DELETE_ERROR } from "../Actions/BulkImportActionTypes";
import { addToList, removeFromList } from "../../Resources/common";

const initialState = {
    errors:[]
}

export default function BulkImportReducer(state = initialState, action) {
    let completion;
    switch (action.type) {
        case BULK_IMPORT_ADD_ERROR:
            return Object.assign({}, state, {
              errors: addToList(action.data, state.errors)
            });
        case BULK_IMPORT_DELETE_ERROR:
            return Object.assign({}, state, {
              errors: removeFromList(action.data, state.errors)
            });
        default:
            return state;
    }
  }