import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';

const styles = {

};

class IngredientList extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    render() {
        const { classes, ingredients } = this.props
        return (
            <ItemList items={ingredients}>
              <SimpleCard></SimpleCard>
            </ItemList>
        );
    }
}

const mapStateToProps = state => {
    return {
        ingredients: state.ingredients.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(IngredientList));
