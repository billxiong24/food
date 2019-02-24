import axios from 'axios';
import common, { createError } from '../../../Resources/common';
import {SKU_DET_MANLINE_AUTOCOMPLETE,SKU_DET_GET_MAN_LINES, SKU_DET_SET_FORMULA_LOCAL, SKU_DET_FORMULA_AUTOCOMPLETE, SKU_DET_GET_FORMULA, SKU_DET_ADD_SKU,SKU_DET_GET_ING,SKU_DET_ADD_ING ,SKU_DET_UPDATE_SKU ,SKU_DET_DELETE_SKU ,SKU_DET_DELETE_ING ,SKU_DET_SET_SKU, SKU_DET_PRODUCT_LINE_LIST, SKU_DET_INGREDIENT_AUTOCOMPLETE, SKU_DET_SET_VALID,  SKU_DET_ADD_ING_LOCAL, SKU_DET_DELETE_ING_LOCAL, SKU_DET_ADD_ERROR, SKU_DET_DELETE_ERROR, SKU_DET_SET_NEW, SKU_DET_SET_EDITING
} from '../SKUDetailActionTypes';

const hostname = common.hostname;

export const skuDetSetFormula = (formula) => {
    return (dispatch) => {
        return dispatch({
            type: SKU_DET_SET_FORMULA_LOCAL,
            data: formula
        });
    }
}
export const skuDetGetFormulaNames = (name) => {
    let params = {
        names:[name]
      }
      return (dispatch) => {
        return axios.get(hostname + 'formula/search', {
          params
        })
      .then(response => {
        dispatch({
          type: SKU_DET_FORMULA_AUTOCOMPLETE,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
}

export const skuDetGetFormula = (formula_id) => {
    return (dispatch) => {
      return axios.get(hostname + 'formula/'+formula_id)
      .then(response => {
          console.log("GOT RESPONSE FROM SKU DET GET FORMULA");
          if(response.data.length === 0) {
              dispatch({
                  type: SKU_DET_ADD_ERROR,
                  data: createError("Formula doesnt exist")
              })
              return;
          }
            dispatch({
              type: SKU_DET_GET_FORMULA,
              data: response.data[0] 
            })
      })
      .catch(error => {
              dispatch({
                  type: SKU_DET_ADD_ERROR,
                  data: createError("Something was wrong. Check your input.")
              })
        //throw(error);
      });
    }
  }

export const skuDetSetLines = (lines) => {
    console.log("setting line");
    console.log(lines);
    return (dispatch) => {
            dispatch({
              type: SKU_DET_GET_MAN_LINES,
              data: lines
            })
    }
}
export const skuDetGetManLines = (sku_id) => {
    console.log("SKU DET GET MANLINES");
    console.log(sku_id);
    return (dispatch) => {
      return axios.get(hostname + 'sku/' + sku_id + '/manufacturing_lines', {
      })
      .then(response => {
          console.log("GOT RESPONSE FROM man line");
          console.log(response);
            dispatch({
              type: SKU_DET_GET_MAN_LINES, 
              data: response.data
            })
      })
      .catch(error => {
              dispatch({
                  type: SKU_DET_ADD_ERROR,
                  data: createError("Something was wrong. Check your input.")
              })
        //throw(error);
      });
    }
}
export const skuDetGetManLinesAuto = (name) => {
    return (dispatch) => {
        let params = {
            name: name
        }
      return axios.get(hostname + 'manufacturing_line/search', {
          params
      })
      .then(response => {
          console.log("GOT RESPONSE FROM man line");
          console.log(response);
            dispatch({
              type: SKU_DET_MANLINE_AUTOCOMPLETE,
              data: response.data
            })
      })
      .catch(error => {
              dispatch({
                  type: SKU_DET_ADD_ERROR,
                  data: createError("Something was wrong. Check your input.")
              })
        //throw(error);
      });
    }
    
}

// GET /sku/:id/ingredients
export const skuDetGetIng = (sku_id) => {
    console.log("SKU_DET_GET_ING ACTION CREATOR")
    console.log(sku_id)
    return (dispatch) => {
      return axios.get(hostname + 'sku/'+sku_id+'/ingredients', {
        
      })
      .then(response => {
          console.log("RESPONSEEE FROM GET INGREDIENTS");
        console.log(response)
        dispatch({
          type: SKU_DET_GET_ING,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }

// POST /sku/:id/ingredients
export const skuDetAddIng = (sku,ingredients) => {
    console.log("SKU_DET_ADD_ING ACTION CREATOR")
    console.log(sku.id,ingredients)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]

    return (dispatch) => {
      return axios.post(hostname + 'sku/'+sku.id+'/ingredients', {
        ingredients: ingredients.map((ingredient) => ({
          ingred_num:ingredient.num,
          quantity: ingredient.quantity})
          )
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_ADD_ING,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }
//  PUT /sku/:id
export const skuDetUpdateSku = (sku) => {
    console.log("UPDATING A SKUUUUUUUUUUUUUUUUUUUUUUUU");
    console.log(sku)
    console.log(sku.id)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.put(hostname + 'sku/'+sku.id, {
        ...sku
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_UPDATE_SKU,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        let message;
        if(error.error !== undefined){
          message = error.error
        }else{
          message = "SKU Conflicts"
        }
        dispatch({
          type: SKU_DET_ADD_ERROR,
          data: createError(message)
        })
      });
    }
  }

  // DELETE /sku/:id/
export const skuDetDeleteSku = (sku, ingredients) => {
    // [{ingred_num: 1, quantity: 1}, {ingred_  num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.delete(hostname + 'sku/'+sku.id, {
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_DELETE_SKU,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }

// DELETE /sku/:id/ingredients
export const skuDetDeleteIng = (sku, ingredients) => {
    console.log("SKU_DET_DELETE_ING ACTION CREATOR")
    console.log(sku)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    return (dispatch) => {
      return axios.delete(hostname + 'sku/'+sku.id+ '/ingredients',  {
        ingredients: ingredients.map((ingredient) => ({
          ingred_num:ingredient.num,
          quantity: ingredient.quantity})
          )
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_DELETE_ING,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }


  export const skuDetSetSku = (sku) => {
      console.log('CHECK IS UNDFEIND');
      if(!sku.manufacturing_lines) {
          sku.manufacturing_lines = [];
      }
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_SET_SKU,
        data: sku
      })
    }
  }

export const skuDetIngAutocomplete = (name) => {
    console.log("SKU_DET_INGREDIENT_AUTOCOMPLETE ACTION CREATOR")
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    let params = {
        names:[name],
        skus: [],
      }
      console.log(params)
      return (dispatch) => {
        return axios.get(hostname + 'ingredients/search', {
          params
        })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_INGREDIENT_AUTOCOMPLETE,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }

export const skuDetGetProductLine = ()  => {
    console.log("SKU_DET_PRODUCT_LINE_LIST ACTION CREATOR")
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
      return (dispatch) => {
        return axios.get(hostname + 'productline/search', {
            params: {
              names: ["p"]
            }
          })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_PRODUCT_LINE_LIST,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }


  export const skuDetAddIngLocal = (ingredient) => {
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_ADD_ING_LOCAL,
        data: ingredient
      })
    }
  }

  export const skuDetDeleteIngLocal = (ingredient) => {
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_DELETE_ING_LOCAL,
        data: ingredient
      })
    }
  }

  export const skuDetAddSku = (sku) => {
    console.log("SKU_DET_ADD_SKU ACTION CREATOR")
    console.log(sku)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    for(let i = 0; i < sku.man_lines.length; i++) {
        sku.man_lines[i] = sku.man_lines[i].id;
    }
      console.log(sku.man_lines)
    return (dispatch) => {
      return axios.post(hostname + 'sku/', {
        ...sku
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: SKU_DET_ADD_SKU,
          data: response.data
        })
      })
      .catch(error => {
        let message;
        if(error.error !== undefined){
          message = error.error
        }else{
          message = "SKU Conflicts"
        }
        dispatch({
          type: SKU_DET_ADD_ERROR,
          data: createError(message)
        })
      });
    }
  }

  export const skuDetAddError = (err) => {
    console.log("SKU_DET_ADD_ERROR ACTION CREATOR")
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_ADD_ERROR,
        data: err
      })
    }
  }
  
  export const skuDetDeleteError = (err) => {
    console.log("SKU_DET_DELETE_ERROR ACTION CREATOR")
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_DELETE_ERROR,
        data: err
      })
    }
  }

  export const skuDetSetNew = (newVal) => {
    console.log("SKU_DET_SET_NEW ACTION CREATOR")
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_SET_NEW,
        data: newVal
      })
    }
  }

  export const skuDetSetValid = (validity) => {
    console.log("SKU_DET_SET_VALID ACTION CREATOR")
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_SET_VALID,
        data: validity
      })
    }
  }

  export const skuDetSetEditing = (editing) => {
    console.log("SKU_DET_SET_EDITING ACTION CREATOR")
    return (dispatch) => {
      return dispatch({
        type: SKU_DET_SET_EDITING,
        data: editing
      })
    }
  }

