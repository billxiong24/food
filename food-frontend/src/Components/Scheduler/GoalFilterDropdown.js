import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import labels from '../../Resources/labels';
import { ingSetFilterType, ingSearch } from '../../Redux/Actions';
import { mapStateToProps, mapDispatchToProps } from './DataConverter';

const styles = {

};

class GoalFilterDropdown extends Component {

    constructor(props){
        super(props);
        this.state={
            items: props.filter_types
        }
    }


    componentWillMount() {

    }

    onFilterSelected = (index) => {
        //console.log(this.state.items[id])
        this.props.set_filter_type_index(index)
    }

    render() {
        const { classes, filter_type_index } = this.props
        
        return (
            <DropdownButton 
                items={this.state.items}
                selected_index={filter_type_index}
                onSelect={this.onFilterSelected}
                type="white"
            ></DropdownButton>
        );
    }
}

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(GoalFilterDropdown));
