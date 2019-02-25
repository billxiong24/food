import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SimpleList from '../GenericComponents/ItemList';
import ItemList from '../GenericComponents/ItemList';
import { purple } from '@material-ui/core/colors';
import color from '@material-ui/core/colors/cyan';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import { connect } from 'react-redux';
import { formulaDeleteError, formulaSearch } from '../../Redux/Actions';
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
import FilterItem from './FilterItem';
import FilterList from './FilterList';
import IngredientList from './IngredientList';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import FilterDropdown from './FilterDropdown';
import SortByDropdown from './SortByDropdown';
import PageSelector from './PageSelector';
import IngredientsPageSearchBar from './IngredientsPageSearchBar';
import { formulaDetSetIngredients, formulaDetSetFormula, formulaDetSetEditing, formulaDetSetNew } from '../../Redux/Actions/ActionCreators/FormulaDetailsActionCreators';
import { withRouter } from 'react-router-dom'
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common from '../../Resources/common';

const styles = {
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
  },
  ingredients_page_container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  ingredients_list_container: {
    height: '100%',
    width: '73%',
    float: 'right', 
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: 'column',
    display: 'flex',
    alignItems: 'center'
  },
  ingredients_list: {
    height: '80vh',
    width: '100%',
    margin: 5,
    padding: 5,
    overflow: 'auto'
  },
  filters_list:{
    overflow: 'auto'
  },
  active_filters_container: {
    height: '85vh',
    width: '23%',
    marginRight: 5,
    marginLeft: 5,
    marginTop: 5,
    marginBottom: 5,
    padding: 12,
    backgroundColor: '#6F3AD3',
    flexDirection: 'column',
    display: 'flex',
    borderRadius: 12,
    overflow: 'auto'
  },
  active_filters_container_title: {
    color: 'white',
    fontSize: '16px',
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 300,
    textAlign: 'left',
    margin: 8
  },
  ingredients_list_divider: {
    width: '90%',
    backgroundColor: 'gray',
    height: '2px',
    margin: 10
  },
  page_number_text: {
    color: 'gray',
    margin: 5
  },
  ingredients_search_bar: {
    flexDirection: 'row',
    display: 'flex'
  },
  page_selection_container: {
    flexDirection: 'row',
    display: 'flex'
  },
  button: {
  },
  input: {
    display: 'none',
  },
  autosuggest:{
    fontSize: 14,
    fontFamily: 'Open Sans',
    fontWeight: 300
  },
  other_actions: {
    width: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  add_ingredient:{
    marginRight: 'auto'
  },
  export_to_csv:{
    marginLeft: 'auto'
  }
};

class FormulaPage extends Component {

  componentWillMount() {
    this.props.search()
  }

  onAddClick = () =>{
    this.props.setFormula(this.props.history)
  }

  onExportClick = () => {
      console.log(this.props.items);
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.items.map((formula) => ({
        id: formula.id,
        num:formula.num,
        name:formula.name,
        comment: formula.comments
      })),
      format: "csv",
      type: "formula"
    })
      .then((response) => {
        FileDownload(response.data, 'ingredients.csv');
      })
      .catch(err => {
        console.log(err);
      })
  }


  render() {
    console.log(this.props)
    console.log(this.props.errors)
    const { classes } = this.props
    return (
      <div className={classes.ingredients_page_container}>
        <Card className={classes.active_filters_container}>
        <Typography className={classes.active_filters_container_title}>
            Search Bar Filter Type
        </Typography>
        <FilterDropdown></FilterDropdown>
        <Typography className={classes.active_filters_container_title}>
            Sort By
          </Typography>
              <SortByDropdown></SortByDropdown>
          <Typography className={classes.active_filters_container_title}>
            Active Filters
          </Typography>
          <FilterList></FilterList>
        </Card>
          <div className={classes.ingredients_list_container}>
            <div className={classes.ingredients_list}>
              <IngredientsPageSearchBar></IngredientsPageSearchBar>
            <div className={classes.ingredients_search_bar}>
          </div>
          <div className={classes.other_actions}>
            { this.props.users.id === common.admin ?
                <Button
                className={classes.add_ingredient}
                onClick={this.onAddClick}
              >
                Add Formula 
              </Button>
            :
            <div></div>

            }
            <Button
              className={classes.export_to_csv}
              onClick={this.onExportClick}
            >
              Export to CSV
            </Button>
          </div>
            <IngredientList></IngredientList>
        </div>
          <div variant="inset" className={classes.ingredients_list_divider} />
          <PageSelector></PageSelector>
        </div>
        {
          this.props.errors.map((error, index) => (
            <SimpleSnackbar
              open={true} 
              handleClose={()=>{this.props.deleteError(error)}}
              message={error.errMsg}
            >
            </SimpleSnackbar>
          ))
          }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    errors: state.formulas.errors,
    items: state.formulas.items,
    users: state.users
  };
};

const mapDispatchToProps = dispatch => {
  return{
    setFormula: (history) => {
    dispatch(formulaDetSetNew(true))
    dispatch(formulaDetSetEditing(true))
    dispatch(formulaDetSetIngredients([]))
      dispatch(formulaDetSetFormula({
        made_formula: false,
        name: "",
        num: null,
        comments: "",
        id: null
    }))
      history.push('/formula/details')
    },
    deleteError: (error) => {
      dispatch(formulaDeleteError(error))
    },
    search: () => {
      dispatch(formulaSearch())
    }
  }
}


export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FormulaPage)));