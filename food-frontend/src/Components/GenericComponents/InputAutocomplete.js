import React from 'react';
import PropTypes from 'prop-types';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import { FormControl } from '@material-ui/core';
import Axios from 'axios';
import common from '../../Resources/common';

const suggestions = [
  { label: 'Afghanistan' },
  { label: 'Aland Islands' },
  { label: 'Albania' },
  { label: 'Algeria' },
  { label: 'American Samoa' },
  { label: 'Andorra' },
  { label: 'Angola' },
  { label: 'Anguilla' },
  { label: 'Antarctica' },
  { label: 'Antigua and Barbuda' },
  { label: 'Argentina' },
  { label: 'Armenia' },
  { label: 'Aruba' },
  { label: 'Australia' },
  { label: 'Austria' },
  { label: 'Azerbaijan' },
  { label: 'Bahamas' },
  { label: 'Bahrain' },
  { label: 'Bangladesh' },
  { label: 'Barbados' },
  { label: 'Belarus' },
  { label: 'Belgium' },
  { label: 'Belize' },
  { label: 'Benin' },
  { label: 'Bermuda' },
  { label: 'Bhutan' },
  { label: 'Bolivia, Plurinational State of' },
  { label: 'Bonaire, Sint Eustatius and Saba' },
  { label: 'Bosnia and Herzegovina' },
  { label: 'Botswana' },
  { label: 'Bouvet Island' },
  { label: 'Brazil' },
  { label: 'British Indian Ocean Territory' },
  { label: 'Brunei Darussalam' },
];

function renderInputComponent(inputProps) {
  const { classes, inputRef = () => {}, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={{ fontWeight: 500 }}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={{ fontWeight: 300 }}>
              {part.text}
            </strong>
          ),
        )}
      </div>
    </MenuItem>
  );
}


// function getSuggestions(value) {
//   const inputValue = deburr(value.trim()).toLowerCase();
//   const inputLength = inputValue.length;
//   let count = 0;

//   return inputLength === 0
//     ? []
//     : suggestions.filter(suggestion => {
//         const keep =
//           count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

//         if (keep) {
//           count += 1;
//         }

//         return keep;
//       });
// }

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    position: 'relative',
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
});

class InputAutocomplete extends React.Component {
  

  constructor(props){
    super(props)
    let state = {
      single: '',
      popper: '',
      suggestions: [],
    };
    if(this.props.defaultValue !== undefined){
      state.single = this.props.defaultValue
      this.props.newItemCallBack(true)
      this.props.idCallback(this.props.defaultId)

    }
    this.state = state

  }

  handleSuggestionsFetchRequested = ({ value }) => {
    console.log("handleSuggestionsFetchRequested")
    this.props.handleChangerino(value)
    Axios.put(`${common.hostname}formula/formula_autocomplete`, {
      "prefix":value
    }).then((res) => {
      console.log(res.data.formulas)
      this.props.newItemCallBack(this.state.suggestions.map(suggestion => suggestion.label).includes(value))
      let item = res.data.formulas.find((item) => item.label == value)
      if(item === undefined){
        this.props.idCallback(null)
        this.props.handleChange(null)
      }else{
        this.props.idCallback(item.id)
        this.props.handleChange(item.id)
      }
      
      this.setState({
        suggestions: res.data.formulas,
      });
    })
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  handleChange = name => (event, { newValue }) => {
    // this.props.newItemCallBack(this.state.suggestions.map(suggestion => suggestion.label).includes(newValue))
    // let item = this.state.suggestions.find((item) => item.label == newValue)
    // if(item === undefined){
    //   this.props.idCallback(null)
    // }else{
    //   this.props.idCallback(item.id)
    // }
    this.setState({
      [name]: newValue,
    });
    //this.props.handleChange(newValue)
  };

  render() {
    const { classes } = this.props;
    const autosuggestProps = {
      renderInputComponent,
      suggestions: this.state.suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };
    // console.log(this.props.defaultValue)
    return (
      <form className={classes.root}>
      <FormControl margin="normal" required fullWidth>
        <Autosuggest
          {...autosuggestProps}
          inputProps={{
            classes,
            label: this.props.name + " *",
            placeholder:"",
            value: this.state.single,
            onChange: this.handleChange('single'),
            error: this.props.error,
            disabled:this.props.disabled,
            InputLabelProps: {
              shrink: true,
              error: this.props.error
            },
          }}
          theme={{
            container: classes.container,
            suggestionsContainerOpen: classes.suggestionsContainerOpen,
            suggestionsList: classes.suggestionsList,
            suggestion: classes.suggestion,
          }}
          renderSuggestionsContainer={options => (
            <Paper {...options.containerProps} square>
              {options.children}
            </Paper>
          )}
        />
        </FormControl>
      </form>
    );
  }
}

InputAutocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputAutocomplete);