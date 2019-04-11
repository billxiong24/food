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
    }
  }
  
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleManlineChange = id => event => {

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
    console.log(user);
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
                        <Checkbox checked={user.analyst} onChange={this.handleChange('gilad')} value="Analyst" />
                      }
                      label="Analyst"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={user.prod_mgr} onChange={this.handleChange('jason')} value="Product Manager" />
                      }
                      label="Product Manager"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={user.bus_mgr} onChange={this.handleChange('jason')} value="Product Manager" />
                      }
                      label="Business Manager"
                    />
                    <FormControlLabel
                      control={
                        <Checkbox checked={user.admin} onChange={this.handleChange('jason')} value="Administrator" />
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
                            checked={user.manlines ? user.manlines.filter((num) => {
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
            <Button onClick={this.props.handleSubmit} color="primary" autoFocus>
              Continue
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