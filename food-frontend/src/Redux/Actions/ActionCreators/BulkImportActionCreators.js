import { BULK_IMPORT_ADD_ERROR, BULK_IMPORT_DELETE_ERROR } from "../BulkImportActionTypes";

export const bulkImportAddError = (error) => {
    return (dispatch) => {
      return dispatch({
        type: BULK_IMPORT_ADD_ERROR,
        data: error
      })
    }
  }

export const bulkImportDeleteError = (error) => {
    return (dispatch) => {
        return dispatch({
          type: BULK_IMPORT_DELETE_ERROR,
          data: error
        })
    }
}