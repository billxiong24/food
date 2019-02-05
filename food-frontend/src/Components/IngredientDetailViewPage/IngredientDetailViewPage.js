import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng, ingDetAddIng, ingDetDeleteError, ingDetAddError } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage, ingDeleteIng } from '../../Redux/Actions';
import IngredientSKUList from './IngredientSKUList';
import { withRouter, Link } from 'react-router-dom';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import EditableNumeric from '../GenericComponents/EditableNumeric';
import { isValidIng, getIngErrors } from '../../Resources/common';


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
            new:false
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

    

    

    onButtonClick = () => {
        const ing = {
            name:this.state.ingredientName,
            num:this.state.ingredientNum,
            vend_info:this.state.vend_info,
            pkg_size:this.state.packageSize,
            pkg_cost:this.state.costPerPackage,
            comments:this.state.comment,
            id:this.props.id
        }
        
        if(this.state.buttonText == "Edit"){
            this.setState({
                buttonText: "Save",
                editing:true,
            });
        }else{
            let errors = getIngErrors(ing);
            if(errors.length == 0){
                this.setState({
                    buttonText: "Edit",
                    editing:false,
                });
                console.log("INGREDIENTDETAILVIEW")
                console.log(ing)
                
                this.props.update(ing)
            }else{
                for (var i = 0; i < errors.length; i++) {
                    this.props.pushError(errors[i])
                }
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

    render() {
        const { classes } = this.props
        return (
            <div className = {classes.ingredient_page_container}>
                <Button component={Link} to={'/ingredients'}>
                    Back
                </Button>
                <div className = {classes.ingredient_detail_view}>
                    <Typography>
                        Ingredient Details
                    </Typography>
                    <EditableText 
                        label={"Ingredient Name"} 
                        editing={this.state.editing}
                        key={"ingredientName"}
                        field={"ingredientName"}
                        onChange={this.onChange}>
                        {this.state.ingredientName}
                    </EditableText>


                    <EditableNumeric
                        label={"Ingredient No."}
                        editing={this.state.editing}
                        key={"ingredientNum"}
                        field={"ingredientNum"}
                        onChange={this.onChange}>
                        {this.state.ingredientNum}
                    </EditableNumeric>

                    <EditableText 
                        label={"Vendor Info"}
                        editing={this.state.editing}
                        key={"vend_info"}
                        field={"vend_info"}
                        onChange={this.onChange}>
                        {this.state.vend_info}
                    </EditableText>

                    <EditableText 
                        label={"Package Size"} 
                        editing={this.state.editing}
                        key={"packageSize"}
                        field={"packageSize"}
                        onChange={this.onChange}>
                        {this.state.packageSize}
                    </EditableText>


                    <EditableNumeric
                        label={"Cost per Package"} 
                        editing={this.state.editing}
                        key={"costPerPackage"}
                        field={"costPerPackage"}
                        onChange={this.onChange}>
                        {this.state.costPerPackage}
                    </EditableNumeric>

                    <EditableText 
                        label={"Comment"} 
                        editing={this.state.editing}
                        key={"comment"}
                        field={"comment"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.comment}
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


const mapStateToProps = state => {
    console.log(state)
    return {
        ingredientName: state.ingredient_details.ingredientName,
        ingredientNum: state.ingredient_details.ingredientNum,
        vend_info: state.ingredient_details.vend_info,
        packageSize: state.ingredient_details.packageSize,
        costPerPackage: state.ingredient_details.costPerPackage,
        comment: state.ingredient_details.comment,
        id: state.ingredient_details.id,
        errors: state.ingredient_details.errors
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        update : (ing) =>
        {
            dispatch(ingDetUpdateIng(ing))
        },
        back: () => {
            dispatch(routeToPage(0))
        },
        delete: (ing) => {
            dispatch(ingDeleteIng(ing))
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
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientDetailViewPage)));
