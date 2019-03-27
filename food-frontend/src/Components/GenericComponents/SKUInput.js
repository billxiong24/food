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
import swal from 'sweetalert';





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
},
d:{
    marginTop:10,
    marginBottom:10
}
});

class SKUInput extends React.Component {

    constructor(props){
        super(props)
    }



  render() {
    const { classes } = this.props;

    return (
        <div className={classes.super_container}>
            <div
            className={classes.d}>
                SKU List
            </div>
            {
                        this.props.data.map((item) => {
                            return (
                            <Input
                                className={classes.d}
                                id="sku_errorMsg"
                                rows="4"
                                name={""}
                                displayName="Input"
                                disabled={true}
                                defaultValue = {`${item.name}:${item.unit_size}*${item.count_per_case}`}
                            />
                    )
                })
            }
            
        </div>
    );
  }
}

SKUInput.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SKUInput);