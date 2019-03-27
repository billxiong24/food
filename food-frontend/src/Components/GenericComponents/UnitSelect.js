import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display:'flex',
    flexDirection: 'row',
    paddingTop:20,
    paddingBottom: 10
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  left:{
    // float: 'left'
    marginTop:1,
    width:"80%",
    marginRight: 10
  },
  right:{
      marginLeft: "auto",
    // float: 'right'
    minWidth:70
  }
});

class UnitSelect extends React.Component {

  
  state = {
    number: this.props.defaultValue,
    unit: this.props.item
  };

//   componentDidMount() {
//     this.setState({
//       labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
//     });
//   }

  handleNumberChange = event => {
    this.setState({ number: event.target.value });
    this.props.handleChange(event.target.value + " " + this.state.unit)
  }

  handleUnitChange = event => {
    this.setState({ [event.target.name]: event.target.value });
    this.props.handleChange(this.state.number + " " + event.target.value)
  };


  render() {
    const { classes } = this.props;

    return (
      <form className={classes.root} autoComplete="off">
      <FormControl className={classes.left}>
          <InputLabel 
            htmlFor="age-simple"
            shrink={true}
            error = {this.props.error}
          >
            {this.props.name + " *"}
          </InputLabel>
          <Input
                id="ing_name"
                rows="4"
                type="number"
                name={"Name"}
                disabled = {this.props.disabled}
                error={this.props.error}
                onChange={this.handleNumberChange}
                defaultValue={this.props.defaultValue}
            />
        </FormControl>
        <FormControl className={classes.right}>
          <InputLabel htmlFor="unit">Unit</InputLabel>
          <Select
            value={this.state.unit}
            onChange={this.handleUnitChange}
            disabled={this.props.disabled}
            inputProps={{
              name: 'unit',
              id: 'unit',
            }}
          >
            {
                this.props.items.map((item) => 
                    <MenuItem value={item}>{item}</MenuItem>
                )
            }
          </Select>
        </FormControl>
      </form>
    );
  }
}

UnitSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(UnitSelect);