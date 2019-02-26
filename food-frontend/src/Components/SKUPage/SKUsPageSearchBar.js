import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { skuAddFilter, skuSearch, ingredientNameAutocomplete, productLineNameAutoComplete, skuAddError, skuDeleteError } from '../../Redux/Actions';

const styles = {
    autosuggest:{
        fontSize: 14,
        fontFamily: 'Open Sans',
        fontWeight: 300
    }
};

class SKUsPageSearchBar extends Component {

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

    onIngredientChange = (input) => {
        this.props.getIngredients(input)
    }

    onProductLineFilterEnter = (input) => {
        let message = "Choose Product Line Filter from Suggestions List"
        this.props.pushError({errMsg: message, id:message.hashCode()})

    }

    onProductLineFilterSuggest = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        
        this.props.addFilter(new_filter);
    }

    onProductLineChange = (input) => {
        this.props.getProductLines(input)
    }

    onSKUFilterEnter = (input) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        this.props.addFilter(new_filter);
    }

    onSKUChange = (input) => {
        
    }
    
    onSKUFilterSuggest = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        
        this.props.addFilter(new_filter);
    }

    render() {
        const { classes, ingredient_names, filter_type } = this.props
        let suggestions = ingredient_names.map(ingredient_name => ({label:ingredient_name}))

        if(filter_type == labels.skus.filter_type.SKUS){
            suggestions = [];
        }

        let placeholder;

        if(filter_type == labels.skus.filter_type.PRODUCT_LINE){
            return (
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={this.props.product_line_names.map(product_line => ({label:product_line.name, id:product_line.num}))}
                    placeholder={"Add a Product Line Filter"}
                    onEnter = {this.onProductLineFilterEnter}
                    onSuggest = {this.onProductLineFilterSuggest}
                    onChange = {this.onProductLineChange}
                ></IntegrationAutosuggest>
            );
        }else if(filter_type == labels.skus.filter_type.SKU_NAME){
            return (
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={[]}
                    placeholder={"Add a SKU Name Filter"}
                    onEnter = {this.onSKUFilterEnter}
                    onSuggest = {this.onSKUFilterSuggest}
                    onChange = {this.onSKUChange}
                ></IntegrationAutosuggest>
            );
        }else if(filter_type == labels.skus.filter_type.INGREDIENTS){
            return (
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={this.props.ingredient_names.map(ingredient_name => ({label:ingredient_name.name, id:ingredient_name.num}))}
                    placeholder={"Add an Ingredient Filter"}
                    onEnter = {this.onIngredientFilterEnter}
                    onSuggest = {this.onIngredientFilterSuggest}
                    onChange = {this.onIngredientChange}
                ></IntegrationAutosuggest>
            );
        }else{
            return (
                <div></div>
            );
        }
    }
}

const mapStateToProps = state => {
    return {
        ingredient_names: state.skus.ingredient_names,
        product_line_names: state.skus.product_line_names,
        filter_type: state.skus.filter_type,
        filters: state.skus.filters
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addFilter: filter => {
            dispatch(skuAddFilter(filter))
            dispatch(skuSearch())
        },
        getIngredients: name => dispatch(ingredientNameAutocomplete(name)),
        getProductLines: name => dispatch(productLineNameAutoComplete(name)),
        pushError: err => {
            dispatch(skuAddError(err))
            setTimeout(function(){dispatch(skuDeleteError(err))}, 2000);
        }

    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUsPageSearchBar));
