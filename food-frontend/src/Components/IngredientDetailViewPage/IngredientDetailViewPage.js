import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng, ingDetAddIng, ingDetDeleteError, ingDetAddError, ingDetSetEditing, ingDetSetNew } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage, ingDeleteIng, ingAddDependency, ingRemoveDependency } from '../../Redux/Actions';
import IngredientSKUList from './IngredientSKUList';
import { withRouter, Link } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import EditableNumeric from '../GenericComponents/EditableNumeric';
import { isValidIng, getIngErrors } from '../../Resources/common';
import {store} from "../../index"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { withCookies } from 'react-cookie';


const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
    },
    left:{
        display:'flex',
        flexDirection: 'column',
        alignItems:'center',
        width:'40vh'
    },
    ingredient_detail_view:{    
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        backgroundColor: 'rgb(111,58,211,0.75)',
        borderRadius: 12,
        color:'white'
    },
    textField:{
        width: '500px',
        color:'white'
    },
    text:{
        width: '500px',
        color:'white'
    },
    button:{
        width: '300px',
        backgroundColor: 'white'
    },


};

class IngredientDetailViewPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonText:"Edit",
            editing:false,
            ingredientName:this.props.ingredientName,
            ingredientNum:this.props.ingredientNum,
            vend_info:this.props.vend_info,
            packageSize:this.props.packageSize,
            costPerPackage:this.props.costPerPackage,
            comment:this.props.comment,
            new:false,
            checked:this.props.dependency.filter((ing) => {
              return ing.id === this.props.id;
            }).length === 1,
        }
        console.log("INGREDIENT DETAIL VIEW")
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
        console.log("INGREDIETNTVIEW DETAIL CHANGE")
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
    

    

    onSaveClick = () => {
        const ing = {
            name:this.state.ingredientName,
            num:this.state.ingredientNum,
            vend_info:this.state.vend_info,
            pkg_size:this.state.packageSize,
            pkg_cost:this.state.costPerPackage,
            comments:this.state.comment,
            id:this.props.id
        }
        
        let errors = getIngErrors(ing);
        if(errors.length == 0){
            console.log("SKUDETAILVIEW")
            this.props.update(ing) // dispatch
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
        
    }

    onAddClick = () => {
        const ing = {
            name:this.state.ingredientName,
            num:this.state.ingredientNum,
            vend_info:this.state.vend_info,
            pkg_size:this.state.packageSize,
            pkg_cost:this.state.costPerPackage,
            comments:this.state.comment,
        }
        let errors = getIngErrors(ing);
        if(errors.length == 0){
            this.setState({
                buttonText: "Edit",
                editing:false,
                new: false
            });
            console.log("INGREDIENTDETAILVIEW")
            console.log(ing)
            this.props.add(ing)
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
    }

    onDelete = () => {
        const ing = {
            name:this.state.ingredientName,
            num:this.state.ingredientNum,
            vend_info:this.state.vend_info,
            pkg_size:this.state.packageSize,
            pkg_cost:this.state.costPerPackage,
            comments:this.state.comment,
            id:this.props.id
        }
        console.log("INGREDIENTDETAILVIEW")
        console.log(ing)
        this.props.delete(ing)
        
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
    console.log(this.state.checked);
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

    addToReport = () => {
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
        console.log(this.props.skus)
        this.props.addIngToReport(ing)
    }

    render() {
        const { classes, editing, newValue } = this.props
        return (
            <div className = {classes.ingredient_page_container}>
                <Button onClick={this.props.back}>
                    Back
                </Button>
                <div className = {classes.ingredient_detail_view}>
                    <Typography>
                        Ingredient Details
                    </Typography>
                    <EditableText 
                        label={"Ingredient Name"} 
                        editing={editing}
                        key={"ingredientName"}
                        field={"ingredientName"}
                        onChange={this.onChange}>
                        {this.state.ingredientName}
                    </EditableText>


                    <EditableNumeric
                        label={"Ingredient No."}
                        editing={editing}
                        key={"ingredientNum"}
                        field={"ingredientNum"}
                        onChange={this.onChange}>
                        {this.state.ingredientNum}
                    </EditableNumeric>

                    <EditableText 
                        label={"Vendor Info"}
                        editing={editing}
                        key={"vend_info"}
                        field={"vend_info"}
                        onChange={this.onChange}>
                        {this.state.vend_info}
                    </EditableText>

                    <EditableText 
                        label={"Package Size"} 
                        editing={editing}
                        key={"packageSize"}
                        field={"packageSize"}
                        onChange={this.onChange}>
                        {this.state.packageSize}
                    </EditableText>


                    <EditableNumeric
                        label={"Cost per Package"} 
                        editing={editing}
                        key={"costPerPackage"}
                        field={"costPerPackage"}
                        onChange={this.onChange}>
                        {this.state.costPerPackage}
                    </EditableNumeric>

                    <EditableText 
                        label={"Comment"} 
                        editing={editing}
                        key={"comment"}
                        field={"comment"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.comment}
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
                        (this.props.cookies.admin === "true" && !editing) ?
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
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={this.state.checked}
                                    onChange={this.dependencyChange}
                                    color="primary"
                                />
                            }
                            label="Add to Dependency"
                        />
                        :
                        <div></div>
                    }

                    
                </div>
                <div className={classes.left}>
                    <Typography>
                        SKU List
                    </Typography>
                    <IngredientSKUList></IngredientSKUList>
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
    return {
        ingredientName: state.ingredient_details.ingredientName,
        ingredientNum: state.ingredient_details.ingredientNum,
        vend_info: state.ingredient_details.vend_info,
        packageSize: state.ingredient_details.packageSize,
        costPerPackage: state.ingredient_details.costPerPackage,
        comment: state.ingredient_details.comment,
        id: state.ingredient_details.id,
        errors: state.ingredient_details.errors,
        skus: state.ingredient_details.skus,
        valid: state.ingredient_details.valid,
        editing: state.ingredient_details.editing,
        newValue: state.ingredient_details.new,
        dependency: state.ingredients.ingDependency,
        cookies: ownProps.cookies.cookies,
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update : (ing) =>
        {
            dispatch(ingDetUpdateIng(ing))
        },
        back: () => {
            dispatch(ingDetSetEditing(false))
            dispatch(ingDetSetNew(false))
            ownProps.history.push('/ingredients')
        },
        delete: (ing) => {
            dispatch(ingDeleteIng(ing))
            dispatch(ingDetSetEditing(false))
            ownProps.history.push('/ingredients')
        },
        add: (ing) =>{
            dispatch(ingDetAddIng(ing))
        },
        deleteError: (error) => {
            dispatch(ingDetDeleteError(error))
        },
        pushError: err => {
            dispatch(ingDetAddError(err))
            setTimeout(function(){dispatch(ingDetDeleteError(err))}, 2000);
        },
        addIngToReport: ing => {
            dispatch(ingAddDependency(ing))
        },
        edit: () => {
            dispatch(ingDetSetEditing(true))
        },
        removeIngFromReport: ing => {
            dispatch(ingRemoveDependency(ing))
        }
    };
};

export default withRouter(withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(IngredientDetailViewPage))));
