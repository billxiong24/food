import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Typography } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import labels from '../../Resources/labels';

const styles = {
    textField:{
        width: '500px',
    },
    text:{
        width: '500px',
        pointerEvents:'none',
        borderRadius: 10
    },
    // input: {
    //     color: "white",
    //     borderColor: 'white'
    //   },
    // active_input:{
    //     color: "white"
    // },
    // cssLabel: {
    //     color : 'white',
    //   },
    
    //   cssOutlinedInput: {
    //     '&$cssFocused $notchedOutline': {
    //       borderColor: labels.colors.primaryColor,
    //     },
    //     color:'white'
    //   },
    
    //   cssFocused: {
    //     '&$cssFocused': {
    //         borderColor: labels.colors.primaryColor,
    //         color: labels.colors.primaryColor,
    //     }
    //   },
    
    //   notchedOutline: {
    //     color:'white',
    //     borderWidth: '1px',
    //     borderColor: 'white'
        
    //   },
};

class EditableText extends Component {

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
        const { classes, editing, multiline } = this.props
        if(multiline && editing){
            return (
                <TextField
                    id="outlined-multiline-flexible"
                    label={this.props.label}
                    multiline
                    rowsMax="4"
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    className={classes.textField}
                    margin="normal"
                    variant="outlined"
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
        }else if(multiline && !editing){
            return (
                <TextField
                    id="outlined-multiline-flexible"
                    label={this.props.label}
                    multiline
                    rowsMax="4"
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    className={classes.text}
                    margin="normal"
                    variant="outlined"
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
        }else if(!multiline && editing){
            return (
                <TextField
                    id="outlined-name"
                    label={this.props.label}
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    variant="outlined"
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
                    id="outlined-name"
                    label={this.props.label}
                    className={classes.text}
                    value={this.state.name}
                    onChange={this.handleChange('name')}
                    margin="normal"
                    variant="outlined"
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

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(EditableText));
