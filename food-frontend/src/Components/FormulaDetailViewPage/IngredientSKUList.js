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
import { CardActionArea } from '@material-ui/core';
import { routeToPage } from '../../Redux/Actions';
import { ingDetSetIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { Icon, IconButton } from '@material-ui/core';
import delete_icon from '../../Resources/Images/delete_button_1.svg'

import {formulaDeleteIngredient} from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';

const styles = {
    icon:{
        float:'right',
        margin: 'auto 0'
    }, 
    card: {
        width: '200px',
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

class IngredientSKUList extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    onClick = (item) =>{
         
    }
    deleteItem = (item) => {
        console.log(this.props.id);
        console.log(item.id);
        this.props.deleteIngredient(this.props.id, item.id);
    }

    render() {
        const { classes, ingredients} = this.props
        return (
            <div>
                {
                ingredients.map((item, index) => (
                    <Card className={classes.card} key={index} onClick = {() => {this.onClick(item)}}>
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent onClick={console.log("")}>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                {item.name + ":" + item.num+ "*" + item.pkg_size + "  " + "Quantity: " + item.quantity + " " + item.formula_unit}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                            <Button onClick={() => this.deleteItem(item)}>
                                Delete
                            </Button>
                    </Card>
                ))
                }
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.formula_details.ingredients,
        id: state.formula_details.id
    };
};

const mapDispatchToProps = dispatch => {
    return {

        deleteIngredient: (formula_id, ing_id) => {
            dispatch(formulaDeleteIngredient(formula_id, ing_id));
        }
    }
};  

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientSKUList));
