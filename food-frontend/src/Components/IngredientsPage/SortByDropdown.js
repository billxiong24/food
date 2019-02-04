import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import labels from '../../Resources/labels';
import DropdownButton from '../GenericComponents/DropdownButton';
import { ingSearch, ingSortBy } from '../../Redux/Actions';

const styles = {

};

class SortByDropdown extends Component {

    constructor(props){
        super(props);
        let items = [
            labels.ingredients.sort_by.COMMENTS,
            labels.ingredients.sort_by.INGREDIENT_NAME,
            labels.ingredients.sort_by.INGREDIENT_NUM,
            labels.ingredients.sort_by.PACKAGE_COST,
            labels.ingredients.sort_by.PACKAGE_SIZE,
            labels.ingredients.sort_by.VENDOR_INFO
        ]
        this.state={
            items
        }
    }


    componentWillMount() {

    }

    onSortBySelected = (id) => {
        console.log(this.state.items[id])
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
        sortby: state.ingredients.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
        search: (category) =>{
            dispatch(ingSortBy(category))
            dispatch(ingSearch())
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SortByDropdown));
