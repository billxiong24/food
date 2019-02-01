import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';

const styles = {

};

class SKUList extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    render() {
        const { classes, SKUs } = this.props
        return (
            <ItemList items={SKUs}>
              <SimpleCard></SimpleCard>
            </ItemList>
        );
    }
}

const mapStateToProps = state => {
    return {
        SKUs: state.skus.items
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SKUList));
