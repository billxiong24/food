import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Icon, IconButton } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import labels from '../../Resources/labels';

const styles = {
    page_selection_container: {
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center'
      },
    page_number_text: {
        fontSize: '14px',
        fontFamily: 'Open Sans',
        fontWeight: 300,
    }
};

class PageSelector extends Component {

    constructor(props){
        super(props);
    }


    componentWillMount() {

    }

    render() {
        const { classes } = this.props
        return (
            <div className={classes.page_selection_container}>
            <IconButton color={labels.colors.primaryColor} className={classes.button} aria-label="Add an alarm">
              <img src={back}/>
            </IconButton>
            <Typography className={classes.page_number_text}>
              Page 1 of 12
            </Typography>
            <IconButton color={labels.colors.primaryColor} className={classes.button} aria-label="Add an alarm">
              <img src={next}/>
            </IconButton>
          </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(PageSelector));
