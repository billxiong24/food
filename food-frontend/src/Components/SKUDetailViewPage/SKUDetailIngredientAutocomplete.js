import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { ingAddFilter, ingSearch, ingGetSkus } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';
import { skuDetGetIng, skuDetIngAutocomplete } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';

const styles = {
    autosuggest:{
        fontSize: 14,
        fontFamily: 'Open Sans',
        fontWeight: 300
    }
};

class SKUDetailIngredientAutocomplete extends Component {

    constructor(props){
        super(props);
        this.props.getIngredientNames("")
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
        this.props.getIngredientNames(input)
    }

    render() {
        const { classes, ingredient_names, filter_type } = this.props
        return (
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={ingredient_names.map(ingredient => ({label:ingredient.name, id:ingredient.id}))}
                    placeholder={"Enter New Ingredient"}
                    onEnter = {this.onSKUFilterEnter}
                    onSuggest = {this.onSKUFilterSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredient_names: state.sku_details.ingredient_suggestions,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getIngredientNames: ing_name => dispatch(skuDetIngAutocomplete(ing_name))
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUDetailIngredientAutocomplete));