import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import ProductLinePage from './ProductLinePage/ProductLinePage';
import CMNavbar from './CMNavbar';
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
import ManufacturingScheduleReportPage from './ManufacturingScheduleReportPage/ManufacturingScheduleReportPage';
import SKUDrilldownPage from './SKUDrilldownPage/SKUDrilldownPage';
import SKUSalesSummaryPage from './SKUSalesSummaryPage/SKUDrilldownPage';
import SKUDrilldownSearch from './SKUDrilldownPage/SKUDrilldownSearch';

export const landingPage = "/ingredients";

const styles = {

}

class RouterComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {manGoals, ingredient_id, cookies} = this.props;

    return (
      <Router>
        <div>
          <CMNavbar></CMNavbar>
          <Switch>
            <Route path="/login" component={LoginPage} />
            <Route path="/privacy" component={PrivacyPage} />
            <PrivateRoute exact={true} path="/manufacturing_goals" component={ManufacturingGoalsPage}
              block={cookies.goals_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/ingredients" component={ IngredientsPage}
              block={cookies.core_read === 'false'} altPath="/login"/>
            <PrivateRoute exact={true} path="/formula" component={ FormulaPage }
              block={cookies.core_read === 'false'} altPath="/login"/>
            <PrivateRoute exact={true} path="/skus" component={SKUsPage}
              block={cookies.core_read === 'false'} altPath="/login"/>
            <PrivateRoute exact={true} path="/product_lines" component={ProductLinePage}
              block={cookies.core_read === 'false'} altPath="/login"/>
            <PrivateRoute exact={true} path="/ingredients/dependency" component={IngredientDependencyPage}
              block={cookies.sales_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/bulk" component={BulkImportPage}
              block={cookies.core_write === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/create_user" component={SignUpPage} 
              block={cookies.user_write === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/users" component={UserAdminPage} 
              block={cookies.user_write === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/logout" component={LogoutPage} />
            <PrivateRoute exact={true} path="/scheduler" component={Scheduler}
              block={cookies.schedule_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/manufacturing_goals/calculations" component={CalculatorPage}
              block={!manGoals.activeGoal.id} altPath={landingPage} />
            <PrivateRoute exact={true} path="/manufacturing_lines" component={ManufacturingLinesPage}
              block={cookies.core_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/manufacturing_report" component={ManufacturingScheduleReportPage}
              block={cookies.sales_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/sales/aggregate" component={SKUSalesSummaryPage}
              block={cookies.sales_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/sales/skus/:sku_num" component={SKUDrilldownPage}
              block={cookies.sales_read === 'false'} altPath={landingPage}/>
            <PrivateRoute exact={true} path="/sales/skusearch" component={SKUDrilldownSearch}
              block={cookies.sales_read === 'false'} altPath={landingPage}/>
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
