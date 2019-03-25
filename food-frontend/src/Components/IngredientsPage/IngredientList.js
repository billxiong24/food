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
import { CardActionArea, Input, TextField } from '@material-ui/core';
import { routeToPage } from '../../Redux/Actions';
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
import { defaultErrorCallback, nameErrorCallback, ingNumErrorCallback } from '../../Resources/common';
import axios from 'axios';
import common from '../../Resources/common';


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
            editDialog: false
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

    openIngredientCreatePage = (closeCallback) => {
        return (
            <DetailView
                open={true}
                close={closeCallback}
                submit={(e) => {
                    console.log(e)
                    swal({
                        icon: "success",
                    });
                    closeCallback()
                }}
                handleChange={() => console.log("handle change")}
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
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="num"
                    rows="4"
                    type="number"
                    name={"Number"}
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="vend_info"
                    rows="4"
                    name={"Vendor Info"}
                    errorCallback={this.errorCallback}
                />
                <UnitSelect
                    id="pkg_size"
                    unitSelect={true}
                    name={"Package Size"}
                    item="kg"
                    items={["kg","g","grams"]}
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="pkg_cost"
                    rows="4"
                    type="number"
                    name={"Package Cost"}
                    errorCallback={this.errorCallback}

                />
                <Input
                    id="comment"
                    rows="4"
                    multiline
                    type="number"
                    name={"Comment"}
                    errorCallback={this.errorCallback}
                />
                <InputAutoCompleteOpenPage
                    id="formula"
                    name={"Formula"}
                    suggestionsCallback={this.suggestionsApi}
                    openCreatePage={this.openCreatePage}
                    openEditPage={this.openEditPage}
                    errorCallback={this.errorCallback}
                />
                <InputSelect
                    id="prd_line"
                    item="prod1"
                    items={["prod1","prod2","prod3","12"]}
                    name={"Product Line"}
                    errorCallback={this.errorCallback}
                />
                <InputList
                    id="ing_list"
                    item="ing1"
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

    openIngredientEditPage = (ingredient, closeCallback) => {
        console.log(ingredient)
        let unitItems = ["kg", "g", "grams"]
        let unitItem = unitItems[0]
        let unitValue = String(ingredient.pkg_size)
        for(var i = 0; i < unitItems.length; i++){
            if(unitValue.endsWith(unitItems[i])){
                unitItem = unitItems[i]
                unitValue = unitValue.slice(0, -unitItems[i].length)
                break
            }
        }


        console.log(ingredient)
        return (
            <DetailView
                open={true}
                close={closeCallback}
                submit={(e) => {
                    console.log(e)
                    swal({
                        icon: "success",
                    });
                    closeCallback()
                }}
                handleChange={() => console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Edit Ingredient"}
            >
                <Input
                    id="name"
                    rows="4"
                    error={true}
                    name={"Name"}
                    errorCallback={nameErrorCallback}
                    defaultValue = {ingredient.name}
                />
                <Input
                    id="num"
                    rows="4"
                    type="number"
                    name={"Number"}
                    errorCallback={ingNumErrorCallback}
                    defaultValue = {ingredient.num}
                />
                <Input
                    id="vend_info"
                    rows="4"
                    name={"Vendor Info"}
                    errorCallback={defaultErrorCallback}
                    defaultValue={ingredient.vend_info}
                />
                <UnitSelect
                    id="pkg_size"
                    unitSelect={true}
                    name={"Package Size"}
                    item={unitItem}
                    items={unitItems}
                    defaultValue={unitValue}
                    errorCallback={defaultErrorCallback}
                />
                <Input
                    id="pkg_cost"
                    rows="4"
                    type="number"
                    name={"Package Cost"}
                    errorCallback={defaultErrorCallback}
                    defaultValue={ingredient.pkg_cost}
                />
                <Input
                    id="comment"
                    rows="4"
                    multiline
                    type="number"
                    name={"Comment"}
                    errorCallback={defaultErrorCallback}
                    defaultValue={ingredient.comments}
                />
                {/* <InputAutoCompleteOpenPage
                    id="formula"
                    name={"Formula"}
                    suggestionsCallback={this.suggestionsApi}
                    openCreatePage={this.openCreatePage}
                    openEditPage={this.openEditPage}
                    errorCallback={this.errorCallback}
                />
                <InputSelect
                    id="prd_line"
                    item="prod1"
                    items={["prod1","prod2","prod3","12"]}
                    name={"Product Line"}
                    errorCallback={this.errorCallback}
                />
                <InputList
                    id="ing_list"
                    item="ing1"
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
                /> */}
            </DetailView>
        )
    }



    openCreatePage = (closeCallBack) => {
        return (
            <DetailView
                open={true}
                close={closeCallBack}
                submit={(e) => console.log(e)}
                handleChange={() => console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Open"}
            >
                <Input
                    id="ing_name"
                    rows="4"
                    name={"Name"}
                    value={()=>console.log("hello")}
                    errorCallback={this.errorCallback}

                />
                <Input
                    id="ing_name"
                    rows="4"
                    name={"Name"}
                    value={()=>console.log("hello")}
                    errorCallback={this.errorCallback}
                />
            </DetailView>
        )
    }

    openEditPage = (closeCallBack) => {
        return (
            <DetailView
                open={true}
                close={closeCallBack}
                submit={(e) => console.log(e)}
                handleChange={() => console.log("handle change")}
                name={"Ingredient Name"}
                shortname={"Ingredient Short Name"}
                comment={"Ingredient Comment"}
                title={"Edit"}
            >
                <Input
                    id="ing_name"
                    rows="4"
                    name={"Name"}
                    value={()=>console.log("hello")}
                    errorCallback={this.errorCallback}
                />
                <Input
                    id="ing_name"
                    rows="4"
                    name={"Name"}
                    value={()=>console.log("hello")}
                    errorCallback={this.errorCallback}
                />
            </DetailView>
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
        const { classes, ingredients, history, sortby } = this.props
        
        return (
            <div>
                {
                this.props.ingredients.map((item, index) => (
                    <Card className={classes.card} key={index} onClick = {() => {
                        this.setState({
                            editDialog: true,
                            ingredient:item
                        })
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
                ))
                }
                {
                    this.state.editDialog ? this.openIngredientEditPage(this.state.ingredient, () => {
                        this.setState({ editDialog: false });
                    }) : null
                }
                {
                    this.state.createDialog ? this.openIngredientCreatePage(() => {
                        this.setState({ createDialog: false });
                    }) : null
                }

            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients.items,
        sortby: state.ingredients.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setIngredient: (ing, history) => {
            dispatch(ingDetSetIng(ing))
            dispatch(ingDetGetSkus(ing.id))
            history.push('/ingredients/details')
        }
    };
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientList)));
