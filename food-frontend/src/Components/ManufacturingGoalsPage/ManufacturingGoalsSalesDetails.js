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
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {CopyToClipboard} from 'react-copy-to-clipboard';


const styles = {

}

class ManufacturingGoalsSalesDetails extends Component {
  constructor(props) {
    super(props);
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
          <DialogTitle id="form-dialog-title">Sales Details</DialogTitle>
          <DialogContent>
        {
            <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Year </TableCell>
                      <TableCell>SKU #</TableCell> 
                      <TableCell>Sales </TableCell>
                    </TableRow>
                  </TableHead>
                    <TableBody>
            {
                Object.keys(this.props.data).map((year, index) => {
                    return <TableRow>
                        <TableCell> {year} </TableCell>
                        <TableCell> { this.props.data[year].sku_num } </TableCell>
                        <TableCell> { this.props.data[year].sales } </TableCell>
                        </TableRow>
                })
            }
            {
                Object.keys(this.props.aggregateData).map((key, index) => {
                    return <TableRow>
                        <TableCell>{key}</TableCell>
                        <TableCell>{this.props.aggregateData[key]}</TableCell>
                        <TableCell>
                        <CopyToClipboard text={this.props.aggregateData[key]}
                    onCopy={() => this.setState({copied: true})}>
                        <button>Copy to clipboard</button>
                        </CopyToClipboard>
                        </TableCell>
                        </TableRow>
                })
            }
                    </TableBody>
            </Table>
        
        }

             

              <DialogActions>
                <Button onClick={this.props.close} color="primary">
                  Cancel
                    </Button>
              </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    )
  }
}

export default withStyles(styles)(ManufacturingGoalsSalesDetails);
