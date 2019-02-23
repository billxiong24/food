import React, { Component, Fragment } from "react";
import { withStyles } from '@material-ui/core/styles';
import ReactDOM from 'react-dom';

const styles = {
  root: {
    fontFamily: 'sans-serif',
    width: '100%',
    overflow:'hidden',
  },
  input: {
    border: '1px solid #999',
    width: '100%',
    padding: 5,
  },
  'no-suggestions': {
    color: '#999',
    padding: '0.5rem',
  },
  datalist: {
    width:'100%',
  },
  suggestions: {
    textAlign:'left',
    border: '1px solid #999',
    'border-top-width': 0,
    listStyle: 'none',
    marginTop: 0,
    maxHeight: 143,
    'overflow-y': 'auto',
    margin:'auto',
    padding: 5,
    zIndex: 1,
    position:'absolute',
    left: 0,
    right: 0,
  },
  suggestion: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: 'rgba(0, 0, 0, 0.14)',
    },
    padding: 5,
  }
}

class SkuAutocomplete extends Component {
  constructor(props) {
    super(props);

    this.state = {
      suggestion_id: null,
    };
  }

  componentDidMount() {
    document.querySelector('input[name=sku]').addEventListener('input', this.handleSelect);
  }

  componentWillUnmount() {
    document.querySelector('input[name=sku]').removeEventListener('input', this.handleSelect);
  }

  handleSelect = e => {
    var input = e.target,
      list = input.getAttribute('list'),
      options = document.querySelectorAll('#' + list + ' option'),
      inputValue = input.value;

    for (var i = 0; i < options.length; i++) {
      var option = options[i];

      if (option.value === inputValue) {
        this.props.selectId(inputValue);
        input.value = option.label;
        break;
      }
    }
  }

  onChange = e => {
    this.props.onChange(e)
  };

  render() {
    const { classes, value, suggestions, id, placeholder } = this.props;

    return (
      <div className={classes.root}>
        <input
          type="text"
          onChange={this.onChange}
          value={value}
          className={classes.input}
          placeholder={placeholder}
          list="suggestions"
          id="suggestionsInput"
          name="sku"
        />
        <datalist id="suggestions" className={classes.datalist}>
          {suggestions.map(suggestion => {
            return (
              <option
              key={suggestion.id}
              label={suggestion.name + ': ' + suggestion.unit_size + ' * ' + suggestion.count_per_case}
              value={suggestion.num}
              ></option>
            )
          })}
        </datalist>
      </div>
    );
  }
}

export default withStyles(styles)(SkuAutocomplete);