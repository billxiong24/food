import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import labels from '../../Resources/labels';
import { ingAddFilter, ingSearch, ingGetSkus } from '../../Redux/Actions';
import { skuFormatter } from '../../Scripts/Formatters';
import { skuDetGetIng, skuDetIngAutocomplete, skuDetAddIngLocal } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import TextField from '@material-ui/core/TextField';

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
        this.state ={
            quantity: 1
        }
    }


    componentWillMount() {

    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
      };

    

    onIngredientFilterEnter = (input) => {
        
    }
    
    onIngredientFilterSuggest = (input, num) => {
        console.log("SKUDETAILINGREDIENTAUTOCOMPLETE ONSUGGEST")
        num.quantity = this.state.quantity
        console.log(num)
        this.props.addIng(num)
        this.setState({
            quantity: 1
        })
    }

    onChange = (input) => {
        console.log(input)
        this.props.getIngredientNames(input)
    }

    render() {
        const { classes, ingredient_names, filter_type, editing } = this.props
        return (
            editing ?
            <div>
                <IntegrationAutosuggest
                    className={classes.autosuggest}
                    suggestions={ingredient_names.map(ingredient => ({label:ingredient.name, id:ingredient}))}
                    placeholder={"Enter New Ingredient"}
                    onEnter = {this.onIngredientFilterEnter}
                    onSuggest = {this.onIngredientFilterSuggest}
                    onChange = {this.onChange}
                ></IntegrationAutosuggest>
                <TextField
                    id="standard-number"
                    label="Number"
                    value={this.state.quantity}
                    onChange={this.handleChange('quantity')}
                    type="number"
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    margin="normal"
                />
            </div>:
            <div></div>
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
        getIngredientNames: ing_name => dispatch(skuDetIngAutocomplete(ing_name)),
        addIng: ing => dispatch(skuDetAddIngLocal(ing))
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUDetailIngredientAutocomplete));