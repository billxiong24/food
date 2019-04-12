
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import ReactDOM from 'react-dom';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { withCookies } from 'react-cookie';

const styles = {
  card: {
    width: '100 %',
    marginBottom: 10,
    marginTop: 10,
    padding: 10,
    height: 50,
  },
  content: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    padding: '0px !important',
  },
  name: {
    fontSize: 14,
    display: 'flex',
    width: '20%',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  shortname: {
    fontSize: 14,
    fontWeight: 'bold',
    width: '5%',
    display: 'flex',
    marginTop: 'auto',
    marginBottom: 'auto',

  },
  comment: {
    fontSize: 14,
    display: 'flex',
    width: '70%',
    whiteSpace: 'nowrap',
    marginTop: 'auto',
    marginBottom: 'auto',
    overflow: 'auto',
    marginRight: '3%',
    marginLeft: '3%',
  },
  close_button: {
    float: 'right',
    padding: '0px',
  }
};

class ManufacturingLinesCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editting: false,
      text: ''
    }
  }

  delete(e) {
    e.stopPropagation();
    this.props.delete(Object.assign({}, this.props.item));
  }

  render() {
    const { classes, cookies} = this.props;
    const item = this.props.item
    return (
      <Card className={classes.card} onClick={() => { this.props.edit(item) }}>
        <CardContent className={classes.content}>
          <Typography className={classes.name} color="textSecondary" gutterBottom>
            {item.name}
          </Typography>
          <Typography className={classes.shortname} color="textSecondary" gutterBottom>
            {item.shortname}
          </Typography>
          <Typography className={classes.comment} color="textSecondary" gutterBottom>
            {item.comment}
          </Typography>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.button + ' ' + classes.close_button}
            onClick={(e) => { this.delete(e) }}
            disabled={cookies.cookies.core_write === 'false'}
          >
            <CloseIcon />
          </IconButton>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(withCookies(ManufacturingLinesCard));