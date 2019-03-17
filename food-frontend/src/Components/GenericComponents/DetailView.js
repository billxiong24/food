import React, { Component, useLayoutEffect } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ItemList from '../GenericComponents/ItemList';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import { IconButton } from '@material-ui/core';
import { withCookies } from 'react-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import common from '../../Resources/common';
import InputSelect from './InputSelect';
import UnitSelect from './UnitSelect';
import labels from '../../Resources/labels';
import swal from 'sweetalert';

const styles = {
    container:{
        backgroundColor:"red"
    },
    red_container:labels.common_styles.error_box

}

class DetailView extends Component {
  constructor(props) {
    super(props);
    let state = {}
    for(var i = 0; i < this.props.children.length; i++){
        // state[this.props.children[i].id]
        //console.log(this.props.children[i].props)
        if(this.props.children[i].type.displayName.includes("WithStyles(InputSelect)")){
            state[this.props.children[i].props.id] = this.props.children[i].props.item
            state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.item)
            
        }else if(this.props.children[i].type.displayName.includes("WithStyles(InputList)")){
            state[this.props.children[i].props.id] = []
            state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback([])

            if(this.props.children[i].props.defaultValue !== undefined){
                state[this.props.children[i].props.id] = this.props.children[i].props.defaultValue
                state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.defaultValue)
            }
        }else if(this.props.children[i].props.defaultValue !== undefined){
            state[this.props.children[i].props.id] = this.props.children[i].props.defaultValue
            state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.defaultValue)
        }else{
            state[this.props.children[i].props.id] = ""
            state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback("")
        }
    }
    this.state = state
    console.log(state)
  }





  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          aria-labelledby="form-dialog-title"
          width="1000"
        >
          <DialogTitle id="form-dialog-title">{this.props.title}</DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={(e) => { this.props.submit(e) }}>
              <DialogContentText>
                Please Review and Edit any of the Following Fields:
             </DialogContentText>
             {
                this.props.children.map((item, index) => {
                    if(!item.type.displayName.includes("WithStyles(Input)")){
                        return (
                        <div key={item.props.id}>
                            {
                                this.state[item.props.id + "_errorMsg"] != null ?
                                    <div className={classes.red_container}>
                                        {this.state[item.props.id + "_errorMsg"]}       
                                    </div>
                                    :
                                    null
                            }
                            {
                                 React.cloneElement(item,{
                                    handleChange: value => {
                                        console.log(value)
                                        this.setState({
                                            [item.props.id]: value,
                                            [item.props.id+"_errorMsg"]: item.props.errorCallback(value)
                                        })
                                    },
                                    onChange: value => { 
                                        console.log(value)
                                        this.setState({
                                            [item.props.id]: value,
                                            [item.props.id+"_errorMsg"]: item.props.errorCallback(value)
                                        })
                                    },
                                    error: this.state[item.props.id + "_errorMsg"] != null
                                })
                            }
                        </div>
                        )
                    }
                    return (
                        <div key={item.props.id}>
                            {
                                this.state[item.props.id + "_errorMsg"] != null ?
                                    <div className={classes.red_container}>
                                        {this.state[item.props.id + "_errorMsg"]}       
                                    </div>
                                    :
                                    null
                            }
                        
                        <FormControl margin="normal" required fullWidth> 
                            
                            <InputLabel 
                                htmlFor={item.props.id}
                                shrink={true}
                                error={this.state[item.props.id + "_errorMsg"] != null}
                            >
                                {item.props.name}
                            </InputLabel>
                            {
                                React.cloneElement(item,{
                                    handleChange: event => {
                                        console.log(event.target.value)
                                        this.setState({
                                            [item.props.id]: event.target.value,
                                            [item.props.id+"_errorMsg"]: item.props.errorCallback(event.target.value)
                                        })
                                    },
                                    onChange: event => {
                                        console.log(event.target.value)
                                        this.setState({
                                            [item.props.id]: event.target.value,
                                            [item.props.id+"_errorMsg"]: item.props.errorCallback(event.target.value)
                                        })
                                    },
                                    error: this.state[item.props.id + "_errorMsg"] != null,
                                    key: item.props.id
                                })
                            }
                        </FormControl> 
                        </div>
                    )
                })
            }
              <DialogActions>
                <Button onClick={this.props.close} color="primary">
                  Cancel
                    </Button>
                <Button
                  color="primary"
                  // type="submit"
                  onClick={()=> {
                    let item = {}
                    let isError = false
                    for (var property in this.state) {
                        if (this.state.hasOwnProperty(property)) {
                            if(!property.includes("errorMsg")){
                                item[property] = this.state[property]
                            }else{
                                isError = isError || this.state[property] != null
                            }
                        }
                        // if (this.state.hasOwnProperty(property)) {
                        //     console.log(String(property).contains(""))
                        // }
                    }
                        if(isError){
                            swal(`There are unresolved errors`,{
                                icon: "error",
                            });
                        }else{
                            this.props.submit(item)
                        }
                        
                    }}
                >
                  Update
                    </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(DetailView);