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

const styles = {
  ingredients_list:{
    height: '85vh',
    width: '65%',
    margin: 'auto',
    padding: 5,
    overflow: 'auto'
  },
  ingredients_list_divider:{
    width:'100%',
    backgroundColor:'gray',
    height:'2px'
  },
  page_number_text:{
    color:'gray',
    margin: 5
  }
};

class ProductLinePage extends Component {

  componentWillMount(){
    this.props.getDummyIngredients()
  }


  render() {
    console.log(this.props)
    const { classes , dummy_ingredients } = this.props
    return (
      <div>
        <div className={classes.ingredients_list}>
          <IntegrationReactSelect></IntegrationReactSelect>
          <ItemList
          items={ dummy_ingredients }
          />
            <div variant="inset" className={classes.ingredients_list_divider}/>
          <Typography className={classes.page_number_text}>
            Page 1 of 12
          </Typography>
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


export default withStyles(styles)(connect(mapStateToProps,{getDummyIngredients})(ProductLinePage));