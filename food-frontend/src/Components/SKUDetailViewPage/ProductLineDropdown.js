import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import { skuSetFilterType } from '../../Redux/Actions';
import { skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';


const styles = {

};

class ProductLineDropdown extends Component {

    constructor(props){
        super(props);
        this.state={
            items: this.props.product_lines
        }
    }


    componentWillMount() {

    }

    onFilterSelected = (id) => {
        this.props.onChange(this.state.items[id])
    }

    render() {
        const { classes, filter_type, current_product_line, product_lines } = this.props

        
        console.log("PRODUCTLINEDROPDOWN COMPONENT")
        console.log(current_product_line)
        console.log(product_lines)
        let selected_index = -1;
        for (var i = 0; i < this.state.items.length; i++) {
            if(current_product_line == this.state.items[i]){
                selected_index = i
            }
       }
       if(selected_index == -1){
           selected_index = 0
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
        filter_type: state.skus.filter_type,
        current_product_line: state.sku_details.prd_line,
        product_lines: state.sku_details.product_lines.map((product_line, index) => product_line.name)
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setFilterType: filter_type =>dispatch(skuSetFilterType(filter_type)),
        getProductLines: () => dispatch(skuDetGetProductLine())
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(ProductLineDropdown));