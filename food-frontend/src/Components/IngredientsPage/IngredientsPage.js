import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SimpleList from '../GenericComponents/ItemList';
import ItemList from '../GenericComponents/ItemList';
import IntegrationReactSelect from '../GenericComponents/IntegrationReactSelect';
import { purple } from '@material-ui/core/colors';
import color from '@material-ui/core/colors/cyan';
import Card from '@material-ui/core/Card';

const styles = {
  card: {
    width: '100 %',
    margin: 20,
    padding: 10
  },
  ingredients_list:{
    height: '80vh',
    width: '65%',
    margin: 5,
    padding: 5,
    float: 'right',
    overflow: 'auto'
  },
  active_filters_container:{
    height: '90vh',
    width: '30%',
    marginRight:5,
    marginLeft:10,
    marginTop: 5,
    marginBottom:5,
    padding:5,
    color: 'purple',
    float:'left',
  }
};

class IngredientsPage extends Component {

  render() {
    const { classes } = this.props
    return (
      <div>
        <Card className = {classes.active_filters_container}>
        </Card>
      <div className={classes.ingredients_list}>
      <IntegrationReactSelect></IntegrationReactSelect>
        <ItemList
        items={[
          {
            name:"Cheddar Cheese",
            id:"5583",
          },
          {
            name:"2% Milk",
            id:"523",
          },
          {
            name:"Georgian Oranges",
            id:"784",
          },
          {
            name:"Water",
            id:"34",
          },
          {
            name:"Chicken Thigh",
            id:"234",
          },
          {
            name:"Rice",
            id:"1",
          },
          {
            name:"Sesame Seeds",
            id:"699",
          },
          {
            name:"Cauliflower",
            id:"432",
          }
        ]}
        />
      </div>
      </div>
    );
  }
}

export default withStyles(styles)(IngredientsPage);