import axios from 'axios';
import common from '../../../Resources/common';
import { SKU_DET_GET_ING,SKU_DET_ADD_ING ,SKU_DET_UPDATE_SKU ,SKU_DET_DELETE_SKU ,SKU_DET_DELETE_ING ,SKU_DET_SET_SKU, SKU_DET_PRODUCT_LINE_LIST, SKU_DET_INGREDIENT_AUTOCOMPLETE
} from '../SKUDetailActionTypes';

const hostname = common.hostname;

// GET /sku/:id/ingredients
export const skuDetGetIng = (sku_id) => {
    console.log("SKU_DET_GET_ING ACTION CREATOR")
    console.log(sku_id)
    return (dispatch) => {
      return axios.get(hostname + 'sku/'+sku_id+'/ingredients', {
        
      })
      .then(response => {
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
export const skuDetAddIng = (sku_id,ingredients) => {
    console.log("SKU_DET_ADD_ING ACTION CREATOR")
    console.log(sku_id,ingredients)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.post(hostname + 'sku/'+sku_id+'/ingredients', {
        ingredients
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
    console.log("SKU_DET_UPDATE_SKU ACTION CREATOR")
    console.log(sku)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.put(hostname + 'sku/'+sku.id, {
        sku
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
        throw(error);
      });
    }
  }

  // DELETE /sku/:id/
export const skuDetDeleteSku = (sku_id) => {
    console.log("SKU_DET_DELETE_SKU ACTION CREATOR")
    console.log(sku_id)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.delete(hostname + 'sku/'+sku_id, {
        
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
export const skuDetDeleteIng = (sku_id, ingredients) => {
    console.log("SKU_DET_DELETE_ING ACTION CREATOR")
    console.log(sku_id)
    // [{ingred_num: 1, quantity: 1}, {ingred_num: 2, quantity: 2}]
    
    return (dispatch) => {
      return axios.delete(hostname + 'sku/'+sku_id+ '/ingredients',  {
        ingredients
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
              name: ""
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

