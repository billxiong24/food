import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { ingAddFilter, ingSearch, ingGetSkus } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';

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
        console.log(input + ":" + this.props.filter_type)
        console.log((input + ":" + this.props.filter_type).hashCode())
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        
        this.props.addFilter(new_filter);
    }

    onIngredientFilterSuggest = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: (input + ":" + this.props.filter_type).hashCode()
        }
        
        this.props.addFilter(new_filter);
    }

    onSKUFilterEnter = (input) => {
        
    }
    
    onSKUFilterSuggest = (input, num) => {
        let new_filter = {
            type: this.props.filter_type,
            string: input,
            id: num
        }
        
        this.props.addFilter(new_filter);
    }

    onChange = (input) => {
        console.log(input)
        this.props.getSKUs(input)
    }

    render() {
        const { classes, skus, filter_type } = this.props
        return (
            filter_type == labels.ingredients.filter_type.INGREDIENTS ?
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={[]}
                    placeholder={"Add an Ingredient Name Filter"}
                    onEnter = {this.onIngredientFilterEnter}
                    onSuggest = {this.onIngredientFilterSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
            :
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={skus.map(sku => ({label:skuFormatter(sku), id:sku.id}))}
                    placeholder={"Add a SKU Name Filter"}
                    onEnter = {this.onSKUFilterEnter}
                    onSuggest = {this.onSKUFilterSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredient_names: state.ingredients.ingredient_names,
        filter_type: state.ingredients.filter_type,
        filters: state.ingredients.filters,
        skus: state.ingredients.skus
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addFilter: filter => {
            dispatch(ingAddFilter(filter))
            dispatch(ingSearch())
        },
        getSKUs: ing => dispatch(ingGetSkus(ing))
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientsPageSearchBar));
