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
import SKUList from './SKUList';
import IntegrationAutosuggest from '../GenericComponents/IntegrationAutosuggest';
import FilterDropdown from './FilterDropdown';
import SortByDropdown from './SortByDropdown';
import PageSelector from './PageSelector';
import SKUsPageSearchBar from './SKUsPageSearchBar';

const styles = {
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
  },
  SKUs_page_container: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    display: 'flex'
  },
  SKUs_list_container: {
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
  SKUs_list: {
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
  SKUs_list_divider: {
    width: '90%',
    backgroundColor: 'gray',
    height: '2px',
    margin: 10
  },
  page_number_text: {
    color: 'gray',
    margin: 5
  },
  SKUs_search_bar: {
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
  }
};

class SKUsPage extends Component {

  componentWillMount() {
  }



  render() {
    console.log(this.props)
    const { classes, dummy_SKUs } = this.props
    return (
      <div className={classes.SKUs_page_container}>
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
        <div className={classes.SKUs_list_container}>
          <div className={classes.SKUs_list}>
            <SKUsPageSearchBar></SKUsPageSearchBar>
            <div className={classes.SKUs_search_bar}>
            </div>
            <SKUList></SKUList>
          </div>
          <div variant="inset" className={classes.SKUs_list_divider} />
          <PageSelector></PageSelector>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dummy_SKUs: state.dummy_SKUs
  };
};


export default withStyles(styles)(connect(mapStateToProps, null)(SKUsPage));