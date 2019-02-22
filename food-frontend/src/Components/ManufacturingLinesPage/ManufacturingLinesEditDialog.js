import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ItemList from '../GenericComponents/ItemList';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import { IconButton } from '@material-ui/core';
import { withCookies } from 'react-cookie';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import common from '../../Resources/common';

const styles = {

}

class ManufacturingLinesEditDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div>
        <Dialog
          open={this.props.open}
          onClose={this.props.close}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Edit Manufacturing Line</DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={(e) => { this.props.submit(e) }}>
              <DialogContentText>
                Please Review and Edit any of the Following Fields:
                  </DialogContentText>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="editName">Name</InputLabel>
                <Input
                  id="editName"
                  value={this.props.name}
                  onChange={this.props.handleChange('editName')}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="editShortName">Short Name</InputLabel>
                <Input
                  id="editShortName"
                  value={this.props.shortname}
                  onChange={this.props.handleChange('editShortName')}
                />
              </FormControl>
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="editComment">Comment</InputLabel>
                <Input
                  id="editComment"
                  multiline
                  rows="4"
                  value={this.props.comment}
                  onChange={this.props.handleChange('editComment')}
                />
              </FormControl>
              <DialogActions>
                <Button onClick={this.props.close} color="primary">
                  Cancel
                    </Button>
                <Button
                  color="primary"
                  type="submit"
                >
                  Create
                    </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(ManufacturingLinesEditDialog);