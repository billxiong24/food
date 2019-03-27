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
import Axios from 'axios';
import axios from 'axios';


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
    let that = this
    
    for(var i = 0; i < this.props.children.length; i++){
        console.log(this.props.children[i].props.displayName)
        // state[this.props.children[i].id]
        //// console.log(this.props.children[i].props)
        if(this.props.children[i].props.displayName.includes("InputSelect")){
            state[this.props.children[i].props.id] = this.props.children[i].props.item
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })
            
        }else if(this.props.children[i].props.displayName.includes("InputAutoCompleteOpenPage")){
            state[this.props.children[i].props.id] = this.props.children[i].props.defaultId
            console.log(this.props.children[i].props.id)
            console.log(state[this.props.children[i].props.id])
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback([])
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })
        }else if(this.props.children[i].props.displayName.includes("InputList")){
            state[this.props.children[i].props.id] = this.props.children[i].props.list
            console.log(this.props.children[i].props.id)
            console.log(state[this.props.children[i].props.id])
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback([])
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            // this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
            //     let {prop, error} = res
            //     this.setState({
            //         [prop]:error
            //     })
            // })
        }else if(this.props.children[i].props.displayName.includes("InputList")){
            state[this.props.children[i].props.id] = []
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback([])
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })

            if(this.props.children[i].props.defaultValue !== undefined){
                state[this.props.children[i].props.id] = this.props.children[i].props.defaultValue
                // state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.defaultValue)
            //     Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     // console.log(res)
            //     const {prop, error} = res
            //     that.setState({
            //         [prop]:error
            //     })
            // })
                this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                    let {prop, error} = res
                    this.setState({
                        [prop]:error
                    })
                })
            }
        }else if(this.props.children[i].props.displayName.includes("UnitSelect")){
            state[this.props.children[i].props.id] = this.props.children[i].props.item
            console.log("UnitSelect")
            console.log(state[this.props.children[i].props.id])
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback([])
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })

            if(this.props.children[i].props.defaultValue !== undefined){
                state[this.props.children[i].props.id] = this.props.children[i].props.defaultValue + " " + this.props.children[i].props.item
                console.log("UnitSelect")
                console.log(state[this.props.children[i].props.id])
                // state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.defaultValue)
            //     Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     // console.log(res)
            //     const {prop, error} = res
            //     that.setState({
            //         [prop]:error
            //     })
            // })
                this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                    let {prop, error} = res
                    this.setState({
                        [prop]:error
                    })
                })
            }
        }else if(this.props.children[i].props.defaultValue !== undefined){
            state[this.props.children[i].props.id] = this.props.children[i].props.defaultValue
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback(this.props.children[i].props.defaultValue)
            // // console.log(i)
            // // console.log(this.props.children[i].props.errorCallback)
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     // console.log(res)
            //     const {prop, error} = res
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })
        }else{
            state[this.props.children[i].props.id] = ""
            //state[this.props.children[i].props.id +"_errorMsg"] = this.props.children[i].props.errorCallback("")
            // Promise.resolve(this.props.children[i].props.errorCallback(state[this.props.children[i].props.id],that.props.children[i].props.id +"_errorMsg"))
            // .then((res) => {
            //     const {prop, error} = res
            //     // console.log(res)
            //     that.setState({
            //         [prop]:error
            //     })
            // })
            this.props.children[i].props.errorCallback(state[this.props.children[i].props.id], this.props.children[i].props.id +"_errorMsg", (res) => {
                let {prop, error} = res
                this.setState({
                    [prop]:error
                })
            })
        }
    }
    this.state = state
    console.log(state)
  }

  





  render() {
    console.log(this.props)
    let readOnly = this.props.cookies.cookies.admin != "true"
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
            <form className={classes.form} onSubmit={(e) => { this.props.submit(this.state) }}>
              <DialogContentText>
                Please Review and Edit any of the Following Fields:
             </DialogContentText>
             {
                this.props.children.map((item, index) => {
                    if(item.props.displayName != "Input"){
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
                                        let that = this;
                                        this.setState({
                                            [item.props.id]: value,
                                            // [item.props.id+"_errorMsg"]: item.props.errorCallback(value)
                                        })
                                        // item.props.errorCallback(value).then((error) => {
                                        //     that.setState({
                                        //         [item.props.id +"_errorMsg"]:error
                                        //     })
                                        // })
                                        item.props.errorCallback(value,item.props.id +"_errorMsg", (res) => {
                                            let {prop, error} = res
                                            this.setState({
                                                [prop]:error
                                            })
                                        })
                                    },
                                    disabled: readOnly,
                                    onChange: value => { 
                                        console.log(value)
                                        let that = this;
                                        this.setState({
                                            [item.props.id]: value,
                                            //[item.props.id+"_errorMsg"]: item.props.errorCallback(value)
                                        })
                                        // item.props.errorCallback(value).then((error) => {
                                        //     that.setState({
                                        //         [item.props.id +"_errorMsg"]:error
                                        //     })
                                        // })
                                        item.props.errorCallback(value,item.props.id +"_errorMsg", (res) => {
                                            let {prop, error} = res
                                            this.setState({
                                                [prop]:error
                                            })
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
                        
                        <FormControl margin="normal" fullWidth> 
                            
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
                                        let that = this;
                                        this.setState({
                                            [item.props.id]: event.target.value,
                                            //[item.props.id+"_errorMsg"]: item.props.errorCallback(event.target.value)
                                        })
                                        // item.props.errorCallback(event.target.value).then((error) => {
                                        //     that.setState({
                                        //         [item.props.id +"_errorMsg"]:error
                                        //     })
                                        // })
                                        item.props.errorCallback(event.target.value,item.props.id +"_errorMsg", (res) => {
                                            let {prop, error} = res
                                            this.setState({
                                                [prop]:error
                                            })
                                        })
                                    },
                                    disabled: readOnly,
                                    onChange: event => {
                                        console.log(event.target.value)
                                        let that = this;
                                        this.setState({
                                            [item.props.id]: event.target.value,
                                            //[item.props.id+"_errorMsg"]: item.props.errorCallback(event.target.value)
                                        })
                                        item.props.errorCallback(event.target.value,item.props.id +"_errorMsg", (res) => {
                                            let {prop, error} = res
                                            this.setState({
                                                [prop]:error
                                            })
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
                  onClick={() => {this.props.onSubmit(this.state)}}
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

export default withStyles(styles)(withCookies(DetailView));