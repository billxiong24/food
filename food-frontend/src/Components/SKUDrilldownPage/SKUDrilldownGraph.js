import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Legend, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import ReactDOM from "react-dom";
import ReactChartkick, { LineChart, PieChart } from 'react-chartkick';
import chart from 'chart.js';

ReactChartkick.addAdapter(chart);

const styles = {
  chart_container: {
    display: 'flex',
    justifyContent: 'center',
  }
};

const data = [
  ["Year", "Sales", "Expenses"],
  [new Date().getDate("YYYYww"), 1000, 400],
  ["2005", 1170, 460],
  ["2006", 660, 1120],
  ["2007", 1030, 540]
];
const options = {
  title: "Company Performance",
  curveType: "function",
  legend: { position: "bottom" }
};

class SKUDrilldownGraph extends Component {

  constructor(props) {
    super(props);
  }


  componentWillMount() {

  }

  render() {
    const { classes } = this.props;
    console.log(this.props.data);
    return (
      <div className={classes.chart_container}>
        <LineChart 
          data={this.props.data}
          xtitle="Date"
          ytitle="Revenue ($)"
          curve={false}
          prefix="$"
          thousands=","
          messages={{empty: "No Sales in this Timespan"}}
        />
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUDrilldownGraph));