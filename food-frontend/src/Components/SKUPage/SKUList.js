import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, Input } from '@material-ui/core';
import { routeToPage, skuAddSelected, skuRemoveSelected, skuSearch } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { skuDetGetManLines, skuDetGetFormula, skuDetSetSku, skuDetGetIng, skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import labels from '../../Resources/labels';
import Checkbox from '@material-ui/core/Checkbox';
import UnitSelect from '../GenericComponents/UnitSelect';
import DetailView from '../GenericComponents/DetailView';
import swal from 'sweetalert';
import axios from 'axios';
import common, { defaultErrorCallback, nameErrorCallback, defaultNumErrorCallback, defaultNumErrorCallbackGenerator, defaultTextErrorCallbackGenerator } from '../../Resources/common';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import InputSelect from '../GenericComponents/InputSelect';
import InputList from '../GenericComponents/InputList';


const styles = {
  entry: {
    width: '100%',
    display:'flex',
    flexDirection:'row',
  },
  card: {
    display:'flex',
    flexGrow: '8',
    marginBottom: 10,
    marginTop: 10,
  },
  cardAction: {
    padding: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
  },
  ingredrient_name: {
    fontSize: 14,
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  ingredient_id: {
    fontSize: 14,
    float: 'right',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    width: '100%'
  }
};

class SKUList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editDialog: null
    }
  }


  componentWillMount() {

  }

  onClick = (item) => {
    this.props.setSku(item)
  }

  handleChange = (sku) => {
    if(this.props.selected.includes(sku.id)) {
      this.props.removeSelected([sku.id]);
    } else {
      this.props.addSelected([sku.id]);
    }
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

  skuNumErrorCallbackGenerator = (num) => {
    return (value, prop, callBack) => {
        axios.put(`${common.hostname}sku/valid_num`,{num:parseInt(value)}).then((res) =>{
          let error
          console.log(num)
          console.log(value)
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
        .then(callBack)
      }
    }

    formulaNumErrorCallbackGenerator = (num) => {
      return (value, prop, callBack) => {
          axios.put(`${common.hostname}formula/valid_num`,{num:parseInt(value)}).then((res) =>{
            let error
            console.log("hello")
            console.log(value)
            console.log(num)
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
              console.log("error")
              return {
                error: "Invalid Number",
                prop
              }
            })
            .then(callBack)
          }
        

    caseUPCNumErrorCallbackGenerator = (case_upc) => {
      return (value, prop, callBack) => {
          axios.put(`${common.hostname}sku/valid_case_upc`,{case_upc:parseInt(value)}).then((res) =>{
            let error
            if(res.data.valid || case_upc==parseInt(value)){
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
      }

      unitUPCNumErrorCallbackGenerator = (unit_upc) => {
        return (value, prop, callBack) => {
            axios.put(`${common.hostname}sku/valid_unit_upc`,{unit_upc:parseInt(value)}).then((res) =>{
              let error
              if(res.data.valid || unit_upc==parseInt(value)){
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
        }




  onClick = (item) =>{
      this.props.setIngredient(item, this.props.history)
  }

  openSKUEditPage = (sku) => {
    console.log(sku)
    axios.get(`${common.hostname}sku/init_sku`)
      .then(res => {
        let init_data = res.data
        let prod_lines = init_data.prod_lines.map(prod_line => prod_line.label)
        axios.get(`${common.hostname}formula/${sku.formula_id}`).then((res) => {
          let formulaName = res.data[0].name
        let editDialog = (
          <DetailView
              open={true}
              close={() => {
                this.setState({ editDialog: null });
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
                        axios.put(`${common.hostname}sku/${sku.id}`, item)
                        .then(function (response) {
                            //that.props.submit(item)
                            swal({
                                icon: "success",
                            });
                            that.setState({editDialog:null})
                            that.props.search()
                            
                        })
                        .catch(function (error) {
                            swal(`${error}`,{
                                icon: "error",
                            });
                        });
                      
                    }
                    
                }}
              handleChange={() => console.log("handle change")}
              title={"Edit SKU"}
            >
              <Input
                  id="name"
                  rows="4"
                  name={"Name"}
                  defaultValue={sku.name}
                  errorCallback={defaultTextErrorCallbackGenerator("Invalid SKU Name")}
              />
              <Input
                  id="num"
                  rows="4"
                  type="number"
                  name={"Number"}
                  defaultValue={sku.num}
                  errorCallback={this.skuNumErrorCallbackGenerator(sku.num)}
              />
              <Input
                  id="case_upc"
                  type="number"
                  name={"Case UPC"}
                  defaultValue={sku.case_upc}
                  errorCallback={this.caseUPCNumErrorCallbackGenerator(sku.case_upc)}
              />
              <Input
                  id="unit_upc"
                  type="number"
                  name={"Unit UPC"}
                  defaultValue={sku.unit_upc}
                  errorCallback={this.unitUPCNumErrorCallbackGenerator(sku.unit_upc)}
              />
              <Input
                  id="unit_size"
                  error={true}
                  name={"Unit Size"}
                  defaultValue={sku.unit_size}
                  errorCallback={defaultTextErrorCallbackGenerator("Invalid Unit Size")}
              />
              <Input
                  id="count_per_case"
                  type="number"
                  name={"Count Per Case"}
                  defaultValue={sku.count_per_case}
                  errorCallback={defaultNumErrorCallbackGenerator("Count Per Case is invalid")}
              />
              <InputSelect
                    id="prd_line"
                    item={sku.prd_line}
                    items={prod_lines}
                    name={"Product Line"}
                    defaultValue={sku.prod_line}
                    errorCallback={defaultErrorCallback}
              />
              <InputAutoCompleteOpenPage
                    id="formula_id"
                    name={"Formula"}
                    suggestionsCallback={this.suggestionsApi}
                    openCreatePage={this.openCreatePage}
                    idCallback={(id) => {
                      console.log(id)
                      this.setState({id:id})
                    }}
                    defaultValue = {formulaName}
                    defaultId = {sku.formula_id}
                    openEditPage={this.openEditPage}
                    errorCallback={this.skuFormulaIdCallback}
              />
              <Input
                  id="formula_scale"
                  type="number"
                  name={"Formula Scale Factor"}
                  defaultValue={sku.formula_scale}
                  errorCallback={defaultNumErrorCallbackGenerator("Formula Scale Factor is invalid")}
              />
              <Input
                  id="man_rate"
                  type="number"
                  name={"Manufacturing Rate"}
                  defaultValue={sku.man_rate}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Rate is invalid")}
              />
              <Input
                  id="man_setup_cost"
                  type="number"
                  name={"Manufacturing Set Up Cost"}
                  defaultValue={sku.man_setup_cost}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Set Up Cost is invalid")}
              />
              <Input
                  id="man_run_cost"
                  type="number"
                  name={"Manufacturing Run Cost"}
                  defaultValue={sku.man_run_cost}
                  errorCallback={defaultNumErrorCallbackGenerator("Manufacturing Run Cost is invalid")}
              />
              <Input
                  id="comments"
                  rows="4"
                  multiline
                  type="number"
                  name={"Comment"}
                  defaultValue={sku.comments}
                  errorCallback={defaultErrorCallback}
              />
            </DetailView>
        )
        this.setState({
          editDialog: editDialog
        })
      })
    })
  }

  suggestionsApi = (value) => {
    return axios.get(`${common.hostname}formula/formula_autocomplete`)
  }

  openCreatePage = (closeCallBack, defaultName) => {
    return axios.get(`${common.hostname}formula/init_formula`).then( (res) => {
        console.log(res)
        console.log("defaultName")
        console.log(defaultName)
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
            handleChange={() => console.log("handle change")}
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
                        console.log(ingredients)
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
                      errorCallback={defaultErrorCallback}
                  />
            </DetailView>
        )
      })
    }
  )
}
  )
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

  render() {
    const { classes, SKUs, sortby, selected } = this.props
    return (
      <div>
        {
          this.props.SKUs.map((item, index) => (
            <div key={index} className={classes.entry}>
              <Checkbox
                checked={selected.includes(item.id)}
                onChange={() => { this.handleChange(item) }}
                value="Select"
              />
              <Card className={classes.card} onClick={() => { 
                   this.openSKUEditPage(item)
                }}>
                <CardActionArea
                  className={classes.cardAction}
                >
                  <CardContent>
                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                      {sortby == labels.skus.sort_by.SKU_NAME ? item.num : item[labels.skus.sort_by_map[sortby]]}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))
        }
        {
            this.state.editDialog
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    SKUs: state.skus.items,
    sortby: state.skus.sortby,
    selected: state.skus.selectedSkus,
  };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        setSku: sku => {
            Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
                .then(function (response) {
                    return Promise.resolve(dispatch(skuDetSetSku(sku)));
                //return response;
                })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetFormula(sku.formula_id)));

            })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetIng(sku.id)));
            })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetManLines(sku.id)));
            })
            .then(function(r) {
                    ownProps.history.push('/skus/details')
            })
        },
        addSelected: (sku) => {
          dispatch(skuAddSelected(sku));
        },
        removeSelected: (sku) => {
          dispatch(skuRemoveSelected(sku));
        },
        search: () => {
          dispatch(skuSearch())
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUList)));
