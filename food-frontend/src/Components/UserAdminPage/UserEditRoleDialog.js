import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withCookies } from 'react-cookie';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { manlineSearch, manlineGetMappings, manlineChangeMapping, manlineUpdateMappings } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators'
import Axios from 'axios';

import common from '../../Resources/common';
import { Typography } from '@material-ui/core';

const hostname = common.hostname;

const styles = {
  check_container: {
    display: 'flex',
    flexDirection: 'row',
    maxHeight: 350
  },
  plant_container: {
    overflow: 'auto'
  },
  plant_div_container: {
    display: 'flex',
    flexDirection: 'column',
  }
};

class UserEditRoleDialog extends Component {

  constructor(props) {
    super(props);
    this.state={
      manlines:[],
      analyst: false,
      prod_mgr: false,
      bus_mgr: false,
      plant_mgr: [],
      admin: false,
    }
  }

  componentDidUpdate(prevProps) {
    if(this.props.user.id !== prevProps.user.id) {
      const user = this.props.user;
      this.setState({
        analyst: user.analyst,
        prod_mgr: user.prod_mgr,
        bus_mgr: user.bus_mgr,
        plant_mgr: user.manlines,
        admin: user.admin
      })
    }
  }
  
  handleChange = name => event => {
    this.setState({
      [name]: event.target.checked
    })
  };

  handleManlineChange = id => event => {
    var new_plant = this.state.plant_mgr.slice();
    if(new_plant.indexOf(id) >= 0) {
      new_plant.splice(new_plant.indexOf(id), 1);
    } else {
      new_plant.push(id);
    }
    this.setState({
      plant_mgr: new_plant
    })
  };

  updateUser() {
    Axios.put(hostname + 'users/update/' + this.props.user.id, {
      data: {
        id: this.props.user.id,
        analyst: this.state.analyst,
        prod_mgr: this.state.prod_mgr,
        bus_mgr: this.state.bus_mgr,
        manlines: this.state.plant_mgr,
        admin: this.state.admin
      }
    })
    .then((res) => {
      this.props.handleClose();
    })
    .catch((err) => {
      this.props.handleError("Error updating user roles: " + err.response);
    })
  }

  componentWillMount() {
    Axios.get(hostname + 'manufacturing_line/search', {
      params: {
        orderKey: 'name'
      }
    })
    .then((res) => {
      this.setState({
        manlines:res.data
      })
    })
  }

  render() {
    const { classes, user, cookies } = this.props
    return (
      <div className={classes.dialog_container}>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{user ? user.uname : ''}</DialogTitle>
          <DialogContent>
            <div className={classes.check_container}>
              <div>
                <Typography variant="h6">Assign Roles</Typography>
                <FormControl component="fieldset" className={classes.formControl}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox checked={this.state.analyst} onChange={this.handleChange('analyst')} value="Analyst" />
                      }
                      label="Analyst"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={this.state.prod_mgr} onChange={this.handleChange('prod_mgr')} value="Product Manager" />
                      }
                      label="Product Manager"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={this.state.bus_mgr} onChange={this.handleChange('bus_mgr')} value="Product Manager" />
                      }
                      label="Business Manager"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={this.state.admin} onChange={this.handleChange('admin')} value="Administrator" />
                      }
                      label="Administrator"
                    />
                  </FormGroup>
                </FormControl>
              </div>

              <div className={classes.plant_div_container}>
                <Typography variant="h6">Plant Manager for:</Typography>
                <FormControl component="fieldset" className={classes.plant_container}>
                  <FormGroup>
                    {this.state.manlines.map((manline) => (
                      <FormControlLabel
                        key={manline.id}
                        control={
                          <Checkbox 
                            checked={this.state.plant_mgr ? this.state.plant_mgr.filter((num) => {
                              return manline.id === num
                            }).length > 0 : false}
                            onChange={this.handleManlineChange(manline.id)}
                            />
                        }
                        label={manline.name}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </div>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={() => {this.updateUser(); this.props.handleClose()}} color="primary" autoFocus>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cookies: ownProps.cookies.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(withCookies(connect(mapStateToProps, mapDispatchToProps)(UserEditRoleDialog)));