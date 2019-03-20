import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { formulaAddFilter, formulaSearch, formulaGetSkus, formulaAddError, formulaDeleteError } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';
import { skuAddFilter, skuSearch, ingredientsFormulaAuto }  from '../../Redux/Actions'; 

const styles = {
    autosuggest:{
        fontSize: 14,
        fontFamily: 'Open Sans',
        fontWeight: 300
    }
};

class IngredientsPageSearchBar extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    onIngredientFilterEnter = (input) => { 
        let message = "Choose Ingredient Filter from Suggestions List"
        this.props.pushError({errMsg: message, id:message.hashCode()})
    }


    onIngredientFilterSuggest = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        
        this.props.addFilter(new_filter);
    }
    onFormulaFilterEnter = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        this.props.addFilter(new_filter);
    }

    onChange = (input) => {
        //this.props.getSKUs(input)
    }
    onIngredientChange = (input) => { 
        this.props.getIngredients(input)
    }


    render() {
        const { classes, filter_type } = this.props
        return (
            filter_type == labels.formulas.filter_type.FORMULA_NAME ?
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={[]}
                    placeholder={"Add a Formula Name Filter"}
                    onEnter = {this.onFormulaFilterEnter}
                    onSuggest = {this.onFormulaFilterEnter}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
            :
            <IntegrationAutosuggest                                                                                                                                                      
            className={classes.autosuggest}
            suggestions={this.props.ingredient_names.map(ingredient_name => ({label:ingredient_name.name, id:ingredient_name.num}))}
            placeholder={"Add an Ingredient Filter"}
            onEnter = {this.onIngredientFilterEnter}
            onSuggest = {this.onIngredientFilterSuggest}
            onChange = {this.onIngredientChange}
            ></IntegrationAutosuggest>

        );
    }
}

const mapStateToProps = state => {
    return {
        formula_names: state.formulas.formula_names,
        ingredient_names: state.formulas.ingredient_names,
        filter_type: state.formulas.filter_type,
        filters: state.formulas.filters
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addFilter: filter => {
            dispatch(formulaAddFilter(filter))
            dispatch(formulaSearch())
        },
        getIngredients: name => dispatch(ingredientsFormulaAuto(name)),
        pushError: err => {
            dispatch(formulaAddError(err))
            setTimeout(function(){dispatch(formulaDeleteError(err))}, 2000);
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientsPageSearchBar));
