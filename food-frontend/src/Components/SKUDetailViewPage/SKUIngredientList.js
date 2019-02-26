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
import labels from '../../Resources/labels';
import { withRouter } from 'react-router-dom'
import { addToList, removeFromList } from '../../Resources/common';
import { skuDetDeleteIngLocal } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import { formulaDetGetSkus, formulaDetGetIngredients, formulaDetSetFormula } from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';

const styles = {
    card: {
        width: '100 %',
        marginBottom:20,
        marginTop:20,
        backgroundColor:labels.colors.primaryColor,
        padding:10,
        width:'300px',
        height:'50px'
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
      },
      icon:{
          float:'right',
          margin: 'auto 0'
      }

};

class SKUIngredientList extends Component {

    constructor(props){
        super(props);
        this.state = {
            deleted_list:[],
            active_list: this.props.ingredients
        }
    }


    componentWillMount() {

    }

    onClick = (item) =>{
        this.props.delete(item)
    }
    formulaOnClick= (item) =>{
        this.props.navigateToFormula(item, this.props.history);
    }
    render() {
        const { classes, manufacturing_lines, current_ingredients, current_formula, editing } = this.props
        return (
            editing ?
            <div>
                {
                (current_ingredients.map((item, index) => (
                    
                    <Card className={classes.card} key={index}>
                        
                        <CardContent >
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                                <div>
                                    {item.name}
                                </div>
                                <div>
                                    {item.num}
                                </div>
                            </Typography>
                        </CardContent>
                        
                    </Card>
                    
                    
                ))
                )}
            </div>
            :
            <div>
                {
                (current_ingredients.map((item, index) => (
                    <Card className={classes.card} key={index}>
                        
                        <CardContent >
            <div>Name: {item.name} </div>
            <div>Num: {item.num} </div>
                            <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                            </Typography>
                            
                            
                        </CardContent>
                        
                    </Card>
                ))
                )}
            <Card className={classes.card} onClick = {() => {this.formulaOnClick(current_formula)}}>
            <div>FORMULA</div>
            <div>Name: {current_formula.name} </div>
            <div>Num: {current_formula.num} </div>
                
                <CardContent >
                    <Typography>
                       
                    </Typography>
                </CardContent>
                
            </Card>
            <div>
            {
                manufacturing_lines.map((item, index) => (
                    <Card className={classes.card} key={index}>
                        <CardContent >
                                <div>
                                    {item.name}
                                </div>
                                <div>
                                    {item.shortname}
                                </div>
                        </CardContent>
                    </Card>

                ))
            }
            
            </div>
            </div>

        );
    }
}

const mapStateToProps = state => {
    return {
        current_ingredients: state.sku_details.current_ingredients,
        current_formula: state.sku_details.current_formula, 
        manufacturing_lines: state.sku_details.manufacturing_lines
    };
};

const mapDispatchToProps = dispatch => {
    return {
        delete: (ing) => { dispatch(skuDetDeleteIngLocal(ing))}, 
        navigateToFormula: (formula, history) => {
            formula.made_formula = true;
            return Promise.resolve(null)
            .then(function(res) {
                dispatch(formulaDetSetFormula(formula))
            })
            .then(function(res) {
                dispatch(formulaDetGetIngredients(formula.id))
            })
            .then(function(res) {
                dispatch(formulaDetGetSkus(formula.id))
            })
            .then(function(res) {
                history.push('/formula/details')
            });
        }
    }
    
};  

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUIngredientList)));
