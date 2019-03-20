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
import { withRouter } from 'react-router-dom'
import { formulaDetGetSkus, formulaDetGetIngredients, formulaDetSetFormula } from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';

 
 
import labels from '../../Resources/labels';

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
    }


    componentWillMount() {

    }

    onClick = (item) =>{
        item.made_formula= true;
         this.props.setFormula(item, this.props.history)
    }

    render() {
        const { classes, ingredients, history, sortby } = this.props
        return (
            <div>
                {
                this.props.ingredients.map((item, index) => (
                    <Card className={classes.card} key={index} onClick = {() => {this.onClick(item)}}>
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
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.formulas.items,
        sortby: state.formulas.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFormula: (formula, history) => {
            dispatch(formulaDetSetFormula(formula))
            dispatch(formulaDetGetIngredients(formula.id))
            dispatch(formulaDetGetSkus(formula.id))
            history.push('/formula/details')
        }
    };
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientList)));
