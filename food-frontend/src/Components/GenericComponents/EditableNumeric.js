import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import labels, { editableTextStyles } from '../../Resources/labels';

export const styles = editableTextStyles

class EditableNumeric extends Component {

    constructor(props){
        super(props)
        this.state ={
            name: this.props.children
        }
    }


    componentWillMount() {

    }

    handleChange = name => event => {
        this.setState({
          [name]: event.target.value,
        });
        console.log(this.props)
        console.log(this.props.key)
        this.props.onChange(event.target.value,this.props.field)
    };

    render() {
        const { classes, editing } = this.props
        if(editing){
            return (
                <TextField
                    id="outlined-number"
                    label={this.props.label}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                        classes: {
                          root: classes.cssLabel,
                          focused: classes.cssFocused,
                        },
                      }}
                      InputProps={{
                        classes: {
                          root: classes.cssOutlinedInput,
                          focused: classes.cssFocused,
                          notchedOutline: classes.notchedOutline,
                    },}}
                />
            )
        }else{
            return (
                <TextField
                    id="outlined-number"
                    label={this.props.label}
                    className={classes.text}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    variant="outlined"
                    type="number"
                    InputLabelProps={{
                        classes: {
                          root: classes.cssLabel,
                          focused: classes.cssFocused,
                        },
                      }}
                      InputProps={{
                        classes: {
                          root: classes.cssOutlinedInput,
                          focused: classes.cssFocused,
                          notchedOutline: classes.notchedOutline,
                    },}}
                />
            )
        }
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

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(EditableNumeric));
