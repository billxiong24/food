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
import Button from '@material-ui/core/Button';
import ReactToPrint from 'react-to-print';
import {routeToPage} from '../../Redux/Actions/index';
import axios from 'axios';
import common from '../../Resources/common';
import FileDownload from 'js-file-download';
import {mangoalGetCalculations} from '../../Redux/Actions/ManufacturingGoalActionCreators';
import {Link} from 'react-router-dom';

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

class CalculatorPage extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.mangoalGetCalculations(this.props.activeGoal);
  }

  exportCalculations() {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.activeGoal.ingredients,
      format: "csv",
    })
      .then((response) => {
        FileDownload(response.data, this.props.activeGoal.name + '_calculations.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {

    const { classes, ingredients, activeGoal} = this.props;
    console.log(ingredients);

    return (
      (ingredients) ? 
      <div className={classes.root}>
        <ReactToPrint
          trigger={() => 
            <Button
            variant="contained"
            className={classes.button + ' ' + classes.calculation_button}
            >
              Print Manufacturing Calculations
            </Button>}
          content={() => this.componentRef}
        />
        <Button
          variant="contained"
          className={classes.button + ' ' + classes.export_button}
          onClick={()=>{this.exportCalculations()}}
        >
          Export to CSV
        </Button>
        <Button
          variant="contained"
          className={classes.button + ' ' + classes.goal_button}
          component={Link}
          to={'/manufacturing_goals'}
        >
          Return to Manufacturing Goals
        </Button>
        <div ref={el => (this.componentRef = el)}>
          <Paper className={classes.calculation_container}>
            <div className={classes.calculation_title}>
              <Typography component="h3" variant="h3" gutterBottom>
                {activeGoal.name}
              </Typography>
            </div>
            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Vendor</TableCell>
                  <TableCell align="right">Number of Packages</TableCell>
                  <TableCell align="right">Cost Per Package</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {ingredients.map(ingredient => (
                  <TableRow key={ingredient.id}>
                    <TableCell component="th" scope="row">
                      {ingredient.name}
                    </TableCell>
                    <TableCell align="right">{ingredient.vend_info}</TableCell>
                    <TableCell align="right">{ingredient.calc_res}</TableCell>
                    <TableCell align="right">{ingredient.pkg_cost}</TableCell>
                    <TableCell align="right">{ingredient.calc_res * ingredient.pkg_cost}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
      </div>
      :
      <div></div>
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
  mangoalGetCalculations,
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(CalculatorPage));