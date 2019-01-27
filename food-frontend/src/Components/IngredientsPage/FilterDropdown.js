import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import labels from '../../Resources/labels';

const styles = {

};

class FilterDropdown extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    render() {
        const { classes, filter_type } = this.props
        let items = [labels.ingredients.filter_type.INGREDIENTS, labels.ingredients.filter_type.SKU_NAME]
        let selected_index = 0;
        for (var i = 0; i < items.length; i++) {
            if(filter_type == items[i]){
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
        filter_type: state.ingredients.filter_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(FilterDropdown));
