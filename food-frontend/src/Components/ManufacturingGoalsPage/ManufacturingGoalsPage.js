import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import ItemList from '../GenericComponents/ItemList';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import ManufacturingGoalsCard from './ManufacturingGoalsCard';
import { mangoalAddFilter, mangoalRemoveFilter, mangoalDeleteMangoalSkus, mangaolDeleteMangoal, mangaolUpdateMangoalSkus, mangoalSearchProductLines, mangoalSetActiveMangoal, mangoalGetMangoals, mangoalCreateMangoal, mangoalSearchSkus } from '../../Redux/Actions/ActionCreators/ManufacturingGoalActionCreators';
import ManufacturingGoalsSkuSearch from './ManufacturingGoalsSkuSearch';
import TextField from '@material-ui/core/TextField';
import SkuCard from './SkuCard';
import axios from 'axios';
import common from '../../Resources/common';
import FileDownload from 'js-file-download';
import {Link} from 'react-router-dom';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import { withCookies } from 'react-cookie';
import SkuAutocomplete from './SkuAutocomplete';
import Autocomplete from './Autocomplete';
import ManufacturingGoalsNewDialog from './ManufacturingGoalsNewDialog';
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
let date = require('date-and-time');

const styles = {
  man_goal_page_container: {
    width: '100%',
    height: '94%',
    flexDirection: 'row',
    display: 'flex',
    position: 'absolute'
  },
  user_man_goals_container: {
    width: '20%',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    backgroundColor: '#6F3AD3',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column'
  },
  user_man_goals_title: {
    color: 'white',
    fontSize: '24px',
    float: 'left'
  },
  man_goal_list_container: {
    overflow: 'auto',
    direction: 'ltr'
  },
  man_goal_container: {
    width: '80%',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 10,
    paddingLeft: '2.5%',
    paddingRight: '2.5%',
    paddingTop: '1%',
    paddingBottom: '1%',
    backgroundColor: '#6F3AD3',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  man_goal_title_container: {
    marginTop: 10,
    marginBottom: 5,
    width: '100%',
    display: 'flex'
  },
  man_goal_title: {
    color: 'white',
    fontSize: '32px',
    width: '95%',
    textAlign: 'left',
  },
  man_goal_content_container: {
    marginTop: 10,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    display:'flex',
    flexDirection: 'column'
  },
  sku_search_container: {
    height: 140,
  },
  man_goal_content_add: {
    width:'100%',
    height:'50%',
    display:'flex',
    flexDirection: 'row',
  },
  sku_search_bar: {
    display: 'flex',
    width:'80%',
    padding: 5,
    paddingTop: 22,
  },
  sku_quant_field: {
    display: 'flex',
    marginTop: 10,
    marginLeft: '1%',
    marginRight: '1%',
  },
  sku_add_button: {
    display: 'flex',
    marginTop: 15,
  },
  filter_container: {
    display: 'flex',
    height: '50%',
    marginLeft: 5,
  },
  drop_down: {
  },
  active_filter_container: {
  },
  filter_chip: {
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: 5,
  },
  sku_list_container: {
    overflow: 'auto',
    flexBasis: '80%',
  },
  man_goal_options_container: {
    padding:10,
  },
  clickable: {
    cursor:'pointer'
  },
  card: {
    width: '100 %',
    margin: 20,
    padding: 10,
  },
  ingredients_list: {
    height: '80vh',
    width: '100%',
    margin: 5,
    padding: 5,
    overflow: 'auto'
  },
  page_number_text: {
    color: 'gray',
    margin: 5
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex'
  },
  divider: {
    width: '100%',
    backgroundColor: 'gray',
    height: '2px'
  },
  hidden: {
    display: 'none'
  },
};

class ManufacturingGoalsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: false,
      message: '',
      suggestions:[],
      quantity: '',
      sku: null,
      search: '',
      searchProdLine: '',
      newDialog: false,
      newName: '',
      newDeadline: date.format(new Date(), 'YYYY-MM-DD'),
      defaultDate: date.format(new Date(), 'YYYY-MM-DD'),
    }
  }

  componentWillMount() {
    this.props.mangoalSearchSkus({name:''}, this.props.manGoals.filters);
    this.props.mangoalSearchProductLines('');
    this.props.mangoalGetMangoals(this.props.cookies.id);
  }

  addFilter = (id) => {
    if (id) {
      new Promise((resolve, reject) => {
        resolve(this.props.mangoalAddFilter(
          this.props.manGoals.productLines.filter((prodline) => {
            return prodline.id === id;
          })[0]
        ));
      })
      .then((value) => {
        this.getSkuSuggestions();
      });
    }
  }

  removeFilter(prdline) {
    new Promise((resolve, reject) => {
      resolve(this.props.mangoalRemoveFilter(prdline));
    })
    .then((value) => {
      this.getSkuSuggestions();
    });
  }

  submitNewForm(e) {
    e.preventDefault();
    if(!this.state.newName || !this.state.newDeadline) {
      this.setState({
        message: "Please fill out all the information",
        alert: true,
      })
    } else {
      this.props.mangoalCreateMangoal(Object.assign({}, {
        user_id: this.props.cookies.id,
        name: this.state.newName,
        deadline: this.state.newDeadline,
      }))
      .then(()=>{
        if (this.props.manGoals.errMsg) {
          this.setState({
            alert: true,
            message: 'Manufacturing Goal NOT Added: ' + this.props.manGoals.errMsg
          });
        } else {
          this.setState({
            alert: true,
            message: 'Manufacturing Goal Successfully added',
            newName: '',
            newDeadline: this.state.defaultDate,
          });
          this.handleNewClose();
        }
      });
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  onChange = e => {
    this.setState({
      search: e.currentTarget.value,
      sku: null,
    });
    return this.props.mangoalSearchSkus({name:e.currentTarget.value}, this.props.manGoals.filters);
  };

  selectSku = skuNum => {
    this.setState({
      sku: skuNum,
    })
  }

  onChangeProdline = e => {
    this.setState({
      searchProdLine: e.currentTarget.value,
    });
    return this.props.mangoalSearchProductLines(e.currentTarget.value);
  }

  addSku() {
    let sku = {
      sku_id: this.state.sku,
      quantity: this.state.quantity,
    }
    this.props.mangaolUpdateMangoalSkus(
      Object.assign({}, this.props.manGoals.activeGoal, {
        user_id: this.props.cookies.id
      }),
      [sku]
    )
    .then((response) => {
      this.setState({
        sku: null,
        quantity: ''
      })
    });
  }

  removeSku(sku) {
    this.props.mangoalDeleteMangoalSkus(
      Object.assign({}, this.props.manGoals.activeGoal, {
        user_id: this.props.cookies.id
      }),
      [sku.id]
    );
  }

  getSkuSuggestions() {
    this.props.mangoalSearchSkus({name:this.state.search}, this.props.manGoals.filters);
  }

  updateManufacturingGoal(manGoal){
    return; // TODO add actual action creator
    this.props.mangoalUpdateMangoal(manGoal)
    .then(()=>{
      if(!this.props.manGoals.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line Successfully Changed!'
        })
      } else {
        this.setState({
          alert: true,
          message: 'Product Line NOT Changed: ' + this.props.manGoals.errMsg
        })
      }
    })
  }

  removeManufacturingGoal(manGoal){
    this.props.mangaolDeleteMangoal(Object.assign({}, manGoal, {
      user_id: this.props.cookies.id
    }))
      .then(() => {
        if (this.props.manGoals.errMsg) {
          this.setState({
            alert: true,
            message: 'Product Line NOT Deleted: ' + this.props.manGoals.errMsg
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

  handleClickNewOpen = () => {
    this.setState({ newDialog: true });
  };

  handleNewClose = () => {
    this.setState({ newDialog: false });
  };

  exportManGoal() {
    return axios.post(common.hostname + 'manufacturing_goals/exported_file', {
        data: this.props.manGoals.activeGoal.skus,
        format: "csv",
        type: "mangoal"
    })
    .then((response)=>{
      FileDownload(response.data, this.props.manGoals.activeGoal.name + '.csv');
    })
    .catch(err=>{
      console.log(err);
    })
  }

  showManufacturingGoal(manGoal) {
    this.props.mangoalSetActiveMangoal(manGoal);
  }

  render() {
    const { classes, manGoals } = this.props
    return (
      <div className={classes.man_goal_page_container}>
        <div className={classes.user_man_goals_container}>
          <Typography className={classes.user_man_goals_title}>
            {this.props.cookies.user}'s Manufacturing Goals
          </Typography>
          <div>
            <Button
              variant="contained"
              onClick={this.handleClickNewOpen}
            >
              New Manufacturing Goal
            </Button>
            <ManufacturingGoalsNewDialog
              open={this.state.newDialog}
              close={this.handleNewClose}
              submit={(e) => this.submitNewForm(e)}
              handleChange={this.handleChange}
              name={this.state.newName}
              date={this.state.newDeadline}
            />
            <div variant="inset" className={classes.divider} />
          </div>
          <div className={classes.man_goal_list_container}>
            <ItemList items={manGoals.goals}>
              <ManufacturingGoalsCard
                onClick={(index)=>{this.showManufacturingGoal(index)}}
                editable={false}
                className={classes.clickable}
              ></ManufacturingGoalsCard>
            </ItemList>
          </div>
        </div>
        <div className={classes.man_goal_container}>
          <div className={classes.man_goal_title_container}>
            <Typography className={classes.man_goal_title}>
              {manGoals.activeGoal.name}
            </Typography>
            <Fab 
            size="small" 
            aria-label="Delete" 
            className={(manGoals.activeGoal.id ? classes.fab : classes.hidden)}
            onClick={()=>{this.removeManufacturingGoal(this.props.manGoals.activeGoal)}}
            >
              <DeleteIcon />
            </Fab>
          </div>
          <div variant="inset" className={classes.divider} />
          <div className={(manGoals.activeGoal.id ? classes.man_goal_content_container : classes.hidden)}>
            <div className={classes.sku_search_container}>
              <div className={classes.man_goal_content_add}>
                <div className={classes.sku_search_bar}>
                  <SkuAutocomplete
                    suggestions={manGoals.skus}
                    value={this.state.search}
                    onChange={this.onChange}
                    selectId={this.selectSku}
                    placeholder={"Please Search and Select a SKU"}
                  >
                  </SkuAutocomplete>
                </div>
                <TextField
                  id="standard-number"
                  label="Number"
                  value={this.state.quantity}
                  onChange={this.handleChange('quantity')}
                  className={classes.textField + ' ' + classes.sku_quant_field}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Fab
                  color="primary"
                  aria-label="Add"
                  className={classes.fab + ' ' + classes.sku_add_button}
                  size="small"
                  disabled={!this.state.sku || !this.state.quantity}
                  onClick={() => { this.addSku() }}>
                  <AddIcon />
                </Fab>
              </div>
              <div className={classes.filter_container}>
                <FormControl className={classes.drop_down}>
                  <Autocomplete
                    suggestions={manGoals.productLines}
                    value={this.state.searchProdLine}
                    onChange={this.onChangeProdline}
                    selectId={this.addFilter}
                    placeholder={"Product Line"}
                    id={"prod"}
                  >
                  </Autocomplete>
                  <FormHelperText>Select Product Lines to Filter By</FormHelperText>
                </FormControl>
                <div className={classes.active_filter_container}>
                  {manGoals.filters.map((prdline) => (
                    <Chip
                      label={prdline.name}
                      value={prdline}
                      key={prdline.id}
                      clickable={false}
                      onDelete={()=>{this.removeFilter(prdline)}}
                      className={classes.filter_chip}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div variant="inset" className={classes.divider} />
            <div>
              <label style={{float:'left',marginLeft:50}}>Qty.</label>
              <label style={{float:'left',marginLeft:50}}>SKU Item</label>
            </div>
            <div className={classes.sku_list_container}>
              <ItemList
                items={manGoals.activeGoal.skus}
              >
                <SkuCard
                onDelete={(e)=>{this.removeSku(e)}}></SkuCard>
              </ItemList>
            </div>
            <div variant="inset" className={classes.divider} />
            <div className={classes.man_goal_options_container}>
              <Button 
              variant="contained" 
              className={classes.button}
              onClick={()=>{this.exportManGoal()}}
              >
                Export {manGoals.activeGoal.name}
              </Button>
              <Button 
              variant="contained" 
              className={classes.button}
              component={Link}
              to={'/manufacturing_goals/calculations'}
              >
                View Manufacturing Calculations
              </Button>
            </div>
          </div>
        </div>
        <SimpleSnackbar
          open={this.state.alert}
          handleClose={() => { this.closeAlert() }}
          message={this.state.message}
          autoHideDuration={this.state.autohide}
        >
        </SimpleSnackbar>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dummy_ingredients: state.dummy_ingredients,
    cookies: ownProps.cookies.cookies,
    manGoals: state.manGoals
  };
};

const mapDispatchToProps = {
  mangoalSetActiveMangoal,
  mangoalGetMangoals,
  mangoalCreateMangoal,
  mangoalSearchSkus,
  mangoalSearchProductLines,
  mangaolUpdateMangoalSkus,
  mangaolDeleteMangoal,
  mangoalDeleteMangoalSkus,
  mangoalRemoveFilter,
  mangoalAddFilter,
}


export default withStyles(styles)(withCookies(connect(mapStateToProps, mapDispatchToProps)(ManufacturingGoalsPage)));
