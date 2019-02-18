import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage } from '../../Redux/Actions';
import { skuDetUpdateSku, skuDetAddIng, skuDetDeleteIng, skuDetDeleteSku, skuDetAddSku, skuDetDeleteError, skuDetAddError, skuDetSetEditing, skuDetSetNew } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import SKUIngredientList from './SKUIngredientList';
import SKUDetailIngredientAutocomplete from './SKUDetailIngredientAutocomplete';
import ProductLineDropdown from './ProductLineDropdown';
import { findDifferences } from '../../Resources/common';
import { withRouter, Link } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { isValidIng, getSkuErrors } from '../../Resources/common';
import EditableNumeric from '../GenericComponents/EditableNumeric';
import {store} from "../../index"
import axios from 'axios';
import FileDownload from 'js-file-download';
import common from '../../Resources/common';
import { withCookies } from 'react-cookie';

const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
        width:'100%',
    },
    ingredient_detail_view:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: '50px',
        backgroundColor: labels.colors.primaryColor,
        borderRadius: 12
    },
    textField:{
        width: '500px',
    },
    text:{
        width: '500px'
    },
    button:{
        width: '300px',
        backgroundColor: 'white'
    },
    list_autocomplete_container:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '50vh'
    },
    title:{
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
        float: 'left',
        overflowWrap: 'breakWord',
        wordWrap: 'breakWord',
        hyphens: 'auto',
        fontFamily: 'Open Sans',
        fontWeight: 400
    }

};

class SKUDetailViewPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonText:"Edit",
            editing:false,
            name:this.props.name,
            case_upc:this.props.case_upc,
            unit_upc:this.props.unit_upc,
            num:this.props.num,
            unit_size:this.props.unit_size,
            count_per_case:this.props.count_per_case,
            prd_line:this.props.prd_line,
            ingredients:this.props.ingredients,
            comments:this.props.comments,
            new:false
        }
        console.log("SKU DETAIL VIEW")
        console.log(this.props.id)
        if(this.props.id == null){
            this.state.editing = true
            this.state.new = true
            this.state.buttonText = "Add"
        }

    }


    componentWillMount() {

    }

    onChange = (input,key) => {
        console.log("SKUDETAILVIEW DETAIL CHANGE")
        console.log(input)
        console.log(key)
        this.setState({
            [key]:input
        });
        console.log(this.state)
    }

    onEditClick = () => {
        this.props.edit()
    }

    onProductLineChange = (product_line) => {
        console.log("SKUDETAILVIEW PRODUCT_LINE CHANGE")
        console.log(product_line)
        this.setState({
            prd_line:product_line
        })
    }

    onExportClick = () => {
        axios.post(common.hostname + 'manufacturing_goals/exported_file', {
            data: this.props.current_ingredients.map((ing) => ({
                sku_num:this.state.num,
                ingred_num:ing.name,
                quantity: ing.quantity
              })),
          format: "csv",
        })
          .then((response) => {
            FileDownload(response.data, 'formulas.csv');
          })
          .catch(err => {
            console.log(err);
          })
      }

    

    onSaveClick = () => {
        const sku = {
            name:this.state.name,
            case_upc:this.state.case_upc,
            unit_upc:this.state.unit_upc,
            num:this.state.num,
            unit_size:this.state.unit_size,
            count_per_case:this.state.count_per_case,
            prd_line:this.state.prd_line,
            comments:this.state.comments,
            id:this.props.id
        }
        let errors = getSkuErrors(sku)
        if(errors.length == 0){
            console.log("SKUDETAILVIEW")
            this.props.update(sku, this.props.current_ingredients, this.props.ingredients)
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
        
    }

    onAddClick = () => {
        const sku = {
            name:this.state.name,
            case_upc:this.state.case_upc,
            unit_upc:this.state.unit_upc,
            num:this.state.num,
            unit_size:this.state.unit_size,
            count_per_case:this.state.count_per_case,
            prd_line:this.state.prd_line,
            comments:this.state.comments,
        }
        let errors = getSkuErrors(sku)
        if(errors.length == 0){
            console.log("INGREDIENTDETAILVIEW")
            console.log(sku)
            this.props.add(sku, this.props.current_ingredients)
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
        
    }

    onDelete = () => {
        const sku = {
            name:this.state.name,
            case_upc:this.state.case_upc,
            unit_upc:this.state.unit_upc,
            num:this.state.num,
            unit_size:this.state.unit_size,
            count_per_case:this.state.count_per_case,
            prd_line:this.state.prd_line,
            comments:this.state.comments,
            id:this.props.id
        }
        this.props.delete(sku)
    }

    render() {
        const { classes , editing, newValue} = this.props
        return (
            <div className = {classes.ingredient_page_container}>
                <Button onClick={this.props.back}>
                    Back
                </Button>
                <div className = {classes.ingredient_detail_view}>
                    <Typography
                        className={classes.title}
                    >
                        SKU Details
                    </Typography>
                    <EditableText 
                        label={"SKU Name"} 
                        editing={editing}
                        field={"name"}
                        onChange={this.onChange}>
                        {this.state.name}
                    </EditableText>

                    <EditableNumeric
                        label={"SKU No."}
                        editing={editing}
                        key={"num"}
                        field={"num"}
                        onChange={this.onChange}>
                        {this.state.num}
                    </EditableNumeric>


                    <EditableNumeric 
                        label={"Case UPC No."}
                        editing={editing}
                        field={"case_upc"}
                        onChange={this.onChange}>
                        {this.state.case_upc}
                    </EditableNumeric>

                    <EditableNumeric 
                        label={"Unit UPC No."}
                        editing={editing}
                        field={"unit_upc"}
                        onChange={this.onChange}>
                        {this.state.unit_upc}
                    </EditableNumeric>

                    <EditableText 
                        label={"Unit Size"} 
                        editing={editing}
                        field={"unit_size"}
                        onChange={this.onChange}>
                        {this.state.unit_size}
                    </EditableText>

                    <EditableNumeric
                        label={"Count Per Case"} 
                        editing={editing}
                        field={"count_per_case"}
                        onChange={this.onChange}>
                        {this.state.count_per_case}
                    </EditableNumeric>

                    <ProductLineDropdown
                        onChange={this.onProductLineChange}
                    >

                    </ProductLineDropdown>

                    <EditableText 
                        label={"Comment"} 
                        editing={editing}
                        field={"comments"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.comments}
                    </EditableText>
                    
                    {
                    (this.props.cookies.admin === "true" && newValue )?
                        <Button 
                            className={classes.button} 
                            editing={editing}
                            onClick = {this.onAddClick}
                        >
                            ADD
                        </Button>
                        :
                        <div></div>
                    }
                    {
                        (this.props.cookies.admin === "true" === common.admin && !editing) ?
                        <Button 
                            className={classes.button} 
                            editing={editing}
                            onClick = {this.onEditClick}
                        >
                            EDIT
                        </Button>

                    
                    :
                    <div></div>
                    }
                    {
                        (editing && !newValue)?
                        <div>
                            <Button 
                                className={classes.button} 
                                editing={editing}
                                onClick = {this.onSaveClick}
                            >
                                SAVE
                            </Button>

                            <Button 
                                className={classes.button} 
                                editing={editing}
                                onClick = {this.onDelete}
                            >
                                DELETE
                            </Button>
                        </div>
                        :
                        <div></div>
                    }
                    {
                        (!newValue && !editing)?
                        <Button 
                            className={classes.button} 
                            editing={editing}
                            onClick = {this.onExportClick}
                        >
                            EXPORT TO CSV
                        </Button>
                        :
                        <div></div>
                    }
                </div>
                
                    <div className={classes.list_autocomplete_container}>
                        <Typography>
                            Ingredient List
                        </Typography>
                        <SKUDetailIngredientAutocomplete editing={editing}></SKUDetailIngredientAutocomplete>
                        <SKUIngredientList editing={editing}></SKUIngredientList>

                    </div>
                
                {
          this.props.errors.map((error, index) => (
            <SimpleSnackbar
              open={true} 
              handleClose={()=>{this.props.deleteError(error)}}
              message={error.errMsg}
            >
            </SimpleSnackbar>
          ))
          }
            </div>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    console.log(state)
    return {
        name: state.sku_details.name,
        case_upc:state.sku_details.case_upc,
        unit_upc:state.sku_details.unit_upc,
        num:state.sku_details.num,
        unit_size:state.sku_details.unit_size,
        count_per_case:state.sku_details.count_per_case,
        prd_line:state.sku_details.prd_line,
        ingredients:state.sku_details.ingredients,
        comments:state.sku_details.comments,
        id:state.sku_details.id,
        current_ingredients:state.sku_details.current_ingredients,
        errors: state.sku_details.errors,
        newValue: state.sku_details.new,
        cookies: ownProps.cookies.cookies,
        editing: state.sku_details.editing,
        valid: state.sku_details.valid
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update : (sku, current_ingredients, ingredients) =>

        {
            console.log(current_ingredients)
            console.log(ingredients)
            Promise.resolve(dispatch(skuDetUpdateSku(sku))) // dispatch
                .then(function (response) {
                    let editing = store.getState().sku_details.editing
                    console.log(ownProps)
                    if(!editing){
                        let object = findDifferences(current_ingredients, ingredients)
                        console.log(object.original)
                        console.log(object.newlist)
                        console.log(object.additions)
                        console.log(object.deletions)
                        dispatch(skuDetAddIng(sku,object.additions))
                        dispatch(skuDetDeleteIng(sku,object.deletions))
                    }
                return response;
                })
        },
        back: () => {
            dispatch(skuDetSetEditing(false))
            dispatch(skuDetSetNew(false))
            ownProps.history.push('/skus')
        },
        delete: (sku) => {
            dispatch(skuDetDeleteSku(sku))
            dispatch(skuDetSetEditing(false))
            ownProps.history.push('/skus')
        },
        add: (sku, current_ingredients) =>{
            Promise.resolve(dispatch(skuDetAddSku(sku))) // dispatch
                .then(function (response) {
                    sku.id = store.getState().sku_details.id
                    console.log(ownProps)
                    if(sku.id !== null){
                        dispatch(skuDetAddIng(sku,current_ingredients))
                    }
                return response;
                })
          .then(function(response){console.log("@RESPONSE",response)})
            
        },
        deleteError: (error) => {
            dispatch(skuDetDeleteError(error))
        },
        pushError: err => {
            dispatch(skuDetAddError(err))
            setTimeout(function(){dispatch(skuDetDeleteError(err))}, 2000);
        },
        edit: () => {
            dispatch(skuDetSetEditing(true))
        }
    };
};

export default withRouter(withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(SKUDetailViewPage))));
