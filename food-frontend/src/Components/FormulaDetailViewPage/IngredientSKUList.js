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
import { withRouter } from 'react-router-dom'
import { skuDetGetManLines, skuDetGetFormula, skuDetSetSku, skuDetGetIng, skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';

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
    onSkuClick = (item) => {
        this.props.navigateToSku(item, this.props.history);
    }
    deleteItem = (item) => {
        this.props.deleteIngredient(this.props.id, item.id);
    }

    render() {
        const { classes, ingredients, skus } = this.props
        return (
            <div>
                {
                ingredients.map((item, index) => (
                    <Card className={classes.card} key={index} onClick = {() => {this.onClick(item)}}>
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent>
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
            <div> ======= SKUS ======== </div>
            {
                skus.map((item, index) => (
                    <Card className={classes.card} key={index} onClick = {() => {this.onSkuClick(item)}}>
                        <CardActionArea
                        className = {classes.cardAction}
                        >
                        <CardContent>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                {item.name + ":" + item.num }
                                <div>
                                    {item.unit_size + "*" + item.count_per_case}
                                </div>
                            </Typography>
                        </CardContent>
                        </CardActionArea>
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
        id: state.formula_details.id, 
        skus: state.formula_details.skus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        
        navigateToSku: (sku, history) => {
            Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
                .then(function (response) {
                    return Promise.resolve(dispatch(skuDetSetSku(sku)));
                    //return response;
                })
                .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetFormula(sku.formula_id)));

                })
                .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetIng(sku.id)));
                })
                .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetManLines(sku.id)));
                })
                .then(function(r) {
                    history.push('/skus/details')
                })
        }, 
        deleteIngredient: (formula_id, ing_id) => {
            dispatch(formulaDeleteIngredient(formula_id, ing_id));
        }
    }
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientSKUList)));
