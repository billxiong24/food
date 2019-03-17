import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    marginTop: 20,
    width: "100%",
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});

class InputSelect extends React.Component {
  state = {
    input: this.props.item,
    name: 'hai',
    labelWidth: 0,
  };

//   componentDidMount() {
//     this.setState({
//       labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth,
//     });
//   }

  handleChange = event => {
    //   console.log(event.target.name)
    //   console.log(event.target.value)
    this.setState({ [event.target.name]: event.target.value });
    this.props.handleChange(event.target.value)
  };

  render() {
    const { classes } = this.props;
    const MenuProps = {
        PaperProps: {
          style: {
            maxHeight: 200,
          },
        },
      };

    return (
      <form className={classes.root} autoComplete="off">
        <FormControl className={classes.formControl}>
          <InputLabel 
            htmlFor="age-simple"
            error={this.props.error}
        >{this.props.name + " *"}</InputLabel>
          <Select
            MenuProps={MenuProps}
            value={this.state.input}
            onChange={this.handleChange}
            inputProps={{
              name: 'input',
              id: 'age-simple',
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

InputSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(InputSelect);