import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import { Typography, Button } from '@material-ui/core';
import EditableText from '../GenericComponents/EditableText';
import labels from '../../Resources/labels';
import { ingDetUpdateIng, ingDetAddIng } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { routeToPage, ingDeleteIng } from '../../Redux/Actions';
import { withRouter, Link } from 'react-router-dom';

const styles = {
    ingredient_page_container:{
        display:'flex',
        flexDirection: 'row',
    },
    ingredient_detail_view:{    
        display:'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px',
        backgroundColor: 'rgb(111,58,211,0.75)',
        borderRadius: 12,
        color:'white'
    },
    textField:{
        width: '500px',
        color:'white'
    },
    text:{
        width: '500px',
        color:'white'
    },
    button:{
        width: '300px',
        backgroundColor: 'white'
    }

};

class BulkImportPage extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {
    }

    
    render() {
        const { classes } = this.props
        return (
            <div>
                
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(BulkImportPage)));
