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
import {mangoalGetCalculations} from '../../Redux/Actions/ActionCreators/ManufacturingGoalActionCreators';
import {Link} from 'react-router-dom';
import { TextField, MenuItem } from "@material-ui/core";
import SimpleSnackbar from "../GenericComponents/SimpleSnackbar";
import { format, differenceInHours } from "date-fns";
import { calculate_scheduled_time } from "../Scheduler/UtilityFunctions";

const hostname = common.hostname;

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  calculation_button: {
    marginTop:'2%',
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
  },
  main_title: {
    marginTop: "2%",
    marginBottom: "2%"
  },
  search_container: {
    width: '50%',
    margin: 'auto',
    textAlign:'left',
    padding: 20,
  },
  manline_select: {
    width: '50%',
  },
  parameter_element: {
    marginRight: 10
  },
  activities_container: {
    width: '80%',
    margin: 'auto',
    marginTop: "2%",
    marginBottom: "2%",
    padding: 20
  },
  table_container: {
    width: 700,
    wordWrap: 'break-word'
  },
  ing_total_title: {
    marginTop: "2%"
  }
});

class ManufacturingScheduleReportPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      manLines: [],
      manLine: "",
      manLineDetails: {},
      start: "",
      end: "",
      alert: false,
      message: "",
      tasks: [],
      ingTotal: []
    }
  }

  componentWillMount() {
    axios.get(hostname + 'manufacturing_line/search', {
      params: {
        orderKey: 'name'
      }
    })
    .then((response) => {
      this.setState({
        manLines: response.data
      })
    })
  }

  exportCalculations() {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.activeGoal.ingredients,
      format: "csv",
        type: "mangoal"
    })
      .then((response) => {
        FileDownload(response.data, this.props.activeGoal.name + '_calculations.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }

  updateStartDate = e => {
    if (!this.state.end || new Date(e.target.value).getTime() < new Date(this.state.end).getTime()) {
      this.setState({
        start: e.target.value
      })
    } else {
      this.setState({
        alert: true,
        message: "Start date must be before end date!"
      })
    }
  }

  updateEndDate = e => {
    if (!this.state.start || new Date(e.target.value).getTime() > new Date(this.state.start).getTime()) {
      this.setState({
        end: e.target.value
      })
    } else {
      this.setState({
        alert: true,
        message: "End date must be after start date!"
      })
    }
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  getReport = e => {
    axios.put(hostname + "scheduler/get_report", {
      id: this.state.manLine,
      start_time: new Date(this.state.start).getTime(),
      end_time: new Date(this.state.end).getTime()
    })
      .then(res => {
        let ings = {};
        res.data.activities.forEach((activity) => {
          activity.formula.ingredients.forEach((ing) => {
            const casesParsed = parseFloat(activity.case_quantity);
            const scaleParsed = parseFloat(activity.formula_scale);
            const quantParsed = parseFloat(ing.quantity);
            const toAdd = casesParsed * scaleParsed * quantParsed;
            if(ings[ing.id]) {
              ings[ing.id] = {
                ...ings[ing.id],
                packages: ings[ing.id].packages + toAdd
              }
            } else {
              ings[ing.id] = {
                ...ing,
                packages: toAdd
              }
            }
          })
        });
        ings = Object.entries(ings).map((ings) => {
          return {
            id: ings[0],
            ...ings[1]
          }
        })
        this.setState({
          tasks: res.data.activities,
          manLineDetails: this.state.manLines.filter(el=>{return el.id === this.state.manLine})[0],
          ingTotal: ings
        })
      })
      .catch(err=>{
        this.setState({
          alert: true,
          message: "Something went wrong"
        })
      })
  }

  closeAlert() {
    this.setState({
      alert: false,
      message: ""
    });
  }

  render() {

    const { classes, ingredients, activeGoal} = this.props;

    return (
      <div>
        <Typography className={classes.main_title} variant="h3">Manufacturing Schedule Report</Typography>
        <Paper className={classes.search_container}>
          <Typography variant="h5">Schedule Report Parameters</Typography>
          <div className={classes.parameter_container}>
            <TextField
              id="standard-select-currency"
              select
              label="Select Manufacturing Line"
              className={classes.manline_select + ' ' + classes.parameter_element}
              value={this.state.manLine}
              onChange={this.handleChange('manLine')}
              fullWidth
            >
              {this.state.manLines.map(manline => (
                <MenuItem key={manline.id} value={manline.id}>
                  {manline.name + " (" + manline.shortname + ")"}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              id="start"
              label="Start Date"
              type="date"
              value={this.state.start}
              onChange={this.updateStartDate}
              className={classes.parameter_element}
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              id="end"
              label="End Date"
              type="date"
              value={this.state.end}
              onChange={this.updateEndDate}
              className={classes.parameter_element}
              InputLabelProps={{
                shrink: true
              }}
            />
            <Button
              variant="contained"
              disabled={!this.state.manLine || !this.state.start || !this.state.end}
              onClick={this.getReport}
            >
              Get Report
            </Button>
          </div>
        </Paper>
        <div>
          {this.state.tasks.length > 0 && 
            <div>
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
              <Paper 
                ref={el => (this.componentRef = el)}
                className={classes.activities_container}
              >
                <Typography variant="h5">Activities for {this.state.manLineDetails.name} ({this.state.manLineDetails.shortname})</Typography>
                {this.state.tasks.map(task=> (
                  <div key={task.id + task.mg_id}>
                    <div className={classes.table_container}>
                      <Table padding="none">
                        <TableHead>
                          <TableRow>
                            <TableCell>SKU Name</TableCell>
                            <TableCell>SKU #</TableCell>
                            <TableCell>SKU Case UPC</TableCell>
                            <TableCell>SKU Unit UPC</TableCell>
                            <TableCell>SKU Unit Size</TableCell>
                            <TableCell>SKU Count per Case</TableCell>
                            <TableCell>SKU Production Line</TableCell>
                            <TableCell>SKU Manufacturing Rate</TableCell>
                            <TableCell>SKU Manufacturing Setup Cost</TableCell>
                            <TableCell>SKU Manufacturing Run Cost</TableCell>
                            <TableCell>SKU Formula Scale</TableCell>
                            <TableCell>Formula Name</TableCell>
                            <TableCell>Formula #</TableCell>
                            <TableCell>Case Quantity</TableCell>
                            <TableCell>Start Time</TableCell>
                            <TableCell>End Time</TableCell>
                            <TableCell>Duration (hrs)</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow key={task.id}>
                            <TableCell>{task.name}</TableCell>
                            <TableCell>{task.num}</TableCell>
                            <TableCell>{task.case_upc}</TableCell>
                            <TableCell>{task.unit_upc}</TableCell>
                            <TableCell>{task.unit_size}</TableCell>
                            <TableCell>{task.count_per_case}</TableCell>
                            <TableCell>{task.prd_line}</TableCell>
                            <TableCell>{task.man_rate}</TableCell>
                            <TableCell>{task.man_setup_cost}</TableCell>
                            <TableCell>{task.man_run_cost}</TableCell>
                            <TableCell>{task.formula_scale}</TableCell>
                            <TableCell>{task.formula.name}</TableCell>
                            <TableCell>{task.formula.num}</TableCell>
                            <TableCell>{task.case_quantity}</TableCell>
                            <TableCell>{format(new Date(parseInt(task.start_time)), "MM-DD-YYYY hh:mm")}</TableCell>
                            <TableCell>{format(new Date(parseInt(task.end_time)), "MM-DD-YYYY hh:mm")}</TableCell>
                            <TableCell>{calculate_scheduled_time(format(new Date(parseInt(task.start_time)), "YYYY-MM-DD HH:mm"), format(new Date(parseInt(task.end_time)), "YYYY-MM-DD HH:mm"))}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Ingredient Name</TableCell>
                          <TableCell>Ingredient Amount</TableCell>
                          <TableCell>Ingredient Vendor</TableCell>
                          <TableCell>Ingredient #</TableCell>
                          <TableCell>Ingredient Size</TableCell>
                          <TableCell>Ingredient Package Cost</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {task.formula.ingredients.map(ing => (
                          <TableRow key={ing.id}>
                            <TableCell>{ing.name}</TableCell>
                            <TableCell>{ing.quantity}</TableCell>
                            <TableCell>{ing.vend_info}</TableCell>
                            <TableCell>{ing.num}</TableCell>
                            <TableCell>{ing.pkg_size} {ing.unit}</TableCell>
                            <TableCell>{ing.pkg_cost}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
                <Typography className={classes.ing_total_title} variant="h6">Ingredient Total</Typography>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Ingredient Name</TableCell>
                      <TableCell>Vendor</TableCell>
                      <TableCell>Total Amount Needed</TableCell>
                      <TableCell>Total # of Packages</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.ingTotal.map(ing => (
                      <TableRow key={ing.id}>
                        <TableCell>{ing.name}</TableCell>
                        <TableCell>{ing.vend_info}</TableCell>
                        <TableCell>{ing.packages * parseFloat(ing.pkg_size)} {ing.unit}</TableCell>
                        <TableCell>{Math.ceil(ing.packages)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </div>
          }
        </div>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
        >
        </SimpleSnackbar>
      </div>
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

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(ManufacturingScheduleReportPage));
