import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { routeToPage } from '../Redux/Actions/index';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withCookies } from 'react-cookie';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.css';

import logo from '../Resources/Images/monkey.ico';

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
    display: 'none',
  },
  tabLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  userDisplay: {
    color: '#ffc61b',
    fontFamily: 'Open Sans',
    fontSize: '14px',
    marginRight: 10
  }
});

class CMNavbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      route: 0,
    }
  }

  componentWillMount() {
  }

  render() {
    const { classes, cookies } = this.props;

    return (
      <div className={classes.root}>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand>
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="Code Monkeys Bootstrap logo"
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <NavDropdown className={cookies.core_read === 'true' ? '' : classes.hidden} title="Core Data" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to={'/ingredients'}>Ingredients</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/skus'}>SKUs</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/formula'}>Formulas</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/product_lines'}>Product Lines</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown className={cookies.sales_read === 'true' ? '' : classes.hidden} title="Sales Data" id="collasible-nav-dropdown">
                <NavDropdown.Item as={Link} to={'/manufacturing_goals'}>Manufacturing Goals</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/scheduler'}>Manufacturing Schedule</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/manufacturing_report'}>Manufacturing Schedule Report</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/sales/aggregate'}>Sales Summary</NavDropdown.Item>
                <NavDropdown.Item as={Link} to={'/sales/skusearch'}>SKU Sales Search</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link className={cookies.core_write === 'true' ? '' : classes.hidden} as={Link} to={'/bulk'}>Bulk Import</Nav.Link>
              <Nav.Link className={cookies.user_write === 'true' ? '' : classes.hidden} as={Link} to={'/users'}>Manage Users</Nav.Link>
            </Nav>
            <Nav>
              <Nav.Item as={Typography} variant="overline" className={cookies.user ? classes.userDisplay : classes.hidden}>{cookies.user}</Nav.Item>
              <Nav.Link className={cookies.user ? '' : classes.hidden} as={Link} to={'/logout'}>Log Out</Nav.Link>
              <Nav.Link className={!cookies.user ? '' : classes.hidden} as={Link} to={'/login'}>Log In</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    cookies: ownProps.cookies.cookies,
    value: state.route,
  }
}

export default withRouter(withCookies(connect(mapStateToProps,{routeToPage})(withStyles(styles)(CMNavbar))));
// export default withStyles(styles)withRouter(connect(mapStateToProps,{routeToPage})(Navbar));
//export default withRouter(connect(mapStateToProps,{routeToPage})(withStyles(styles)(Navbar)));
// export default withStyles(styles)withRouter(connect(mapStateToProps,{routeToPage})(Navbar));
