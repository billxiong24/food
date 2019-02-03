import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {routeToPage} from '../../Redux/Actions/index';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  calculation_button: {
    marginRight:'5%',
  },
  export_button: {
    marginRight:'5%',
  },
  calculation_container: {
    width: '80%',
    margin: 'auto',
    textAlign:'center',
    marginTop: '5%',
  },
  calculation_title: {
    paddingTop: 20,
  }
});

class IngredientDependencyEntry extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    const { classes, item } = this.props;

    return (
      <TableRow>
        <TableCell component="th" scope="row">
        </TableCell>
        <TableCell align="right">a</TableCell>
        <TableCell align="right">b</TableCell>
        <TableCell align="right">c</TableCell>
      </TableRow>
    )
  }
}

const mapStateToProps = state => {
  return {
      ingredients: state.manGoals.activeGoal.ingredients,
      activeGoal: state.manGoals.activeGoal,
  };
};

const mapDispatchToProps = {
  routeToPage,
};

export default withStyles(styles)(IngredientDependencyEntry);