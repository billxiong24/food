import { FETCH_GITHUB_DATA, GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import { USER_LOG_IN_ATTEMPT, USER_CREATE_ATTEMPT } from './UserActionTypes';
import { ROUTERS_ROUTE_TO_PAGE } from './RoutingActionTypes';
import { ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
    ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING } from './IngredientActionTypes';
import { SKU_ADD_FILTER, SKU_REMOVE_FILTER, SKU_SEARCH, SKU_SORT_BY,
    SKU_GET_ING, SKU_ADD_ING, SKU_DELETE_ING, SKU_ADD_SKU, SKU_UPDATE_SKU,
    SKU_DELETE_SKU } from './SkuActionType';
import { PRDLINE_ADD_PRDLINE, PRDLINE_UPDATE_PRDLINE, PRDLINE_DELETE_PRDLINE, PRDLINE_SEARCH } from './ProductLineActionTypes';
import labels from "../../Resources/labels";
import axios from 'axios';

const hostname = 'http://cmdev.colab.duke.edu:8000/';

export const getDummyIngredients = () => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/dummyData')
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

/*
========================================================( SKUs Action Creators )========================================================
*/

export const skuAddFilter = (filter) => {
  return (dispatch) => {
    return dispatch({
      type: SKU_ADD_FILTER,
      data: filter
    })
  }
}

export const skuRemoveFilter = (filter) => {
  return (dispatch) => {
    return dispatch({
      type: SKU_REMOVE_FILTER,
      data: filter
    })
  }
}

export const skuSearch = (filters) => {
  return (dispatch) => {
    return axios.get(hostname + 'sku/search', {
      query: {
        name:filters.filter((el)=>{return el.type === labels.skus.filter_type.SKU_NAME}).map((a)=>{return a.string}),
        ingredients:filters.filter((el)=>{return el.type === labels.skus.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
        prodlines:filters.filter((el)=>{return el.type === labels.skus.filter_type.PRODUCT_LINE}).map((a)=>{return a.string}),
      }
    })
    .then(response => {
      dispatch({
        type: SKU_SEARCH,
        data: {
          items: response.data,
          errMsg: ''
        }
      })
    })
    .catch(error => {
      throw(error);
    })
  }
}

// Need to do something, probably involved with search
export const skuSortBy = (category) => {
  return (dispatch) => {
    return dispatch({
      type: SKU_SORT_BY,
      data: category
    })
  }
}

export const skuGetIng = (sku) => {
  return (dispatch) => {
    return axios.get(hostname + 'sku/' + sku.case_upc + '/ingredients')
    .then((response) => {
      dispatch({
        type: SKU_GET_ING,
        data: {
          ingredients: response.data,
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 400) {
        dispatch({
          type: SKU_GET_ING,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: SKU_GET_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

export const skuAddIng = (sku, ing) => {
  return (dispatch) => {
    return axios.post(hostname + 'sku/' + sku.case_upc + '/ingredients', ing)
    .then((reponse)=>{
      dispatch({
        type: SKU_ADD_ING,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err)=>{
      if(err.response.status===400 || err.reponse.status===409) {
        dispatch({
          type: SKU_ADD_ING,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: SKU_ADD_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.reponse);
      }
    });
  }
}

export const skuDeleteIng = (sku, ing) => {
  return (dispatch) => {
    return axios.delete(hostname + 'sku/' + sku.case_upc + 'ingredients', ing)
    .then((response)=>{
      dispatch({
        type: SKU_DELETE_ING,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 400 || err.response.status === 409) {
        dispatch({
          type: SKU_DELETE_ING,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: SKU_DELETE_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const skuAddSku = (sku) => {
  return (dispatch) => {
    return axios.post(hostname + 'sku/', sku)
    .then((result) => {
      dispatch({
        type: SKU_ADD_SKU,
        data: {
          errMsg: ''
        }
      });
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch({
          type: SKU_ADD_SKU,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: SKU_ADD_SKU,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const skuUpdateSku = (sku) => {
  return (dispatch) => {
    return axios.put(hostname + 'sku/' + sku.case_upc, sku)
    .then((result) => {
      dispatch({
        type: SKU_UPDATE_SKU,
        data: {
          errMsg: ''
        }
      });
    })
    .catch((err) => {
      if(err.response.status === 400 || err.response.status === 409) {
        dispatch({
          type: SKU_UPDATE_SKU,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: SKU_UPDATE_SKU,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

export const skuDeleteSku = (sku) => {
  return (dispatch) => {
    return axios.put(hostname + 'sku/' + sku.case_upc)
    .then((response) => {
      dispatch({
        type: SKU_DELETE_SKU,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 400 || err.response.status === 409) {
        dispatch({
          type: SKU_DELETE_SKU,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: SKU_DELETE_SKU,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

/*
========================================================( Ingredients Action Creators )========================================================
*/

export const ingAddFilter = (filter) => {
  return (dispatch) => {
    return dispatch({
      type: ING_ADD_FILTER,
      data: filter
    })
  }
}

export const ingRemoveFilter = (filter) => {
  return (dispatch) => {
    return dispatch({
      type: ING_REMOVE_FILTER,
      data: filter
    })
  }
}

export const ingSearch = (filters) => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/search', {
      query: {
        name: filters.filter((el)=>{return el.type === labels.ingredients.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
        skus: filters.filter((el)=>{return el.type === labels.ingredients.filter_type.SKU_NAME}).map((a)=>{return a.string})
      }
    })
    .then(response => {
      dispatch({
        type: ING_SEARCH,
        data: response.data
      })
    })
    .catch(error => {
      throw(error);
    });
  }
}

// Need to do something, probably involved with search
export const ingSortBy = (category) => {
  return (dispatch) => {
    return dispatch({
      type: ING_SORT_BY,
      data: category
    })
  }
}

export const ingAddIng = (ing) => {
  return (dispatch) => {
    return axios.post(hostname + 'ingredients/', ing)
    .then((response) => {
      dispatch({
          type: ING_ADD_ING,
          data: {
            errMsg: ''
          }
      })
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch({
          type: ING_ADD_ING,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: ING_ADD_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

export const ingGetSkus = (ing) => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/' + ing.name + '/skus')
    .then((response) => {
      dispatch({
        type: ING_GET_SKUS,
        data: {
          skus: response.data,
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 400) {
        dispatch({
          type: ING_GET_SKUS,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: ING_GET_SKUS,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

export const ingUpdateIng = (ing) => {
  return (dispatch) => {
    return axios.put(hostname + 'ingredients/' + ing.name, ing)
    .then((response) => {
      dispatch({
        type: ING_UPDATE_ING,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch({
          type: ING_UPDATE_ING,
          data: {
            errMsg: err.response.data.error
          }}
        );
      } else {
        dispatch({
          type: ING_UPDATE_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

export const ingDeleteIng = (ing) => {
  return (dispatch) => {
    return axios.put(hostname + 'ingredients/' + ing.name, ing)
    .then((response) => {
      dispatch({
        type: ING_DELETE_ING,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch({
          type: ING_DELETE_ING,
          data: {
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: ING_DELETE_ING,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

/*
========================================================( Product Line Action Creators )========================================================
*/

export const prdlineSearch = (name) => {
  return (dispatch) => {
    return axios.get(hostname + 'productline/search', {
      params: {
        name: name
      }
    })
    .then(response => {
      dispatch({
        type: PRDLINE_SEARCH,
        data: {
          productLines: response.data,
          errMsg: ''
        }
      })
    })
    .catch(error => {
      throw(error);
    })
  }
}

export const prdlineAddPrdline = (prdline) => {
  return (dispatch) => {
    return axios.post(hostname + 'productline/', prdline)
    .then((response) => {
      dispatch({
        type: PRDLINE_ADD_PRDLINE,
        data: {
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      console.log(err);
      if(err.response.status === 409) {
        dispatch({
          type: PRDLINE_ADD_PRDLINE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: PRDLINE_ADD_PRDLINE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    });
  }
}

export const prdlineUpdatePrdline = (prdline) => {
  return (dispatch) => {
    return axios.put(hostname + 'productline/' + prdline.oldname, {
      name: prdline.name
    })
    .then((response) => {
      delete prdline.oldname;
      dispatch({
        type: PRDLINE_UPDATE_PRDLINE,
        data: {
          productLineToUpdate: prdline,
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 400) {
        dispatch({
          type: PRDLINE_UPDATE_PRDLINE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: PRDLINE_UPDATE_PRDLINE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        })
        throw(err.response);
      }
    })
  }
}

export const prdlineDeletePrdline = (prdline) => {
  return (dispatch) => {
    return axios.delete(hostname + 'productline/' + prdline.name)
    .then((response) => {
      dispatch({
        type: PRDLINE_DELETE_PRDLINE,
        data: {
          productLineToDelete: prdline,
          errMsg: ''
        }
      })
    })
    .catch((err) => {
      if(err.response.status === 409) {
        dispatch({
          type: PRDLINE_DELETE_PRDLINE,
          data: {
            errMsg: err.response.data.error
          }
        })
      } else {
        dispatch({
          type: PRDLINE_DELETE_PRDLINE,
          data: {
            errMsg: 'Something unexpected went wrong'
          }
        });
        throw(err.response);
      }
    })
  }
}

/*
========================================================( Routing Action Creators )========================================================
*/

// Temporary Routing for now
export const routeToPage = (val) => {
  return (dispatch) => {
    return dispatch({
      type: ROUTERS_ROUTE_TO_PAGE,
      data: val
    })
  }
};

/*
========================================================( Users Action Creators )========================================================
*/

// User Creation
export const userCreateAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.put(hostname + 'users/' + dataObj.uname, {
      uname: dataObj.uname,
      password: dataObj.password
    })
    .then(response => {
      dispatch({
        type: USER_CREATE_ATTEMPT,
        data: {
          isSuccess: true,
          errMsg: ''
        }
      });
    })
    .catch(err => {
      if(err.response.status == 400 || err.response.status == 409) {
        dispatch({
          type: USER_CREATE_ATTEMPT,
          data: {
            isSuccess: false,
            errMsg: err.response.data.error
          }
        });
      } else {
        dispatch({
          type: USER_LOG_IN_ATTEMPT,
          data: {
            errMsg: "Something unexpected went wrong"
          }
        });
        throw(err.response);
      }
    })
  }
}

// User Authentication
export const userLoginAttempt = (dataObj) => {
  return (dispatch) => {
    return axios.post(hostname + 'users/', {
      uname: dataObj.uname,
      password: dataObj.password
    })
    .then(response => {
      dispatch({
        type: USER_LOG_IN_ATTEMPT,
        data: {
          uname: response.data.uname,
          errMsg: ''
        }
      });
    })
    .catch(error => {
      let msg = '';
      if(error.response.status == 400) {
        if(error.response.data.error == "User Doesn't Exist") {
          msg = "Incorrect Username or Password";
        } else {
          msg = "Incorrect Password";
        }
        dispatch({
          type: USER_LOG_IN_ATTEMPT,
          data: {
            errMsg: msg
          }
        });
      } else {
        dispatch({
          type: USER_LOG_IN_ATTEMPT,
          data: {
            errMsg: "Something unexpected went wrong"
          }
        });
        throw(error.response);
      }
    });
  }
}