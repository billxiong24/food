import { FETCH_GITHUB_DATA, GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import axios from 'axios';

export const getDummyIngredients = () => {
  return (dispatch) => {
    return axios.get('http://cmdev.colab.duke.edu:8000/ingredients/dummyData')
      .then(response => {
        dispatch(
          {
            type: GET_INGREDIENTS_DUMMY_DATA,
            data: response.data
          }
        )
      })
      .catch(error => {
        throw(error);
      });
  };
};