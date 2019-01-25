import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { userLoginAttempt } from '../../Redux/Actions'

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname:"",
      password:""
    }
  }

  updateUnameValue(evt) {
    this.setState({
      uname: evt.target.value
    });
  }

  updatePasswordValue(evt) {
    evt.preventDefault();
    this.setState({
      password: evt.target.value
    });
  }

  render() {
    const { classes, users } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} onSubmit={(e)=>{e.preventDefault(); this.props.userLoginAttempt(Object.assign({},this.state))}}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" name="username" autoComplete="username" autoFocus value={this.state.uname} onChange={evt => {this.updateUnameValue(evt)}}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" autoComplete="current-password" value={this.state.password} onChange={evt => {this.updatePasswordValue(evt)}}/>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign in
            </Button>
            <label>{users.uname}</label>
          </form>
        </Paper>
      </main>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

export default withStyles(styles)(connect(mapStateToProps,{userLoginAttempt})(LoginPage));