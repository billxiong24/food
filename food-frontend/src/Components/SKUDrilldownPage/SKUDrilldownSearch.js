import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { Typography, Paper } from '@material-ui/core';
import SkuAutocomplete from '../ManufacturingGoalsPage/SkuAutocomplete';
import common from '../../Resources/common';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';

const hostname = common.hostname;

const styles = {
  main: {
    width: "80%",
    margin: "auto",
    marginTop: "1%"
  },
  search_container: {
    width: "50%",
    margin: "auto",
    padding: 20,
    marginTop: "5%"
  },
  search_input: {
    marginBottom: "3%"
  }
};

class SKUDrilldownSearch extends Component {

  constructor(props) {
    super(props);
    this.state = {
      suggestions:[],
      search:"",
      sku:""
    }
  }


  componentWillMount() {

  }

  onChange = e => {
    this.setState({
      search: e.currentTarget.value,
      sku: null
    }, () => {
      axios.get(hostname + 'sku/search', {
        params: {
          names: this.state.search,
          orderKey: 'name',
          limit: 10,
        }
      })
        .then((response) => {
          this.setState({
            suggestions: response.data
          });
        })
        .catch((err) => {
        });
    })
  };

  selectSku = skuNum => {
    this.setState({
      sku: skuNum,
    })
  }

  render() {
    const { classes } = this.props
    return (
      <div className={classes.main}>
        <Typography variant="h3" gutterBottom>Search for SKU</Typography>
        <Paper className={classes.search_container}>
          <div className={classes.search_input}>
            <SkuAutocomplete
              suggestions={this.state.suggestions}
              value={this.state.search}
              onChange={this.onChange}
              selectId={this.selectSku}
              placeholder={"Please Search and Select a SKU"}
            >
            </SkuAutocomplete>
          </div>
          <Button
            variant="contained"
            disabled={this.state.sku ? false : true}
            component={Link}
            to={'/sales/skus/' + this.state.sku}
          >See Drilldown</Button>
        </Paper>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUDrilldownSearch));