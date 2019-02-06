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
import { connect } from 'react-redux';
import labels from '../../Resources/labels';

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
      underline={classes.underline}
      InputProps={{
        inputRef: node => {
          ref(node);
          inputRef(node);
        },
        classes: {
          input: classes.input,
          underline: classes.underline,
        },
      }}
      {...other}
    />
  );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query);
  const parts = parse(suggestion.label, matches);
  const suggestion_text = {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 300,
  }

  const selection_text = {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 400,
  }

  const id = {
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 300,
    color: 'gray'
  }

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) =>
          part.highlight ? (
            <span key={String(index)} style={selection_text}>
              {part.text}
            </span>
          ) : (
            <strong key={String(index)} style={suggestion_text}>
              {part.text}
            </strong>
          ),
        )}
        <span style={id}>
              {" (" +suggestion.id +")"}
        </span>
        

      </div>
    </MenuItem>
  );
}

function getSuggestions(value) {
  const inputValue = deburr(value.trim()).toLowerCase();
  const inputLength = inputValue.length;
  let count = 0;

  return inputLength === 0
    ? []
    : suggestions.filter(suggestion => {
        const keep =
          count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;

        if (keep) {
          count += 1;
        }

        return keep;
      });
}

function getSuggestionValue(suggestion) {
  return suggestion.label;
}

const styles = theme => ({
  root: {
    minHeight: 10,
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
    display: 'block',
    fontSize: 56,
    fontFamily: 'Open Sans',
    fontWeight: 300
  },
  suggestion_text:{
    fontSize: 56,
    fontFamily: 'Open Sans',
    fontWeight: 300,
    color: 'white'
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: 'none',
  },
  divider: {
    height: theme.spacing.unit * 2,
  },
  input : {
    fontSize: 14,
    fontFamily:'Open Sans',
  },
  underline:{
    '&:after': {
      borderBottom:'2px solid ' + labels.colors.primaryColor,
      
    },
  },
});

class IntegrationAutosuggest2 extends React.Component {
  state = {
    single: '',
    popper: '',
    suggestions: [],
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value),
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: [],
    });
  };

  onSuggestionSelected = (event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) => {
    console.log(suggestion)
    this.props.onSuggest(suggestion.label, suggestion.item);
    this.clear()
  }

  onEnter = (e) => {
    if(e.keyCode == 13){
      this.props.onEnter(e.target.value);
      // put the login here
      this.clear()
   }
  }

  clear = () => {
    
    this.setState({
      single: ""
    })
  }
  handleChange = name => (event, { newValue, method }) => {
    console.log(this.props)
    this.setState({
      single : newValue
    });
    this.props.onChange(newValue)
  };

  render() {
    const { classes, suggestions, filter_type } = this.props;


    const autosuggestProps = {
      renderInputComponent,
      suggestions: suggestions,
      onSuggestionsFetchRequested: this.handleSuggestionsFetchRequested,
      onSuggestionsClearRequested: this.handleSuggestionsClearRequested,
      getSuggestionValue,
      renderSuggestion,
    };

    return (
      <div className={classes.root}>
        <Autosuggest
          {...autosuggestProps}
          onSuggestionSelected={this.onSuggestionSelected}
          inputProps={{
            classes,
            placeholder: this.props.placeholder,
            value: this.state.single,
            onChange: this.handleChange('single'),
            onKeyDown: this.onEnter
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
        <div className={classes.divider} />
      </div>
    );
  }
}

IntegrationAutosuggest2.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
    return {
        ingredient_names: state.ingredients.ingredient_names,
        filter_type: state.ingredients.filter_type
    };
  };

export default withStyles(styles)(connect(mapStateToProps, null)(IntegrationAutosuggest2));
