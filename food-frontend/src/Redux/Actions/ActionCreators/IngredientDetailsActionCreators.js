import axios from 'axios';
import common from '../../../Resources/common';
import { ING_DET_UPDATE_ING, ING_DET_SET_INGREDIENT, ING_DET_GET_SKUS } from '../IngredientDetailsActionTypes';

const hostname = common.hostname;

export const ingDetUpdateIng = (ing) => {
    let params = {
        ...ing
    }
    console.log("ING_DET_UPDATE_ING ACTION CREATOR")
    console.log(params)
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
      .catch((err) => {
        if(err.response.status === 409) {
          dispatch({
            type: ING_DET_UPDATE_ING,
            data: {
              errMsg: err.response.data.error
            }}
          );
        } else {
          dispatch({
            type: ING_DET_UPDATE_ING,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw(err.response);
        }
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
    console.log("ING_DET_GET_SKUS ACTION CREATOR")
    console.log(ing_id)
    return (dispatch) => {
      return axios.get(hostname + 'ingredients/'+ing_id+'/skus', {
        
      })
      .then(response => {
        console.log(response)
        dispatch({
          type: ING_DET_GET_SKUS,
          data: response.data
        })
      })
      .catch(error => {
        console.log("error")
        throw(error);
      });
    }
  }