import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import IngredientDependencyEntry from './IngredientDependencyEntry';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common from '../../Resources/common';

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
    maxWidth: '80%',
    margin: 'auto',
  },
  ing_name: {
    fontWeight: 'bold',
    fontSize: '18px',
  },
  export_button: {
    marginBottom:'2%',
  },
});

class IngredientDependencyPage extends Component {

  constructor(props) {
    super(props);
  }

  exportCalculations() {
    const rows = this.props.ings.reduce((arr, ing) => {
      if (ing.skus.length > 0) {
        return arr.concat(ing.skus.map((sku) => {
          return {
            ...sku,
            ingredient: ing.name
          };
        }))
      } else {
        return arr.concat([{ingredient: ing.name},]);
      }
    }, []);
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: rows,
      format: "csv",
    })
      .then((response) => {
        FileDownload(response.data, 'ingredient_dependency_report.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }

  render() {
    const { classes, ings } = this.props
    return (
      <div className={classes.root}>
        <Button
          variant="contained"
          className={classes.button + ' ' + classes.export_button}
          onClick={()=>{this.exportCalculations()}}
        >
          Export to CSV
        </Button>
        <Paper className={classes.calculation_container}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h5" gutterBottom>
                    Ingredient Name
                 </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5" gutterBottom>
                    SKU Name
                 </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5" gutterBottom>
                    SKU #
                 </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h5" gutterBottom>
                    Product Line
                 </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {ings.map((ing, index) => (
              <TableBody key={ing.id}>
                <TableRow>
                  <TableCell component="th" scope="row">
                    <label className={classes.ing_name}>
                      {ing.name}
                    </label>
                  </TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
                {ing.skus.map((sku) => (
                  <TableRow key={sku.id}>
                    <TableCell component="th" scope="row">
                    </TableCell>
                    <TableCell align="right">{sku.name}</TableCell>
                    <TableCell align="right">{sku.num}</TableCell>
                    <TableCell align="right">{sku.prd_line}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ))}
          </Table>
        </Paper>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ings: state.ingredients.ingDependency
  };
};

const mapDispatchToProps = {
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IngredientDependencyPage));