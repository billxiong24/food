import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ItemList from '../GenericComponents/ItemList';
import SimpleCard from '../GenericComponents/SimpleCard';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { CardActionArea, Input } from '@material-ui/core';
import { routeToPage, skuAddSelected, skuRemoveSelected } from '../../Redux/Actions';
import { withRouter } from 'react-router-dom'
import { skuDetGetManLines, skuDetGetFormula, skuDetSetSku, skuDetGetIng, skuDetGetProductLine } from '../../Redux/Actions/ActionCreators/SKUDetailsActionCreators';
import labels from '../../Resources/labels';
import Checkbox from '@material-ui/core/Checkbox';
import UnitSelect from '../GenericComponents/UnitSelect';
import DetailView from '../GenericComponents/DetailView';
import swal from 'sweetalert';

const styles = {
  entry: {
    width: '100%',
    display:'flex',
    flexDirection:'row',
  },
  card: {
    display:'flex',
    flexGrow: '8',
    marginBottom: 10,
    marginTop: 10,
  },
  cardAction: {
    padding: 10
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
  },
  ingredrient_name: {
    fontSize: 14,
    float: 'left',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  ingredient_id: {
    fontSize: 14,
    float: 'right',
    fontFamily: 'Open Sans',
    fontWeight: 400,
  },
  pos: {
    marginBottom: 12,
  },
  button: {
    width: '100%'
  }
};

class SKUList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editDialog: false
    }
  }


  componentWillMount() {

  }

  onClick = (item) => {
    this.props.setSku(item)
  }

  handleChange = (sku) => {
    if(this.props.selected.includes(sku.id)) {
      this.props.removeSelected([sku.id]);
    } else {
      this.props.addSelected([sku.id]);
    }
  }

  suggestionsApi = (value) => {
      let suggestions = ["Afghanistan", "Azerbijan"]
      return suggestions
  }

  onClick = (item) =>{
      this.props.setIngredient(item, this.props.history)
  }

  openSKUEditPage = (sku, closeCallback) => {
      console.log(sku)
      // let unitItems = ["kg", "g", "grams"]
      // let unitItem = unitItems[0]
      // let unitValue = String(ingredient.pkg_size)
      // for(var i = 0; i < unitItems.length; i++){
      //     if(unitValue.endsWith(unitItems[i])){
      //         unitItem = unitItems[i]
      //         unitValue = unitValue.slice(0, -unitItems[i].length)
      //         break
      //     }
      // }


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
              title={"Edit SKU"}
          >
              <Input
                  id="name"
                  error={true}
                  name={"Name"}
                  errorCallback={this.errorCallback}
                  defaultValue = {sku.name}
              />
              <Input
                  id="num"
                  type="number"
                  name={"Number"}
                  errorCallback={this.errorCallback}
                  defaultValue = {sku.num}
              />
              <Input
                  id="case_upc"
                  type="number"
                  name={"Case UPC"}
                  errorCallback={this.errorCallback}
                  defaultValue = {sku.case_upc}
              />
              <Input
                  id="unit_upc"
                  type="number"
                  name={"Unit UPC"}
                  errorCallback={this.errorCallback}
                  defaultValue = {sku.unit_upc}
              />
              
              {/* <Input
                  id="vend_info"
                  rows="4"
                  name={"Vendor Info"}
                  errorCallback={this.errorCallback}
                  defaultValue={ingredient.vend_info}
              />
              <UnitSelect
                  id="pkg_size"
                  unitSelect={true}
                  name={"Package Size"}
                  item={unitItem}
                  items={unitItems}
                  defaultValue={unitValue}
                  errorCallback={this.errorCallback}
              />
              <Input
                  id="pkg_cost"
                  rows="4"
                  type="number"
                  name={"Package Cost"}
                  errorCallback={this.errorCallback}
                  defaultValue={ingredient.pkg_cost}
              />
              <Input
                  id="comment"
                  rows="4"
                  multiline
                  type="number"
                  name={"Comment"}
                  errorCallback={this.errorCallback}
                  defaultValue={ingredient.comments}
              /> */}
              {/* <InputAutoCompleteOpenPage
                  id="formula"
                  name={"Formula"}
                  suggestionsCallback={this.suggestionsApi}
                  openCreatePage={this.openCreatePage}
                  openEditPage={this.openEditPage}
                  errorCallback={this.errorCallback}
              />
              <InputSelect
                  id="prd_line"
                  item="prod1"
                  items={["prod1","prod2","prod3","12"]}
                  name={"Product Line"}
                  errorCallback={this.errorCallback}
              />
              <InputList
                  id="ing_list"
                  item="ing1"
                  items={[
                      {
                          label:"ing1",
                          id:1
                      },
                      {
                          label:"ing2",
                          id:2
                      },
                      {
                          label:"ing3",
                          id:3
                      },
                      {
                          label:"ing4",
                          id:4
                      },
                      {
                          label:"ing5",
                          id:5
                      },
                      {
                          label:"ing6",
                          id:6
                      },
                      {
                          label:"ing7",
                          id:7
                      },
                      {
                          label:"ing8",
                          id:8
                      }
                  ]}
                  name={"Ingredient List"}
                  errorCallback={this.errorCallback}
              /> */}
          </DetailView>
      )
  }



  openFormulaCreatePage = (closeCallBack) => {
      return (
          <DetailView
              open={true}
              close={closeCallBack}
              submit={(e) => console.log(e)}
              handleChange={() => console.log("handle change")}
              name={"Ingredient Name"}
              shortname={"Ingredient Short Name"}
              comment={"Ingredient Comment"}
              title={"Open"}
          >
              <Input
                  id="ing_name"
                  rows="4"
                  name={"Name"}
                  value={()=>console.log("hello")}
                  errorCallback={this.errorCallback}

              />
              <Input
                  id="ing_name"
                  rows="4"
                  name={"Name"}
                  value={()=>console.log("hello")}
                  errorCallback={this.errorCallback}
              />
          </DetailView>
      )
  }

  openFormulaEditPage = (closeCallBack) => {
      return (
          <DetailView
              open={true}
              close={closeCallBack}
              submit={(e) => console.log(e)}
              handleChange={() => console.log("handle change")}
              name={"Ingredient Name"}
              shortname={"Ingredient Short Name"}
              comment={"Ingredient Comment"}
              title={"Edit"}
          >
              <Input
                  id="ing_name"
                  rows="4"
                  name={"Name"}
                  value={()=>console.log("hello")}
                  errorCallback={this.errorCallback}
              />
              <Input
                  id="ing_name"
                  rows="4"
                  name={"Name"}
                  value={()=>console.log("hello")}
                  errorCallback={this.errorCallback}
              />
          </DetailView>
      )
  }

  errorCallback = (value) => {
      value = String(value)
      if(value.includes("12")){
          return "Input cannot contain 12"
      }else{
          return null
      }
  }


  render() {
    const { classes, SKUs, sortby, selected } = this.props
    return (
      <div>
        {
          this.props.SKUs.map((item, index) => (
            <div key={index} className={classes.entry}>
              <Checkbox
                checked={selected.includes(item.id)}
                onChange={() => { this.handleChange(item) }}
                value="Select"
              />
              <Card className={classes.card} onClick={() => { 
                  this.setState({
                    editDialog: true,
                    sku: item
                  }) 
                }}>
                <CardActionArea
                  className={classes.cardAction}
                >
                  <CardContent>
                    <Typography className={classes.ingredrient_name} color="textSecondary" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography className={classes.ingredient_id} color="textSecondary" gutterBottom>
                      {sortby == labels.skus.sort_by.SKU_NAME ? item.num : item[labels.skus.sort_by_map[sortby]]}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </div>
          ))
        }
        {
            this.state.editDialog ? this.openSKUEditPage(this.state.sku, () => {
                this.setState({ editDialog: false });
            }) : null
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    SKUs: state.skus.items,
    sortby: state.skus.sortby,
    selected: state.skus.selectedSkus,
  };
};

const mapDispatchToProps = (dispatch,ownProps) => {
    return {
        setSku: sku => {
            Promise.resolve(dispatch(skuDetGetProductLine())) // dispatch
                .then(function (response) {
                    return Promise.resolve(dispatch(skuDetSetSku(sku)));
                //return response;
                })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetFormula(sku.formula_id)));

            })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetIng(sku.id)));
            })
            .then(function(r) {
                    return Promise.resolve(dispatch(skuDetGetManLines(sku.id)));
            })
            .then(function(r) {
                    ownProps.history.push('/skus/details')
            })
        },
        addSelected: (sku) => {
          dispatch(skuAddSelected(sku));
        },
        removeSelected: (sku) => {
          dispatch(skuRemoveSelected(sku));
        }
    };
};

export default withRouter(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(SKUList)));
