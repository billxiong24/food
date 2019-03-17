import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import { connect } from 'react-redux';
import { ingDeleteError, ingSearch } from '../../Redux/Actions';
import FilterList from './FilterList';
import IngredientList from './IngredientList';
import FilterDropdown from './FilterDropdown';
import SortByDropdown from './SortByDropdown';
import PageSelector from './PageSelector';
import IngredientsPageSearchBar from './IngredientsPageSearchBar';
import { ingDetSetIng, ingDetSetEditing, ingDetSetNew } from '../../Redux/Actions/ActionCreators/IngredientDetailsActionCreators';
import { withRouter } from 'react-router-dom'
import SimpleSnackbar from '../GenericComponents/SimpleSnackbar';
import axios from 'axios';
import FileDownload from 'js-file-download';
import common from '../../Resources/common';
import { withCookies } from 'react-cookie';
import DetailView from '../GenericComponents/DetailView';
import { Input } from '@material-ui/core';
import UnitSelect from '../GenericComponents/UnitSelect';
import swal from 'sweetalert';

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

class IngredientsPage extends Component {

  constructor(props){
    super(props)
    this.state = {
      createDialog: false
    }
  }

  componentWillMount() {
    this.props.search()
  }

  onAddClick = () =>{
    this.props.setIngredient(this.props.history)
  }

  onExportClick = () => {
  }

  errorCallback = (value) => {
    value = String(value)
    if(value.includes("12")){
        return "Input cannot contain 12"
    }else{
        return null
    }
}

  openIngredientCreatePage = (closeCallback) => {
    return (
        <DetailView
            open={true}
            close={closeCallback}
            submit={(e) => {
                console.log(e)
                swal({
                    icon: "success",
                });
                closeCallback()
            }}
            handleChange={() => console.log("handle change")}
            name={"Ingredient Name"}
            shortname={"Ingredient Short Name"}
            comment={"Ingredient Comment"}
            title={"Create Ingredient"}

        >
            <Input
                id="name"
                rows="4"
                error={true}
                name={"Name"}
                errorCallback={this.errorCallback}
            />
            <Input
                id="num"
                rows="4"
                type="number"
                name={"Number"}
                errorCallback={this.errorCallback}
            />
            <Input
                id="vend_info"
                rows="4"
                name={"Vendor Info"}
                errorCallback={this.errorCallback}
            />
            <UnitSelect
                id="pkg_size"
                unitSelect={true}
                name={"Package Size"}
                item="kg"
                items={["kg","g","grams"]}
                errorCallback={this.errorCallback}
            />
            <Input
                id="pkg_cost"
                rows="4"
                type="number"
                name={"Package Cost"}
                errorCallback={this.errorCallback}

            />
            <Input
                id="comment"
                rows="4"
                multiline
                type="number"
                name={"Comment"}
                errorCallback={this.errorCallback}
            />
        </DetailView>
    )
}


  render() {
    const { classes, dummy_ingredients } = this.props
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
            { this.props.cookies.admin === "true" ?
                <Button
                className={classes.add_ingredient}
                onClick={() => {this.setState({createDialog: true})}}
              >
                Add Ingredient
              </Button>
            :
            <div></div>

            }
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
          {
            this.state.createDialog ? this.openIngredientCreatePage(() => {
                this.setState({ createDialog: false });
            }) : null
          }
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    dummy_ingredients: state.dummy_ingredients,
    errors: state.ingredients.errors,
    items: state.ingredients.items,
    cookies: ownProps.cookies.cookies
  };
};

const mapDispatchToProps = dispatch => {
  return{
    setIngredient: (history) => {
      dispatch(ingDetSetIng({
        unit: "",
        name: "",
        num: null,
        vend_info: "",
        pkg_size: "",
        pkg_cost: "",
        comments: "",
        id: null
    }))
    dispatch(ingDetSetNew(true))
    dispatch(ingDetSetEditing(true))
      history.push('/ingredients/details')
    },
    deleteError: (error) => {
      dispatch(ingDeleteError(error))
    },
    search: () => {
      dispatch(ingSearch())
    }
  }
}


export default withRouter(withStyles(styles)(withCookies(connect(mapStateToProps, mapDispatchToProps)(IngredientsPage))));
//export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(IngredientsPage)));
