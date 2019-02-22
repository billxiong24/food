import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { routeToPage } from '../Redux/Actions/index';
import { connect } from 'react-redux';
import {Link} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';

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
  },
  tabLink : {
    display:"flex",
    alignItems:"center",
    justifyContent:"center"
  }
});

class Navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route:0,
    }
  }

  componentWillMount() {
    let initValue = 0;
    switch (this.props.location.pathname) {
      case '/ingredients':
        initValue=1;
        break;
      case '/skus':
        initValue=2;
        break;
      case '/product_lines':
        initValue=3;
        break;
      case '/ingredients/dependency':
        initValue=4;
        break;
      case '/bulk':
        initValue=5;
        break;
      case '/users':
        initValue=6;
        break;
      case '/logout':
        initValue=7;
        break;
      default:
        initValue=0;
    }
    this.props.routeToPage(initValue);
  }

  handleChange = (event, value) => {
    if(this.props.cookies.user) {
      this.props.routeToPage(value);
    }
  };

  render() {
    const { classes, value, cookies } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs 
            onChange={this.handleChange} 
            value={value}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab value={0} label="Manufacturing Goals" component={Link} to={'/manufacturing_goals'} />
            <Tab value={1} label="Ingredients" component={Link} to={'/ingredients'} />
            <Tab value={2} label="SKUs" component={Link} to={'/skus'} />
            <Tab value={3} label="Product Line" component={Link} to={'/product_lines'} />
            <Tab value={4} label="Ingredient Dependency" component={Link} to={'/ingredients/dependency'} />
            <Tab value={5} label="Bulk Import/Export" component={Link} to={'/bulk'} />
            <Tab value={6} className={cookies.admin === 'true' ? '' : classes.hidden} label="Manage Users" component={Link} to={'/users'} />
            <Tab value={7} className={cookies.user ? '' : classes.hidden} label="Log Out" component={Link} to={'/logout'} />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state, ownProps) => {
  return {
    cookies: ownProps.cookies.cookies,
    value: state.route,
  }
}

export default withRouter(withCookies(connect(mapStateToProps,{routeToPage})(withStyles(styles)(Navbar))));
// export default withStyles(styles)withRouter(connect(mapStateToProps,{routeToPage})(Navbar));