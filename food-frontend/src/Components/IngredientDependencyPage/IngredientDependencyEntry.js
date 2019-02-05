import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
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