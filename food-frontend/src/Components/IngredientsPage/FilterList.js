import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
    filter_container:{
        backgroundColor: 'white',
        opacity: 0.2,
        padding: 5,
        margin: 5,
        marginBottom:10,
        height: '30px',
        width: 'auto',
        borderRadius: 12
    },
    filter_name: {
        fontSize: 14,
        opacity:1.0,
        float:'left',
    }
};

class FilterList extends Component {

    render(){
        const { classes } = this.props;
        const item = this.props.item
        // console.log(this.props)
        return (
            <div className ={classes.filters_list}>
                <ItemList items={dummy_ingredients}>
                    <FilterItem></FilterItem>
                </ItemList>
            </div>
        );
    }

}


export default withStyles(styles)(FilterList);