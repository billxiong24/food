import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ProductLinePage from './ProductLinePage/ProductLinePage';
import Navbar from './Navbar';
import LoginPage from './LoginPage/LoginPage';
import PrivateRoute from './PrivateRoute';
import ManufacturingGoalsPage from './ManufacturingGoalsPage/ManufacturingGoalsPage';
import IngredientsPage from './IngredientsPage/IngredientsPage';
import IngredientDependencyPage from './IngredientDependencyPage/IngredientDependencyPage';
import '../Root.css';
import SKUsPage from './SKUPage/SKUsPage';
import SignUpPage from './LoginPage/SignUpPage';
import LogoutPage from './LoginPage/LogoutPage';
import BulkTransactionPage from './BulkTransactionPage/BulkTransactionPage'
import CalculatorPage from './CalculatorPage/CalculatorPage';
import IngredientDetailViewPage from './IngredientDetailViewPage/IngredientDetailViewPage';
import common from '../Resources/common';

const styles = {

}

class RouterComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {manGoals, ingredient_id, users} = this.props;

    return (
      <Router>
        <div>
          <Navbar></Navbar>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <PrivateRoute exact={true} path="/manufacturing_goals" component={ManufacturingGoalsPage} />
            <PrivateRoute exact={true} path="/ingredients" component={IngredientsPage} />
            <PrivateRoute exact={true} path="/ingredients/details" component={IngredientDetailViewPage}
            block={!ingredient_id} altPath="/ingredients" />
            <PrivateRoute exact={true} path="/skus" component={SKUsPage} />
            <PrivateRoute exact={true} path="/product_lines" component={ProductLinePage} />
            <PrivateRoute exact={true} path="/ingredients/dependency" component={IngredientDependencyPage} />
            <PrivateRoute exact={true} path="/bulk" component={BulkTransactionPage} />
            <PrivateRoute exact={true} path="/create_user" component={SignUpPage} 
              block={users.id!==common.admin}/>
            <PrivateRoute exact={true} path="/logout" component={LogoutPage} />
            <PrivateRoute exact={true} path="/manufacturing_goals/calculations" component={CalculatorPage}
              block={!manGoals.activeGoal.id} altPath="/manufacturing_goals" />
            <Redirect from="/*" to="/manufacturing_goals" />
          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
      manGoals: state.manGoals,
      ingredient_id: state.ingredient_details.id,
      users: state.users,
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(RouterComponent));