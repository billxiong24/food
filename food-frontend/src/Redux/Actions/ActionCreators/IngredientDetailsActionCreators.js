import axios from 'axios';
import common from '../../../Resources/common';
import { ING_DET_UPDATE_ING } from '../IngredientDetailsActionTypes';

const hostname = common.hostname;

export const ingDetUpdateIng = (ing) => {
    return (dispatch) => {
      return axios.put(hostname + 'ingredients/' + ing.name, ing)
      .then((response) => {
        dispatch({
          type: ING_DET_UPDATE_ING,
          data: {
            errMsg: ''
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