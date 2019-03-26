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
import FormulaPage from './FormulaPage/FormulaPage';
import IngredientDependencyPage from './IngredientDependencyPage/IngredientDependencyPage';
import '../Root.css';
import SKUsPage from './SKUPage/SKUsPage';
import SignUpPage from './LoginPage/SignUpPage';
import LogoutPage from './LoginPage/LogoutPage';
import CalculatorPage from './CalculatorPage/CalculatorPage';
import IngredientDetailViewPage from './IngredientDetailViewPage/IngredientDetailViewPage';
import FormulaDetailViewPage from './FormulaDetailViewPage/FormulaDetailViewPage';
import SKUDetailViewPage from './SKUDetailViewPage/SKUDetailViewPage'
import BulkImportPage from './BulkImport/BulkImportPage'
import common from '../Resources/common';
import Scheduler from './Scheduler/Scheduler';
import { withCookies } from 'react-cookie';
import PrivacyPage from './PrivacyPage/PrivacyPage';
import UserAdminPage from './UserAdminPage/UserAdminPage';
import ManufacturingLinesPage from './ManufacturingLinesPage/ManufacturingLinesPage';
import SKUDrilldownPage from './SKUDrilldownPage/SKUDrilldownPage';
import SKUSalesSummaryPage from './SKUSalesSummaryPage/SKUDrilldownPage';

const styles = {

}

class RouterComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {manGoals, ingredient_id, cookies} = this.props;
    const landingPage = "/manufacturing_goals";

    return (
      <Router>
        <div>
          <Navbar></Navbar>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <PrivateRoute exact={true} path="/manufacturing_goals" component={ManufacturingGoalsPage} />
            <PrivateRoute exact={true} path="/bulkimportexport" component={ BulkImportPage } />
            <PrivateRoute exact={true} path="/ingredients" component={ IngredientsPage} />
            <PrivateRoute exact={true} path="/formula" component={ FormulaPage } />
            <PrivateRoute exact={true} path="/formula/details" component={ FormulaDetailViewPage } />
            <PrivateRoute exact={true} path="/ingredients/details" component={ IngredientDetailViewPage}/>
            <PrivateRoute exact={true} path="/skus" component={SKUsPage} />
            <PrivateRoute exact={true} path="/skus/details" component={SKUDetailViewPage} />
            <PrivateRoute exact={true} path="/product_lines" component={ProductLinePage} />
            <PrivateRoute exact={true} path="/ingredients/dependency" component={IngredientDependencyPage} />
            <PrivateRoute exact={true} path="/bulk" component={BulkImportPage} />
            <PrivateRoute exact={true} path="/create_user" component={SignUpPage} 
              block={cookies.admin === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/users" component={UserAdminPage} 
              block={cookies.admin === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/logout" component={LogoutPage} />
            <PrivateRoute exact={true} path="/scheduler" component={Scheduler} />
            <PrivateRoute exact={true} path="/manufacturing_goals/calculations" component={CalculatorPage}
              block={!manGoals.activeGoal.id} altPath={landingPage} />
            <PrivateRoute exact={true} path="/manufacturing_lines" component={ManufacturingLinesPage}
              block={cookies.admin === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/sales/aggregate" component={SKUSalesSummaryPage}/>
            <PrivateRoute exact={true} path="/sales/skus/:sku_name/:sku_num" component={SKUDrilldownPage}/>
            <Redirect from="/*" to={landingPage} />
          </Switch>
        </div>
      </Router>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
      manGoals: state.manGoals,
      ingredient_id: state.ingredient_details.id,
      cookies: ownProps.cookies.cookies,
  };
};

const mapDispatchToProps = dispatch => {
  return {
  };
};

export default withStyles(styles)(withCookies(connect(mapStateToProps,mapDispatchToProps)(RouterComponent)));
//export default withStyles(styles)(connect(mapStateToProps,mapDispatchToProps)(RouterComponent));
