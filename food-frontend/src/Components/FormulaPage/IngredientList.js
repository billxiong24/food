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
import { routeToPage, formulaSearch } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { formulaDetGetSkus, formulaDetGetIngredients, formulaDetSetFormula } from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';
import axios from 'axios';
import common, { defaultErrorCallback, defaultTextErrorCallbackGenerator } from '../../Resources/common';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import InputSelect from '../GenericComponents/InputSelect';
import InputList from '../GenericComponents/InputList';
 
 
import labels from '../../Resources/labels';
import DetailView from '../GenericComponents/DetailView';
import swal from 'sweetalert';

const styles = {
    card: {
        width: '100 %',
        marginBottom:20,
        marginTop:20,
      },
      cardAction:{
        padding:10
      },
      bullet: {
        display: 'inline-block',
        margin: '0 2px',
      },
      ingredrient_name: {
        fontSize: 14,
        float:'left',
        fontFamily: 'Open Sans',
        fontWeight: 400,
      },
      ingredient_id: {
        fontSize: 14,
        float:'right',
        fontFamily: 'Open Sans',
        fontWeight: 400,
      },
      pos: {
        marginBottom: 12,
      },
      button:{
          width:'100%'
      }

};

class IngredientList extends Component {

    constructor(props){
        super(props);
        this.state = {
            editDialog: null
        }
    }


    componentWillMount() {

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

    openEditPage = (formula) => {
        let init_data;
        let formula_data
        console.log(formula)
        return axios.get(`${common.hostname}formula/init_formula`)
        .then( (res) => {
            console.log(res)
            init_data = res.data
            return axios.get(`${common.hostname}formula/${formula.id}`).then((res) => {
              console.log(res)
              formula_data = res.data[0]
              return axios.get(`${common.hostname}formula/${formula.id}/ingredients`).then((res) => {
                console.log(res)
                let editDialog = (
                  <DetailView
                      open={true}
                      close={() => {this.setState({editDialog: null})}}
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
                                          that.setState({editDialog:null})
                                          that.props.search()
                                          
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
                      title={"Open"}
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
                              errorCallback={defaultErrorCallback}
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
              this.setState({
                  editDialog: editDialog
              })
            })
          }
        )
      }
        )
      }

    onClick = (item) =>{
        item.made_formula= true;
         this.props.setFormula(item, this.props.history)
    }

    render() {
        const { classes, ingredients, history, sortby } = this.props
        console.log(ingredients)
        return (
            <div>
                {
                this.props.ingredients.map((item, index) => (
                    <Card 
                        className={classes.card} 
                        key={index} 
                        onClick = {() => this.openEditPage(item)}
                    >
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                {item.name}
                            </Typography>
                            <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                                {sortby == labels.ingredients.sort_by.INGREDIENT_NAME? item.num : item[labels.ingredients.sort_by_map[sortby]]}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
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
        ingredients: state.formulas.items,
        sortby: state.formulas.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFormula: (formula, history) => {
            dispatch(formulaDetSetFormula(formula))
            dispatch(formulaDetGetIngredients(formula.id))
            dispatch(formulaDetGetSkus(formula.id))
            history.push('/formula/details')
        },
        search: () => {
          dispatch(formulaSearch())
        }
    };
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientList)));
