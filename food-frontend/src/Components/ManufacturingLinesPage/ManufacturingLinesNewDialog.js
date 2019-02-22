import React, { Component } from 'react';
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

const styles = {

}

class ManufacturingLinesNewDialog extends Component {
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
          <DialogTitle id="form-dialog-title">New Manufacturing Line</DialogTitle>
          <DialogContent>
            <form className={classes.form} onSubmit={(e) => { this.props.submit(e) }}>
              <DialogContentText>
                Please Fill Out the Required Details
                  </DialogContentText>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="newName">Name</InputLabel>
                <Input
                  id="newName"
                  value={this.props.name}
                  onChange={this.props.handleChange('newName')}
                />
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="newShortName">Short Name</InputLabel>
                <Input
                  id="newShortName"
                  value={this.props.shortname}
                  onChange={this.props.handleChange('newShortName')}
                />
              </FormControl>
              <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="newComment">Comment</InputLabel>
                <Input
                  id="newComment"
                  multiline
                  rows="4"
                  value={this.props.comment}
                  onChange={this.props.handleChange('newComment')}
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

export default withStyles(styles)(ManufacturingLinesNewDialog);