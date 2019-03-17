import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Popper from '@material-ui/core/Popper';
import { withStyles } from '@material-ui/core/styles';
import { FormControl, InputLabel, Button, Input, IconButton, Icon } from '@material-ui/core';
import InputAutocomplete from './InputAutocomplete';
import DetailView from '../GenericComponents/DetailView';
import UnitSelect from '../GenericComponents/UnitSelect';
import InputSelect from '../GenericComponents/InputSelect';
import InputAutoCompleteOpenPage from '../GenericComponents/InputAutoCompleteOpenPage';
import clear_icon from '../../Resources/Images/blue_clear.svg'
import add_icon from '../../Resources/Images/add.svg'
import { throws } from 'assert';
import { removeFromList, addToList } from '../../Resources/common';





const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  super_container:{
    display: "flex",
    flexDirection: 'column',
  },
  img:{
      opacity: 0.75
  },
  container: {
    display: "flex",
    flexDirection: 'row',
    width: "100%",
  },
  item_container:{
    width:"100%"
  },
  input_container:{
    width:"90%",
    marginTop: 10,
    marginBottom: 10,
  },
  number_container:{
    width:"12%",
    marginTop: "auto",
    marginLeft: 10,
    marginBottom: 10,
  },
  number_container2:{
    width:"13%",
    marginTop: "auto",
    marginLeft: 10,
  },
  suggestionsContainerOpen: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0,
  },
  suggestion: {
    display: 'inline',
  },
  suggestionsList: {  
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  button: {
      height: 35,
  },
  icon_button:{
      height:45,
      width:45,
      marginTop: "auto",
      marginBottom: 5,
      marginLeft: "auto"
  },
  icon_button_2:{
    height:45,
    width:45,
    opacity: 0.5,
    marginTop: "auto",
    marginLeft: "auto"
}
});

class InputList extends React.Component {

    constructor(props){
        super(props)
        let id = null
        for(var i = 0; i < this.props.items.length; i++){
            if(this.props.item == this.props.items[i].label){
                id = this.props.items[i].id
                break
            }
        }
        this.state = {
            list: [
                
            ],
            newItem: this.props.item,
            newItemId:id,
            newQuantity: 1
        };
    }

  handleChange = (value) => {
    console.log(value)
    let id = null
    for(var i = 0; i < this.props.items.length; i++){
        if(value == this.props.items[i].label){
            id = this.props.items[i].id
            break
        }
    }
    // this.setState({ [event.target.name]: event.target.value });
    this.setState({
        newItem:value,
        newItemId: id
    })
  }


  render() {
    const { classes } = this.props;

    return (
        <div className={classes.super_container}>
            <div className={classes.container}>
                <div className={classes.input_container}>
                    <InputSelect
                        id="sku_prd_line"
                        item={this.props.item}
                        items={this.props.items.map(item => item.label)}
                        name={this.props.name}
                        error={this.props.error}
                        handleChange={this.handleChange}
                    />
                </div>
                <div className={classes.number_container}>
                    <Input
                        id="ing_pkg_cost"
                        name={"Comment"}
                        type="number"
                        min="1"
                        error={this.props.error}
                        defaultValue={this.state.newQuantity}
                        onChange={(event)=>{
                            console.log(event.target.value)
                            this.props.onChange(event.target.value)
                            this.setState({newQuantity:event.target.value}
                            )}}
                    />
                </div>
                <IconButton 
                    className={classes.icon_button}
                    onClick={() => {
                        let list = addToList({label:this.state.newItem, id: this.state.newItemId, quantity:this.state.newQuantity},this.state.list)
                        this.props.handleChange(list)
                        this.setState({
                            list:list
                        })
                        }
                    }
                >
                    <img src={add_icon} />
                </IconButton>
            </div>
            {
                this.state.list.map(item => (
                    <div 
                        className={classes.container}
                        key={item.id}
                    >
                        {/* <div className={classes.input_container}> */}
                        <Input
                            id="ing_pkg_cost"
                            disabled={true}
                            name={"Comment"}
                            className={classes.item_container}
                            defaultValue={item.label}
                        />
                        <div className={classes.number_container2}>
                            <Input
                                id="ing_pkg_cost"
                                disabled={true}
                                name={"Comment"}
                                type="number"
                                defaultValue={item.quantity}
                            />
                        </div>
                        
                        {/* </div> */}
                            <IconButton 
                                className={classes.icon_button_2}
                                onClick={() => {
                                    let list = removeFromList(item,this.state.list)
                                    this.props.handleChange(list)
                                    this.setState({
                                        list:list
                                    })
                                    }
                                }
                            
                            >
                                <img src={clear_icon} />
                            </IconButton>
                    </div>
                ))
            }
        </div>
    );
  }
}

InputList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputList);