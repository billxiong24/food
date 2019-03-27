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
import common, { defaultErrorCallback, defaultTextErrorCallbackGenerator, defaultNumErrorCallbackGenerator } from '../../Resources/common';
import DetailView from '../GenericComponents/DetailView';
import { Input } from '@material-ui/core';
import InputList from '../GenericComponents/InputList';
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

class FormulaPage extends Component {

  state = {
    createDialog: null
  }

  errorCallback = (value) => {
    // value = String(value)
    // if(value.includes("12")){
    //     return "Input cannot contain 12"
    // }else{
    //     return null
    // }
    return null
}


  componentWillMount() {
    this.props.search()
  }

  onAddClick = () =>{
    this.props.setFormula(this.props.history)
  }

  formulaNumErrorCallbackGenerator = (num) => {
    return (value, prop, callBack) => {
        axios.put(`${common.hostname}formula/valid_num`,{num:parseInt(value)}).then((res) =>{
          let error
          console.log("hello")
          console.log(value)
          console.log(num)
          if(res.data.valid || num==parseInt(value)){
            error = null
          }else{
            error = "Invalid Number"
          }
          return {
            prop,
            error
          }
        })
        .catch((error) => {
          return {
            error: "Invalid Number",
            prop
          }
        })
        .then(callBack)
      }
    }

    formulaNumErrorCallback = (value, prop, callBack) => {

          axios.put(`${common.hostname}formula/valid_num`,{num:parseInt(value)}).then((res) =>{
            let error
            if(res.data.valid){
              error = null
            }else{
              error = "Invalid Number"
            }
            return {
              prop,
              error
            }
          })
          .catch((error) => {
            console.log("error")
            return {
              error: "Invalid Number",
              prop
            }
          })
          .then(callBack)
        }

  openCreatePage = () => {
    return axios.get(`${common.hostname}formula/init_formula`).then( (res) => {
          let formula_data = res.data
          let createDialog = (
            <DetailView
              open={true}
              close={() => {this.setState({createDialog:null})}}
              onSubmit={(form_data) => {
              let item = {}
              let isError = false
              for (var property in form_data) {
                  if (form_data.hasOwnProperty(property)) {
                      if(property.includes("pkg_size") && !property.includes("errorMsg")){
                          // console.log(property)
                          // console.log(this.state[property])
                          item["pkg_size"] = form_data[property].split(" ")[0]
                          item["unit"] = form_data[property].split(" ")[1]
                      }else if(!property.includes("errorMsg")){
                          item[property] = form_data[property]
                      }else{
                          isError = isError || form_data[property] != null
                      }
                  }
                  // if (this.state.hasOwnProperty(property)) {
                  //     // console.log(String(property).contains(""))
                  // }
              }
                  if(isError){
                      swal(`There are unresolved errors`,{
                          icon: "error",
                      });
                  }else{
                    if(!Array.isArray(item.ingredients)){
                      item.ingredients = [] 
                    }
                      console.log(item.ingredients)
                      let ingredientso = item.ingredients.map(ing => {
                        return {
                        ingredients_id:ing.id,
                        quantity: ing.quantity,
                        unit: "kg"
                      }
                    })
                    console.log(ingredients)
                      console.log(item)
                      let that = this
                      const {ingredients, ...new_formula_data} = item
                      new_formula_data.num = parseInt(new_formula_data.num)
                      console.log(ingredients)
                      axios.post(`${common.hostname}formula/`, new_formula_data)
                      .then(function (response) {
                          //that.props.submit(item)
                          axios.post(`${common.hostname}formula/${response.data.id}/ingredients`, {ingredients:ingredientso})
                            .then(function (response) {
                                console.log(response)
                                swal({
                                    icon: "success",
                                });
                                that.setState({createDialog:null})
                                that.props.search()
                                
                            })
                            .catch(function (error) {
                                swal(`${error}`,{
                                    icon: "error",
                                });
                            });
                                
                      })
                      .catch(function (error) {
                          swal(`${error}`,{
                              icon: "error",
                          });
                      });
                    
                  }
                  
              }}
              handleChange={() => console.log("handle change")}
              title={"Create Formula"}
          >
              <Input
                  id="name"
                  name={"Name *"}
                  displayName="Input"
                  errorCallback={defaultTextErrorCallbackGenerator("Name is invalid")}
              />
              <Input
                    id="num"
                    rows="4"
                    type="number"
                    name={"Number *"}
                    displayName="Input"
                    defaultValue={res.data.num}
                    errorCallback={this.formulaNumErrorCallback}
                />
                <InputList
                      id="ingredients"
                      displayName="InputList"
                      item={res.data.ingredients[0].label}
                      items={res.data.ingredients}
                      name={"Ingredient List"}
                      errorCallback={defaultNumErrorCallbackGenerator("Invalid Quantity")}
                  />
                <Input
                    id="comment"
                    rows="4"
                    multiline
                    displayName="Input"
                    type="number"
                    name={"Comment"}
                    errorCallback={defaultErrorCallback}
                />
          </DetailView>
        )
        this.setState({createDialog: createDialog})
        }
      )
  }

  onExportClick = () => {
    axios.post(common.hostname + 'manufacturing_goals/exported_file', {
      data: this.props.items.map((formula) => ({
        id: formula.id,
        num:formula.num,
        name:formula.name,
        comment: formula.comment
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
                onClick={this.openCreatePage}
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
          {
            this.state.createDialog
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
