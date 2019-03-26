import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import Autocomplete from '../ManufacturingGoalsPage/Autocomplete';
import Axios from 'axios';
import common from '../../Resources/common';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { format, setISOWeek, setYear, subDays, subWeeks, subMonths, subYears, getISOWeek, getYear } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import SKUDrilldownGraph from './SKUDrilldownGraph';
import FileDownload from 'js-file-download';

const hostname = common.hostname;

const styles = {
  filterContainer: {
    marginTop: "5%",
    textAlign: "left",
    padding: 20,
    borderStyle: "solid",
    borderWidth: 1
  },
  timespanFilterContainer: {
    marginTop: "1%"
  },
  contentContainer: {
    marginTop: "2%",
    marginBottom: "2%"
  },
  timespanLabel: {
    display:"inline",
    paddingRight: 10
  },
  timespanFilterSpan: {
    display:"flex",
    alignItems: "center",
    flexDirection: "row"
  },
  textField: {
    marginRight:"1%",
    width: 200,
  },
  customer_container: {
    textAlign:'center',
    marginTop: '2%',
    padding: 20
  },
  customer_title: {
    textAlign:'left',
    paddingTop: 20,
    paddingLeft: 20,
  },
  export_button: {
    marginTop: '2%'
  }
};

const timeUnits = [
  {
    value: 0,
    label: 'Day(s)'
  },
  {
    value: 1,
    label: 'Week(s)'
  },
  {
    value: 2,
    label: 'Month(s)'
  },
  {
    value: 3,
    label: 'Year(s)'
  }
]

class SKUDrilldownMain extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerFilter: '',
      customers: [],
      suggestions: [],
      timespanAmount: 365,
      timespanUnit: 0,
      message:"",
      alert:false,
      autohide:null,
      details: [],
      filtered: false
    }
  }


  componentWillMount() {
    this.getSuggestions();
    this.getDetails();

  }

  getDetails() {
    let target = new Date();
    switch(this.state.timespanUnit) {
      case 0:
        target = subDays(target, this.state.timespanAmount);
        break;
      case 1:
        target = subWeeks(target, this.state.timespanAmount);
        break;
      case 2:
        target = subMonths(target, this.state.timespanAmount);
        break;
      case 3:
        target = subYears(target, this.state.timespanAmount);
        break;
    }
    const targetWeek = getISOWeek(target);
    const targetYear = getYear(target);
    Axios.get(hostname + 'sales/search/' + this.props.sku.num + '/?customers=' + encodeURI(this.state.customerFilter) + '&years=' + (getYear(new Date()) - targetYear + 1)
      // params: {
      //   customers: this.state.customerFilter,
      //   years: getYear(new Date()) - targetYear + 1
      // }
    )
    .then(response => {
      // let newDetails = {};
      // response.data.forEach((e) => {
      //   const {customer_name, customer_num, ...temp} = e;
      //   if(!newDetails[customer_name]) {
      //     newDetails[customer_name] = {
      //       customer_num: customer_num,
      //       entries: [{
      //         temp
      //       }]
      //     }
      //   } else {
      //     newDetails[customer_name].entries.push(temp);
      //   }
      // });
      // this.setState({
      //   details: newDetails
      // })
      let filtered = this.state.customerFilter ? true : false;
      this.setState({
        details: response.data.filter((el) => {
          return !(el.year === targetYear && el.week < targetWeek)
        }).sort((a,b) => {return a.customer_name.localeCompare(b.customer_name)}),
        filtered: filtered
      })
    })
    .catch(err=>{
      this.setState({
        details: [],
        alert: true,
        message: "Something went wrong with retrieving sales data: " + err
      })
    })
  }

  getSuggestions() {
    Axios.get(hostname + 'customer/search', {
      params: {
        name: this.state.customerFilter
      }
    })
    .then(response => {
      this.setState({
        customers: response.data.sort((a,b) => {return a.name.localeCompare(b.name)})
      })
    })
    .catch(err=>{
      this.setState({
        customers:[]
      });
    })
  }

  getNumberOfWeek(date) {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

  onFilterChange = e => {
    let newSuggestions = this.state.customers.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) === 0});
    if (newSuggestions.length < 10) {
      newSuggestions = newSuggestions.concat(this.state.customers.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > 0}))
    }
    this.setState({
      customerFilter: e.currentTarget.value,
      suggestions: newSuggestions.slice(0,10),
      filtered: false
    }, () => {if (!this.state.customerFilter) this.getDetails()});
  }

  selectFilter = (id) => {
    this.setState({
      customerFilter: this.state.customers.filter((el)=>{return el.id === id})[0].name
    }, () => {this.getDetails()});
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleAmountChange = event => {
    if (event.target.value.match(/^[0-9]+$/) != null) {
      this.setState({
        timespanAmount: parseInt(event.target.value)
      });
      return;
    } else if(!event.target.value) {
      this.setState({
        timespanAmount: ''
      })
    }
  }

  applyTimespan = event => {
    if(!this.state.timespanAmount) {
      this.setState({
        alert: true,
        message: "Please enter a amount of time to filter by!"
      });
      return;
    }
    this.getDetails();
  }

  exportCalculations() {
    Axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.state.details,
      format: "csv",
        type: "mangoal"
    })
      .then((response) => {
        FileDownload(response.data, this.props.sku.name + '_sales.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }

  closeAlert() {
    this.setState({
      alert: false,
      message: ""
    });
  }

  render() {
    const { classes, sku } = this.props
    return (
      <div>
        <Typography variant="h3" gutterBottom>Sales Detail for {sku.name}: {sku.unit_size} * {sku.count_per_case} ({sku.num})</Typography>
        <div className={classes.filterContainer}>
          <div className={classes.customerFilterContainer}>
            <Typography variant="h6">Filter by Customer</Typography>
            <Autocomplete
              suggestions={this.state.suggestions}
              value={this.state.customerFilter}
              onChange={this.onFilterChange}
              selectId={this.selectFilter}
              placeholder={"All Customers"}
              id={"prod"}
            ></Autocomplete>
          </div>
          <div className={classes.timespanFilterContainer}>
            <Typography variant="h6">Timespan</Typography>
            <form className={classes.timespanFilterSpan}>
              <Typography className={classes.timespanLabel} variant="subtitle2" gutterBottom>Last</Typography>
              <TextField
                id="time-amount"
                value={this.state.timespanAmount}
                onChange={this.handleAmountChange}
                className={classes.textField}
                helperText="Please enter amount of time"
                margin="dense"
              />
              <TextField
                id="time-unit"
                select
                className={classes.textField}
                value={this.state.timespanUnit}
                onChange={this.handleChange('timespanUnit')}
                SelectProps={{
                  MenuProps: {
                    className: classes.menu,
                  },
                }}
                helperText="Please select unit of time"
                margin="normal"
              >
                {timeUnits.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button variant="contained" onClick={this.applyTimespan}>Apply</Button>
            </form>
          </div>
        </div>
        <div className={classes.contentContainer}>
          <Paper className={classes.customer_container}>
            <Typography variant="h3">Graph</Typography>
            {
              this.state.filtered && <SKUDrilldownGraph data={this.state.details.reduce((obj, val) => {
                console.log(this.state.details);
                return {
                  ...obj,
                  [format(setYear(setISOWeek(new Date(), val.week), val.year), "YYYY-MM-DD")]: (parseInt(val.sales) * parseInt(val.price_per_case))
                };
              }, {}
              )}></SKUDrilldownGraph>
            }
            {
              !this.state.filtered && <Typography variant="h6">Specify a Customer above to see revenue graph</Typography>
            }
          </Paper>
          <Paper className={classes.customer_container}>
            <div>
              <Typography variant="h3">Sales</Typography>
              <Button 
                className={classes.export_button} 
                onClick={()=>{this.exportCalculations()}}
                variant="contained"
              >Export as CSV</Button>
            </div>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Year</TableCell>
                  <TableCell>Week Number</TableCell>
                  <TableCell>Customer Number</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Number of Sales</TableCell>
                  <TableCell>Price per Case</TableCell>
                  <TableCell>Revenue</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  this.state.details.map((val, index) => (
                    <TableRow key={index}>
                      <TableCell>{val.year}</TableCell>
                      <TableCell>{val.week}</TableCell>
                      <TableCell>{val.customer_num}</TableCell>
                      <TableCell>{val.customer_name}</TableCell>
                      <TableCell>{val.sales}</TableCell>
                      <TableCell>{parseInt(val.price_per_case).toFixed(2)}</TableCell>
                      <TableCell>{(parseInt(val.sales) * parseInt(val.price_per_case)).toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </Paper>
        </div>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
        >
        </SimpleSnackbar>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUDrilldownMain));