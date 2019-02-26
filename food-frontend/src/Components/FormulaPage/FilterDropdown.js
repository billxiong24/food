import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import labels from '../../Resources/labels';
import { formulaSetFilterType, formulaSearch } from '../../Redux/Actions';

const styles = {

};

class FilterDropdown extends Component {

    constructor(props){
        super(props);
        this.state={
            items: [labels.formulas.filter_type.INGREDIENTS, labels.formulas.filter_type.FORMULA_NAME]
        }
    }


    componentWillMount() {

    }

    onFilterSelected = (id) => {
        console.log(this.state.items[id])
        this.props.setFilterType(this.state.items[id])
    }

    render() {
        const { classes, filter_type } = this.props
        
        let selected_index = 0;
        for (var i = 0; i < this.state.items.length; i++) {
            if(filter_type == this.state.items[i]){
                selected_index = i
            }
       }
        return (
            <DropdownButton 
                items={this.state.items}
                selected_index={selected_index}
                onSelect={this.onFilterSelected}
            ></DropdownButton>
        );
    }
}

const mapStateToProps = state => {
    return {
        filter_type: state.formulas.filter_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFilterType: filter_type =>{
            dispatch(formulaSetFilterType(filter_type))
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(FilterDropdown));
