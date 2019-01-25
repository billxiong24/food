import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = {

};

class SampleComponent extends Component {

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

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(SampleComponent));