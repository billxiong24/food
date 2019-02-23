import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { formulaDetAddIngredient, formulaDetAddFormula, formulaDetAddError, formulaDetDeleteError, formulaDetSetNew, formulaDetUpdateFormula, formulaDetSetEditing, formulaDetDeleteFormula } from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';
import { routeToPage, ingDeleteIng, ingAddDependency, ingRemoveDependency } from '../../Redux/Actions';
import IngredientSKUList from './IngredientSKUList';
import { withRouter, Link } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import EditableNumeric from '../GenericComponents/EditableNumeric';
import common, { getFormInsertErrors, getFormUpdateErrors } from '../../Resources/common';
import {store} from "../../index"
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';


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
    add_ing: {
        backgroundColor: 'blue'
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

class FormulaDetailViewPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonText:"Edit",
            editing:false,
            formulaName:this.props.formulaName,
            formulaNum:this.props.formulaNum,
            formulaComment:this.props.formulaComment,
            new:false,
            new_ingredient_name: null,
            new_ingredient_quantity: null,
            new_ingredient_unit: null 
        }
        console.log("FORMULA DETAIL VIEW")
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
        const formula = {
            name: this.state.formulaName,
            num: this.state.formulaNum,
            comment: this.state.formulaComment,
            id: this.props.id
        }

        let errs = getFormUpdateErrors(formula);
        console.log(errs);
        if(errs.length === 0){
            this.props.update(formula) // dispatch
        }
        else {
            for(let i = 0; i < errs.length; i++) {
                this.props.pushError(errs[i]);
            }
        }
    }

    onAddClick = () => {
        const formula = {
            name: this.state.formulaName,
            num: this.state.formulaNum,
            comment: this.state.formulaComment
        }
        let errors = getFormInsertErrors(formula);
        if(errors.length == 0){
            this.setState({
                buttonText: "Edit",
                editing:false,
                new: false
            });
            this.props.add(formula)
        }else{
            for (var i = 0; i < errors.length; i++) {
                this.props.pushError(errors[i])
            }
        }
    }

    onDelete = () => {
        const formula= {
            id:this.props.id
        }
        console.log("am deleting a formulaaa");
        this.props.del(formula)
        
    }

    addIngredient = () => {
        this.props.addIng(this.props.id, {
            name: this.state.new_ingredient_name,
            quantity: this.state.new_ingredient_quantity,
            unit: this.state.new_ingredient_unit
        });
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
                        label={"Formula Name"} 
                        editing={editing}
                        key={"formulaName"}
                        field={"formulaName"}
                        onChange={this.onChange}>
                        {this.state.formulaName}
                    </EditableText>


                    <EditableNumeric
                        label={"Formula No."}
                        editing={editing}
                        key={"formulaNum"}
                        field={"formulaNum"}
                        onChange={this.onChange}>
                        {this.state.formulaNum}
                    </EditableNumeric>
                    <EditableText 
                        label={"Comment"} 
                        editing={editing}
                        key={"formulaComment"}
                        field={"formulaComment"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.formulaComment}
                    </EditableText>
                    {
                    (this.props.users.id === common.admin && newValue )?
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
                        (this.props.users.id === common.admin && !editing) ?
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
                        <div></div>
                    }

                    
                </div>
                <div className={classes.left}>
                    <Typography>
                        Ingredients List
                    </Typography>
                    <IngredientSKUList></IngredientSKUList>
                    <div className = {classes.add_ing}>
                    <EditableText 
                        label={"Ingredient name"} 
                        editing={editing}
                        key={"new_ingredient_name"}
                        field={"new_ingredient_name"}
                        onChange={this.onChange}
                        multiline={false}>
                        { this.state.new_ingredient_name}
                    </EditableText>
                    <EditableNumeric
                        label={"Ingredient Quantity"} 
                        editing={editing}
                        key={"new_ingredient_quantity"}
                        field={"new_ingredient_quantity"}
                        onChange={this.onChange}
                        multiline={false}>
                        { this.state.new_ingredient_quantity}
                    </EditableNumeric>
                    <EditableText 
                        label={"Unit"} 
                        editing={editing}
                        key={"new_ingredient_unit"}
                        field={"new_ingredient_unit"}
                        onChange={this.onChange}
                        multiline={false}>
                        { this.state.new_ingredient_unit }
                    </EditableText>
                    </div>
                    <Button editing={editing} onClick={this.addIngredient}>
                       Add 
                    </Button>
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
    return {
        formulaName: state.formula_details.formulaName, 
        formulaNum: state.formula_details.formulaNum,
        formulaComment: state.formula_details.formulaComment,
        id: state.formula_details.id,
        errors: state.formula_details.errors,
        skus: state.formula_details.skus,
        users: state.users,
        valid: state.formula_details.valid,
        editing: state.formula_details.editing,
        newValue: state.formula_details.new
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update : (formula) =>
        {
            dispatch(formulaDetUpdateFormula(formula))
        },
        back: () => {
            dispatch(formulaDetSetEditing(false))
            dispatch(formulaDetSetNew(false))
            ownProps.history.push('/formula')
        },
        del: (formula) => {
            dispatch(formulaDetSetEditing(formula))
            dispatch(formulaDetSetEditing(false))
            dispatch(formulaDetDeleteFormula(formula.id))
            ownProps.history.push('/formula')
        },
        add: (formula) =>{
            dispatch(formulaDetAddFormula(formula))
        },
        addIng: (formula_id, ing) => {
            dispatch(formulaDetAddIngredient(formula_id, ing));
        }, 
        deleteError: (error) => {
            dispatch(formulaDetDeleteError(error))
        },
        pushError: err => {
            dispatch(formulaDetAddError(err))
            setTimeout(function(){dispatch(formulaDetDeleteError(err))}, 2000);
        },
        edit: () => {
            dispatch(formulaDetSetEditing(true))
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(FormulaDetailViewPage)));
