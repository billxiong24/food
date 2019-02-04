import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import labels from '../../Resources/labels';
import { ingSetFilterType, ingSearch } from '../../Redux/Actions';

const styles = {

};

class FilterDropdown extends Component {

    constructor(props){
        super(props);
        this.state={
            items: [labels.ingredients.filter_type.INGREDIENTS, labels.ingredients.filter_type.SKU_NAME]
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
        filter_type: state.ingredients.filter_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFilterType: filter_type =>{
            dispatch(ingSetFilterType(filter_type))
        }
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(FilterDropdown));
