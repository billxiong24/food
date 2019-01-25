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
import { getDummyIngredients } from '../../Redux/Actions';
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
    width: '70%',
    float: 'right',
    backgroundColor: 'red',
    marginRight: 15,
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
    padding: 10,
    backgroundColor: 'purple',
    flexDirection: 'column',
    display: 'flex',
    borderRadius: 12
  },
  active_filters_container_title: {
    color: 'white',
    fontSize: '24px',
    float: 'left'
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
  }
};

class IngredientsPage extends Component {

  componentWillMount() {
    this.props.getDummyIngredients()
  }



  render() {
    console.log(this.props)
    const { classes, dummy_ingredients } = this.props
    return (
      <div className={classes.ingredients_page_container}>
        <Card className={classes.active_filters_container}>
          <Typography className={classes.active_filters_container_title}>
            Active Filters
          </Typography>
          <div className ={classes.filters_list}>
            <ItemList items={dummy_ingredients}>
              <FilterItem></FilterItem>
            </ItemList>
          </div>
        </Card>
        <div className={classes.ingredients_list_container}>
          <div className={classes.ingredients_list}>
            <div className={classes.ingredients_search_bar}>
              <IntegrationReactSelect></IntegrationReactSelect>
              <DropdownButton></DropdownButton>
              <DropdownButton></DropdownButton>
            </div>
            <ItemList items={dummy_ingredients}>
              <SimpleCard></SimpleCard>
            </ItemList>
          </div>
          <div variant="inset" className={classes.ingredients_list_divider} />
          <div className={classes.page_selection_container}>
            <IconButton color="secondary" className={classes.button} aria-label="Add an alarm">
              <img src={back}/>
            </IconButton>
            <Typography className={classes.page_number_text}>
              Page 1 of 12
            </Typography>
            <IconButton color="secondary" className={classes.button} aria-label="Add an alarm">
              <img src={next}/>
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dummy_ingredients: state.dummy_ingredients
  };
};


export default withStyles(styles)(connect(mapStateToProps, { getDummyIngredients })(IngredientsPage));