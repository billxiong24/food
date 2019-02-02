import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import SimpleList from './GenericComponents/ItemList';
import IngredientsPage from './IngredientsPage/IngredientsPage';
import LoginPage from './LoginPage/LoginPage';
import SignUpPage from './LoginPage/SignUpPage';
import ProductLinePage from './ProductLinePage/ProductLinePage';
import ManufacturingGoalsPage from './ManufacturingGoalsPage/ManufacturingGoalsPage';
import CalculatorPage from './CalculatorPage/CalculatorPage';
import LogoutPage from './LoginPage/LogoutPage';
import { routeToPage } from '../Redux/Actions/index';
import { connect } from 'react-redux';
import IngredientDependencyPage from './IngredientDependencyPage/IngredientDependencyPage';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  hidden: {
    display:'none',
  }
});

class ScrollableTabsButtonAuto extends React.Component {
  constructor(props) {
    super(props);
  }
  // state = {
  //   value: 0,
  // };

  handleChange = (event, value) => {
    this.props.routeToPage(value);
  };

  render() {
    const { classes } = this.props;
    const value = this.props.route;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={(event, value) => {this.handleChange(event, value)}}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Ingredients" />
            <Tab label="SKUs" />
            <Tab label="Product Line" />
            <Tab label="Calculator" />
            <Tab label="Bulk Import" />
            <Tab label="Admin" />
            <Tab label="Log In" />
            <Tab label="Create Account"/>
            <Tab className={classes.hidden}/>
            <Tab label="Dependency Report"/>
            <Tab label="Log Out"/>
          </Tabs>
        </AppBar>
        {value === 0 && <IngredientsPage></IngredientsPage>}
        {value === 1 && <TabContainer>Item Two</TabContainer>}
        {value === 2 && <ProductLinePage></ProductLinePage>}
        {value === 3 && <ManufacturingGoalsPage></ManufacturingGoalsPage>}
        {value === 4 && <TabContainer>Item Five</TabContainer>}
        {value === 5 && <TabContainer>Item Six</TabContainer>}
        {value === 6 && <LoginPage></LoginPage>}
        {value === 7 && <SignUpPage></SignUpPage>}
        {value === 8 && <CalculatorPage></CalculatorPage>}
        {value === 9 && <IngredientDependencyPage></IngredientDependencyPage>}
        {value === 10 && <LogoutPage></LogoutPage>}
      </div>
    );
  }
}

ScrollableTabsButtonAuto.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    route: state.route
  }
}

export default withStyles(styles)(connect(mapStateToProps,{routeToPage})(ScrollableTabsButtonAuto));