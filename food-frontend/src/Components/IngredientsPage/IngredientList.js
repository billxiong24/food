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
import { CardActionArea, Input, TextField, Checkbox } from '@material-ui/core';
import { routeToPage, ingSearch, ingAddDependency, ingRemoveDependency } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { ingDetSetIng, ingDetGetSkus } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import labels from '../../Resources/labels';
import ManufacturingLinesEditDialog from '../ManufacturingLinesPage/ManufacturingLinesEditDialog';
import DetailView from '../GenericComponents/DetailView';
import UnitSelect from '../GenericComponents/UnitSelect';
import InputAutocomplete from '../GenericComponents/InputAutocomplete';
import InputSelect from '../GenericComponents/InputSelect';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import InputList from '../GenericComponents/InputList';
import swal from 'sweetalert';
import { defaultErrorCallback, nameErrorCallback, ingNumErrorCallback, defaultNumErrorCallbackGenerator } from '../../Resources/common';
import axios from 'axios';
import common from '../../Resources/common';
import SKUInput from '../GenericComponents/SKUInput';


const styles = {
    card: {
        display:'flex',
        flexGrow: '8',
        marginBottom: 10,
        marginTop: 10,
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
      },
      entry: {
        width: '100%',
        display:'flex',
        flexDirection:'row',
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

    suggestionsApi = (value) => {
        let suggestions = ["Afghanistan", "Azerbijan"]
        return suggestions
    }

    onClick = (item) =>{
         this.props.setIngredient(item, this.props.history)
    }

    ingNumErrorCallbackGenerator = (num) => {
    return (value, prop, callBack) => {
        axios.put(`${common.hostname}ingredients/valid_num`,{num:parseInt(value)}).then((res) =>{
          let error
          if(res.data.valid && num!=parseInt(value)){
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

    dependencyChange = () =>{
        const ing = {
          name:this.state.ingredientName,
          num:this.state.ingredientNum,
          vend_info:this.state.vend_info,
          pkg_size:this.state.packageSize,
          pkg_cost:this.state.costPerPackage,
          comments:this.state.comment,
          id:this.props.id,
          skus:this.props.skus
      }
        if(this.state.checked) {
          this.props.removeIngFromReport(ing)
          this.setState({
            checked: false,
          })
        } else {
          this.props.addIngToReport(ing)
          this.setState({
            checked: true,
          });
        }
      }

    openIngredientCreatePage = (closeCallback) => {
        return (
            <DetailView
                open={true}
                close={closeCallback}
                submit={(e) => {
                    //console.log(e)
                    swal({
                        icon: "success",
                    });
                    closeCallback()
                }}
                //handleChange={() => console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Create Ingredient"}

            >
                <Input
                    id="name"
                    rows="4"
                    error={true}
                    name={"Name"}
                    displayName="Input"
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="num"
                    rows="4"
                    type="number"
                    name={"Number"}
                    displayName="Input"
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="vend_info"
                    rows="4"
                    name={"Vendor Info"}
                    displayName="Input"
                    errorCallback={this.errorCallback}
                />
                <UnitSelect
                    id="pkg_size"
                    unitSelect={true}
                    name={"Package Size"}
                    item="kg"
                    items={["kg","g","grams"]}
                    displayName="UnitSelect"
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="pkg_cost"
                    rows="4"
                    type="number"
                    displayName="Input"
                    name={"Package Cost"}
                    errorCallback={this.errorCallback}

                />
                <Input
                    id="comment"
                    rows="4"
                    multiline
                    displayName="Input"
                    type="number"
                    name={"Comment"}
                    errorCallback={this.errorCallback}
                />
                <InputAutoCompleteOpenPage
                    id="formula"
                    name={"Formula"}
                    displayName="InputAutoCompleteOpenPage"
                    suggestionsCallback={this.suggestionsApi}
                    openCreatePage={this.openCreatePage}
                    openEditPage={this.openEditPage}
                    errorCallback={this.errorCallback}
                />
                <InputSelect
                    id="prd_line"
                    item="prod1"
                    displayName="InputSelect"
                    items={["prod1","prod2","prod3","12"]}
                    name={"Product Line"}
                    errorCallback={this.errorCallback}
                />
                <InputList
                    id="ing_list"
                    item="ing1"
                    displayName="InputList"
                    items={[
                        {
                            label:"ing1",
                            id:1
                        },
                        {
                            label:"ing2",
                            id:2
                        },
                        {
                            label:"ing3",
                            id:3
                        },
                        {
                            label:"ing4",
                            id:4
                        },
                        {
                            label:"ing5",
                            id:5
                        },
                        {
                            label:"ing6",
                            id:6
                        },
                        {
                            label:"ing7",
                            id:7
                        },
                        {
                            label:"ing8",
                            id:8
                        }
                    ]}
                    name={"Ingredient List"}
                    errorCallback={this.errorCallback}
                />
            </DetailView>
        )
    }

    ingNumErrorCallbackGenerator = (num) => {
        return (value, prop, callBack) => {
            axios.put(`${common.hostname}ingredients/valid_num`,{num:parseInt(value)}).then((res) =>{
              let error
              //console.log(num)
              //console.log(value)
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

    openIngredientEditPage = (ingredient, closeCallback) => {
        //console.log(ingredient)
        let unitItems = ["kg", "g", "grams","lb"]
        let unitItem = ingredient.unit
        let unitValue = String(ingredient.pkg_size)
        //console.log(unitItem)
        //console.log(unitItems)
        //console.log(unitValue)
        // for(var i = 0; i < unitItems.length; i++){
        //     if(unitValue.endsWith(unitItems[i])){
        //         unitItem = unitItems[i]
        //         unitValue = unitValue.slice(0, -unitItems[i].length)
        //         break
        //     }
        // }


        // console.log(ingredient)
        axios.get(`${common.hostname}ingredients/${ingredient.id}/skus`)
        .then((response) => {
            console.log(response)
            let pic = (
                <DetailView
                    open={true}
                    close={closeCallback}
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
                                // console.log(item)
                                let that = this
                                let ing = ingredient
                                // const {ing_list, ...new_formula_data} = item
                                // new_formula_data.num = parseInt(new_formula_data.num)
                                // console.log(new_formula_data)
                                axios.put(`${common.hostname}ingredients/${ing.id}`, item)
                                .then(function (response) {
                                    //that.props.submit(item)
                                    swal({
                                        icon: "success",
                                    });
                                    that.setState({editDialog:false})
                                    that.props.search()
                                    
                                })
                                .catch(function (error) {
                                    swal(`${error}`,{
                                        icon: "error",
                                    });
                                });
                              
                            }
                            
                        }}
                    // handleChange={() => console.log("handle change")}
                    name={"Ingredient Name"}
                    title={"Edit Ingredient"}
                >
                    <Input
                        id="name"
                        rows="4"
                        error={true}
                        name={"Name"}
                        displayName="Input"
                        errorCallback={nameErrorCallback}
                        defaultValue = {ingredient.name}
                    />
                    <Input
                        id="num"
                        rows="4"
                        type="number"
                        name={"Number"}
                        displayName="Input"
                        errorCallback={this.ingNumErrorCallbackGenerator(ingredient.num)}
                        defaultValue = {ingredient.num}
                    />
                    <Input
                        id="vend_info"
                        rows="4"
                        name={"Vendor Info"}
                        displayName="Input"
                        errorCallback={defaultErrorCallback}
                        defaultValue={ingredient.vend_info}
                    />
                    <UnitSelect
                        id="pkg_size"
                        unitSelect={true}
                        name={"Package Size"}
                        item={unitItem}
                        displayName="UnitSelect"
                        items={unitItems}
                        defaultValue={unitValue}
                        errorCallback={defaultErrorCallback}
                    />
                    <Input
                        id="pkg_cost"
                        rows="4"
                        type="number"
                        displayName="Input"
                        name={"Package Cost"}
                        errorCallback={defaultNumErrorCallbackGenerator("Invalid Package Cost")}
                        defaultValue={ingredient.pkg_cost}
                    />
                    <Input
                        id="comments"
                        rows="4"
                        multiline
                        type="number"
                        displayName="Input"
                        name={"Comment"}
                        errorCallback={defaultErrorCallback}
                        defaultValue={ingredient.comments}
                    />
                    <SKUInput
                        id ="sku_errorMsg"
                        displayName="SKUInput"
                        data={response.data}
                        name={"SKU List"}
                    />
                </DetailView>
            )
            this.setState({editDialog: pic})
        })
        
    }


    open = (item) => {
        this.openIngredientEditPage(item, () => {
            this.setState({ editDialog: null });
        })
        
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
        const { classes, ingredients, history, sortby } = this.props
        console.log(this.props.dependency)
        
        return (
            <div>
                {
                this.props.ingredients.map((item, index) => (
                    <div key={index} className={classes.entry}>
                    <Checkbox
                        checked={this.props.dependency.map(a => a.id).includes(item.id)}
                        onChange={() => {
                            axios.get(`${common.hostname}ingredients/${item.id}/skus`)
                            .then((response) => {
                                item.skus = response.data
                                if(this.props.dependency.map(a => a.id).includes(item.id)){
                                    this.props.removeIngFromReport(item)
                                }else{
                                    this.props.addIngToReport(item)
                                }
                                
                            })
                        }}
                        value="Select"
                    />
                    <Card className={classes.card} key={index} onClick = {() => {
                       this.open(item)
                    }}>
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
        ingredients: state.ingredients.items,
        sortby: state.ingredients.sortby,
        dependency: state.ingredients.ingDependency,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setIngredient: (ing, history) => {
            dispatch(ingDetSetIng(ing))
            dispatch(ingDetGetSkus(ing.id))
            history.push('/ingredients/details')
        },
        search: () => {
            dispatch(ingSearch())
        },
        addIngToReport: ing => {
            dispatch(ingAddDependency(ing))
        },
        removeIngFromReport: ing => {
            dispatch(ingRemoveDependency(ing))
        }
    };
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientList)));
