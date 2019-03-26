import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import FilterList from './FilterList';
import SKUList from './SKUList';
import FilterDropdown from './FilterDropdown';
import SortByDropdown from './SortByDropdown';
import PageSelector from './PageSelector';
import SKUsPageSearchBar from './SKUsPageSearchBar';
import { withRouter } from 'react-router-dom'
import { skuDetSetSku, skuDetGetProductLine, skuDetSetNew, skuDetSetEditing } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { skuDeleteError, skuSearch } from '../../Redux/Actions';
import { skuAddAllSelected, skuRemoveAllSelected } from '../../Redux/Actions/index';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common, { defaultErrorCallback, defaultTextErrorCallbackGenerator, defaultNumErrorCallbackGenerator } from '../../Resources/common';
import { withCookies } from 'react-cookie';
import BulkEditDialog from './BulkEditDialog';
import { manlineGetMappings, manlineResetMapping, manlineUpdateMappings } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators';
import { Input } from '@material-ui/core';
import InputSelect from '../GenericComponents/InputSelect';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import DetailView from '../GenericComponents/DetailView';
import swal from 'sweetalert';
import InputList from '../GenericComponents/InputList';

const styles = {
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
  },
  SKUs_page_container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  SKUs_list_container: {
    height: '100%',
    width: '73%',
    float: 'right',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center'
  },
  SKUs_list: {
    height: '80vh',
    width: '100%',
    margin: 5,
    padding: 5,
    overflow: 'auto'
  },
  filters_list: {
    overflow: 'auto'
  },
  active_filters_container: {
    height: '85vh',
    width: '23%',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 12,
    backgroundColor: '#6F3AD3',
    flexDirection: 'column',
    display: 'flex',
    borderRadius: 12,
    overflow: 'auto'
  },
  active_filters_container_title: {
    color: 'white',
    fontSize: '16px',
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    textAlign: 'left',
    margin: 8
  },
  SKUs_list_divider: {
    width: '90%',
    backgroundColor: 'gray',
    height: '2px',
    margin: 10
  },
  page_number_text: {
    color: 'gray',
    margin: 5
  },
  SKUs_search_bar: {
    flexDirection: 'row',
    display: 'flex'
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex'
  },
  button: {
  },
  input: {
    display: 'none',
  },
  autosuggest: {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 300
  },
  other_actions: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  add_ingredient: {
    marginRight: 'auto'
  },
  export_to_csv: {
    marginLeft: 'auto'
  }
};

class SKUsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bulkEditDialog: false,
    }
  }

  componentWillMount() {
  }

  onAddClick = () => {
    this.props.setSKU(this.props.history)
  }

  onExportClick = () => {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.items.map((sku) => ({
        id: sku.id,
        num: sku.num,
        name: sku.name,
        case_upc: sku.case_upc,
        unit_upc: sku.unit_upc,
        unit_size: sku.unit_size,
        count_per_case: sku.count_per_case,
        prd_line: sku.prd_line,
        formula_id: sku.formula_id,
        man_rate: sku.man_rate,
        formula_scale: sku.formula_scale,
        comments: sku.comments
      })),
      format: "csv",
      type: "sku"
    })
      .then((response) => {
        FileDownload(response.data, 'skus.csv');
      })
      .catch(err => {
        // console.log(err);
      })
  }

  openBulkEdit() {
    this.props.manlineGetMappings(this.props.selected)
    this.setState({ bulkEditDialog: true })
  }

  closeBulkEdit() {
    this.props.manlineResetMapping();
    this.setState({ bulkEditDialog: false })
  }

  submitBulkEdit = () => {
    this.props.manlineUpdateMappings();
    this.closeBulkEdit();
  }

  openSKUCreatePage = () => {
    axios.get(`${common.hostname}sku/init_sku`)
      .then(res => {
        // console.log(res)
        this.setState({
          createDialog: true,
          defaultNum: res.data.num,
          defaultCaseUPC: res.data.case_upc,
          defaultUnitUPC: res.data.unit_upc,
          defaultFormulas: res.data.formulas,
          defaultProdLines: res.data.prod_lines.map(prod_line => prod_line.label),
          defaultManLines: res.data.man_lines
        })
      })
  }

  suggestionsApi = (value) => {
    return axios.get(`${common.hostname}formula/formula_autocomplete`)
  }

  openCreatePage = (closeCallBack, defaultName) => {
    return axios.get(`${common.hostname}formula/init_formula`).then( (res) => {
        // console.log(res)
        // console.log("defaultName")
        // console.log(defaultName)
        return (
          <DetailView
            open={true}
            close={closeCallBack}
            onSubmit={(form_data) => {
              let item = {}
              let isError = false
              for (var property in form_data) {
                  if (form_data.hasOwnProperty(property)) {
                      if(property.includes("pkg_size") && !property.includes("errorMsg")){
                          // console.log(property)
                          // console.log(this.state[property])
                          item["pkg_size"] = form_data[property].split(" ")[0]
                          item["unit"] = form_data[property].split(" ")[1]
                      }else if(!property.includes("errorMsg")){
                          item[property] = form_data[property]
                      }else{
                          isError = isError || form_data[property] != null
                      }
                  }
                  // if (this.state.hasOwnProperty(property)) {
                  //     // console.log(String(property).contains(""))
                  // }
              }
                  if(isError){
                      swal(`There are unresolved errors`,{
                          icon: "error",
                      });
                  }else{
                      console.log(item.ingredients)
                      let ingredientso = item.ingredients.map(ing => {
                        return {
                        ingredients_id:ing.id,
                        quantity: ing.quantity,
                        unit: "kg"
                      }
                    })
                    console.log(ingredients)
                      console.log(item)
                      let that = this
                      const {ingredients, ...new_formula_data} = item
                      new_formula_data.num = parseInt(new_formula_data.num)
                      console.log(ingredients)
                      axios.post(`${common.hostname}formula/`, new_formula_data)
                      .then(function (response) {
                          //that.props.submit(item)
                          axios.post(`${common.hostname}formula/${response.data.id}/ingredients`, {ingredients:ingredientso})
                            .then(function (response) {
                                console.log(response)
                                swal({
                                    icon: "success",
                                });
                                closeCallBack()
                                
                            })
                            .catch(function (error) {
                                swal(`${error}`,{
                                    icon: "error",
                                });
                            });
                                
                      })
                      .catch(function (error) {
                          swal(`${error}`,{
                              icon: "error",
                          });
                      });
                    
                  }
                  
              }}
            title={"Create Formula"}
        >
            <Input
                id="name"
                name={"Name"}
                defaultValue = {defaultName}
                errorCallback={defaultTextErrorCallbackGenerator("Name is invalid")}
            />
            <Input
                  id="num"
                  rows="4"
                  type="number"
                  name={"Number"}
                  defaultValue={res.data.num}
                  errorCallback={this.formulaNumErrorCallback}
              />
              <InputList
                    id="ingredients"
                    item={res.data.ingredients[0].label}
                    items={res.data.ingredients}
                    name={"Ingredient List"}
                    errorCallback={defaultNumErrorCallbackGenerator("Invalid Quantity")}
                />
              <Input
                  id="comment"
                  rows="4"
                  multiline
                  type="number"
                  name={"Comment"}
                  errorCallback={defaultErrorCallback}
              />
        </DetailView>
      )
      }
    )
}

openEditPage = (closeCallBack) => {
  let init_data;
  let formula_data
  let formula
  return axios.get(`${common.hostname}formula/init_formula`)
  .then( (res) => {
      console.log(res)
      init_data = res.data
      return axios.get(`${common.hostname}formula/${this.state.id}`).then((res) => {
        console.log(res)
        formula_data = res.data[0]
        formula = formula_data
        return axios.get(`${common.hostname}formula/${this.state.id}/ingredients`).then((res) => {
          console.log(res)
          return (
            <DetailView
                open={true}
                close={closeCallBack}
                onSubmit={(form_data) => {
                  let item = {}
                  let isError = false
                  for (var property in form_data) {
                      if (form_data.hasOwnProperty(property)) {
                          if(property.includes("pkg_size") && !property.includes("errorMsg")){
                              // console.log(property)
                              // console.log(this.state[property])
                              item["pkg_size"] = form_data[property].split(" ")[0]
                              item["unit"] = form_data[property].split(" ")[1]
                          }else if(!property.includes("errorMsg")){
                              item[property] = form_data[property]
                          }else{
                              isError = isError || form_data[property] != null
                          }
                      }
                      // if (this.state.hasOwnProperty(property)) {
                      //     // console.log(String(property).contains(""))
                      // }
                  }
                      if(isError){
                          swal(`There are unresolved errors`,{
                              icon: "error",
                          });
                      }else{
                          console.log(item)
                          console.log(item.ingredients)
                          let ingredientso = item.ingredients.map(ing => {
                            return {
                            ingredients_id:ing.id,
                            quantity: ing.quantity,
                            unit: "kg"
                          }
                        })
                        console.log(ingredientso)
                          console.log(item)
                          let that = this
                          const {ingredients, ...new_formula_data} = item
                          new_formula_data.num = parseInt(new_formula_data.num)
                          console.log(ingredients)
                          axios.put(`${common.hostname}formula/${formula.id}`, new_formula_data)
                          .then(function (response) {
                              //that.props.submit(item)
                              axios.post(`${common.hostname}formula/${formula.id}/ingredients`, {ingredients:ingredientso})
                                .then(function (response) {
                                    console.log(response)
                                    swal({
                                        icon: "success",
                                    });
                                    closeCallBack()
                                    
                                    
                                })
                                .catch(function (error) {
                                    swal(`${error}`,{
                                        icon: "error",
                                    });
                                });
                                
                                    
                          })
                          .catch(function (error) {
                              swal(`${error}`,{
                                  icon: "error",
                              });
                          });
                        
                      }
                      
                  }}
                handleChange={() => console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Edit Formula"}
            >
                <Input
                    id="name"
                    name={"Name"}
                    defaultValue={formula_data.name}
                    errorCallback={defaultTextErrorCallbackGenerator("Name is invalid")}

                />
                <Input
                      id="num"
                      rows="4"
                      type="number"
                      name={"Number"}
                      defaultValue={formula_data.num}
                      errorCallback={this.formulaNumErrorCallbackGenerator(formula_data.num)}
                  />
                  <InputList
                        id="ingredients"
                        item={init_data.ingredients[0].label}
                        items={init_data.ingredients}
                        list={res.data.map((item) => {
                          return {
                            label:item.name,
                            quantity: item.quantity,
                            id:item.id
                          }
                        })}
                        name={"Ingredient List"}
                        errorCallback={defaultNumErrorCallbackGenerator("Invalid Quantity")}
                    />
                  <Input
                      id="comment"
                      rows="4"
                      multiline
                      type="number"
                      name={"Comment"}
                      defaultValue={formula_data.comment}
                      errorCallback={this.errorCallback}
                  />
            </DetailView>
        )
      })
    }
  )
}
  )
}



skuNumErrorCallback = (value, prop, callBack) => {
      axios.put(`${common.hostname}sku/valid_num`,{num:parseInt(value)}).then((res) =>{
        let error
        if(res.data.valid){
          error = null
        }else{
          error = "Invalid Number"
        }
        return {
          prop,
          error
        }
      })
      .then(callBack)
  }

  caseUPCNumErrorCallback = (value, prop, callBack) => {
  
        axios.put(`${common.hostname}sku/valid_case_upc`,{case_upc:parseInt(value)}).then((res) =>{
          // console.log(parseInt(value))
          // console.log(res)
          let error
          if(res.data.valid){
            error = null
          }else{
            error = "Invalid Case UPC"
          }
          return {
            prop,
            error
          }
        })
        .then(callBack)
      }


  unitUPCNumErrorCallback = (value, prop, callBack) => {
        axios.put(`${common.hostname}sku/valid_unit_upc`,{unit_upc:parseInt(value)}).then((res) =>{
          // console.log(parseInt(value))
          // console.log(res)
          let error
          if(res.data.valid){
            error = null
          }else{
            error = "Invalid Unit UPC"
          }
          return {
            prop,
            error
          }
        })
        .then(callBack)
    }

    skuFormulaIdCallback = (value, prop, callBack) => {
      Promise.resolve("Success")
      .then(()=>{
        if(value == ""){
          return {
            error: "Formula is Empty",
            prop
          }
        }
        if(this.state.id == null){
          return {
            error: "Please Create Formula",
            prop
          }
        }
        return {
          error: null,
          prop
        }
      })
    .then(callBack)
    }
    
    formulaNumErrorCallbackGenerator = (num) => {
      return (value, prop, callBack) => {
          axios.put(`${common.hostname}formula/valid_num`,{num:parseInt(value)}).then((res) =>{
            let error
            // console.log("hello")
            // console.log(value)
            // console.log(num)
            if(res.data.valid || num==parseInt(value)){
              error = null
            }else{
              error = "Invalid Number"
            }
            return {
              prop,
              error
            }
          })
          .catch((error) => {
            return {
              error: "Invalid Number",
              prop
            }
          })
          .then(callBack)
        }
      }

      formulaNumErrorCallback = (value, prop, callBack) => {

            axios.put(`${common.hostname}formula/valid_num`,{num:parseInt(value)}).then((res) =>{
              let error
              if(res.data.valid){
                error = null
              }else{
                error = "Invalid Number"
              }
              return {
                prop,
                error
              }
            })
            .catch((error) => {
              // console.log("error")
              return {
                error: "Invalid Number",
                prop
              }
            })
            .then(callBack)
          }
  



errorCallback = (value) => {
    // value = String(value)
    // if(value.includes("12")){
    //     return "Input cannot contain 12"
    // }else{
    //     return null
    // }
    return null
}


  render(){
    //// console.log(defaultErrorCallback)
    const { classes, dummy_SKUs } = this.props
    return (
      <div className={classes.SKUs_page_container}>
        <Card className={classes.active_filters_container}>
          <Typography className={classes.active_filters_container_title}>
            Search Bar Filter Type
        </Typography>
          <FilterDropdown></FilterDropdown>
          <Typography className={classes.active_filters_container_title}>
            Sort By
          </Typography>
          <SortByDropdown></SortByDropdown>
          <Typography className={classes.active_filters_container_title}>
            Active Filters
          </Typography>
          <FilterList></FilterList>
        </Card>
        <div className={classes.SKUs_list_container}>
          <div className={classes.SKUs_list}>
            <SKUsPageSearchBar></SKUsPageSearchBar>
            <div className={classes.SKUs_search_bar}>
            </div>
            <div className={classes.other_actions}>
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={this.openSKUCreatePage}
                    variant="contained"
                    >
                    Add SKU
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.props.addAllFilter() }}
                    variant="contained"
                  >
                    Select All
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.props.removeAllFilter() }}
                    variant="contained"
                  >
                    Unselect All
                  </Button>
                  :
                  <div></div>
              }
              {
                this.props.cookies.admin === "true" ?
                  <Button
                    className={classes.add_ingredient}
                    onClick={() => { this.openBulkEdit() }}
                    variant="contained"
                  >
                    Bulk Edit Manufacturing Line
                  </Button>
                  :
                  <div></div>
              }
              <BulkEditDialog
                open={this.state.bulkEditDialog}
                close={() => { this.closeBulkEdit() }}
                submit={this.submitBulkEdit}
              />
              <Button
                className={classes.export_to_csv}
                onClick={this.onExportClick}
                variant="contained"
              >
                Export to CSV
            </Button>
            </div>
            <SKUList></SKUList>
          </div>
          <div variant="inset" className={classes.SKUs_list_divider} />
          <PageSelector></PageSelector>
        </div>
        {
          this.props.errors.map((error, index) => (
            <SimpleSnackbar
              open={true}
              handleClose={() => { this.props.deleteError(error) }}
              message={error.errMsg}
            >
            </SimpleSnackbar>
          ))
        }
        {
          this.state.createDialog ?
          <DetailView
              open={true}
              close={() => {
                this.setState({ createDialog: false });
              }}
              onSubmit={(form_data) => {
                let item = {}
                let isError = false
                for (var property in form_data) {
                    if (form_data.hasOwnProperty(property)) {
                        if(property.includes("pkg_size") && !property.includes("errorMsg")){
                            // console.log(property)
                            // console.log(this.state[property])
                            item["pkg_size"] = form_data[property].split(" ")[0]
                            item["unit"] = form_data[property].split(" ")[1]
                        }else if(!property.includes("errorMsg")){
                            item[property] = form_data[property]
                        }else{
                            isError = isError || form_data[property] != null
                        }
                    }
                    // if (this.state.hasOwnProperty(property)) {
                    //     // console.log(String(property).contains(""))
                    // }
                }
                    if(isError){
                        swal(`There are unresolved errors`,{
                            icon: "error",
                        });
                    }else{
                        console.log(item)
                        let that = this
                        // const {ing_list, ...new_formula_data} = item
                        // new_formula_data.num = parseInt(new_formula_data.num)
                        // console.log(new_formula_data)
                        axios.post(`${common.hostname}sku/`, item)
                        .then(function (response) {
                            //that.props.submit(item)
                            swal({
                                icon: "success",
                            });
                            that.setState({createDialog:false})
                            that.props.search()
                        })
                        .catch(function (error) {
                            swal(`${error}`,{
                                icon: "error",
                            });
                        });
                      
                    }
                    
                }}
              title={"Create SKU"}
              // url={`${common.hostname}sku/`}
            >
              <Input
                  id="name"
                  rows="4"
                  name={"Name"}
                  errorCallback={defaultTextErrorCallbackGenerator("Name is not valid")}
              />
              <Input
                  id="num"
                  rows="4"
                  type="number"
                  name={"Number"}
                  defaultValue={this.state.defaultNum}
                  errorCallback={this.skuNumErrorCallback}
              />
              <Input
                  id="case_upc"
                  type="number"
                  name={"Case UPC"}
                  defaultValue={this.state.defaultCaseUPC}
                  errorCallback={this.caseUPCNumErrorCallback}
              />
              <Input
                  id="unit_upc"
                  type="number"
                  name={"Unit UPC"}
                  defaultValue={this.state.defaultUnitUPC}
                  errorCallback={this.unitUPCNumErrorCallback}
              />
              <Input
                  id="unit_size"
                  error={true}
                  name={"Unit Size"}
                  errorCallback={defaultTextErrorCallbackGenerator("Unit Size is invalid")}
              />
              <Input
                  id="count_per_case"
                  type="number"
                  name={"Count Per Case"}
                  errorCallback={defaultNumErrorCallbackGenerator("Count Per Case is invalid")}
              />
              <InputSelect
                    id="prd_line"
                    item={this.state.defaultProdLines[0]}
                    items={this.state.defaultProdLines}
                    name={"Product Line"}
                    errorCallback={defaultErrorCallback}
              />
              <Input
                  id="comments"
                  rows="4"
                  multiline
                  type="number"
                  name={"Comment"}
                  errorCallback={defaultErrorCallback}
              />
              <InputAutoCompleteOpenPage
                    id="formula_id"
                    name={"Formula"}
                    suggestionsCallback={this.suggestionsApi}
                    openCreatePage={this.openCreatePage}
                    idCallback={(id) => {
                      // console.log(id)
                      this.setState({id:id})
                    }}
                    handleChangerino={(value) => {
                      this.setState({namerino: value})
                    }}
                    openEditPage={this.openEditPage}
                    errorCallback={this.skuFormulaIdCallback}
              />
              <Input
                  id="formula_scale"
                  type="number"
                  name={"Formula Scale Factor"}
                  errorCallback={defaultNumErrorCallbackGenerator("Formula Scale Factor is invalid")}
              />
              <Input
                  id="man_rate"
                  type="number"
                  name={"Manufacturing Rate"}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Rate is invalid")}
              />
              <Input
                  id="man_setup_cost"
                  type="number"
                  name={"Manufacturing Set Up Cost"}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Setup Cost is invalid")}
              />
              <Input
                  id="man_run_cost"
                  type="number"
                  name={"Manufacturing Run Cost"}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Run Cost is invalid")}
              />

            </DetailView>
          :
          null
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dummy_SKUs: state.dummy_SKUs,
    errors: state.skus.errors,
    items: state.skus.items,
    cookies: ownProps.cookies.cookies,
    selected: state.skus.selectedSkus,
    manline: state.manLine,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    deleteError: (error) => {
      dispatch(skuDeleteError(error))
    },
    setSKU: (history) => {
      Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
        .then(function (response) {
          dispatch(skuDetSetSku({
            manufacturing_lines: [],
            formula_id: null,
            name: "",
            case_upc: null,
            unit_upc: null,
            unit_size: "",
            count_per_case: null,
            prd_line: "",
            comments: "",
            id: null
          }))
          dispatch(skuDetSetNew(true))
          dispatch(skuDetSetEditing(true))
          history.push('/skus/details')

          return response;
        })
        .then(function (response) {  })
    },
    addAllFilter: () => { dispatch(skuAddAllSelected()) },
    removeAllFilter: () => { dispatch(skuRemoveAllSelected()) },
    manlineGetMappings: (skus) => {
      dispatch(manlineGetMappings(skus));
    },
    manlineResetMapping: () => {
      dispatch(manlineResetMapping());
    },
    manlineUpdateMappings: () => {
      dispatch(manlineUpdateMappings());
    },
    search: () => {
      dispatch(skuSearch())
    }
  }
}


export default withRouter(withStyles(styles)(withCookies(connect(mapStateToProps, mapDispatchToProps)(SKUsPage))));
