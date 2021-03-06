import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import labels from '../../Resources/labels';
import { ingSetFilterType, skuSetFilterType } from '../../Redux/Actions';

const styles = {

};

class FilterDropdown extends Component {

    constructor(props){
        super(props);
        this.state={
            items: [labels.skus.filter_type.INGREDIENTS, labels.skus.filter_type.SKU_NAME, labels.skus.filter_type.PRODUCT_LINE]
        }
    }


    componentWillMount() {

    }

    onFilterSelected = (id) => {
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
        filter_type: state.skus.filter_type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFilterType: filter_type =>dispatch(skuSetFilterType(filter_type))
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(FilterDropdown));
