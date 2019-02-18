import { GET_INGREDIENTS_DUMMY_DATA } from './ActionTypes';
import { ROUTERS_ROUTE_TO_PAGE } from './RoutingActionTypes';
import { ING_ADD_DEPENDENCY, ING_REMOVE_DEPENDENCY, ING_ADD_FILTER, ING_REMOVE_FILTER, ING_SEARCH, ING_SORT_BY,
  ING_ADD_ING, ING_GET_SKUS, ING_UPDATE_ING, ING_DELETE_ING, ING_SET_FILTER_TYPE, ING_ADD_ERROR, ING_DELETE_ERROR, ING_ADD_ING_TO_DEP_REPORT } from './IngredientActionTypes';
import { SKU_ADD_FILTER, SKU_REMOVE_FILTER, SKU_SEARCH, SKU_SORT_BY,
    SKU_GET_ING, SKU_ADD_ING, SKU_DELETE_ING, SKU_ADD_SKU, SKU_UPDATE_SKU,
    SKU_DELETE_SKU, 
    SKU_SET_FILTER_TYPE,
    SKU_ING_NAME_AUTOCOMPLETE,
    SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE,
    SKU_ADD_ERROR,
    SKU_DELETE_ERROR} from './SkuActionType';
import { PRDLINE_CHANGE_LIMITS, PRDLINE_NEXT_PAGE, PRDLINE_PREV_PAGE, PRDLINE_ADD_PRDLINE, PRDLINE_UPDATE_PRDLINE, PRDLINE_DELETE_PRDLINE, PRDLINE_SEARCH } from './ProductLineActionTypes';
import labels from "../../Resources/labels";
import axios from 'axios';
import common from "../../Resources/common";
import {store} from "../../index"

const hostname = common.hostname;

export const getDummyIngredients = () => {
  return (dispatch) => {
    return dispatch({
      type: "HUHUHU",
      data: "HUHUH"
    })
  }
};

/*
========================================================( SKUs Action Creators )========================================================
*/

export const ingredientNameAutocomplete = (name) => {
  console.log("SKU_ING_NAME_AUTOCOMPLETE ACTION CREATOR")
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
      dispatch({
        type: SKU_ING_NAME_AUTOCOMPLETE,
        data: response.data
      })
    })
    .catch(error => {
      throw(error);
    });
  }
}

export const productLineNameAutoComplete = (name) => {
  console.log("SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE ACTION CREATOR")
  console.log(name)
  return (dispatch) => {
    return axios.get(hostname + 'productline/search', {
      params: {
        name: name
      }
    })
    .then(response => {
      dispatch({
        type: SKU_PRODUCT_LINE_NAME_AUTOCOMPLETE,
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

export const skuSearch = (offset) => {
  console.log("SKU_SEARCH ACTION CREATOR")
  console.log(store.getState().skus.filters)
  console.log(labels.skus.sort_by_map[store.getState().skus.sortby])
  console.log(store.getState().skus.limit)
  console.log(store.getState().skus.offset)
  let params;
  let full = store.getState().skus.full
  if(offset === undefined){
    offset = 0
    console.log("Regular Request")
  }else if(offset == -1){
    offset = 0
    full = true
    console.log("Full Request")
  }else if(offset == -2){
    offset = 0
    full = false
    console.log("Full Request")
  }else{
  }
  if(full){
    params = {
      names:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.SKU_NAME}).map((a)=>{return a.string}),
      ingredients:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
      prodlines:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.PRODUCT_LINE}).map((a)=>{return a.string}),
      orderKey:labels.skus.sort_by_map[store.getState().skus.sortby],
      offset,
    }
  }else{
    params = {
      names:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.SKU_NAME}).map((a)=>{return a.string}),
      ingredients:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
      prodlines:store.getState().skus.filters.filter((el)=>{return el.type === labels.skus.filter_type.PRODUCT_LINE}).map((a)=>{return a.string}),
      orderKey:labels.skus.sort_by_map[store.getState().skus.sortby],
      limit: store.getState().ingredients.limit + 1,
      offset,
    }
  }
  return (dispatch) => {
    return axios.get(hostname + 'sku/search', {
      params
    })
      .then(response => {
        dispatch({
          type: SKU_SEARCH,
          data: {
            items: response.data,
            errMsg: '',
            other:response
          },
          offset,
          full
        })
      })
      .catch(error => {
        throw (error);
      })
  }
}

// Need to do something, probably involved with search
export const skuSetFilterType = (filter_type) => {
  return (dispatch) => {
    return dispatch({
      type: SKU_SET_FILTER_TYPE,
      data: filter_type
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
        if (err.response.status === 400) {
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
          throw (err.response);
        }
      });
  }
}

export const skuAddIng = (sku, ing) => {
  return (dispatch) => {
    return axios.post(hostname + 'sku/' + sku.case_upc + '/ingredients', ing)
      .then((reponse) => {
        dispatch({
          type: SKU_ADD_ING,
          data: {
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 400 || err.reponse.status === 409) {
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
          throw (err.reponse);
        }
      });
  }
}

export const skuDeleteIng = (sku, ing) => {
  return (dispatch) => {
    return axios.delete(hostname + 'sku/' + sku.case_upc + 'ingredients', ing)
      .then((response) => {
        dispatch({
          type: SKU_DELETE_ING,
          data: {
            errMsg: ''
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 400 || err.response.status === 409) {
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
          throw (err.response);
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
        if (err.response.status === 409) {
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
          throw (err.response);
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
        if (err.response.status === 400 || err.response.status === 409) {
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
          throw (err.response);
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
        if (err.response.status === 400 || err.response.status === 409) {
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
          throw (err.response);
        }
      });
  }
}

export const skuAddError = (err) => {
  console.log("SKU_ADD_ERROR ACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: SKU_ADD_ERROR,
      data: err
    })
  }
}

export const skuDeleteError = (err) => {
  console.log("SKU_DELETE_ERROR ACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: SKU_DELETE_ERROR,
      data: err
    })
  }
}

/*
========================================================( Ingredients Action Creators )========================================================
*/
export const ingRemoveDependency = (ing) => {
  return (dispatch) => {
    return dispatch({
      type: ING_REMOVE_DEPENDENCY,
      data: ing
    })
  }
}

export const ingAddDependency = (ing) => {
  return (dispatch) => {
    return axios.get(hostname + 'ingredients/' + ing.id + '/skus')
      .then((response) => {
        dispatch({
          type: ING_ADD_DEPENDENCY,
          data: {
            ingDependency: {
              ...ing,
              skus: response.data
            }
          }
        })
      })
      .catch((err) => {
        if (err.response.status === 400) {
          dispatch({
            type: ING_ADD_DEPENDENCY,
            data: {
              errMsg: err.response.data.error
            }
          });
        } else {
          dispatch({
            type: ING_ADD_DEPENDENCY,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      })
  }
}


export const ingAddFilter = (filter) => {
  return (dispatch) => {
    return dispatch({
      type: ING_ADD_FILTER,
      data: filter
    })
  }
}

export const ingRemoveFilter = (filter_id) => {
  console.log("filter delete action")
  console.log("filter_id:" + filter_id)
  return (dispatch) => {
    return dispatch({
      type: ING_REMOVE_FILTER,
      filter_id
    })
  }
}

export const ingSearch = (offset) => {
  console.log("ING SEARCH ACTION CREATOR")
  console.log(labels.ingredients.sort_by_map[store.getState().ingredients.sortby])
  console.log(store.getState().ingredients.limit)
  console.log(store.getState().ingredients.offset)
  let params;
  let full = store.getState().ingredients.full
  if(offset === undefined){
    offset = 0
    console.log("Regular Request")
  }else if(offset == -1){
    offset = 0
    full = true
    console.log("Full Request")
  }else if(offset == -2){
    offset = 0
    full = false
    console.log("Full Request")
  }else{
  }
  if(full){
    params = {
      names:store.getState().ingredients.filters.filter((el)=>{return el.type === labels.ingredients.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
      skus: store.getState().ingredients.filters.filter((el)=>{return el.type === labels.ingredients.filter_type.SKU_NAME}).map((a)=>{return a.id}),
      orderKey:labels.ingredients.sort_by_map[store.getState().ingredients.sortby],
      offset,
    }
  }else{
    params = {
      names:store.getState().ingredients.filters.filter((el)=>{return el.type === labels.ingredients.filter_type.INGREDIENTS}).map((a)=>{return a.string}),
      skus: store.getState().ingredients.filters.filter((el)=>{return el.type === labels.ingredients.filter_type.SKU_NAME}).map((a)=>{return a.id}),
      orderKey:labels.ingredients.sort_by_map[store.getState().ingredients.sortby],
      limit: store.getState().ingredients.limit + 1,
      offset,
    }
  }
  console.log(store.getState().ingredients.filters)
  console.log(params)
  return (dispatch) => {
    console.log("AXIOS")
    console.log(params)
    return axios.get(hostname + 'ingredients/search', {
      params
    })
      .then(response => {
        console.log(response)
        dispatch({
          type: ING_SEARCH,
          data: response.data,
          other:response,
          offset,
          full
        })
      })
      .catch(error => {
        throw (error);
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

// Need to do something, probably involved with search
export const ingSetFilterType = (filter_type) => {
  return (dispatch) => {
    return dispatch({
      type: ING_SET_FILTER_TYPE,
      data: filter_type
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
        if (err.response.status === 409) {
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
          throw (err.response);
        }
      });
  }
}

export const ingAddToDependencyReport = (ing) => {
  return (dispatch) => {
    return dispatch({
      type: ING_ADD_ING_TO_DEP_REPORT,
      data: ing
    })
  }
}

export const ingGetSkus = (ing) => {
  // return (dispatch) => {
  //   return axios.get(hostname + 'ingredients/' + ing + '/skus')
  //   .then((response) => {
  //     dispatch({
  //       type: ING_GET_SKUS,
  //       data: {
  //         skus: response.data,
  //         errMsg: ''
  //       }
  //     })
  //   })
  //   .catch((err) => {
  //     if(err.response.status === 400) {
  //       dispatch({
  //         type: ING_GET_SKUS,
  //         data: {
  //           errMsg: err.response.data.error
  //         }
  //       });
  //     } else {
  //       dispatch({
  //         type: ING_GET_SKUS,
  //         data: {
  //           errMsg: 'Something unexpected went wrong'
  //         }
  //       });
  //       throw(err.response);
  //     }
  //   });
  // }
  return (dispatch) => {
    let params = {
      names:[ing],
      ingredients: [],
      prodlines: [],
    }
    console.log(params)
    return axios.get(hostname + 'sku/search', {
      params
    })
    .then(response => {
      dispatch({
        type: ING_GET_SKUS,
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
        if (err.response.status === 409) {
          dispatch({
            type: ING_UPDATE_ING,
            data: {
              errMsg: err.response.data.error
            }
          }
          );
        } else {
          dispatch({
            type: ING_UPDATE_ING,
            data: {
              errMsg: 'Something unexpected went wrong'
            }
          });
          throw (err.response);
        }
      });
  }
}

export const ingDeleteIng = (ing) => {
  return (dispatch) => {
    return axios.delete(hostname + 'ingredients/' + ing.id)
    .then((response) => {
      dispatch({
        type: ING_DELETE_ING,
        data: {
          errMsg: ''
        }
      })
    })
      .catch((err) => {
        if (err.response.status === 409) {
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
          throw (err.response);
        }
      });
  }
}



// Need to do something, probably involved with search
export const ingAddError = (err) => {
  console.log("ING_ADD_ERROR ACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: ING_ADD_ERROR,
      data: err
    })
  }
}

export const ingDeleteError = (err) => {
  console.log("ING_DELETE_ERROR ACTION CREATOR")
  return (dispatch) => {
    return dispatch({
      type: ING_DELETE_ERROR,
      data: err
    })
  }
}

/*
========================================================( Product Line Action Creators )========================================================
*/

export const prdlineChangeLimit = (val) => {
  return (dispatch) => {
    return dispatch({
      type: PRDLINE_CHANGE_LIMITS,
      data: {
        limit: val
      }
    })
  }
}

export const prdlinePrevPage = () => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    return dispatch({
      type: PRDLINE_NEXT_PAGE,
      data: {
        current_page_number: curPage === 1 ? curPage : curPage - 1,
      }
    })
  }
}

export const prdlineNextPage = () => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    return dispatch({
      type: PRDLINE_PREV_PAGE,
      data: {
        current_page_number: curPage === store.getState().productLine.total_pages ? curPage : curPage + 1,
      }
    })
  }
}

export const prdlineSearch = (name) => {
  return (dispatch) => {
    const curPage = store.getState().productLine.current_page_number;
    const limit = store.getState().productLine.limit;
    let offset = limit ? (curPage - 1) * limit : 0;
    return axios.get(hostname + 'productline/search', {
      params: {
        names: name,
        offset: offset,
        limit: limit,
      }
    })
      .then(response => {
        let totalRows = response.data.length > 0 ? response.data[0].row_count : 0;
        dispatch({
          type: PRDLINE_SEARCH,
          data: {
            productLines: response.data,
            total_pages: Math.ceil(totalRows / limit),
            errMsg: '',
          }
        })
      })
      .catch(error => {
        throw (error);
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
        if (err.response.status === 409) {
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
          throw (err.response);
        }
      });
  }
}

export const prdlineUpdatePrdline = (prdline) => {
  return (dispatch) => {
    return axios.put(hostname + 'productline/' + prdline.id, prdline)
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
        if (err.response.status === 400) {
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
          throw (err.response);
        }
      })
  }
}

export const prdlineDeletePrdline = (prdline) => {
  return (dispatch) => {
    return axios.delete(hostname + 'productline/' + prdline.id)
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
        if (err.response.status === 409) {
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
          throw (err.response);
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