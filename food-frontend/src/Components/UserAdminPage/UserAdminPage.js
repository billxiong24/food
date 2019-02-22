import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ItemList from '../GenericComponents/ItemList';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import { userSearch, userUpdate, userDelete, userNextPage, userPrevPage, userChangeLimit, } from '../../Redux/Actions/ActionCreators/UserActionCreators';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import { IconButton } from '@material-ui/core';
import { withCookies } from 'react-cookie';
import { Link } from 'react-router-dom';
import UserCard from './UserCard';

const styles = {
  ingredients_list:{
    height: '100%',
    width: '65%',
    margin: 'auto',
    padding: 5,
  },
  ingredients_list_divider:{
    width:'100%',
    backgroundColor:'gray',
    height:'2px',
    marginTop:10,
  },
  page_number_text:{
    color:'gray',
    margin: 5
  },
  top_section:{
    width: '100%',
    'text-align':'left',
    display:'flex',
    flexDirection:'row',
  },
  search_bar:{
    width: '80%',
    display:'inline-flex'
  },
  query_button:{
    display:'inline-flex',
    width: '6%',
    'padding-left':'2%',
    marginTop:15,
  },
  create_button:{
    textAlign:'center',
  },
  list_container:{
    overflow:'auto',
  },
  hide: {
    display:'none'
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '30%',
    paddingRight: '30%',
  },
  page_number_text: {
    fontSize: '14px',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    margin:'auto',
  },
  button: {
    margin:'auto',
  }
};

class UserAdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: '',
      alert: false,
      message: ''
    }
  }

  componentWillMount(){
    this.handleQuery();
  }

  handleQueryChange(e){
    this.setState({
      query: e.target.value
    });
  }

  handleEnter(e){
    if(e.which === 13 || e.keyCode === 13) {
      this.handleQuery();
    }
  }

  handleQuery(){
    this.props.userSearch(this.state.query);
  }

  updateUser(user){
    this.props.userUpdate(user)
    .then(()=>{
      if(!this.props.users.errMsg) {
        this.setState({
          alert: true,
          message: 'User Successfully Changed!'
        })
      } else {
        this.setState({
          alert: true,
          message: 'User NOT Changed: ' + this.props.users.errMsg
        })
      }
    })
  }

  deleteUser(user) {
    this.props.userDelete(user)
    .then(()=>{
      if(!this.props.users.errMsg) {
        this.setState({
          alert: true,
          message: 'User Successfully Removed!'
        });
      } else {
        this.setState({
          alert:true,
          message: 'User NOT Deleted: ' + this.props.users.errMsg
        });
      }
    });
  }

  handleToggle(user) {
    delete user.row_count
    this.updateUser(Object.assign({}, user, {admin:!user.admin}));
  }

  closeAlert() {
    this.setState({
      alert: false,
      message: ''
    });
  }

  incrementPage() {
    this.props.userNextPage();
    this.handleQuery();
  }

  decrementPage() {
    this.props.userPrevPage();
    this.handleQuery();
  }

  changeLimit(val) {
    this.props.userChangeLimit(val);
    this.handleQuery();
  }

  render() {
    const { classes, users, cookies } = this.props
    return (
      <div>
        <div className={classes.ingredients_list}>
          <div className={classes.top_section}>
            <div className={classes.search_bar}>
              <TextField
                id="outlined-search"
                label="Search Users"
                type="search"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
                value={this.state.query}
                onChange={(e) => { this.handleQueryChange(e) }}
                onKeyPress={(e) => { this.handleEnter(e) }}
              />
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                aria-label="Delete"
                className={classes.fab}
                onClick={(e) => { this.handleQuery() }}
              >
                Search
              </Fab>
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                aria-label="Delete"
                className={classes.create_button}
                component={Link}
                to={"/create_user"}
              >
                Create User
              </Fab>
            </div>
          </div>
          <DisplayButton
          classes={classes}
          limit={users.limit}
          changeLimit={(val)=>this.changeLimit(val)}
          >
          </DisplayButton>
          <div className={classes.list_container}>
            <div variant="inset" className={classes.ingredients_list_divider} />
            <ItemList items={users.users}>
              <UserCard
                delete={(user) => { this.deleteUser(user) }}
                handleToggle={(user) => {this.handleToggle(user) }}
                currentUser={cookies.user}
              ></UserCard>
            </ItemList>
          </div>

          <div className={(users.users.length === 0 || !users.limit) ? classes.hide : ''}>
            <div variant="inset" className={classes.ingredients_list_divider} />
            <div className={classes.page_selection_container}>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.decrementPage()}}>
                <img src={back} />
              </IconButton>
              <Typography className={classes.page_number_text}>
                Page {users.current_page_number} of {users.total_pages}
              </Typography>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.incrementPage()}}>
                <img src={next} />
              </IconButton>
            </div>
          </div>
        </div>
        <SimpleSnackbar
        open={this.state.alert} 
        handleClose={()=>{this.closeAlert()}}
        message={this.state.message}
        >
        </SimpleSnackbar>
      </div>
    );
  }
}

function DisplayButton(props) {
  const { classes } = props
  if(props.limit) {
    return (
      <Button variant="contained" className={classes.button} onClick={()=>props.changeLimit(null)}>
        Show All Entries
      </Button>
    )
  } else {
    return (
      <Button variant="contained" className={classes.button} onClick={()=>props.changeLimit(10)}>
        Show 10 Entries Per Page
      </Button>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    users: state.users,
    cookies: ownProps.cookies.cookies,
  };
};

const mapDispatchToProps = {
  userSearch,
  userUpdate,
  userDelete,
  userNextPage,
  userPrevPage,
  userChangeLimit,
};


export default withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(UserAdminPage)));