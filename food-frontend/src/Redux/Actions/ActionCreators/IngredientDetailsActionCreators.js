import axios from 'axios';
import common, { createError } from '../../../Resources/common';
import { ING_DET_UPDATE_ING, ING_DET_SET_INGREDIENT, ING_DET_SET_EDITING, ING_DET_GET_SKUS, ING_DET_ADD_ING, ING_DET_ADD_ERROR, ING_DET_DELETE_ERROR, ING_DET_SET_VALID, ING_DET_SET_NEW } from '../IngredientDetailsActionTypes';

const hostname = common.hostname;

export const ingDetUpdateIng = (ing) => {
    let params = {
        ...ing
    }
    return (dispatch) => {
      return axios.put(hostname + 'ingredients/' + params.id, params)
      .then((response) => {
        dispatch({
          type: ING_DET_UPDATE_ING,
          data: {
            errMsg: '',
            ing: ing
          }
        })
      })
      .catch((error) => {
        let message;
        if(error.error !== undefined){
          message = error.error
        }else{
          message = "Ingredient Conflicts"
        }
        dispatch({
          type: ING_DET_ADD_ERROR,
          data: createError(message)
        })
      });
    }
  }

  export const ingDetSetIng = (ing) => {
    return (dispatch) => {
      return dispatch({
        type: ING_DET_SET_INGREDIENT,
        data: ing
      })
    }
  }

  export const ingDetGetSkus = (ing_id) => {
    return (dispatch) => {
      return axios.get(hostname + 'ingredients/'+ing_id+'/skus', {
        
      })
      .then(response => {
        dispatch({
          type: ING_DET_GET_SKUS,
          data: response.data
        })
      })
      .catch(error => {
        throw(error);
      });
    }
  }

  export const ingDetAddIng = (ing) => {
    let params = {
        ...ing
    }
    return (dispatch) => {
      return axios.post(hostname + 'ingredients/', params)
      .then((response) => {
        dispatch({
          type: ING_DET_ADD_ING,
          data: {
            errMsg: '',
            ing: ing
          }
        })
      })
      .catch((error) => {
        let message;
        if(error.error !== undefined){
          message = error.error
        }else{
          message = "Ingredient Conflicts"
        }
        dispatch({
          type: ING_DET_ADD_ERROR,
          data: createError(message)
        })
      });
    }
  }

  // Need to do something, probably involved with search
export const ingDetAddError = (err) => {
  return (dispatch) => {
    return dispatch({
      type: ING_DET_ADD_ERROR,
      data: err
    })
  }
}

export const ingDetDeleteError = (err) => {
  return (dispatch) => {
    return dispatch({
      type: ING_DET_DELETE_ERROR,
      data: err
    })
  }
}

export const ingDetSetValid = (validity) => {
  return (dispatch) => {
    return dispatch({
      type: ING_DET_SET_VALID,
      data: validity
    })
  }
}

export const ingDetSetEditing = (editing) => {
  return (dispatch) => {
    return dispatch({
      type: ING_DET_SET_EDITING,
      data: editing
    })
  }
}

export const ingDetSetNew= (newValue) => {
  return (dispatch) => {
    return dispatch({
      type: ING_DET_SET_NEW,
      data: newValue
    })
  }
}
