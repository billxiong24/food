import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';

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

    onEnter = (input) => {
        console.log(input + ":" + this.props.filter_type)
        console.log((input + ":" + this.props.filter_type).hashCode())
        
    }

    render() {
        const { classes, ingredient_names, filter_type } = this.props
        let suggestions = ingredient_names.map(ingredient_name => ({label:ingredient_name}))

        if(filter_type == labels.ingredients.filter_type.INGREDIENTS){
            suggestions = [];
        }

        let placeholder;

        if(filter_type == labels.ingredients.filter_type.INGREDIENTS){
            placeholder = "Add an Ingredient Name Filter"
        }else if(filter_type == labels.ingredients.filter_type.SKU_NAME){
            placeholder = "Add a SKU Name Filter"
        }else{
            placeholder = "Error in Filter Type Rendering"
        }

        return (
            <IntegrationAutosuggest
                className={classes.autosuggest}
                suggestions={suggestions}
                placeholder={placeholder}
                onEnter = {this.onEnter}
            ></IntegrationAutosuggest>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredient_names: state.ingredients.ingredient_names,
        filter_type: state.ingredients.filter_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientsPageSearchBar));
