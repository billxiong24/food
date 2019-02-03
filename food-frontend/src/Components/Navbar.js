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
      case '/skus':
        initValue=2;
      case '/product_lines':
        initValue=3;
      case '/ingredients/dependency':
        initValue=4;
      case '/bulk':
        initValue=5;
      case '/create_user':
        initValue=6;
      case '/logout':
        initValue=7;
      default:
        initValue=0;
    }
    this.setState({
      route:initValue
    });
  }

  handleChange = (event, value) => {
    if(this.props.users.id) {
      this.setState({
        route: value,
      });
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="default">
          <Tabs 
            onChange={this.handleChange} 
            value={this.state.route}
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
            <Tab value={6} className={this.props.users.id===7 ? '' : classes.hidden} label="Create Account" component={Link} to={'/create_user'} />
            <Tab value={7} className={this.props.users.id ? '' : classes.hidden} label="Log Out" component={Link} to={'/logout'} />
          </Tabs>
        </AppBar>
      </div>
    );
  }
}

Navbar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = state => {
  return {
    users: state.users,
  }
}

export default withRouter(connect(mapStateToProps,{routeToPage})(withStyles(styles)(Navbar)));
// export default withStyles(styles)withRouter(connect(mapStateToProps,{routeToPage})(Navbar));