import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';

const styles = {

};

class SampleComponent extends Component {

    componentWillMount() {

    }

    render() {
        const { classes } = this.props
        return (
            <div>
              We Do No Evil!
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

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SampleComponent));