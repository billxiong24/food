import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import labels from '../../Resources/labels';
import DropdownButton from '../GenericComponents/DropdownButton';

const styles = {

};

class SortByDropdown extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    render() {
        const { classes, sortby } = this.props
        let items = [
            labels.ingredients.sort_by.COMMENTS,
            labels.ingredients.sort_by.INGREDIENT_NAME,
            labels.ingredients.sort_by.INGREDIENT_NUM,
            labels.ingredients.sort_by.PACKAGE_COST,
            labels.ingredients.sort_by.PACKAGE_SIZE,
            labels.ingredients.sort_by.VENDOR_INFO
        ]
        let selected_index = 0;
        for (var i = 0; i < items.length; i++) {
            if(sortby == items[i]){
                selected_index = i
            }
       }
        return (
            <DropdownButton items={items} selected_index={selected_index}></DropdownButton>
        );
    }
}

const mapStateToProps = state => {
    return {
        sortby: state.ingredients.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SortByDropdown));
