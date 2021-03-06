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
import { userCreateAttempt } from '../../Redux/Actions/ActionCreators/UserActionCreators';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import { Link } from 'react-router-dom';

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
  hide: {
    display: 'none'
  },
  status: {
    marginTop:20,
  }
});

const unameRegex = "^(?=.{3,32}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";
const netidRegex = /^netid_/i;
const passwordRegex = "^(?=.{8,70}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$";

class SignUpPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uname:"",
      password:"",
      passwordCheck:"",
      status:"",
      message:"",
      alert:false,
      autohide:null,
    }
  }

  updateUnameValue(evt) {
    this.setState({
      uname: evt.target.value
    });
  }

  updatePasswordValue(evt) {
    this.setState({
      password: evt.target.value
    });
  }

  updatePasswordCheckValue(evt) {
    this.setState({
      passwordCheck: evt.target.value
    });
  }

  submitFormCheck(e) {
    e.preventDefault();
    if(this.state.uname.match(unameRegex)===null || this.state.uname.match(netidRegex)!==null) {
      this.setState({
        uname: "",
        message: "Usernames must be between 3 and 32 characters of length and only use alphanumerical characters, -, and _. Cannot begin with 'netid_'.",
        alert: true,
        autohide: null,
      });
      return;
    }
    if(this.state.password.match(passwordRegex)===null) {
      this.setState({
        message: "Passwords must be between 8 and 32 characters of length and only use alphanumerical characters, -, and _",
        alert: true,
        autohide: null,
        password: "",
        passwordCheck: ""
      });
      return;
    }
    if(this.state.password!==this.state.passwordCheck) {
      this.setState({
        message: "Passwords do not match!",
        alert: true,
        autohide: 6000,
      });
      return;
    }
    this.props.userCreateAttempt(Object.assign({},this.state))
    .then(()=>{
      if(this.props.users.isSuccess) {
        this.setState({
          message: "User Successfully Created!",
          alert: true,
          autohide: 6000,
          uname: "",
          password: "",
          passwordCheck: ""
        })
      }
      else {
        this.setState({
          message: this.props.users.errMsg,
          alert: true,
          autohide: 6000
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
    const { classes, users } = this.props;
    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Create New User
          </Typography>
          <form className={classes.form} onSubmit={(e)=>{this.submitFormCheck(e)}}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="username">Username</InputLabel>
              <Input id="username" name="username" value={this.state.uname} onChange={evt => {this.updateUnameValue(evt)}}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input name="password" type="password" id="password" value={this.state.password} onChange={evt => {this.updatePasswordValue(evt)}}/>
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Re-Enter Password</InputLabel>
              <Input name="password" type="password" id="passwordCheck" value={this.state.passwordCheck} onChange={evt => {this.updatePasswordCheckValue(evt)}}/>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Create User
            </Button>
            <Button
              fullWidth
              variant="contained"
              className={classes.submit}
              component={Link}
              to={"/users"}
            >
              Done
            </Button>
          </form>
        </Paper>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
          overrideAutoHide={true}
          autoHideDuration={this.state.autohide}
        >
        </SimpleSnackbar>
      </main>
    );
  }
  
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

export default withStyles(styles)(connect(mapStateToProps,{userCreateAttempt})(SignUpPage));