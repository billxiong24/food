import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import ItemList from '../GenericComponents/ItemList';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import ManufacturingLinesCard from './ManufacturingLinesCard';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import Typography from '@material-ui/core/Typography';
import { IconButton } from '@material-ui/core';
import { manlineSearch, manlineCreate, manlineUpdate, manlineChangeLimit,
          manlineNextPage, manlinePrevPage, manlineDelete } from '../../Redux/Actions/ActionCreators/ManufacturingLineActionCreators';
import ManufacturingLinesNewDialog from './ManufacturingLinesNewDialog';
import ManufacturingLinesEditDialog from './ManufacturingLinesEditDialog';

const styles = {
  ingredients_list:{
    height: '100%',
    width: '65%',
    margin: 'auto',
    padding: 5,
  },
  divider:{
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
  },
  label_container: {
    marginTop: 10,
    marginBottom: 10,
    display:'flex',
    flexDirection:'row',
    justifyContent: 'flex-start',
  },
  name_label: {
    fontSize: 14,
    display:'flex',
    width:'19%',
    marginTop:'auto',
    marginBottom:'auto',
  },
  shortname_label: {
    fontSize: 14,
    width:'10%',
    display:'flex',
    marginTop:'auto',
    marginBottom:'auto',

  },
  comment_label: {
    fontSize: 14,
    display:'flex',
    marginLeft:'25%',
    marginTop:'auto',
    marginBottom:'auto',
  },
};

const nameRegex = /^[a-zA-Z0-9]{1,31}$/;
const shortNameRegex = /(?=^[A-Z]{1,5}[0-9]*$)(?=^[A-Z0-9]{1,5}$).*/;

class ManufacturingLinesPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      query: '',
      alert: false,
      message: '',
      autohide: null,
      newDialog: false,
      newName: '',
      newShortName: '',
      newComment:'',
      editDialog: false,
      editName: '',
      editShortName: '',
      editComment: '',
      editId: null,
    }
  }

  componentWillMount() {
    this.handleQuery();
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    })
  }

  handleEnter(e){
    if(e.which === 13 || e.keyCode === 13) {
      this.handleQuery();
    }
  }

  handleQuery(){
    this.props.manlineSearch(this.state.query);
  }

  handleClickNewOpen = () => {
    this.setState({ newDialog: true });
  };

  handleNewClose = () => {
    this.setState({ newDialog: false });
  };

  handleClickEditOpen = (manline) => {
    this.setState({ 
      editDialog: true,
      editName: manline.name,
      editShortName: manline.shortname,
      editComment: manline.comment,
      editId: manline.id,
    });
  };

  handleEditClose = () => {
    this.setState({ editDialog: false });
  };

  checkInputs(form) {
    if(this.state[form+'Name'].match(nameRegex) === null) {
      this.setState({
        message: "Name must be alphanumerical characters and have a max length of 32 characters",
        alert: true,
        autohide: null,
      })
    }
    if(this.state[form+'ShortName'].match(shortNameRegex) === null) {
      this.setState({
        message: "Short name must begin with one or more capital letters and may have numbers at the end with a max size of 5 characters",
        alert: true,
        autohide: null,
      })
    } else {
      return true;
    }
    return false;
  }

  handleResult(msg) {
    if(!this.props.manLine.errMsg) {
      this.setState({
        message: msg,
        alert: true,
        autohide: 6000,
        newName: '',
        newShortName: '',
        newComment: '',
      })
    } else {
      this.setState({
        message: this.props.manLine.errMsg,
        alert: true,
        autohide: 6000,
      })
    }
  }

  submitEditForm(e) {
    e.preventDefault();
    if(this.checkInputs('edit')) {
      this.props.manlineUpdate(Object.assign({}, {
        name: this.state.newName,
        shortname: this.state.newShortName,
        comment: this.state.newComment,
        id: this.state.editId,
      }))
      .then(()=> {
        this.handleResult("Manufacturing Line Successfully Updated!");
      })
    }
  }

  submitNewForm(e) {
    e.preventDefault();
    if(this.checkInputs('new')) {
      this.props.manlineCreate(Object.assign({}, {
        name: this.state.newName,
        shortname: this.state.newShortName,
        comment: this.state.newComment,
      }))
      .then(()=> {
        this.handleResult("Manufacturing Line Successfully Created!");
      })
    }
  }

  deleteManline(manline) {
    this.props.manlineDelete(manline)
    .then(()=>{
      if(!this.props.manLine.errMsg) {
        this.setState({
          alert: true,
          message: 'Manufacturing Line Successfully Removed!'
        });
      } else {
        this.setState({
          alert:true,
          message: 'Manufacturing Line NOT Deleted: ' + this.props.manLine.errMsg
        });
      }
    });
  }

  closeAlert() {
    this.setState({
      alert: false,
      message: ""
    });
  }

  incrementPage() {
    this.props.manlineNextPage();
    this.handleQuery();
  }

  decrementPage() {
    this.props.manlinePrevPage();
    this.handleQuery();
  }

  changeLimit(val) {
    this.props.manlineChangeLimit(val);
    this.handleQuery();
  }

  render() {
    const { classes, manLine } = this.props
    return (
      <div>
      <div className={classes.ingredients_list}>
          <div className={classes.top_section}>
            <div className={classes.search_bar}>
              <TextField
                id="outlined-search"
                label="Search Manufacturing Lines"
                type="search"
                className={classes.textField}
                margin="normal"
                variant="outlined"
                fullWidth
                value={this.state.query}
                onChange={this.handleChange('query')}
                onKeyPress={(e) => { this.handleEnter(e) }}
              />
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                className={classes.fab}
                onClick={(e) => { this.handleQuery() }}
              >
                Search
              </Fab>
            </div>
            <div className={classes.query_button}>
              <Fab
                variant="extended"
                className={classes.create_button}
                onClick={this.handleClickNewOpen}
              >
                New Line
              </Fab>
            </div>
            <ManufacturingLinesNewDialog
              open={this.state.newDialog}
              close={this.handleNewClose}
              submit={(e) => this.submitNewForm(e)}
              handleChange={this.handleChange}
              name={this.state.newName}
              shortname={this.state.newShortName}
              comment={this.state.newComment}
            />
          </div>
          <DisplayButton
            classes={classes}
            limit={manLine.limit}
            changeLimit={(val) => this.changeLimit(val)}
          >
          </DisplayButton>
          <div className={classes.list_container}>
            <div className={classes.label_container}>
              <span className={classes.name_label}>Name</span>
              <span className={classes.shortname_label}>Short Name</span>
              <span className={classes.comment_label}>Comment</span>
            </div>
            <div variant="inset" className={classes.divider} />
            <ItemList items={manLine.manLines}>
              <ManufacturingLinesCard
                delete={(manline) => { this.deleteManline(manline) }}
                edit={this.handleClickEditOpen}
              ></ManufacturingLinesCard>
            </ItemList>
          </div>
          <ManufacturingLinesEditDialog
            open={this.state.editDialog}
            close={this.handleEditClose}
            submit={(e) => this.submitFormCheck(e)}
            handleChange={this.handleChange}
            name={this.state.editName}
            shortname={this.state.editShortName}
            comment={this.state.editComment}
          />
          
          <div className={(manLine.manLines.length === 0 || !manLine.limit) ? classes.hide : ''}>
            <div variant="inset" className={classes.divider} />
            <div className={classes.page_selection_container}>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.decrementPage()}}>
                <img src={back} />
              </IconButton>
              <Typography className={classes.page_number_text}>
                Page {manLine.current_page_number} of {manLine.total_pages}
              </Typography>
              <IconButton color="primary" className={classes.button} onClick={()=>{this.incrementPage()}}>
                <img src={next} />
              </IconButton>
            </div>
          </div>
        </div>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
          overrideAutoHide={true}
          autoHideDuration={this.state.autohide}
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

const mapStateToProps = state => {
  return {
    manLine: state.manLine,
  };
};

const mapDispatchToProps = {
  manlineSearch,
  manlineCreate,
  manlineUpdate,
  manlineChangeLimit,
  manlineNextPage,
  manlinePrevPage,
  manlineDelete,
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ManufacturingLinesPage));