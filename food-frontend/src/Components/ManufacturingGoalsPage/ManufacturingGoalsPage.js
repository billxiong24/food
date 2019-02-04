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
import ManufacturingGoalsFilterSelect from './ManufacturingGoalsFilterSelect';
import { mangoalAddFilter, mangoalRemoveFilter, mangoalDeleteMangoalSkus, mangaolDeleteMangoal, mangaolUpdateMangoalSkus, mangoalUpdateFilters, mangoalGetProductLines, mangoalSetActiveMangoal, mangoalGetMangoals, mangoalCreateMangoal, mangoalSearchSkus } from '../../Redux/Actions/ManufacturingGoalActionCreators';
import ManufacturingGoalsSkuSearch from './ManufacturingGoalsSkuSearch';
import TextField from '@material-ui/core/TextField';
import SkuCard from './SkuCard';
import axios from 'axios';
import common from '../../Resources/common';
import FileDownload from 'js-file-download';
import {routeToPage} from '../../Redux/Actions/index';
import {Link} from 'react-router-dom';
import Input from '@material-ui/core/Input';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';

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
    backgroundColor: 'purple',
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
    backgroundColor: 'purple',
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
    }
  }

  componentWillMount() {
    this.props.mangoalGetProductLines();
    this.getSkuSuggestions();
    this.props.mangoalGetMangoals(this.props.users.id);
  }

  updateFilters(filters) {
    new Promise((resolve, reject) => {
      resolve(this.props.mangoalUpdateFilters(filters));
    })
    .then((value) => {
      this.getSkuSuggestions();
    });
  }

  addFilter(prdline) {
    if (prdline) {
      this.props.mangoalAddFilter(prdline);
    }
  }

  removeFilter(prdline) {
    this.props.mangoalRemoveFilter(prdline);
  }

  addManufacturingGoal(manGoal) {
    this.props.mangoalCreateMangoal(Object.assign({}, manGoal, {
      user_id: this.props.users.id
    }))
    .then(()=>{
      if (this.props.manGoals.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line NOT Added: ' + this.props.manGoals.errMsg
        });
      }
    });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  handleQueryChange = name => event => {
    this.setState({
      [name]: event,
    });
  }

  addSku() {
    let sku = {
      sku_id: this.state.sku.value.id,
      quantity: this.state.quantity,
    }
    this.props.mangaolUpdateMangoalSkus(this.props.manGoals.activeGoal, [sku])
    .then((response) => {
      this.setState({
        sku: null,
        quantity: ''
      })
    });
  }

  removeSku(sku) {
    this.props.mangoalDeleteMangoalSkus(this.props.manGoals.activeGoal, [sku.id]);
  }

  getSkuSuggestions() {
    this.props.mangoalSearchSkus({name:''}, this.props.manGoals.filters)
    .then(()=>{
      let newSuggestions = this.props.manGoals.skus
      .map(sku => ({
        value: sku,
        label: sku.name + ': ' +
          sku.unit_size + ' * ' +
          sku.count_per_case
      }));
      this.setState({
        suggestions: newSuggestions // TODO update this when the query changes so we don't get all skus for autocomplete
      });
    })
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
    this.props.mangaolDeleteMangoal(manGoal)
    .then(()=>{
      if(this.props.manGoals.errMsg) {
        this.setState({
          alert:true,
          message: 'Product Line NOT Deleted: ' + this.props.manGoals.errMsg
        });
      }
    });
  }

  exportManGoal() {
    return axios.post(common.hostname + 'manufacturing_goals/exported_file', {
        data: this.props.manGoals.activeGoal.skus,
        format: "csv",
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
            {this.props.users.uname}'s Manufacturing Goals
          </Typography>
          <div>
            <ManufacturingGoalsCard
              onEnter={(manGoal) => { this.addManufacturingGoal(manGoal) }}
              editable={true}
              item={{ name: 'Add New Manufacturing Goal' }}
            ></ManufacturingGoalsCard>
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
                  <ManufacturingGoalsSkuSearch
                    suggestions={this.state.suggestions}
                    value={this.state.sku}
                    onChange={this.handleQueryChange('sku')}
                    placeholder={"Search for SKUs to Add"}
                  ></ManufacturingGoalsSkuSearch>
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
                  <InputLabel htmlFor="age-simple">Product Line</InputLabel>
                  <Select
                    value=""
                    onChange={(e)=>{this.addFilter(e.target.value)}}
                  >
                    <MenuItem value="">
                      <em></em>
                    </MenuItem>
                    {manGoals.productLines.map((prdline)=>(
                      <MenuItem key={prdline.id} value={prdline} data={prdline}>{prdline.name}</MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>Some important helper text</FormHelperText>
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
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dummy_ingredients: state.dummy_ingredients,
    users: state.users,
    manGoals: state.manGoals
  };
};

const mapDispatchToProps = {
  mangoalSetActiveMangoal,
  mangoalGetMangoals,
  mangoalCreateMangoal,
  mangoalSearchSkus,
  mangoalGetProductLines,
  mangoalUpdateFilters,
  mangaolUpdateMangoalSkus,
  mangaolDeleteMangoal,
  mangoalDeleteMangoalSkus,
  mangoalRemoveFilter,
  mangoalAddFilter,
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ManufacturingGoalsPage));