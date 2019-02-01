import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import delete_icon from '../../Resources/Images/delete_button_1.svg'
import { Icon, IconButton } from '@material-ui/core';
import { connect } from 'react-redux';
import { ingRemoveFilter, skuRemoveFilter, skuSearch } from '../../Redux/Actions';

const styles = {
    filter_container: {
        backgroundColor: 'rgb(255,255,255,0.23)',
        paddingLeft: 15,
        paddingBottom: 5,
        paddingTop: 5,
        marginBottom: 10,
        minHeight: '50px',
        maxWidth: '100%',
        overflow: 'auto',
        borderRadius: 12,
        alignItems:'center',
        display: 'flex',
        flexDirection: 'row',
    },
    filter_text_container: {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80%'
    },
    filter_type: {
        fontSize: 14,
        color: 'white',
        textAlign: 'left',
        float: 'left',
        overflowWrap: 'breakWord',
        wordWrap: 'breakWord',
        hyphens: 'auto',
        fontFamily: 'Open Sans',
        fontWeight: 400
    },
    filter_name: {
        fontSize: 14,
        color: 'white',
        maxWidth: '100%',
        textAlign: 'left',
        float: 'left',
        overflowWrap: 'breakWord',
        wordWrap: 'breakWord',
        hyphens: 'auto',
        fontFamily: 'Open Sans',
        fontWeight: 300
    },
    icon: {
        marginLeft: 'auto',
    }
};

class FilterItem extends Component {

    constructor(props){
        super(props)
        this.state = {focus: true}
        this.delete = this.delete.bind(this);
    }

    delete(e, index){
        e.preventDefault();
        console.log("handled filter delete on click")
        console.log("onClick.index:" + index)
        this.props.deleteFilter(index);
      }

    mouseOut() {
        console.log("Mouse out!!!");
        this.setState({focus: false});
      }
      
      mouseOver() {
        console.log("Mouse over!!!");
        this.setState({focus: true});
      }

    render() {
        const { classes } = this.props;
        const item = this.props.item
        console.log(item)
        return (
            <div className={classes.filter_container} >
                <div className={classes.filter_text_container}>
                    <Typography className={classes.filter_type}>
                        {item.type + " Filter"}
                    </Typography>
                    <Typography className={classes.filter_name}>
                        {item.string}
                    </Typography>
                </div>
                { this.state.focus ? 
                    <IconButton className={classes.icon} onClick ={(e) => this.delete(e,item.id)}>
                        <img src={delete_icon} />
                    </IconButton>
                    : 
                    null 
                }
            </div>
        );
    }

}

const mapDispatchToProps = dispatch => {
    return {
        deleteFilter: filter_id =>{
            dispatch(skuRemoveFilter(filter_id))
            dispatch(skuSearch())
        }
    };
};

export default withStyles(styles)(connect(null, mapDispatchToProps)(FilterItem));