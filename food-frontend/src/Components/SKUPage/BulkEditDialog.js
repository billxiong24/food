import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import Typography from '@material-ui/core/Typography';
import { manlineSearch, manlineGetMappings, manlineChangeMapping, manlineUpdateMappings } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators'
import { Select } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';

const styles = {
  entry: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    display: 'flex',
  },
  value: {
    display: 'flex',
    width: '20%'
  },
  divider: {
    width: '100%',
    backgroundColor: 'gray',
    height: '2px',
    marginBottom: 5
  },
}

class BulkEditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  componentWillMount() {
    this.props.manlineSearch("");
    this.props.manlineGetMappings(this.props.selected);
  }

  getRelation(manline) {
    if(this.props.all.filter((el) => {return el.id === manline.id}).length > 0) {
      return "All";
    } 
    else if(this.props.none.filter((el) => {return el.id === manline.id}).length > 0) {
      return "None";
    }
    else return "Some";
  }

  handleChange = (e, manline) => {
    this.props.manlineChangeMapping(manline, e.target.value);
  }

  submit = (e) => {
    this.props.manlineUpdateMappings();
  }

  render() {
    const { classes, selected, manlines, values } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <DialogTitle id="form-dialog-title">Bulk Edit Manufacturing Line</DialogTitle>
          <DialogContent>
            <Typography variant="subtitle1">
              You have selected {selected.length} SKUs
            </Typography>
            <br />
            <div className={classes.entry}>
              <Typography className={classes.name}>
                Manufacturing Line
                    </Typography>
              <Typography className={classes.value}>
                Selected SKUs Relation
                    </Typography>
            </div>
            <div>
              <div variant="inset" className={classes.divider} />
              {
                manlines.map((item, index) => (
                  <div className={classes.entry} key={item.id}>
                    <Typography className={classes.name}>
                      {item.name}
                    </Typography>
                    <FormControl className={classes.formControl + ' ' + classes.value}>
                      <Select
                        value={values[item.id]}
                        onChange={(e) => {this.handleChange(e, item)}}
                        inputProps={{
                          name: item.name,
                          id: item.id,
                        }}
                      >
                        <MenuItem value={0} disabled>
                          <em>Currently: {this.getRelation(item)}</em>
                        </MenuItem>
                        <MenuItem value={1}>None</MenuItem>
                        <MenuItem value={2}>All</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                ))
              }
            </div>
            <DialogActions>
              <Button onClick={this.props.close} color="primary">
                Cancel
              </Button>
              <Button
                color="primary"
                onClick={this.submit}
              >
                Update
              </Button>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    selected: state.skus.selectedSkus,
    manlines: state.manLine.manLines,
    none: state.manLine.none,
    all: state.manLine.all,
    some: state.manLine.some,
    values: state.manLine.values
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    manlineSearch: (name) => {
      dispatch(manlineSearch(name));
    },
    manlineGetMappings: (skus) => {
      dispatch(manlineGetMappings(skus));
    },
    manlineChangeMapping: (manline, value) => {
      dispatch(manlineChangeMapping(manline, value));
    },
    manlineUpdateMappings: () => {
      dispatch(manlineUpdateMappings());
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(BulkEditDialog));