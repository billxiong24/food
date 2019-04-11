import React, { Component } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { routeToPage } from '../../Redux/Actions';
import { userLoginAttempt, userNetIdLogin } from '../../Redux/Actions/ActionCreators/UserActionCreators';
import { Redirect } from 'react-router-dom';
import querystring from 'querystring';
import axios from 'axios';
import common from '../../Resources/common';
import { withCookies } from 'react-cookie';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { landingPage } from '../RouterComponent';

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
  }
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname:"",
      password:"",
      message:"",
      alert:false,
    }
  }

  componentWillMount() {
    if (window.location.hash) {
      const hash = querystring.parse(window.location.hash.slice(1));
      axios.get('https://api.colab.duke.edu/identity/v1/', {
        headers: {
          'x-api-key': common.colab_client_id,
          'Authorization': `Bearer ${hash.access_token}`
        },
        withCredentials: false,
      })
      .then((response) => {
        this.props.userNetIdLogin({uname: response.data.netid, password: response.data.duDukeID});
      })
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

  submitFormCheck(e) {
    e.preventDefault();
    this.props.userLoginAttempt(Object.assign({},this.state))
    .then((response) => {
      if(this.props.users.errMsg) {
        this.setState({
          alert: true,
          message: this.props.users.errMsg,
        })
      }
    })
  }
  
  closeAlert() {
    this.setState({
      alert: false,
      message: ""
    });
  }

  render() {
    const { classes, cookies } = this.props;
    if (cookies.user) {
      console.log(landingPage);
      return <Redirect to={landingPage}/>
    }

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log In
          </Typography>
          <form className={classes.form} onSubmit={(e)=>{this.submitFormCheck(e)}}>
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
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              href={"https://oauth.oit.duke.edu/oauth/authorize.php?client_id=" + common.colab_client_id + 
                   "&redirect_uri=" + common.colab_redirect_uri + 
                   "&client_secret=" + common.colab_client_secret + 
                   "&response_type=token&state=1234&scope=basic"}
            >
              NetID Sign In
            </Button>
          </form>
        </Paper>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
        >
        </SimpleSnackbar>
      </main>
    );
  }
  
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    cookies: ownProps.cookies.cookies,
  }
}

const mapDispatchToProps = {
  userLoginAttempt: userLoginAttempt,
  routeToPage: routeToPage,
  userNetIdLogin: userNetIdLogin,
}

export default withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(LoginPage)));