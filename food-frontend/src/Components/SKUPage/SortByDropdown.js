import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import labels from '../../Resources/labels';
import DropdownButton from '../GenericComponents/DropdownButton';
import { ingSearch, ingSortBy, skuSortBy, skuSearch } from '../../Redux/Actions';

const styles = {

};

class SortByDropdown extends Component {

    constructor(props){
        super(props);
        // NAME: "Name",
        //     SKU_NUM: "SKU No.",
        //     CASE_UPC: "Case UPC No.",
        //     UNIT_UPC: "Unit UPC No.",
        //     UNIT_SIZE: "Unit Size",
        //     COUNT_PER_CASE: "Count Per Case",
        //     PRODUCT_LINE: "Product Line",
        //     COMMENTS:"Comments"
        let items = [
            labels.skus.sort_by.NAME,
            labels.skus.sort_by.SKU_NUM,
            labels.skus.sort_by.CASE_UPC,
            labels.skus.sort_by.UNIT_UPC,
            labels.skus.sort_by.UNIT_SIZE,
            labels.skus.sort_by.COUNT_PER_CASE,
            labels.skus.sort_by.PRODUCT_LINE,
            labels.skus.sort_by.COMMENTS,
            labels.skus.sort_by.FORMULA_SCALE,
            labels.skus.sort_by.MANUFACTURING_RATE
        ]
        this.state={
            items
        }
    }


    componentWillMount() {

    }

    onSortBySelected = (id) => {
        this.props.search(this.state.items[id])
    }

    render() {
        const { classes, sortby } = this.props
        let selected_index = 0;
        for (var i = 0; i < this.state.items.length; i++) {
            if(sortby == this.state.items[i]){
                selected_index = i
            }
       }
        return (
            <DropdownButton 
                items={this.state.items} 
                selected_index={selected_index}
                onSelect={this.onSortBySelected}
            ></DropdownButton>
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
        search: (category) =>{
            dispatch(skuSortBy(category))
            dispatch(skuSearch())
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SortByDropdown));
