import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Axios from 'axios';
import common from '../../Resources/common';
import { Typography } from '@material-ui/core';
import SKUDrilldownMain from './SKUDrilldownMain';

const hostname = common.hostname;

const styles = {
  main: {
    width: "80%",
    margin: "auto",
    marginTop: "1%"
  },
  hidden: {
    display: "none"
  }
};

class SKUDrilldownPage extends Component {

  constructor(props) {
    super(props);

    this.state = {
      sku: null,
    }
  }


  componentWillMount() {
    Axios.get(hostname + 'sku/search', {
      params: {
        names: this.props.match.params.sku_num
      }
    })
      .then(response => {
        if (response.data.length > 0) {
          let sku = response.data.filter((el) => { return el.num == this.props.match.params.sku_num });
          if(sku.length > 0) {
            this.setState({
              sku: sku[0]
            });
            return;
          }
        }
        this.setState({
          sku: null
        });
      })
      .catch(error => {
        this.setState({
          sku: null
        });
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        {this.state.sku && <SKUDrilldownMain sku={this.state.sku}></SKUDrilldownMain>}
        <div className={ this.state.sku ? classes.hidden : "" }>
          <Typography variant="h3" gutterBottom>SKU not found</Typography>
        </div>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUDrilldownPage));