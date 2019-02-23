import axios from 'axios';
import { ING_DET_UPDATE_ING, ING_DET_SET_INGREDIENT, ING_DET_SET_EDITING, ING_DET_GET_SKUS, ING_DET_ADD_ING, ING_DET_ADD_ERROR, ING_DET_DELETE_ERROR, ING_DET_SET_VALID, ING_DET_SET_NEW } from '../IngredientDetailsActionTypes';
import common, { createError } from '../../../Resources/common';
import {
    FORMULA_DET_GET_INGREDIENTS,
    FORMULA_DET_SET_FORMULA,
    FORMULA_DET_UPDATE_FORMULA,
    FORMULA_DET_ADD_FORMULA,
    FORMULA_DET_ADD_ERROR,
    FORMULA_DET_DELETE_ERROR,
    FORMULA_DET_DELETE_INGREDIENTS,
    FORMULA_DET_DELETE_FORMULA,
    FORMULA_DET_SET_VALID,
    FORMULA_DET_SET_EDITING,
    FORMULA_DET_SET_NEW
} from '../FormulaDetailActionTypes';

const hostname = common.hostname;

export const formulaDetUpdateFormula = (formula) => {
    let params = {
        ...formula
    }
    console.log("formula UPDATING ");
    console.log(params)
    return (dispatch) => {
      return axios.put(hostname + 'formula/' + params.id, params)
      .then((response) => {
        dispatch({
          type: FORMULA_DET_UPDATE_FORMULA,
          data: {
            errMsg: '',
            formula: formula
          }
        })
      })
      .catch((error) => {
        let message;
        console.log(error)
        if(error.error !== undefined){
          message = error.error
        }else{
          message = "Bad input for formula"
        }
        dispatch({
          type: FORMULA_DET_ADD_ERROR,
          data: createError(message)
        })
      });
    }
  }

  export const formulaDetSetFormula = (ing) => {
    return (dispatch) => {
      return dispatch({
        type: FORMULA_DET_SET_FORMULA,
        data: ing
      })
    }
  }

  export const formulaDetDeleteFormula = (form_id) => {
      console.log("DLEETETING A FORMULA");
      console.log(form_id);
    return (dispatch) => {
      return axios.delete(hostname + 'formula/'+form_id, {
        
      })
      .then(response => {
          console.log(response);
        dispatch({
          type: FORMULA_DET_DELETE_FORMULA,
          data: response.data
        })
      })
      .catch(error => {
        throw(error);
      });
    }

  }

  export const formulaDetGetIngredients = (form_id) => {
    return (dispatch) => {
      return axios.get(hostname + 'formula/'+form_id +'/ingredients', {
        
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: FORMULA_DET_GET_INGREDIENTS,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }

  export const formulaDetAddFormula = (ing) => {
    let params = {
        ...ing
    }
    console.log(params)
    return (dispatch) => {
      return axios.post(hostname + 'formula/', params)
      .then((response) => {
        dispatch({
          type: FORMULA_DET_ADD_FORMULA,
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

export const formulaDetAddError = (err) => {
  console.log("formula adding error")
  return (dispatch) => {
    return dispatch({
      type: FORMULA_DET_ADD_ERROR,
      data: err
    })
  }
}

export const formulaDetDeleteError = (err) => {
  console.log("formula delet erACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: FORMULA_DET_DELETE_ERROR,
      data: err
    })
  }
}

export const formulaDetSetValid = (validity) => {
  console.log("ING_DET_SET_VALID ACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: FORMULA_DET_SET_VALID,
      data: validity
    })
  }
}

export const formulaDetSetEditing = (editing) => {
  console.log("formula edit ACTION CREATOR")
  console.log(editing)
  return (dispatch) => {
    return dispatch({
      type: FORMULA_DET_SET_EDITING,
      data: editing
    })
  }
}

export const formulaDetSetNew = (newValue) => {
  console.log("form_DET_SET_NEW ACTION CREATOR")
  console.log(newValue)
  return (dispatch) => {
    return dispatch({
      type: FORMULA_DET_SET_NEW,
      data: newValue
    })
  }
}
