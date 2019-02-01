import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import FilterItem from './FilterItem';
import ItemList from '../GenericComponents/ItemList';

const styles = {
    filters_list:{
    }
};

class FilterList extends Component {

    constructor(props) {
        super(props);
        
    }


    componentWillMount() {

    }

    render() {
        const { classes, filters } = this.props
        console.log(filters)
        return (
            <div className={classes.filters_list}>
                <ItemList items={filters}>
                    <FilterItem></FilterItem>
                </ItemList>
            </div>
        );
    }
}  

const mapStateToProps = state => {
    return {
        filters:state.skus.filters
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FilterList));
