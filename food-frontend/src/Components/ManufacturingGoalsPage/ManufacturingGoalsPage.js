import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SimpleList from '../GenericComponents/ItemList';
import ItemList from '../GenericComponents/ItemList';
import IntegrationReactSelect from '../GenericComponents/IntegrationReactSelect';
import { purple } from '@material-ui/core/colors';
import color from '@material-ui/core/colors/cyan';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import DropdownButton from '../GenericComponents/DropdownButton';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';
import DeleteIcon from '@material-ui/icons/Delete';
import NavigationIcon from '@material-ui/icons/Navigation';
import IconButton from '@material-ui/core/IconButton';
import back from '../../Resources/Images/baseline-navigate_before-24px.svg'
import next from '../../Resources/Images/baseline-navigate_next-24px.svg'
import SimpleCard from '../GenericComponents/SimpleCard';
import ManufacturingGoalsCard from './ManufacturingGoalsCard';
import ManufacturingGoalsFilterSelect from './ManufacturingGoalsFilterSelect';
import { mangoalUpdateFilters, mangoalGetProductLines, mangoalSetActiveMangoal, mangoalGetMangoals, mangoalCreateMangoal, mangoalSearchSkus } from '../../Redux/Actions/ManufacturingGoalActionCreators';
import ManufacturingGoalsSkuSearch from './ManufacturingGoalsSkuSearch';
import TextField from '@material-ui/core/TextField';

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
    backgroundColor: 'purple',
    borderRadius: 12,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  man_goal_title_container: {
    marginTop: 10,
    width: '100%',
    display: 'flex'
  },
  man_goal_title: {
    color: 'white',
    fontSize: '32px',
  },
  man_goal_content_container: {
    marginTop: 10,
    backgroundColor: 'white',
    height: '100%',
    width: '100%',
    display:'flex',
    flexDirection: 'column'
  },
  man_goal_content_add: {
    width:'100%',
    height:60,
    display:'flex',
    flexDirection: 'row',
    padding: 5
  },
  sku_search_bar: {
    display: 'flex',
    width:'85%',
    padding: 5,
  },
  sku_quant_field: {
    display: 'flex',
    marginTop: 1,
    marginLeft: '1%',
    marginRight: '1%',
  },
  sku_add_button: {
    display: 'flex',
  },
  filter_container: {
    display: 'flex'
  },
  clickable: {
    cursor:'pointer'
  },
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
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
};

class ManufacturingGoalsPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: false,
      message: '',
      suggestions:[],
      quantity: 0
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
        suggestions: newSuggestions
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
    return; // TODO 
    this.props.prdlineDeletePrdline(manGoal)
    .then(()=>{
      if(!this.props.manGoals.errMsg) {
        this.setState({
          alert: true,
          message: 'Product Line Successfully Removed!'
        });
        // this.handleQuery();
      } else {
        this.setState({
          alert:true,
          message: 'Product Line NOT Deleted: ' + this.props.manGoals.errMsg
        });
      }
    });
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
          </div>
          <div variant="inset" className={classes.divider} />
          <div className={classes.man_goal_content_container}>
            <div className={classes.man_goal_content_add}>
              <div className={classes.sku_search_bar}>
                <ManufacturingGoalsSkuSearch
                  suggestions={this.state.suggestions}
                ></ManufacturingGoalsSkuSearch>
              </div>
              <TextField
                id="standard-number"
                label="Number"
                value={this.state.quantity}
                onChange={this.handleChange('quantity')}
                className={classes.textField +' '+classes.sku_quant_field}
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <Fab 
              color="primary" 
              aria-label="Add" 
              className={classes.fab +' '+classes.sku_add_button}
              size="small">
                <AddIcon />
              </Fab>
            </div>
            <div className={classes.filter_container}>
              <ManufacturingGoalsFilterSelect
              prdlines={manGoals.productLines}
              updateFilters={(filters)=>{this.updateFilters(filters)}}
              name={manGoals.filters}
              ></ManufacturingGoalsFilterSelect>
            </div>
          <div variant="inset" className={classes.divider} />
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
  mangoalUpdateFilters
}


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(ManufacturingGoalsPage));