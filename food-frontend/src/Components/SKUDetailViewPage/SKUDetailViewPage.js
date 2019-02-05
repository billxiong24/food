import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage } from '../../Redux/Actions';
import { skuDetUpdateSku, skuDetAddIng, skuDetDeleteIng, skuDetDeleteSku, skuDetAddSku, skuDetDeleteError, skuDetAddError } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import SKUIngredientList from './SKUIngredientList';
import SKUDetailIngredientAutocomplete from './SKUDetailIngredientAutocomplete';
import ProductLineDropdown from './ProductLineDropdown';
import { findDifferences } from '../../Resources/common';
import { withRouter, Link } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { isValidIng, getSkuErrors } from '../../Resources/common';

const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
    },
    ingredient_detail_view:{
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        alignItems: 'center'
    },

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

    onProductLineChange = (product_line) => {
        console.log("SKUDETAILVIEW PRODUCT_LINE CHANGE")
        console.log(product_line)
        this.setState({
            prd_line:product_line
        })
    }

    

    onButtonClick = () => {
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
        
        if(this.state.buttonText == "Edit"){
            this.setState({
                buttonText: "Save",
                editing:true,
            });
        }else{
            let errors = getSkuErrors(sku)
            if(errors.length == 0){
                this.setState({
                    buttonText: "Edit",
                    editing:false,
                });
                console.log("SKUDETAILVIEW")
                console.log(sku)
                this.props.update(sku,this.props.current_ingredients,this.props.ingredients)
            }else{
                for (var i = 0; i < errors.length; i++) {
                    this.props.pushError(errors[i])
                }
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
            this.setState({
                buttonText: "Edit",
                editing:false,
                new: false
            });
            console.log("INGREDIENTDETAILVIEW")
            console.log(sku)
            this.props.add(sku)
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
        const { classes } = this.props
        console.log("Editiing:" + this.state.editing)
        console.log("New:"+this.state.new)
        return (
            <div className = {classes.ingredient_page_container}>
                <Button component={Link} to={'/skus'}>
                    Back
                </Button>
                <div className = {classes.ingredient_detail_view}>
                    <Typography>
                        SKU Details
                    </Typography>
                    <EditableText 
                        label={"SKU Name"} 
                        editing={this.state.editing}
                        field={"name"}
                        onChange={this.onChange}>
                        {this.state.name}
                    </EditableText>

                    <EditableText 
                        label={"Case UPC No."}
                        editing={this.state.editing}
                        field={"case_upc"}
                        onChange={this.onChange}>
                        {this.state.case_upc}
                    </EditableText>

                    <EditableText 
                        label={"Unit UPC No."}
                        editing={this.state.editing}
                        field={"unit_upc"}
                        onChange={this.onChange}>
                        {this.state.unit_upc}
                    </EditableText>

                    <EditableText 
                        label={"Unit Size"} 
                        editing={this.state.editing}
                        field={"unit_size"}
                        onChange={this.onChange}>
                        {this.state.unit_size}
                    </EditableText>

                    <EditableText 
                        label={"Count Per Case"} 
                        editing={this.state.editing}
                        field={"count_per_case"}
                        onChange={this.onChange}>
                        {this.state.count_per_case}
                    </EditableText>

                    <ProductLineDropdown
                        onChange={this.onProductLineChange}
                    >

                    </ProductLineDropdown>

                    <EditableText 
                        label={"Comment"} 
                        editing={this.state.editing}
                        field={"comments"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.comments}
                    </EditableText>
                    {
                        this.state.new ?
                        <Button 
                            className={classes.button} 
                            editing={this.state.editing}
                            onClick = {this.onAddClick}
                        >
                            {this.state.buttonText}
                        </Button>
                        :
                        <Button 
                            className={classes.button} 
                            editing={this.state.editing}
                            onClick = {this.onButtonClick}
                        >
                            {this.state.buttonText}
                        </Button>

                    }
                    {
                        (this.state.editing && !this.state.new)?
                        <Button 
                            className={classes.button} 
                            editing={this.state.editing}
                            onClick = {this.onDelete}
                        >
                            DELETE
                        </Button>
                        :
                        <div></div>
                    }
                </div>
                <div>
                    <div className={classes.list_autocomplete_container}>
                        <Typography>
                            Ingredient List
                        </Typography>
                        <SKUDetailIngredientAutocomplete editing={this.state.editing}></SKUDetailIngredientAutocomplete>
                        <SKUIngredientList editing={this.state.editing}></SKUIngredientList>

                    </div>
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


const mapStateToProps = state => {
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
        errors: state.sku_details.errors
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update : (sku, current_ingredients, ingredients) =>
        {
            dispatch(skuDetUpdateSku(sku))
            let object = findDifferences(current_ingredients, ingredients)
            console.log(object.original)
            console.log(object.newlist)
            console.log(object.additions)
            console.log(object.deletions)
            dispatch(skuDetAddIng(sku,object.additions))
            dispatch(skuDetDeleteIng(sku,object.deletions))
        },
        back: () => ownProps.history.push('/skus'),
        delete: (sku) => {
            dispatch(skuDetDeleteSku(sku))
            ownProps.history.push('/skus')
        },
        add: (sku) =>{
            dispatch(skuDetAddSku(sku))
        },
        deleteError: (error) => {
            dispatch(skuDetDeleteError(error))
        },
        pushError: err => {
            dispatch(skuDetAddError(err))
            setTimeout(function(){dispatch(skuDetDeleteError(err))}, 2000);
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUDetailViewPage)));
