import React, { Component, Fragment } from 'react';
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
import { subDays, subWeeks, subMonths, subYears, getISOWeek, getYear } from 'date-fns';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
  },
  customer_title: {
    textAlign:'left',
    paddingTop: 20,
    paddingLeft: 20,
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
      productlines: [], 
      productline_suggestions: [], 
      productlineFilters: [],
      currProdLine: '',
      timespanAmount: 365,
      timespanUnit: 0,
      message:"",
      alert:false,
      autohide:null,
      details: []
    }
  }


  componentWillMount() {
      this.getSuggestions();
      this.getProdSuggestions();
      //this.getDetails();
  }

  getDetails = e => {
      console.log(this.state.productlineFilters);
      console.log(this.state.customerFilter);
    Axios.get(hostname + 'sales/search/aggregate', {
        params: {
            years: 10,
            prodlines: this.state.productlineFilters, 
            customers: this.state.customerFilter
        }
    })
        .then(response => {
            console.log(response.data);
            this.setState({
                details: response.data
            })
        })
        .catch(err=>{
            console.log(err);
            this.setState({
                details:[]
            });
        })
  }

    getProdSuggestions() {
        Axios.get(hostname + 'productline/search', {
            params: {
                names: this.state.currProdLine
            }
        })
            .then(response => {
                this.setState({
                    productlines: response.data.sort((a,b) => {return a.name.localeCompare(b.name)})
                })
            })
            .catch(err=>{
                console.log(err);
                this.setState({
                    productlines:[]
                });
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

  onProdLineFilterChange = e => {
    let newSuggestions = this.state.productlines.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) === 0});
    if (newSuggestions.length < 10) {
      newSuggestions = newSuggestions.concat(this.state.productlines.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > 0}))
    }
    this.setState({
      currProdLine: e.currentTarget.value,
      productline_suggestions: newSuggestions.slice(0,10)
    });
      console.log(this.state.currProdLine);
  }

  onFilterChange = e => {
    let newSuggestions = this.state.customers.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) === 0});
    if (newSuggestions.length < 10) {
      newSuggestions = newSuggestions.concat(this.state.customers.filter((el) => {return el.name.toLowerCase().indexOf(e.currentTarget.value.toLowerCase()) > 0}))
    }
    this.setState({
      customerFilter: e.currentTarget.value,
      suggestions: newSuggestions.slice(0,10)
    });
  }

  selectProdFilter = (id) => {
    this.setState({
      currProdLine: this.state.productlines.filter((el)=>{return el.id === id})[0].name
    }, () => {this.state.productlineFilters.push(this.state.currProdLine); console.log(this.state.productlineFilters)});
  }

  selectFilter = (id) => {
    this.setState({
      customerFilter: this.state.customers.filter((el)=>{return el.id === id})[0].name
    }, () => {console.log(this.state.customerFilter)});
  }

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };



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
        <Typography variant="h3" gutterBottom>Sales Summary</Typography>
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
          <div className={classes.customerFilterContainer}>
            <Typography variant="h6">Filter by Product Line</Typography>
            <Autocomplete
              suggestions={this.state.productline_suggestions}
              value={this.state.currProdLine}
              onChange={this.onProdLineFilterChange}
              selectId={this.selectProdFilter}
              placeholder={"All Product Lines"}
              id={"rpod2"}
            ></Autocomplete>
          <div>
        {
            this.state.productlineFilters.map((val, index) => (
                <p key={val}>{val}</p>
            ))

        }
        </div>
          </div>
                <Button onClick={this.getDetails}>
                    Generate Data 
                </Button>
          
        </div>
        <div className={classes.contentContainer}>
          <Paper className={classes.customer_container}>
                {
                    Object.keys(this.state.details).map((prodline, index) => {
                        return <Table key={index}>
                              <TableHead>
                                <TableRow>
                                  <TableCell>{prodline}</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell>SKU No.</TableCell>
                                  <TableCell>Year</TableCell>
                                  <TableCell>Revenue</TableCell>
                                  <TableCell>Average Revenue</TableCell>
                                </TableRow>
                              </TableHead>
                                <TableBody>
                            {
                                Object.keys(this.state.details[prodline]).map((sku_num, index) => {
                                        return <Fragment>
                                        {
                                        Object.keys(this.state.details[prodline][sku_num]).map((year, index) => {
                                            
                                            return <TableRow key = {index}>
                                                <TableCell>{sku_num}</TableCell>
                                                <TableCell>{year}</TableCell>
                                                <TableCell>{this.state.details[prodline][sku_num][year].revenue}</TableCell>
                                                <TableCell>{this.state.details[prodline][sku_num][year].avgRevenue}</TableCell>
                                                </TableRow>
                                        })

                                        }
                                    </Fragment>
                                })
                            }
                                </TableBody>
                        </Table>
                    })
                }
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
