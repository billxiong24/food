import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import { ingDetUpdateIng, ingDetAddIng, ingDetDeleteError, ingDetAddError, ingDetSetEditing, ingDetSetNew } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { ingDeleteIng, ingAddDependency, ingRemoveDependency } from '../../Redux/Actions';
import IngredientSKUList from './IngredientSKUList';
import { withRouter } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import EditableNumeric from '../GenericComponents/EditableNumeric';
import {  getIngErrors } from '../../Resources/common';
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
            unit: this.props.unit,
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
        if(this.props.id == null){
            this.state.editing = true
            this.state.new = true
            this.state.buttonText = "Add"
        }
    }


    componentWillMount() {
    }

    onChange = (input,key) => {
        this.setState({
            [key]:input
        });
    }

    
    onEditClick = () => {
        this.props.edit()
    }
    

    

    onSaveClick = () => {
        const ing = {
            unit: this.state.unit,
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
            this.props.update(ing) // dispatch
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
        
    }

    onAddClick = () => {
        const ing = {
            unit: this.state.unit,
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
            unit: this.state.unit,
            name:this.state.ingredientName,
            num:this.state.ingredientNum,
            vend_info:this.state.vend_info,
            pkg_size:this.state.packageSize,
            pkg_cost:this.state.costPerPackage,
            comments:this.state.comment,
            id:this.props.id,
            skus:this.props.skus
        }
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
                        label={"Unit"} 
                        editing={editing}
                        key={"unit"}
                        field={"unit"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.unit}
                    </EditableText>

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
        unit: state.ingredient_details.unit,
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
