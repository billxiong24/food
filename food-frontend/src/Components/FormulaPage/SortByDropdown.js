import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import labels from '../../Resources/labels';
import DropdownButton from '../GenericComponents/DropdownButton';
import { formulaSearch, formulaSortBy } from '../../Redux/Actions';

const styles = {

};

class SortByDropdown extends Component {

    constructor(props){
        super(props);
        let items = [
            labels.formulas.sort_by.COMMENTS,
            labels.formulas.sort_by.FORMULA_NUM,
            labels.formulas.sort_by.FORMULA_NAME
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
        sortby: state.formulas.sortby
    };
};

const mapDispatchToProps = dispatch => {
    return {
        search: (category) =>{
            dispatch(formulaSortBy(category))
            dispatch(formulaSearch())
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SortByDropdown));
