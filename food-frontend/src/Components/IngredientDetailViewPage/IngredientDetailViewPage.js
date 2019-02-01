import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
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
    }

};

class IngredientDetailViewPage extends Component {

    constructor(props){
        super(props);
        this.state = {
            buttonText:"Edit",
            editing:false,
            ingredientName:this.props.ingredientName,
            ingredientNum:this.props.ingredientNum,
            packageSize:this.props.packageSize,
            costPerPackage:this.props.costPerPackage,
            comment:this.props.comment,
        }
    }


    componentWillMount() {

    }

    onChange = (input,key) => {
        this.setState({
            [key]:input
        });
    }

    

    onButtonClick = () => {
        if(this.state.buttonText == "Edit"){
            this.setState({
                buttonText: "Save",
                editing:true,
            });
        }else{
            this.setState({
                buttonText: "Edit",
                editing:false,
            });
            const ing = {
                ingredientName:this.state.ingredientName,
                ingredientNum:this.state.ingredientNum,
                packageSize:this.state.packageSize,
                costPerPackage:this.state.costPerPackage,
                comment:this.state.comment,
            }
            this.props.update(ing)
        }
    }

    render() {
        const { classes } = this.props
        return (
            <div className = {classes.ingredient_page_container}>
                <div className = {classes.ingredient_detail_view}>
                    <Typography>
                        Ingredient Details
                    </Typography>
                    <EditableText 
                        label={"Ingredient Name"} 
                        editing={this.state.editing}
                        key={"ingredientName"}
                        onChange={this.onChange}>
                        {this.state.ingredientName}
                    </EditableText>

                    <EditableText 
                        label={"Ingredient No."}
                        editing={this.state.editing}
                        key={"ingredientNum"}
                        onChange={this.onChange}>
                        {this.state.ingredientNum}
                    </EditableText>

                    <EditableText 
                        label={"Package Size"} 
                        editing={this.state.editing}
                        key={"packageSize"}
                        onChange={this.onChange}>
                        {this.state.packageSize}
                    </EditableText>

                    <EditableText 
                        label={"Cost per Package"} 
                        editing={this.state.editing}
                        key={"costPerPackage"}
                        onChange={this.onChange}>
                        {this.state.costPerPackage}
                    </EditableText>

                    <EditableText 
                        label={"Comment"} 
                        editing={this.state.editing}
                        key={"comment"}
                        onChange={this.onChange}
                        multiline={true}>
                        {this.state.comment}
                    </EditableText>
                    <Button 
                        className={classes.button} 
                        editing={this.state.editing}
                        onClick = {this.onButtonClick}
                        >
                        {this.state.buttonText}
                    </Button>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    console.log(state)
    return {
        ingredientName: state.ingredient_details.ingredientName,
        ingredientNum: state.ingredient_details.ingredientNum,
        packageSize: state.ingredient_details.packageSize,
        costPerPackage: state.ingredient_details.costPerPackage,
        comment: state.ingredient_details.comment
    };
};

const mapDispatchToProps = dispatch => {
    return {
        update : (ing) =>
        {
            dispatch(ingDetUpdateIng(ing))
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientDetailViewPage));
