import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { manlineSearch, manlineGetMappings, manlineChangeMapping, manlineUpdateMappings } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators'

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

class UserWarningDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
    const { classes, user, goalCount } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Are You Sure You Want To Delete {user ? user.uname : ''}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This user has {this.props.goalCount} manufacturing goal(s). By deleting the account, you will inherit all the goals.
            </DialogContentText>
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

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(UserWarningDialog));