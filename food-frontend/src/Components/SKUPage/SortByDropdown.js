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
            labels.skus.sort_by.NAME,
            labels.skus.sort_by.SKU_NUM,
            labels.skus.sort_by.CASE_UPC,
            labels.skus.sort_by.UNIT_UPC,
            labels.skus.sort_by.COUNT_PER_CASE,
            labels.skus.sort_by.PRODUCT_LINE
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
        sortby: state.skus.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SortByDropdown));
